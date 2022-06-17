//Pour hash le mot de passe
const bcrypt = require('bcrypt');

//Pour l'utilisation du token
const jwt = require('jsonwebtoken');

//pour crypté l'eamil
const crypto = require('crypto-js')

//utilisation du models user
const User = require('../models/User');

//Partie création de l'utilisateur
exports.signup = (req, res, next) => {
  //chiffrement de l'email
  const cryptoEmail = crypto.HmacSHA256(req.body.email, "CLE_SECRET").toString();
  //on hash le mdp
    bcrypt.hash(req.body.password, 5)
      .then(hash => {
        const user = new User({
          email: cryptoEmail,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  //Partie connection de l'utilisateur
  exports.login = (req, res, next) => {
    //partie chiffrement de l'email
    var bytes  = crypto.HmacSHA256(req.body.email, 'CLE_SECRET');
    var decodedEmail = bytes.toString();
    User.findOne({ email: decodedEmail })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            //connection du compte avec le token
            const token = jwt.sign({ userId: user._id },'RANDOM_TOKEN_SECRET',{ expiresIn: '24h' })
            res.status(200).json({
              userId: user._id,
              token: token
            });
          })
          
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };