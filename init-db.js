// init-db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/hamburgueria.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS hamburgueres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT NOT NULL,
        preco DECIMAL(2,2) NOT NULL
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS ingredientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        calorias INTEGER
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS hamburgueres_ingredientes (
        hamburguer_id INTEGER,
        ingrediente_id INTEGER,
        PRIMARY KEY (hamburguer_id, ingrediente_id),
        FOREIGN KEY (hamburguer_id) REFERENCES hamburgueres(id),
        FOREIGN KEY (ingrediente_id) REFERENCES ingredientes(id)
    );`);

    db.run(`INSERT INTO hamburgueres (nome, descricao, categoria, preco) VALUES
        ('Salada', 'Pão de batata, carne, muçarela, alface, tomate e cebola roxa.', 'Clássico', 13.00),
        ('Calabresa', 'Pão de batata, carne, muçarela, calabresa, alface, tomate e cebola roxa.', 'Clássico', 15.00),
        ('Bacon', 'Pão de batata, carne, muçarela, bacon, alface, tomate e cebola roxa.', 'Clássico', 15.00),
        ('Divino', 'Pão de batata, carne, bacon, geleia de pimenta, cream cheese e molho de gorgonzola', 'Especial', 28.00),
        ('Sinistro', 'Pão de batata, 2 carnes, cheddar em dobro, bacon em tiras, catupiry e cebola caramelizada.', 'Especial', 28.00),
        ('Magnífico', 'Pão de batata, carne, cream cheese, geleia de amora, queijo coalho e bacon', 'Especial', 27.00),
        ('Magnata', 'Pão de batata, carne, muçarela, lombinho, maionese de bacon, cream cheese e cebola caramelizada.', 'Especial', 27.00),
        ('Cabuloso', 'Pão de batata, 3 carnes, triplo cheddar, bacon, catupiry, barbecue, cebola roxa e picles.', 'Premium', 34.00),
        ('Nordestino', 'Pão de batata, carne, banana, cream cheese, carne seca, queijo coalho e melaço.', 'Premium', 30.00),
        ('Sinistrinho', 'Pão de batata, 2 carnes smash, duplo cheddar, bacon, molho da casa, cebola caramelizada.', 'Smash', 23.00),
        ('Firezinho', 'Pão de batata, carne 80g, cheddar, molho da casa, cebola caramelizada', 'Smash', 16.00);
    `);

    db.run(`INSERT INTO ingredientes (nome, categoria, calorias) VALUES
        ('Pão de batata', 'Pão', 150),
        ('Carne', 'Proteína', 250),
        ('Muçarela', 'Laticínio', 80),
        ('Alface', 'Vegetal', 5),
        ('Tomate', 'Vegetal', 20),
        ('Cebola roxa', 'Vegetal', 10),
        ('Calabresa', 'Embutido', 150),
        ('Bacon', 'Embutido', 70),
        ('Geleia de pimenta', 'Molho', 50),
        ('Cream cheese', 'Laticínio', 100),
        ('Molho de gorgonzola', 'Molho', 110),
        ('Cheddar', 'Laticínio', 110),
        ('Catupiry', 'Laticínio', 90),
        ('Cebola caramelizada', 'Vegetal', 30),
        ('Geleia de amora', 'Molho', 40),
        ('Queijo coalho', 'Laticínio', 100),
        ('Lombinho', 'Proteína', 100),
        ('Maionese de bacon', 'Molho', 150),
        ('Barbecue', 'Molho', 60),
        ('Picles', 'Vegetal', 5),
        ('Banana', 'Fruta', 90),
        ('Carne seca', 'Proteína', 200),
        ('Molho da casa', 'Molho', 80)
    `);

    const hamburguerIngredientes = [
        [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], // Salada
        [2, 1], [2, 2], [2, 3], [2, 7], [2, 4], [2, 5], [2, 6], // Calabresa
        [3, 1], [3, 2], [3, 3], [3, 8], [3, 4], [3, 5], [3, 6], // Bacon
        [4, 1], [4, 2], [4, 8], [4, 9], [4, 10], [4, 11], // Divino
        [5, 1], [5, 2], [5, 12], [5, 8], [5, 13], [5, 6], // Sinistro
        [6, 1], [6, 2], [6, 10], [6, 14], [6, 15], [6, 8], // Magnífico
        [7, 1], [7, 2], [7, 3], [7, 16], [7, 17], [7, 10], [7, 6], // Magnata
        [8, 1], [8, 2], [8, 3], [8, 8], [8, 18], [8, 19], [8, 6], [8, 20], // Cabuloso
        [9, 1], [9, 2], [9, 21], [9, 10], [9, 22], [9, 15], [9, 23], // Nordestino
        [10, 1], [10, 2], [10, 12], [10, 8], [10, 24], [10, 6], // Sinistrinho
        [11, 1], [11, 2], [11, 12], [11, 24], [11, 6], // Firezinho
      ];
    
      hamburguerIngredientes.forEach(([hamburguer_id, ingrediente_id]) => {
        db.run("INSERT INTO hamburguer_ingrediente (hamburguer_id, ingrediente_id) VALUES (?, ?)", [hamburguer_id, ingrediente_id]);
      });
});

db.close();
