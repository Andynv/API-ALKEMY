const { Router } = require('express');
const { Op } = require('sequelize');
const {  Movies, Categories } = require('../db');
const movie = Router();

movie.get('', async (req, res, next) => {
    const { title, order, categorie } = req.query;
    try{
        if(title){
            const movieName = await Movies.findAll({ where:
                 { title:{[Op.iLike]:  `%${title}%`} },
                attributes: ['title', 'image'],
            })
            if(!movieName){
                res.status(404).send('No se encontro la pelicula');
            }
            return res.json(movieName);
        }
        if(order){
            const movieYear = await Movies.findAll({ where:
                 { year: {[Op.gte]:  order} },
                 order : [['year', 'ASC']],
                 attributes: ['year', 'title', 'image'],
                 })
            if(!movieYear){
                res.status(404).send('No se encontro la pelicula');
            }
            return res.json(movieYear);
        }
        if(categorie){
        const movieCateg = await Categories.findAll({
            where: {name: categorie},
            attributes: ['name'],
  
            include: [{model: Movies, attributes: ['title', 'image'],
            }],
        });
        return res.json(movieCateg);
        }
        const movies = await Movies.findAll({
            attributes: ['title', 'image'],
        });
        res.json(movies);
    } catch (error) {
        next(error);
    }
  });
  
  
  // DETALLE DE PELICULA
movie.get('/:id', async (req, res) => {
    const { id } = req.params;
    const movie = await Movies.findOne({
      where: { id: id },
      attributes: ["title", "image", "year"],
      include: [ 
        { model: Categories, attributes: ["name"] } ],
    });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    return res.status(201).json(movie);
  });
  
  // ELIMINAR PELICULA
movie.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const movie = await Movies.findOne({
      where: { id: id },
    });
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    await movie.destroy();
    return res.status(200).send('Movie deleted');
  });
  
  // EDITAR PELICULA
movie.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, image, year, score } = req.body;
    const movie = await Movies.update(
      { title: title, 
        image: image,
        year: year,
        score: score },
      { where: { id: id } }
    );
    return res.status(201).json(movie);
  });
  
  
  // AGREGAR PELICULA
movie.post('', async (req, res) => {
    const { title, image, year, score, category} = req.body;
    const movie = await Movies.create({
      title: title,
      image: image,
      year: year,
      score: score,
      category: category,
    });
  
    const categoryName = await Categories.findAll({
      where: { name: category},
    });
  
    await movie.setCategories(categoryName);
    return res.status(201).json({ movie, categoryName });
  });

module.exports = movie;