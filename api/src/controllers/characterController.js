const { Router } = require('express');
const { Op } = require('sequelize');
const { Character, Movies } = require('../db');
const character = Router();

character.get('', async (req, res) => {
    const { name, films, age }  = req.query
  //  BUSQUEDA POR NOMBRE
    if(name){
      const findCName = await Character.findAll({ where: 
        { name: { [Op.like]: `%${name}%` } },
        attributes: ['name', 'age','history', 'films']
      });
      if(!findCName){
        res.status(404).send('No se encontro personaje con ese nombre');
      } 
      return res.json(findCName);
    } 
    // BUSQUEDA POR PELICULA  
    if(films){
      const findCFilms = await Character.findAll({ where: 
        { films: { [Op.like]: `%${films}%` } },
        attributes: ['films', 'name',]
       });
      
      if(!findCFilms){
        res.status(404).send('No se encontro personaje con esa pelicula');
      }
      return res.json(findCFilms);
    }
    // BUSQUEDA POR EDAD
    if(age){
      const findCAge = await Character.findAll({ 
        where: { age: age },
        attributes: ['name', 'age', 'weight', 'films'], 
      });
      if(!findCAge){
        res.status(404).send('No se encontro personaje con esa edad');
      }
      return res.json(findCAge);
   } //BUSQUEDA GENERAL 
    else {
      const findCharacters = await Character.findAll({
        attributes: ["name", "image"],
      });
      return res.status(201).json(findCharacters);
    }
  });

  // DETALLE DE PERSONAJE
 character.get('/:id', async (req, res) => {
    const id = req.params.id;
    const character = await Character.findOne({
      where: { id: id },
      attributes: ["name", "image", "age", "history"],
      include: [ { model: Movies, attributes: ["title"] } ],
    });
    if (!character) {
      return res.status(404).send('Character not found');
    }
    return res.status(201).json(character);
  });

  // ELIMINAR PERSONAJE
 character.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const character = await Character.findOne({
      where: { id: id },
    });
    await character.destroy();
    return res.status(200).send('Character deleted');
  });

  // EDITAR PERSONAJE
  character.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, image, age, films, history } = req.body;
    const character = await Character.update(
      { name: name, image: image, age: age, films: films, history: history },
      { where: { id: id } }
    );
    return res.status(201).json(character);
  });

  // AGREGAR PERSONAJE
  character.post('', async (req, res) => {
    const { name, image, age, weight, history, films } = req.body;
    const character = await Character.create({
      name: name,
      image: image,
      age: age,
      weight: weight,
      history: history,
    });


    const filmId = await Movies.findAll({
      where: { title: films },
    });
    await character.addMovies(filmId);
    return res.status(201).json(character);
  });
module.exports = character;