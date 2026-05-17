INSERT INTO events
(title, artist, category, date, time, venue, city, description, featured, image, tags)
VALUES
(
  'Neon Lights Festival 2026',
  'Da LAB, Vu., Chillies, DJ Wukong',
  'festival',
  '2026-11-22',
  '18:30:00',
  'Cong vien Yen So',
  'Ha Noi',
  'Le hoi am nhac ngoai troi voi khong gian anh sang neon, nhieu san khau bieu dien va khu check-in danh cho khan gia tre.',
  1,
  '/uploads/event-1778936778015-946913972.jpg',
  '["festival","neon","music","outdoor"]'
);

SET @eventId = LAST_INSERT_ID();

INSERT INTO ticket_tiers
(eventId, name, price, capacity, available, description)
VALUES
(@eventId, 'Sky Pass', 2000000, 150, 150, 'Khu vuc dep gan san khau chinh'),
(@eventId, 'Glow Pass', 1200000, 300, 300, 'Khu vuc trung tam, tam nhin tot'),
(@eventId, 'General Pass', 650000, 600, 600, 'Ve pho thong khu vuc phia sau');
