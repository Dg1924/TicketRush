const User = require("../model/userModel");
const AppError = require("../utils/appError");
const { createSendToken } = require("../utils/authHelper");
const catchAsync = require("../utils/catchAsync");
const db = require("../config/db");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email");
const { emitSeatUpdate } = require("../utils/socket");

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

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, gender, dob } = req.body;

  if (!name || !email || !password || !passwordConfirm || !gender || !dob) {
    return next(new AppError("Vui lòng điền đầy đủ thông tin", 400));
  }

  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    return next(new AppError("Email đã được sử dụng", 409));
  }

  const userId = await User.createUser({
    name,
    email,
    password,
    passwordConfirm,
    gender,
    dob,
  });

  createSendToken(
    {
      id: userId,
      name,
      email: email.trim().toLowerCase(),
      role: "user",
    },
    201,
    res,
    "Đăng ký thành công"
  );
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findByEmail(email);

  if (!user || !(await User.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  user.password = undefined;

  createSendToken(user, 200, res, "Login successful");
});

exports.socialLogin = catchAsync(async (req, res, next) => {
  const { name, email, provider } = req.body;

  if (!email || !provider) {
    return next(new AppError("Missing social login data", 400));
  }

  let user = await User.findByEmail(email);

  if (!user) {
    const userId = await User.createSocialUser({
      name,
      email,
      provider,
    });

    user = {
      id: userId,
      name,
      email,
      role: "user",
      provider,
    };
  }

  if (user.password) {
    user.password = undefined;
  }

  createSendToken(user, 200, res, "Social login successful");
});

exports.getEventById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [rows] = await db.promise().query("SELECT * FROM events WHERE id = ?", [
    id,
  ]);

  if (!rows.length) {
    return next(new AppError("Event not found", 404));
  }

  const event = rows[0];

  const [tiersFromTable] = await db
    .promise()
    .query("SELECT * FROM ticket_tiers WHERE eventId = ?", [id]);

const [bookedTickets] = await db.promise().query(
  `
  SELECT seat
  FROM tickets
  WHERE eventId = ?
  AND status = 'paid'
  AND active = 1
  `,
  [id]
);

  res.status(200).json({
    status: "success",
    data: {
      ...event,
      tags: safeParseJson(event.tags, []),
      tiers: tiersFromTable,
      bookedSeats: bookedTickets.map((t) => t.seat).filter(Boolean),
    },
  });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const [events] = await db.promise().query(`
    SELECT e.*,
    (SELECT MIN(price) FROM ticket_tiers WHERE eventId = e.id) as minPrice,
    (SELECT SUM(available) FROM ticket_tiers WHERE eventId = e.id) as totalAvailable
    FROM events e
    ORDER BY e.id DESC
  `);

  const [allTiers] = await db.promise().query("SELECT * FROM ticket_tiers");

  const formattedEvents = events.map((ev) => {
    const eventTiers = allTiers.filter((t) => t.eventId === ev.id);

    return {
      ...ev,
      tags: safeParseJson(ev.tags, []),
      tiers: eventTiers,
      hasConfig: Boolean(ev.seat_map_config),
      minPrice:
        ev.minPrice ||
        (eventTiers.length > 0
          ? Math.min(...eventTiers.map((t) => Number(t.price || 0)))
          : 0),
      totalAvailable:
        ev.totalAvailable ||
        eventTiers.reduce(
          (sum, t) => sum + Number(t.available || t.capacity || 0),
          0
        ),
    };
  });

  res.status(200).json({
    status: "success",
    data: formattedEvents,
  });
});

exports.getMyTickets = catchAsync(async (req, res, next) => {
  const [tickets] = await db.promise().query(
    `
    SELECT
      t.id,
      t.userId,
      t.eventId,
      t.tierId,
      t.seat,
      t.status,
      t.created_at,
      e.title,
      e.date,
      e.time,
      e.venue,
      e.city,
      e.image,
      tt.name AS tierName,
      tt.price
    FROM tickets t
    JOIN events e ON t.eventId = e.id
    LEFT JOIN ticket_tiers tt ON t.tierId = tt.id
WHERE t.userId = ?
AND t.active = 1
AND t.status = 'paid'
ORDER BY t.created_at DESC
    `,
    [req.user.id]
  );

  res.status(200).json({
    status: "success",
    data: tickets,
  });
});
exports.holdSeats = catchAsync(async (req, res, next) => {
  const { eventId, seats, sessionId } = req.body;
  const userId = req.user.id;

  if (!eventId) {
    return next(new AppError("Thiếu eventId", 400));
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    return next(new AppError("Không có ghế nào để giữ", 400));
  }

  if (!sessionId) {
    return next(new AppError("Thiếu sessionId", 400));
  }

  const normalizedSeats = seats.map((item) => ({
    seatId: typeof item === "string" ? item : item.seatId,
    tierId: typeof item === "string" ? null : item.tierId,
  }));

  for (const item of normalizedSeats) {
    if (!item.seatId) {
      return next(new AppError("Dữ liệu ghế không hợp lệ", 400));
    }

    if (!item.tierId) {
      return next(new AppError(`Ghế ${item.seatId} thiếu hạng vé`, 400));
    }
  }

  const seatIds = normalizedSeats.map((item) => item.seatId);
  const heldUntil = Date.now() + 10 * 60 * 1000;

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    for (const item of normalizedSeats) {
      await connection.query(
        `
        INSERT INTO tickets
        (userId, eventId, tierId, seat, status, active)
        VALUES (?, ?, ?, ?, 'locked', 1)
        `,
        [userId, eventId, item.tierId, item.seatId]
      );
    }

    await connection.commit();

    emitSeatUpdate(eventId, {
      type: "held",
      seats: seatIds,
      sessionId,
      heldUntil,
    });

    res.status(200).json({
      status: "success",
      message: "Giữ ghế thành công",
      data: {
        seats: seatIds,
        sessionId,
        heldUntil,
      },
    });
  } catch (err) {
    await connection.rollback();

    if (err.code === "ER_DUP_ENTRY") {
      return next(
        new AppError(
          "Một hoặc nhiều ghế vừa được người khác giữ hoặc đã bán",
          409
        )
      );
    }

    return next(err);
  } finally {
    connection.release();
  }
});
exports.releaseSeats = catchAsync(async (req, res, next) => {
  const { eventId, seats, sessionId } = req.body;
  const userId = req.user.id;

  if (!eventId) {
    return next(new AppError("Thiếu eventId", 400));
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    return next(new AppError("Không có ghế nào để hủy giữ", 400));
  }

  await db.promise().query(
    `
    UPDATE tickets
    SET active = 0
    WHERE eventId = ?
    AND userId = ?
    AND seat IN (?)
    AND status = 'locked'
    AND active = 1
    `,
    [eventId, userId, seats]
  );

  emitSeatUpdate(eventId, {
    type: "released",
    seats,
    sessionId,
  });

  res.status(200).json({
    status: "success",
    message: "Đã hủy giữ ghế",
  });
});
exports.purchaseTicket = catchAsync(async (req, res, next) => {
  const { eventId, seats } = req.body;
  const userId = req.user.id;

  if (!eventId) {
    return next(new AppError("Thiếu eventId", 400));
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    return next(new AppError("Không có ghế nào được chọn", 400));
  }

  const [userRows] = await db
    .promise()
    .query("SELECT name, email FROM users WHERE id = ?", [userId]);

  if (userRows.length === 0) {
    return next(new AppError("Không tìm thấy người dùng", 404));
  }

  const [eventRows] = await db
    .promise()
    .query("SELECT title FROM events WHERE id = ?", [eventId]);

  const eventTitle =
    eventRows.length > 0 ? eventRows[0].title : `Sự kiện #${eventId}`;

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    for (const item of seats) {
      if (!item.tierId || !item.seatId) {
        throw new AppError("Dữ liệu ghế không hợp lệ", 400);
      }

      const [existingSeats] = await connection.query(
        `
        SELECT id, userId, status
        FROM tickets
        WHERE eventId = ?
        AND seat = ?
        AND active = 1
        AND status IN ('locked', 'pending', 'paid')
        LIMIT 1
        FOR UPDATE
        `,
        [eventId, item.seatId]
      );

      const existingSeat = existingSeats[0];

      if (existingSeat && existingSeat.status === "paid") {
        throw new AppError(`Ghế ${item.seatId} đã được bán`, 409);
      }

      if (existingSeat && String(existingSeat.userId) !== String(userId)) {
        throw new AppError(`Ghế ${item.seatId} đang được người khác giữ`, 409);
      }

      if (
        existingSeat &&
        (existingSeat.status === "locked" || existingSeat.status === "pending")
      ) {
        await connection.query(
          `
          UPDATE tickets
          SET tierId = ?,
              status = 'paid',
              active = 1
          WHERE id = ?
          `,
          [item.tierId, existingSeat.id]
        );
      } else {
        await connection.query(
          `
          INSERT INTO tickets
          (userId, eventId, tierId, seat, status, active)
          VALUES (?, ?, ?, ?, 'paid', 1)
          `,
          [userId, eventId, item.tierId, item.seatId]
        );
      }
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();

    if (err.code === "ER_DUP_ENTRY") {
      return next(
        new AppError(
          "Một hoặc nhiều ghế vừa được người khác giữ hoặc đã bán",
          409
        )
      );
    }

    return next(err);
  } finally {
    connection.release();
  }

  emitSeatUpdate(eventId, {
    type: "sold",
    seats: seats.map((item) => item.seatId),
  });

  try {
    const ticketDetailsText = seats
      .map(
        (item) =>
          `${item.seatId} - ${item.tierName || "Vé"} - ${Number(
            item.price || 0
          ).toLocaleString("vi-VN")}đ`
      )
      .join("\n");

    const message = `
Xin chào ${userRows[0].name},

Chúc mừng bạn đã thanh toán thành công trên TicketRush!

Sự kiện: ${eventTitle}
Chi tiết:
${ticketDetailsText}
Trạng thái: ĐÃ THANH TOÁN

Bạn có thể đăng nhập vào website, vào mục "Vé của tôi" để xem mã QR Check-in nhé.

Cảm ơn bạn đã sử dụng TicketRush!
    `;

    await sendEmail({
      email: userRows[0].email,
      subject: `Xác nhận đặt vé thành công: ${eventTitle} - TicketRush`,
      message,
    });
  } catch (error) {
    console.error("Lỗi gửi email thực tế:", error);
  }

  res.status(201).json({
    status: "success",
    message: "Thanh toán thành công!",
  });
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return next(new AppError("Không tìm thấy email", 404));
  }

  const [cooldownRows] = await db.promise().query(
    `
    SELECT TIMESTAMPDIFF(
      MINUTE,
      password_reset_sent_at,
      NOW()
    ) as diff
    FROM users
    WHERE id = ?
    `,
    [user.id]
  );

  const diffMinutes = cooldownRows[0].diff;

  if (diffMinutes !== null && diffMinutes < 10) {
    return next(
      new AppError(
        `Vui lòng chờ ${10 - diffMinutes} phút để gửi lại email`,
        429
      )
    );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await db.promise().query(
    `
    UPDATE users
    SET resetPasswordToken = ?, resetPasswordExpires = ?
    WHERE id = ?
    `,
    [hashedToken, expires, user.id]
  );

  const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

  await sendEmail({
    email: user.email,
    subject: "Reset Password - TicketRush",
    message: `
Bạn yêu cầu đặt lại mật khẩu.

Nhấn link bên dưới:

${resetURL}

Link hết hạn sau 10 phút.
    `,
  });

  await db.promise().query(
    `
    UPDATE users
    SET password_reset_sent_at = NOW()
    WHERE id = ?
    `,
    [user.id]
  );

  res.status(200).json({
    status: "success",
    message: "Đã gửi email reset password",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const [rows] = await db.promise().query(
    `
    SELECT * FROM users
    WHERE resetPasswordToken = ?
    AND resetPasswordExpires > NOW()
    `,
    [hashedToken]
  );

  const user = rows[0];

  if (!user) {
    return next(new AppError("Token không hợp lệ hoặc đã hết hạn", 400));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  await db.promise().query(
    `
    UPDATE users
    SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL
    WHERE id = ?
    `,
    [hashedPassword, user.id]
  );

  res.status(200).json({
    status: "success",
    message: "Đổi mật khẩu thành công",
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const [userRows] = await db.promise().query(
    "SELECT id, name, email, gender, dob, age FROM users WHERE id = ?",
    [req.user.id]
  );

  if (userRows.length === 0) {
    return next(new AppError("Không tìm thấy người dùng", 404));
  }

  res.status(200).json({ status: "success", data: userRows[0] });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, gender, dob } = req.body;

  let age = null;

  if (dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    age = today.getFullYear() - birthDate.getFullYear();

    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  }

  await db.promise().query(
    "UPDATE users SET name = ?, gender = ?, dob = ?, age = ? WHERE id = ?",
    [name, gender, dob, age, req.user.id]
  );

  res.status(200).json({
    status: "success",
    message: "Cập nhật hồ sơ thành công!",
  });
});