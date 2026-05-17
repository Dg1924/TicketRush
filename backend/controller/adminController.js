const db = require("../config/db");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const safeParseJson = (value, fallback = []) => {
    if (!value) return fallback;
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return value;

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const SEAT_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DEFAULT_SEATS_PER_ROW = 20;
const BOOKED_STATUSES = ["pending", "paid", "locked"];

const normalizeTierName = (value) => {
    return String(value || "").trim().toLowerCase();
};

const getNextSeatLabel = (usedLabels) => {
    const label = SEAT_LABELS.find((item) => !usedLabels.has(item));

    if (label) {
        usedLabels.add(label);
        return label;
    }

    const fallback = `R${usedLabels.size + 1}`;
    usedLabels.add(fallback);
    return fallback;
};

const buildSeatId = (eventId, row, seatNumber) => {
    return `${eventId}_${row.label}_${seatNumber}`;
};

const getBookedTicketsByEvent = async (eventId) => {
    const [rows] = await db.promise().query(
        `
        SELECT id, tierId, seat, status
        FROM tickets
        WHERE eventId = ?
        AND status IN (?, ?, ?)
        `,
        [eventId, ...BOOKED_STATUSES]
    );

    return rows.filter((ticket) => ticket.seat);
};

const getBookedCountByTier = async (eventId, tierId) => {
    const [rows] = await db.promise().query(
        `
        SELECT COUNT(*) AS booked
        FROM tickets
        WHERE eventId = ?
        AND tierId = ?
        AND status IN (?, ?, ?)
        `,
        [eventId, tierId, ...BOOKED_STATUSES]
    );

    return Number(rows[0]?.booked || 0);
};

const getPaidCountByEvent = async (eventId) => {
    const [rows] = await db.promise().query(
        `
        SELECT COUNT(*) AS paid
        FROM tickets
        WHERE eventId = ?
        AND status = 'paid'
        `,
        [eventId]
    );

    return Number(rows[0]?.paid || 0);
};

const buildAvailableSeatSet = (seatMap, eventId) => {
    const availableSeatIds = new Set();
    const tierCapacityMap = {};

    if (!Array.isArray(seatMap?.rows)) {
        return { availableSeatIds, tierCapacityMap };
    }

    seatMap.rows.forEach((row) => {
        const tierId = String(row.tierId || "").trim();
        const label = String(row.label || "").trim();
        const seats = Number(row.seats || 0);
        const disabled = Array.isArray(row.disabled)
            ? row.disabled.map((item) => Number(item))
            : [];

        if (!label || !tierId || seats <= 0) return;

        for (let seatNumber = 1; seatNumber <= seats; seatNumber += 1) {
            if (disabled.includes(seatNumber)) continue;

const seatId = buildSeatId(
    seatMap.eventId || eventId,
    {
        ...row,
        tierId,
        label,
    },
    seatNumber
);

            availableSeatIds.add(seatId);
            tierCapacityMap[tierId] = (tierCapacityMap[tierId] || 0) + 1;
        }
    });

    return { availableSeatIds, tierCapacityMap };
};

const validateSeatMapBeforeSave = async (eventId, seatMap) => {
    if (!Array.isArray(seatMap?.rows)) {
        throw new AppError("Sơ đồ ghế không hợp lệ", 400);
    }

    const labels = new Set();

    for (const row of seatMap.rows) {
        const label = String(row.label || "").trim();

        if (!label) {
            throw new AppError("Có dãy ghế chưa có tên dãy", 400);
        }

        if (labels.has(label)) {
            throw new AppError(`Dãy ghế ${label} bị trùng`, 400);
        }

        labels.add(label);

        if (!row.tierId) {
            throw new AppError(`Dãy ${label} chưa chọn hạng vé`, 400);
        }

        if (Number(row.seats || 0) <= 0) {
            throw new AppError(`Dãy ${label} phải có ít nhất 1 ghế`, 400);
        }
    }

    const bookedTickets = await getBookedTicketsByEvent(eventId);
    const normalizedSeatMap = {
    ...seatMap,
    eventId: seatMap.eventId || eventId,
};

const { availableSeatIds, tierCapacityMap } = buildAvailableSeatSet(
    normalizedSeatMap,
    eventId
);

    for (const ticket of bookedTickets) {
        if (!availableSeatIds.has(ticket.seat)) {
            throw new AppError(
                `Không thể lưu sơ đồ ghế vì ghế ${ticket.seat} đã có người đặt. Không được xóa, disable, đổi tier hoặc giảm số ghế làm mất ghế này.`,
                400
            );
        }
    }

    const bookedByTier = {};

    bookedTickets.forEach((ticket) => {
        const tierId = String(ticket.tierId);
        bookedByTier[tierId] = (bookedByTier[tierId] || 0) + 1;
    });

    for (const [tierId, bookedCount] of Object.entries(bookedByTier)) {
        const newCapacity = Number(tierCapacityMap[String(tierId)] || 0);

        if (newCapacity < Number(bookedCount)) {
            throw new AppError(
                `Không thể lưu sơ đồ ghế. Hạng vé #${tierId} đã có ${bookedCount} vé được đặt nhưng sơ đồ mới chỉ còn ${newCapacity} ghế.`,
                400
            );
        }
    }

    return { bookedTickets, tierCapacityMap };
};

const buildSeatMapFromTiers = (oldSeatMap, tiers, eventId = null) => {
    const oldRows = Array.isArray(oldSeatMap?.rows) ? oldSeatMap.rows : [];
    const usedLabels = new Set();
    const rows = [];

    const makeRow = ({ label, seats, tier, disabled = [] }) => {
        const cleanSeats = Math.max(0, Number(seats || 0));

        const cleanDisabled = Array.isArray(disabled)
            ? disabled
                  .map((item) => Number(item))
                  .filter((item) => item >= 1 && item <= cleanSeats)
            : [];

        return {
            id: `row-${label}-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 7)}`,
            label,
            seats: cleanSeats,
            tierId: String(tier.id),
            tierName: tier.name,
            disabled: cleanDisabled,
        };
    };

    for (const tier of tiers) {
        let remainingSeats = Number(tier.capacity || tier.available || 0);

        if (remainingSeats <= 0) continue;

        const matchingOldRows = oldRows.filter((row) => {
            return (
                String(row.tierId) === String(tier.oldId) ||
                String(row.tierId) === String(tier.id) ||
                normalizeTierName(row.tierName) === normalizeTierName(tier.name)
            );
        });

        for (const oldRow of matchingOldRows) {
            if (remainingSeats <= 0) break;

            const oldSeatCount = Number(oldRow.seats || DEFAULT_SEATS_PER_ROW);
            const seatsForThisRow = Math.min(oldSeatCount, remainingSeats);

            const oldLabel = String(oldRow.label || "").trim();
            const label =
                oldLabel && !usedLabels.has(oldLabel)
                    ? oldLabel
                    : getNextSeatLabel(usedLabels);

            usedLabels.add(label);

            rows.push(
                makeRow({
                    label,
                    seats: seatsForThisRow,
                    tier,
                    disabled: oldRow.disabled || [],
                })
            );

            remainingSeats -= seatsForThisRow;
        }

        while (remainingSeats > 0) {
            const label = getNextSeatLabel(usedLabels);
            const seatsForThisRow = Math.min(DEFAULT_SEATS_PER_ROW, remainingSeats);

            rows.push(
                makeRow({
                    label,
                    seats: seatsForThisRow,
                    tier,
                    disabled: [],
                })
            );

            remainingSeats -= seatsForThisRow;
        }
    }

return {
    eventId: oldSeatMap?.eventId || eventId,
    stageName: oldSeatMap?.stageName || "STAGE",
    rows,
};
};

exports.createEvent = catchAsync(async (req, res, next) => {
    const {
        title,
        artist,
        category,
        date,
        time,
        venue,
        city,
        description,
        featured,
        tags,
        tiers,
    } = req.body;

    const imagePath = req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image || "";

    const parsedTiers = safeParseJson(tiers, []);

    const [result] = await db.promise().query(
        `
        INSERT INTO events
        (title, artist, category, date, time, venue, city, description, featured, image, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            title,
            artist,
            category || "concert",
            date,
            time || null,
            venue,
            city || "",
            description || "",
            featured === "true" || featured === true ? 1 : 0,
            imagePath,
            tags || "[]",
        ]
    );

    const eventId = result.insertId;
    const insertedTiers = [];

    for (const tier of parsedTiers) {
        const capacity = Number(tier.capacity || tier.available || 0);

        const [tierResult] = await db.promise().query(
            `
            INSERT INTO ticket_tiers
            (eventId, name, price, capacity, available, description)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                eventId,
                tier.name,
                Number(tier.price || 0),
                capacity,
                capacity,
                tier.description || "",
            ]
        );

        insertedTiers.push({
            ...tier,
            id: tierResult.insertId,
            oldId: tier.id,
            capacity,
            available: capacity,
        });
    }

    const initialSeatMap = buildSeatMapFromTiers(null, insertedTiers, eventId);

    await db.promise().query(
        `
        UPDATE events
        SET seat_map_config = ?
        WHERE id = ?
        `,
        [JSON.stringify(initialSeatMap), eventId]
    );

    res.status(201).json({
        status: "success",
        message: "Tạo sự kiện thành công!",
        data: {
            id: eventId,
            seat_map_config: initialSeatMap,
        },
    });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const {
        title,
        artist,
        category,
        date,
        time,
        venue,
        city,
        description,
        featured,
        tags,
        tiers,
    } = req.body;

    const [existingEvents] = await db
        .promise()
        .query("SELECT * FROM events WHERE id = ?", [id]);

    if (existingEvents.length === 0) {
        return next(new AppError("Không tìm thấy sự kiện", 404));
    }

    const existingEvent = existingEvents[0];

    let imagePath = existingEvent.image || "";

    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
        imagePath = req.body.image;
    }

    const parsedTiers = safeParseJson(tiers, []);
    const oldSeatMap = safeParseJson(existingEvent.seat_map_config, null);

    const [oldTiers] = await db
        .promise()
        .query("SELECT * FROM ticket_tiers WHERE eventId = ?", [id]);

    const preparedTiers = [];
    const keptTierIds = new Set();

    for (const tier of parsedTiers) {
        const tierName = String(tier.name || "").trim();

        if (!tierName) continue;

        const oldTierById = oldTiers.find(
            (item) => String(item.id) === String(tier.id)
        );

        const oldTierByName = oldTiers.find(
            (item) => normalizeTierName(item.name) === normalizeTierName(tierName)
        );

        const matchedOldTier = oldTierById || oldTierByName || null;

        const capacity = Number(tier.capacity || tier.available || 0);
        const price = Number(tier.price || 0);
        const tierDescription = tier.description || "";

        if (matchedOldTier) {
            const booked = await getBookedCountByTier(id, matchedOldTier.id);

            if (capacity < booked) {
                return next(
                    new AppError(
                        `Không thể giảm hạng vé "${tierName}" xuống ${capacity} ghế vì đã có ${booked} vé đang được đặt hoặc đã thanh toán.`,
                        400
                    )
                );
            }

            keptTierIds.add(Number(matchedOldTier.id));

            preparedTiers.push({
                ...tier,
                oldId: matchedOldTier.id,
                id: matchedOldTier.id,
                name: tierName,
                price,
                capacity,
                available: Math.max(0, capacity - booked),
                description: tierDescription,
                isNew: false,
            });
        } else {
            preparedTiers.push({
                ...tier,
                oldId: tier.id,
                id: null,
                name: tierName,
                price,
                capacity,
                available: capacity,
                description: tierDescription,
                isNew: true,
            });
        }
    }

    for (const oldTier of oldTiers) {
        if (keptTierIds.has(Number(oldTier.id))) continue;

        const booked = await getBookedCountByTier(id, oldTier.id);

        if (booked > 0) {
            return next(
                new AppError(
                    `Không thể xóa hạng vé "${oldTier.name}" vì đã có ${booked} vé đang được đặt hoặc đã thanh toán.`,
                    400
                )
            );
        }
    }

    await db.promise().query(
        `
        UPDATE events SET
            title = ?,
            artist = ?,
            category = ?,
            date = ?,
            time = ?,
            venue = ?,
            city = ?,
            description = ?,
            featured = ?,
            image = ?,
            tags = ?
        WHERE id = ?
        `,
        [
            title,
            artist,
            category || "concert",
            date,
            time || null,
            venue,
            city || "",
            description || "",
            featured === "true" || featured === true ? 1 : 0,
            imagePath,
            tags || "[]",
            id,
        ]
    );

    const insertedOrUpdatedTiers = [];

    for (const tier of preparedTiers) {
        if (tier.isNew) {
            const [result] = await db.promise().query(
                `
                INSERT INTO ticket_tiers
                (eventId, name, price, capacity, available, description)
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    id,
                    tier.name,
                    tier.price,
                    tier.capacity,
                    tier.available,
                    tier.description,
                ]
            );

            insertedOrUpdatedTiers.push({
                ...tier,
                id: result.insertId,
                oldId: tier.oldId,
            });
        } else {
            await db.promise().query(
                `
                UPDATE ticket_tiers
                SET name = ?,
                    price = ?,
                    capacity = ?,
                    available = ?,
                    description = ?
                WHERE id = ?
                AND eventId = ?
                `,
                [
                    tier.name,
                    tier.price,
                    tier.capacity,
                    tier.available,
                    tier.description,
                    tier.id,
                    id,
                ]
            );

            insertedOrUpdatedTiers.push(tier);
        }
    }

    const finalTierIds = insertedOrUpdatedTiers.map((tier) => Number(tier.id));

    for (const oldTier of oldTiers) {
        if (finalTierIds.includes(Number(oldTier.id))) continue;

        await db.promise().query(
            `
            DELETE FROM ticket_tiers
            WHERE id = ?
            AND eventId = ?
            `,
            [oldTier.id, id]
        );
    }

const updatedSeatMap = buildSeatMapFromTiers(
    oldSeatMap,
    insertedOrUpdatedTiers,
    id
);

    await validateSeatMapBeforeSave(id, updatedSeatMap);

    await db.promise().query(
        `
        UPDATE events
        SET seat_map_config = ?
        WHERE id = ?
        `,
        [JSON.stringify(updatedSeatMap), id]
    );

    res.status(200).json({
        status: "success",
        message: "Cập nhật sự kiện thành công!",
        data: {
            id,
            seat_map_config: updatedSeatMap,
            tiers: insertedOrUpdatedTiers,
        },
    });
});

exports.getEventById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const [events] = await db
        .promise()
        .query("SELECT * FROM events WHERE id = ?", [id]);

    if (events.length === 0) {
        return next(new AppError("Không tìm thấy sự kiện", 404));
    }

    const [tiers] = await db
        .promise()
        .query("SELECT * FROM ticket_tiers WHERE eventId = ?", [id]);

    const event = events[0];

    res.status(200).json({
        status: "success",
        data: {
            ...event,
            tags: safeParseJson(event.tags, []),
            seat_map_config: safeParseJson(event.seat_map_config, null),
            tiers,
        },
    });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
    const [events] = await db.promise().query(`
        SELECT e.*,

        (SELECT MIN(price)
         FROM ticket_tiers
         WHERE eventId = e.id) AS minPrice,

        (SELECT SUM(capacity)
         FROM ticket_tiers
         WHERE eventId = e.id) AS totalSeats,

        (SELECT COUNT(*)
         FROM tickets
         WHERE eventId = e.id
         AND status = 'paid') AS soldSeats,

        IF(e.seat_map_config IS NOT NULL AND e.seat_map_config != '', 1, 0) AS hasConfig

        FROM events e
        ORDER BY e.id DESC
    `);

    const [allTiers] = await db.promise().query("SELECT * FROM ticket_tiers");

    const formattedEvents = events.map((event) => {
        const eventTiers = allTiers.filter((tier) => tier.eventId === event.id);

        return {
            ...event,
            tags: safeParseJson(event.tags, []),
            tiers: eventTiers,
            seat_map_config: safeParseJson(event.seat_map_config, null),
            totalSeats: Number(event.totalSeats || 0),
            soldSeats: Number(event.soldSeats || 0),
        };
    });

    res.status(200).json({
        status: "success",
        data: formattedEvents,
    });
});

exports.getDashboardStats = catchAsync(async (req, res, next) => {
    const [orders] = await db.promise().query(`
        SELECT
            t.*,
            t.created_at AS createdAt,
            u.name AS buyerName,
            u.email AS buyerEmail,
            u.gender AS buyerGender,
            u.age AS buyerAge,
            e.title AS eventTitle,
            tt.name AS tierName,
            tt.price
        FROM tickets t
        JOIN users u ON t.userId = u.id
        JOIN events e ON t.eventId = e.id
        JOIN ticket_tiers tt ON t.tierId = tt.id
        ORDER BY t.created_at DESC
    `);

    const [events] = await db.promise().query(`
        SELECT
            e.*,
            (SELECT MIN(price) FROM ticket_tiers WHERE eventId = e.id) AS minPrice,
            (SELECT SUM(capacity) FROM ticket_tiers WHERE eventId = e.id) AS totalSeats,
            (SELECT COUNT(*) FROM tickets WHERE eventId = e.id AND status = 'paid') AS soldSeats,
            IF(e.seat_map_config IS NOT NULL AND e.seat_map_config != '', 1, 0) AS hasConfig
        FROM events e
        ORDER BY e.id DESC
    `);

    const [revenueRow] = await db.promise().query(`
        SELECT SUM(tt.price) AS total
        FROM tickets t
        JOIN ticket_tiers tt ON t.tierId = tt.id
        WHERE t.status = 'paid'
    `);

    const [soldRow] = await db.promise().query(`
        SELECT COUNT(*) AS count
        FROM tickets
        WHERE status = 'paid'
    `);

    const [eventRow] = await db.promise().query(`
        SELECT COUNT(*) AS count
        FROM events
    `);

    const [genderRows] = await db.promise().query(`
        SELECT
            COALESCE(NULLIF(gender, ''), 'Khác') AS gender,
            COUNT(*) AS count
        FROM users
        WHERE role = 'user'
        GROUP BY COALESCE(NULLIF(gender, ''), 'Khác')
    `);

    const [ageRows] = await db.promise().query(`
        SELECT
            CASE
                WHEN age IS NULL THEN 'Chưa cập nhật'
                WHEN age < 18 THEN 'Dưới 18'
                WHEN age BETWEEN 18 AND 24 THEN '18 - 24'
                WHEN age BETWEEN 25 AND 34 THEN '25 - 34'
                ELSE 'Trên 35'
            END AS ageGroup,
            COUNT(*) AS count
        FROM users
        WHERE role = 'user'
        GROUP BY ageGroup
        ORDER BY
            CASE ageGroup
                WHEN 'Dưới 18' THEN 1
                WHEN '18 - 24' THEN 2
                WHEN '25 - 34' THEN 3
                WHEN 'Trên 35' THEN 4
                ELSE 5
            END
    `);

    const [totalAudienceRows] = await db.promise().query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'user'
    `);

    res.status(200).json({
        status: "success",
        data: {
            events: events.map((event) => ({
                ...event,
                tags: safeParseJson(event.tags, []),
                seat_map_config: safeParseJson(event.seat_map_config, null),
                totalSeats: Number(event.totalSeats || 0),
                soldSeats: Number(event.soldSeats || 0),
            })),
            eventsCount: eventRow[0].count,
            ordersCount: orders.length,
            soldTickets: soldRow[0].count,
            totalRevenue: revenueRow[0].total || 0,
            orders,
            audience: {
                genders: genderRows.map((item) => ({
                    gender: item.gender,
                    count: Number(item.count || 0),
                })),
                ages: ageRows.map((item) => ({
                    ageGroup: item.ageGroup,
                    count: Number(item.count || 0),
                })),
                total: Number(totalAudienceRows[0].total || 0),
            },
        },
    });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const [orders] = await db.promise().query(`
        SELECT
            t.*,
            t.created_at AS createdAt,
            u.name AS buyerName,
            u.email AS buyerEmail,
            e.title AS eventTitle,
            tt.name AS tierName,
            tt.price
        FROM tickets t
        JOIN users u ON t.userId = u.id
        JOIN events e ON t.eventId = e.id
        JOIN ticket_tiers tt ON t.tierId = tt.id
        ORDER BY t.created_at DESC
    `);

    res.status(200).json({
        status: "success",
        data: { orders },
    });
});

exports.getSeatMap = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const [rows] = await db
        .promise()
        .query("SELECT seat_map_config FROM events WHERE id = ?", [id]);

    if (rows.length === 0) {
        return next(new AppError("Không tìm thấy sự kiện", 404));
    }

    const [bookedSeats] = await db.promise().query(
        `
        SELECT
            t.id,
            t.seat,
            t.status,
            t.created_at AS createdAt,
            u.name AS buyerName,
            u.email AS buyerEmail,
            tt.name AS tierName,
            tt.price
        FROM tickets t
        LEFT JOIN users u ON t.userId = u.id
        LEFT JOIN ticket_tiers tt ON t.tierId = tt.id
        WHERE t.eventId = ?
        AND t.status IN ('pending', 'paid', 'locked')
        AND t.seat IS NOT NULL
        ORDER BY t.created_at DESC
        `,
        [id]
    );

    const seatMapConfig = safeParseJson(rows[0].seat_map_config, null);

res.status(200).json({
    status: "success",
    data: {
        seat_map_config: seatMapConfig
            ? {
                  ...seatMapConfig,
                  eventId: seatMapConfig.eventId || id,
              }
            : null,
        bookedSeats,
    },
});
});


exports.updateSeatMap = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const seatMap = req.body || {};

    const { tierCapacityMap } = await validateSeatMapBeforeSave(id, seatMap);

    await db
        .promise()
        .query("UPDATE events SET seat_map_config = ? WHERE id = ?", [
            JSON.stringify(seatMap),
            id,
        ]);

    for (const [tierId, capacity] of Object.entries(tierCapacityMap)) {
        const booked = await getBookedCountByTier(id, tierId);
        const available = Math.max(0, Number(capacity) - booked);

        await db.promise().query(
            `
            UPDATE ticket_tiers
            SET capacity = ?, available = ?
            WHERE id = ?
            AND eventId = ?
            `,
            [capacity, available, tierId, id]
        );
    }

    await db.promise().query(
        `
        UPDATE ticket_tiers
        SET capacity = 0, available = 0
        WHERE eventId = ?
        AND id NOT IN (?)
        `,
        [
            id,
            Object.keys(tierCapacityMap).length
                ? Object.keys(tierCapacityMap)
                : ["-1"],
        ]
    );

    res.status(200).json({
        status: "success",
        message: "Lưu sơ đồ ghế thành công!",
        data: seatMap,
    });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const [events] = await db
        .promise()
        .query("SELECT * FROM events WHERE id = ?", [id]);

    if (events.length === 0) {
        return next(new AppError("Không tìm thấy sự kiện", 404));
    }

    const paid = await getPaidCountByEvent(id);

    if (paid > 0) {
        return next(
            new AppError(
                "Không thể xóa sự kiện đã có vé được thanh toán. Bạn nên ẩn hoặc ngừng bán sự kiện này.",
                400
            )
        );
    }

    await db.promise().query("DELETE FROM tickets WHERE eventId = ?", [id]);
    await db.promise().query("DELETE FROM ticket_tiers WHERE eventId = ?", [id]);
    await db.promise().query("DELETE FROM events WHERE id = ?", [id]);

    res.status(200).json({
        status: "success",
        message: "Xóa sự kiện thành công!",
    });
});