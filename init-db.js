// init-db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/db.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS streaming_platforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        mensalidade REAL NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        ano INTEGER NOT NULL,
        platform_id INTEGER,
        FOREIGN KEY (platform_id) REFERENCES streaming_platforms(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS movie_genres (
        movie_id INTEGER,
        genre_id INTEGER,
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        FOREIGN KEY (genre_id) REFERENCES genres(id),
        PRIMARY KEY (movie_id, genre_id)
    )`);

    db.run(`INSERT INTO streaming_platforms (nome, mensalidade) VALUES 
        ('Netflix', 29.90),
        ('Amazon Prime Video', 19.90),
        ('Disney+', 27.90)
    `);

    db.run(`INSERT INTO genres (nome) VALUES 
        ('Ação'),
        ('Comédia'),
        ('Drama'),
        ('Fantasia'),
        ('Terror')
    `);

    db.run(`INSERT INTO movies (titulo, ano, platform_id) VALUES 
        ('Extraction', 2020, 1),
        ('The Tomorrow War', 2021, 2),
        ('Soul', 2020, 3),
        ('The Irishman', 2019, 1),
        ('Borat Subsequent Moviefilm', 2020, 2)
    `);

    db.run(`INSERT INTO movie_genres (movie_id, genre_id) VALUES 
        (1, 1),
        (2, 1),
        (3, 4),
        (4, 3),
        (5, 2)
    `);
});

db.close();
