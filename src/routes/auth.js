const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const user = await Usuario.findOne({ where: { usuario } });
    if (!user || user.contrasena !== contrasena) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol, id_profesor: user.id_profesor },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, rol: user.rol, id_profesor: user.id_profesor });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;