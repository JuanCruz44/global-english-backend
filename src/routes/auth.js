const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, Profesor } = require('../models/index');
require('dotenv').config();

// POST /auth/login
router.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Las contraseñas hasheadas con bcrypt empiezan con "$2".
    const esHash = user.contrasena.startsWith('$2');
    let valido;

    if (esHash) {
      valido = await bcrypt.compare(contrasena, user.contrasena);
    } else {
      // Contraseña legacy en texto plano: se compara y, si es correcta,
      // se migra a un hash para futuros inicios de sesión.
      valido = user.contrasena === contrasena;
      if (valido) {
        const hash = await bcrypt.hash(contrasena, 10);
        await user.update({ contrasena: hash });
      }
    }

    if (!valido) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Un profesor dado de baja no puede iniciar sesión
    if (user.rol === 'profesor' && user.id_profesor) {
      const profesor = await Profesor.findByPk(user.id_profesor);
      if (!profesor || profesor.estado !== 'activo') {
        return res.status(403).json({ error: 'Tu cuenta está inactiva. Contactá a la secretaría.' });
      }
    }

    const token = jwt.sign(
      { id: user.id_usuario, rol: user.rol, id_profesor: user.id_profesor },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, rol: user.rol, id_profesor: user.id_profesor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;