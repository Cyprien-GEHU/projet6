const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
  
//permet de crée un compte
router.post('/signup', userCtrl.signup);

//permet de se connecter a un compte
router.post('/login', userCtrl.login);

module.exports = router;