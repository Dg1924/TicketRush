INSERT INTO events
(title, artist, category, date, time, venue, city, description, featured, image, tags)
VALUES
('TicketRush Music Night 2026', 'Son Tung M-TP, Hoang Thuy Linh', 'concert', '2026-06-15', '19:30:00', 'San van dong My Dinh', 'Ha Noi', 'Dem nhac lon voi san khau anh sang hien dai.', 1, '/uploads/event-1778936778015-946913972.jpg', '["concert","pop","featured"]');

SET @event1 = LAST_INSERT_ID();

INSERT INTO ticket_tiers
(eventId, name, price, capacity, available, description)
VALUES
(@event1, 'VIP', 2500000, 100, 100, 'Ghe dep gan san khau'),
(@event1, 'Standard', 900000, 300, 300, 'Khu vuc tieu chuan');

INSERT INTO events
(title, artist, category, date, time, venue, city, description, featured, image, tags)
VALUES
('EDM Summer Festival', 'DJ Mie, Touliver, Triple D', 'festival', '2026-07-20', '18:00:00', 'Cung Dien Kinh My Dinh', 'Ha Noi', 'Le hoi EDM mua he cho khan gia tre.', 1, '/uploads/event-1778936778015-946913972.jpg', '["edm","festival","summer"]');

SET @event2 = LAST_INSERT_ID();

INSERT INTO ticket_tiers
(eventId, name, price, capacity, available, description)
VALUES
(@event2, 'Fan Zone', 1800000, 150, 150, 'Dung gan san khau'),
(@event2, 'General', 750000, 500, 500, 'Ve pho thong');

INSERT INTO events
(title, artist, category, date, time, venue, city, description, featured, image, tags)
VALUES
('Comedy Night: Cuoi Xuyen Dem', 'Tran Thanh, Truong Giang', 'comedy', '2026-08-10', '20:00:00', 'Nha hat Hoa Binh', 'TP Ho Chi Minh', 'Dem hai kich giai tri voi cac nghe si noi tieng.', 0, '/uploads/event-1778936778015-946913972.jpg', '["comedy","show","entertainment"]');

SET @event3 = LAST_INSERT_ID();

INSERT INTO ticket_tiers
(eventId, name, price, capacity, available, description)
VALUES
(@event3, 'Premium', 1200000, 120, 120, 'Hang ghe trung tam'),
(@event3, 'Regular', 500000, 350, 350, 'Hang ghe thuong');
