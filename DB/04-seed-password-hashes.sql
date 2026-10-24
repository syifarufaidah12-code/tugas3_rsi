USE review_kantin;
GO

UPDATE dbo.USERS SET password_hash = N'$2b$10$eYDhA8k96hVOwauOdHcJ/eyLwmLpIXMJcOApklHzRNrAa2yXVweXy'
WHERE email = N'admin@kantin.test';

UPDATE dbo.USERS SET password_hash = N'$2b$10$uDbObu/Mw0BOJ0MNJo9H4.E3RsRtKnpRHBZ4axJr76K0fSn8qYrAe'
WHERE email = N'tini@kantin.test';

UPDATE dbo.USERS SET password_hash = N'$2b$10$XayKzWUDvMrQxrSm50SMNeJHtPZxImuhA7uUtk2h3bvD5fVzUfdje'
WHERE email = N'bagas@student.test';

-- Verifikasi: hash_prefix harus $2b$10$
SELECT id, email, role, LEFT(password_hash, 7) AS hash_prefix
FROM dbo.USERS
WHERE email IN (N'admin@kantin.test', N'tini@kantin.test', N'bagas@student.test');
GO