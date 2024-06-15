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
            
            res.render('inicio', { page:'Início', musicas, artistas, artistaSelecionado });
        });
    });
});

// Rota para tabela de musicas
app.get('/musicas', (req, res) => {
    db.all(`SELECT * FROM musicas`, [], (err, musicas) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Erro no servidor");
            return;
        }
        res.render('musicas', { page:'Músicas', musicas });
    });
});

// Rota para tabela de artistas
app.get('/artistas', (req, res) => {
    const acao = req.query.acao;
    const dados = { 'id': req.query.id, 'nome': req.query.nome, 'genero': req.query.genero};


    console.log(req.query.action, dados);
    
    db.all(`SELECT * FROM artistas`, [], (err, artistas) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Erro no servidor");
            return;
        }

        if(acao) {
            let query = ``;
            let variaveis = [];

            if(acao == 'incluir' && dados.nome && dados.genero) {
                query = `INSERT INTO artistas(nome, genero) VALUES (?, ?)`;
                variaveis = [dados.nome, dados.genero];
                
            } else if(acao == 'editar' && dados.id && dados.nome && dados.genero) {
                query = `UPDATE artistas SET nome = ?, genero = ? WHERE id = ?`;
                variaveis = [dados.nome, dados.genero, dados.id];

            } else if(acao == 'excluir' && dados.id && dados.nome && dados.genero) {
                query = `DELETE FROM artistas WHERE id = ?`;
                variaveis = [dados.id];
            }

            db.run(query, variaveis, (err) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Erro no servidor");
                    return;
                }
                res.redirect('artistas');

            });
        } else {
            res.render('artistas', { page:'Artistas', artistas });
        }

    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});
