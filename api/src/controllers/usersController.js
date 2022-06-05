const { Router } = require('express');
const { Users } = require('../db');
const jwt = require('jsonwebtoken');
const bcryp = require('bcryptjs');
const emailer = require('../emailer');
const users = Router();

users.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    if(!email || !password || !name) {
      return res.status(400).send({
        message: 'Complete todos los campos'
      });
    }
    const user = await Users.findOne({
      where: {
        email
      }
    });
    if(user) {
      return res.status(400).send({
        message: 'El usuario ya existe'
      });
    }
    const salt = bcryp.genSaltSync();
    const hash = bcryp.hashSync(password, salt);
    const newUser = await Users.create({
      email,
      password: hash,
      name
    });
    const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, { 
      expiresIn: '1h' });
    emailer.sendMail(email, token);
    return res.status(200).send({
      message: 'Usuario registrado correctamente',
      token
    });
  });
  
  // INICIO DE SESION DE USUARIOS
  users.post('/login', async (req, res) => {
      const { email, password } = req.body;
      if(!email || !password){
        return res.status(400).send("Complete todos los campos");
      };
  
      const user = await Users.findOne({
        where: {
          email: email,
        }
      });
        if(!user){
          return res.status(400).send("Email no registrado");
        }
        const checkPassword = await bcryp.compare(password, user.password);
        if(!checkPassword){
          return res.status(400).send("Contraseña incorrecta");
        }
        const token = jwt.sign({
          userid: user.id,
          email: user.email
        }, process.env.SECRET_KEY, {
          expiresIn: "2h"
        });
        user.token = token;
        emailer.sendMail(user.email, user.token);
        res.status(200).json({
          message: "Inicio de sesión exitoso",
          user,
          token
        });
  }); 
  
  // TODOS  LOS USUARIOS
  users.get('/users', async (req, res) => {
      const users = await Users.findAll();
      return res.json(users);
  });

  module.exports = users;