const Thing = require('../models/thing');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const newSauce = new Thing({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes : 0,
    dislikes : 0,
    });
    newSauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.getSauces = (req, res, next) => {
    Thing.find()
    .then(sauces => {res.status(200).json(sauces)})
    .catch(error => res.status(400).json({ error }));
  }

  exports.searchSauces= (req, res, next) => {
    console.log(req.params.id);
    Thing.findOne({ _id: req.params.id})
      .then((sauces) => {
        console.log(sauces)
        res.status(200).json(sauces);
      })
      .catch(error => res.status(404).json({ error }));
  }
  
  exports.modifySauces = (req, res, next) => {
    console.log("ici")
      const thingObject = req.file ?
        {
          ...JSON.parse(req.id),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
      Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => {res.status(200).json({ message: 'Objet modifié !'})})

        .catch(error => res.status(400).json({ error }));
    };

    exports.deleteSauces = (req, res, next) => {
      Thing.findOne({ _id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };