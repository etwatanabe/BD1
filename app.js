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
    let query = `SELECT m.titulo, a.nome as artista, m.duracao, a.genero as genero
                 FROM musicas m
                 JOIN artistas a ON m.artista_id = a.id`;

    if (artistaSelecionado) {
        query += ` WHERE a.id = ${artistaSelecionado}`;
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
            
            res.render('index', { musicas, artistas, artistaSelecionado });
        });
    });
});

app.get('/musicas', (req, res) => {
    db.all(`SELECT * FROM musicas`, [], (err, musicas) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Erro no servidor");
            return;
        }
        res.render('musicas', { musicas });
    });
});

app.get('/artistas', (req, res) => {
    db.all(`SELECT * FROM artistas`, [], (err, artistas) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Erro no servidor");
            return;
        }
        res.render('artistas', { artistas });
    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});
