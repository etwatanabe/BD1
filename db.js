// init-db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/musicas.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS generos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
    );`)

    db.run(`CREATE TABLE IF NOT EXISTS artistas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        genero_id INTEGER,
        FOREIGN KEY (genero_id) REFERENCES generos(id)
    );`);
    
    db.run(`CREATE TABLE IF NOT EXISTS musicas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        duracao TIME NOT NULL,
        artista_id INTEGER,
        FOREIGN KEY (artista_id) REFERENCES artistas(id)
    );`);

    db.run(`INSERT INTO generos (nome) VALUES 
        ('Pop'),
        ('Reggae'),
        ('Hip Hop'),
        ('Rock'),
        ('R&B');
    `);

    db.run(`INSERT INTO artistas (nome, genero_id) VALUES 
        ('Michael Jackson', 1), -- Pop
        ('Madonna', 1), -- Pop
        ('Bob Marley', 2), -- Reggae
        ('Eminem', 3), -- Hip Hop
        ('Adele', 1), -- Pop
        ('Elvis Presley', 4), -- Rock
        ('Beyoncé', 5); -- R&B
    `);

    db.run(`INSERT INTO musicas (titulo, duracao, artista_id) VALUES 
        ('Thriller', '00:05:57', 1), -- Michael Jackson
        ('Like a Virgin', '00:03:38', 2), -- Madonna
        ('Redemption Song', '00:03:48', 3), -- Bob Marley
        ('Lose Yourself', '00:05:20', 4), -- Eminem
        ('Rolling in the Deep', '00:03:48', 5), -- Adele
        ('Can''t Help Falling in Love', '00:03:01', 6), -- Elvis Presley
        ('Halo', '00:04:21', 7), -- Beyoncé
        ('Billie Jean', '00:04:54', 1), -- Michael Jackson
        ('Vogue', '00:05:19', 2), -- Madonna
        ('No Woman, No Cry', '00:03:00', 3), -- Bob Marley
        ('Stan', '00:06:44', 4), -- Eminem
        ('Someone Like You', '00:04:45', 5), -- Adele
        ('Jailhouse Rock', '00:02:29', 6), -- Elvis Presley
        ('Single Ladies (Put a Ring on It)', '00:03:13', 7); -- Beyoncé
    `);
});

db.close();