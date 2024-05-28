const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database/musicas.db');

// Configurar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    const artistaSelecionado = req.query.artista;
    const generoSelecionado = req.query.genero;
    let query = `SELECT musicas.titulo, musicas.duracao, generos.nome AS genero, artistas.nome AS artista
                 FROM musicas 
                 JOIN artistas ON musicas.artista_id = artistas.id
                 JOIN generos ON artistas.genero_id = generos.id`;
    // console.log(artistaSelecionado, generoSelecionado);

    if (artistaSelecionado) {
        query += ` WHERE artistas.id = ${artistaSelecionado}`;
    }

    if (generoSelecionado) {
        if(artistaSelecionado) {
            query += ` AND generos.id = ${generoSelecionado}`;
        }
        else {
            query += ` WHERE generos.id = ${generoSelecionado}`;
        }
    }

    db.all(query, [], (err, musicas) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Erro no servidor");
            return;
        }

        db.all(`SELECT * FROM artistas`, [], (err, artistas) => {
            if (err) {
                console.error(err.message);
                res.status(500).send("Erro no servidor");
                return;
            }

            db.all(`SELECT * FROM generos`, [], (err, generos) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Erro no servidor");
                    return;
                }

            res.render('index', { musicas, artistas, generos, artistaSelecionado, generoSelecionado });
            });
        });
    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});
