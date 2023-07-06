// Importer le framework Express
const express = require('express');
// Créer une application Express
const app = express();
// Définir le numéro de port
const port = 5000;
// Importer la configuration de la base de données
const db = require('./models');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const {Users} = require("./models");



// Analyser les corps de requête en tant que JSON
app.use(express.json());
app.use(cookieParser());

app.post("/register", (req, res) => {
    const {username, password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
         Users.create({
            username: username,
            password: hash
        }).then(() => {
            res.json("USER REGISTERED")
        }).catch((err) => {
            if(err){
                res.status(400).json({error: err});
            }
        })
    });

});

app.post("/login", async (req,res) => {
   const {username, password} = req.body;

   const user = await Users.findOne({ where: { username : username}})

   if(!user) res.status(400).json({ error: "User Doesn't Exist"});

   const dbPassword = await user.password;
   
   bcrypt.compare(password,dbPassword).then((match) => {
        if (!match) {
            res.status(400).json({ error: "Wrong Username and Password combination!"});
        } else {
            res.json(("LOGGED IN"));
        }
   })
  
})

app.get("/profile", (req,res) => {
    res.json("profile");
})

// Synchroniser les modèles de la base de données et démarrer le serveur
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Le serveur fonctionne sur le port ${port}`);
    });
});

