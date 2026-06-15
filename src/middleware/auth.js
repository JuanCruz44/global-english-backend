const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const soloSecretaria = (req, res, next) => {
  if (req.usuario.rol !== 'secretaria') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};
const soloProfesor = (req, res, next) => {
  if (req.usuario.rol !== 'profesor') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

module.exports = { verificarToken, soloSecretaria, soloProfesor };