// SQL queries
export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    views_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS likes (
    user_id INTEGER NOT NULL,
    news_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, news_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (news_id) REFERENCES news(id)
  );
`;

export const INSERT_USER = 'INSERT INTO users (username, password) VALUES (?, ?)';
export const SELECT_USER = 'SELECT * FROM users WHERE username = ?';
export const INSERT_NEWS = 'INSERT INTO news (title, content, author_id) VALUES (?, ?, ?)';

export const SELECT_ALL_NEWS = `
  SELECT 
    n.*,
    u.username as author_username,
    (SELECT COUNT(*) FROM likes WHERE news_id = n.id) as likes_count
  FROM news n
  JOIN users u ON n.author_id = u.id 
  ORDER BY n.created_at DESC
`;

export const GET_USER_PROFILE = `
  SELECT 
    u.*,
    (SELECT COUNT(*) FROM news WHERE author_id = u.id) as published_count,
    (SELECT COALESCE(SUM(views_count), 0) FROM news WHERE author_id = u.id) as total_views
  FROM users u
  WHERE u.id = ?
`;

export const TOGGLE_LIKE = `
  INSERT INTO likes (user_id, news_id)
  SELECT ?, ?
  WHERE NOT EXISTS (
    SELECT 1 FROM likes WHERE user_id = ? AND news_id = ?
  )
`;

export const DELETE_LIKE = `
  DELETE FROM likes 
  WHERE user_id = ? AND news_id = ?
`;

export const CHECK_LIKE = `
  SELECT COUNT(*) as liked 
  FROM likes 
  WHERE user_id = ? AND news_id = ?
`;

export const INCREMENT_VIEW = `
  UPDATE news 
  SET views_count = views_count + 1 
  WHERE id = ?
`;

export const INCREMENT_USER_VIEW = `
  UPDATE users 
  SET views_count = views_count + 1 
  WHERE id = ?
`;