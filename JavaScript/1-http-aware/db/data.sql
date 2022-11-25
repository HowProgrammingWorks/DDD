INSERT INTO "users" ("login", "password") VALUES
  ('admin', 'ypMEd9FwvtlOjcvH94iICQ==:V6LnSOVwXzENxeLCJk59Toadea7oaA1IxYulAOtKkL9tBxjEPOw085vYalEdLDoe8xbrXQlhh7QRGzrSe8Bthw=='),
  ('marcus', 'dpHw0OUNBz76nuqrXZbeYQ==:wpvUVgi8Yp9rJ0yZyBWecaWP2EL/ahpxZY74KOVfhAYbAZSq6mWqjsQwtCvIPcSKZqUVpVb13JcSciB2fA+6Tg=='),
  ('user', 'r8zb8AdrlPSh5wNy6hqOxg==:HyO5rvOFLtwzU+OZ9qFi3ADXlVccDJWGSfUS8mVq43spJ6sxyliUdW3i53hOPdkFAtDn3EAQMttOlIoJap1lTQ=='),
  ('iskandar', 'aqX1O4bKXiwC/Jh2EKNIYw==:bpE4TARNg09vb2Libn1c00YRxcvoklB9zVSbD733LwQQFUuAm7WHP85PbZXwEbbeOVPIFHgflR4cvEmvYkr76g==');

-- Examples login/password
-- admin/123456
-- marcus/marcus
-- user/nopassword
-- iskandar/zulqarnayn

INSERT INTO "country" ("name") VALUES
  ('Soviet Union'),
  ('People''s Republic of China'),
  ('Vietnam'),
  ('Cuba');

INSERT INTO "city" ("name", "country") VALUES
  ('Beijing', 2),
  ('Wuhan', 2),
  ('Kiev', 1),
  ('Havana', 4),
  ('Hanoi', 3),
  ('Kaliningrad', 1);
