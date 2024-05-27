// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const db = new sqlite3.Database('./database/db.sqlite');

app.get('/', (req, res) => {
    const platformId = req.query.platform;
    const genreId = req.query.genre;
    let query = `SELECT movies.id, movies.titulo, movies.ano, streaming_platforms.nome as plataforma, group_concat(genres.nome, ', ') as generos
                 FROM movies
                 JOIN streaming_platforms ON movies.platform_id = streaming_platforms.id
                 JOIN movie_genres ON movies.id = movie_genres.movie_id
                 JOIN genres ON movie_genres.genre_id = genres.id
                 GROUP BY movies.id, movies.titulo, movies.ano, streaming_platforms.nome`;

    if (platformId) {
        query += ` HAVING movies.platform_id = ${platformId}`;
    }

    if (genreId) {
        if (platformId) {
            query += ` AND group_concat(genres.nome, ', ') LIKE '%${genreId}%'`;
        } else {
            query += ` HAVING group_concat(genres.nome, ', ') LIKE '%${genreId}%'`;
        }
    }

    db.all(query, [], (err, movies) => {
        if (err) {
            return console.error(err.message);
        }

        db.all(`SELECT * FROM streaming_platforms`, [], (err, platforms) => {
            if (err) {
                return console.error(err.message);
            }

            db.all(`SELECT * FROM genres`, [], (err, genres) => {
                if (err) {
                    return console.error(err.message);
                }

                res.render('index', {
                    movies,
                    platforms,
                    genres
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
