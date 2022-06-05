const { Router } = require('express');
const users = require('../controllers/usersController');
const movies = require('../controllers/moviesController');
const characters = require('../controllers/characterController');
const router = Router();


//RUTA DE USUARIOS
router.use('/auth', users);

// RUTA DE PELICULAS
router.use('/movie', movies);

// RUTA DE PERSONAJES
router.use('/character', characters);

module.exports = router;