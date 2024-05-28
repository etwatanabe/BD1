// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const db = new sqlite3.Database('./database/hamburgueria.db');

app.get('/', (req, res) => {
    const ingredienteId = req.query.ingredientes;
    console.log(ingredienteId);
    let query = `SELECT hamburgueres.nome, hamburgueres.descricao, hamburgueres.preco
                 FROM hamburgueres
                 JOIN hamburgueres_ingredientes ON hamburgueres.id = hamburgueres_ingredientes.hamburguer_id
                 JOIN ingredientes ON hamburgueres_ingredientes.ingrediente_id = ingredientes.id
                 WHERE 1=1
                 `;

    if (ingredienteId) {
        for(let ingrediente in ingredienteId) {
            query += ` AND ingredientes.id = ${ingredienteId[ingrediente]}`;
        }
    }

    query += ` GROUP BY hamburgueres.id`;

    db.all(query, [], (err, hamburgueres) => {
        if (err) {
            return console.error(err.message);
        }

        db.all(`SELECT * FROM ingredientes`, [], (err, ingredientes) => {
            if (err) {
                return console.error(err.message);
            }

            res.render('index', {
                ingredienteId,
                hamburgueres,
                ingredientes
            });
        });
    });
    console.log(query);
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
