const express = require('express');

//utilisation de mangoDB
const mongoose = require('mongoose');

const bodyParser = require('body-parser')

//utilisation des routes du fichier stuff.js
const stuffRoute = require('./routes/stuff')

//utilisation des route du fichier user.js
const userRoutes = require('./routes/user')

//utilisation de path pour le chemin du fichier
const path = require('path');

const rateLimit = require('express-rate-limit')

//acces a un utilisateur mangoDB altas
mongoose.connect('mongodb+srv://dragon:sonic1234@cluster0.dtsg5.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//utilisation de express
const app = express();

//erreur du CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces',stuffRoute);
app.use('/api/auth',userRoutes);
app.use('/api', apiLimiter)

module.exports = app;