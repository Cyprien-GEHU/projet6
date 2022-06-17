const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

  //Crée une sauce
  router.post('/',auth,multer,stuffCtrl.createSauces);
  
  //récuperer tous les sauces
  router.get('/', auth,stuffCtrl.getSauces);
  
  //récuperer une sauce
  router.get('/:id', auth, stuffCtrl.searchSauces );
  
  //permet de modifier une sauce
  router.put('/:id', auth, multer,stuffCtrl.modifySauces );
  
  //permet de suprimmer une sauce
  router.delete('/:id', auth, stuffCtrl.deleteSauces);
 
  //mettre un like ou dislike sur une sauce
  router.post('/:id/like',auth, stuffCtrl.likeSauces);
  module.exports = router;
  