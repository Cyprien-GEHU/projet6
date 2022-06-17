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
    Thing.findOne({ _id: req.params.id})
      .then(sauces => {res.status(200).json(sauces)})
      .catch(error => res.status(404).json({ error }))
  }
  
  exports.modifySauces = (req, res, next) => {
      const thingObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
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

  exports.likeSauces = (req, res, next ) => {
    const like = req.body.like;
    const userID = req.body.userId;
    console.log(req.body)
    
    if(like == 1 ){
      console.log("il a aimer !")
      Thing.findOne({ _id: req.params.id})
      .then(sauces => {
        const Tab = sauces.usersLiked
        sauces.likes = sauces.likes + 1;
        Tab.push(userID)
        sauces.save()
          .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
          .catch(error => res.status(400).json({ error }));
          console.log(sauces)
      })
      .catch(error => res.status(404).json({ error }))
    }

    if(like == -1){
      console.log("il a pas aimé")
      Thing.findOne({ _id: req.params.id})
      .then(sauces => {
        const Tab = sauces.usersDisliked
        sauces.dislikes = sauces.dislikes + 1;
        Tab.push(userID)
        console.log(sauces)
        sauces.save()
          .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
          .catch(error => res.status(400).json({ error }));
        })
      .catch(error => res.status(404).json({ error }))
    }


  if(like == 0){
    console.log(userID)
    Thing.findOne({ _id: req.params.id})
      .then(sauces => {
        const Tab_l = sauces.usersLiked
        const Tab_d = sauces.usersDisliked
        for(let i in Tab_l){
          if(Tab_l[i] == userID){
            console.log("deja aimé")
            sauces.likes = sauces.likes - 1;
            var myIndex = Tab_l.indexOf(userID);
            if (myIndex !== -1) {
              Tab_l.splice(myIndex, 1);
            }
          }
        }
        for(let i in Tab_d){
          if(Tab_d[i] == userID){
            console.log("deja pas aimé")
            sauces.dislikes = sauces.dislikes - 1;
            var myIndex = Tab_d.indexOf(userID);
            if (myIndex !== -1) {
              Tab_d.splice(myIndex, 1);
            }
          }
        }
        console.log (sauces)
        sauces.save()
          .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
          .catch(error => res.status(400).json({ error }));
        })
      .catch(error => res.status(404).json({ error }))
      }
};