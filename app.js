const express = require("express");
const app = express();

app.set("engine ejs", "ejs");

app.use(express.urlencoded({extended: false}));

//rotas...
app.get("/", function(req, res){
    let nome ="UNIVERSIDADE ESTADUAL DE SANTA CRUZ";

    let mascots = [
        { nome: 'Sammy', empresa: "DigitalOcean", ano: 2012},
        { nome: 'Tux', empresa: "Linux", ano: 1996},
        { nome: 'Moby Dock', empresa: "Docker", ano: 2013}
    ];

    res.render("index.ejs", {
        uesc: nome,
        query: mascots
    });
});

app.listen(3000, () => {
    console.log('SERVIDOR ATIVO, ACESSE http://localhost:3000');
});