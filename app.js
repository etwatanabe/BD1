const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./database/my_database.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Criar a tabela de posts se não existir
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        )
    `);
});

// // Rota principal para visualizar todos os posts
// app.get('/', (req, res) => {
//     db.all('SELECT * FROM posts', [], (err, rows) => {
//         if (err) {
//             throw err;
//         }
//         res.render('index', { posts: rows });
//     });
// });


// Rota para visualizar todas as tabelas do banco de dados
app.get('/', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            throw err;
        }
        res.render('tables', { tables });
    });
});

// Rota para visualizar o conteúdo de uma tabela específica
app.get('/table/:name', (req, res) => {
    const tableName = req.params.name;
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index', { posts: rows });
    });
});

// Rota para criar um novo post
app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        res.send('Title and Content are required!');
        return;
    }
    db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err) => {
        if (err) {
            return console.log(err.message);
        }
        res.redirect('/');
    });
});

// Rota para editar um post
app.get('/edit/:id', (req, res) => {
    const postId = req.params.id;
    db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
        if (err) {
            throw err;
        }
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('edit', { post });
    });
});

app.post('/edit/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    if (!title || !content) {
        res.send('Title and Content are required!');
        return;
    }
    db.run('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, postId], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
