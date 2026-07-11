const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Profesor, Usuario, Curso } = require('../models/index');
const { verificarToken, soloSecretaria } = require('../middleware/auth');

// GET /profesores
router.get('/', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const profesores = await Profesor.findAll();
    res.json(profesores);
  } catch {
    res.status(500).json({ error: 'Error al obtener profesores' });
  }
});

// GET /profesores/:id — perfil del profesor con sus cursos
router.get('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const { Curso } = require('../models/index');
    const profesor = await Profesor.findByPk(req.params.id, {
      include: [{ model: Curso, attributes: ['id_curso', 'nombre', 'nivel', 'horario', 'cuota_mensual'] }]
    });
    if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });
    res.json(profesor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el profesor' });
  }
});

// POST /profesores
router.post('/', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const { usuario, contrasena, ...datosProfesor } = req.body;
    const profesor = await Profesor.create(datosProfesor);

    if (usuario && contrasena) {
      const hash = await bcrypt.hash(contrasena, 10);
      await Usuario.create({
        usuario,
        contrasena: hash,
        rol: 'profesor',
        id_profesor: profesor.id_profesor
      });
    }

    res.status(201).json(profesor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear profesor' });
  }
});

// PUT /profesores/:id
router.put('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const profesor = await Profesor.findByPk(req.params.id);
    if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });
    await profesor.update(req.body);
    res.json(profesor);
  } catch {
    res.status(500).json({ error: 'Error al modificar profesor' });
  }
});

// PUT /profesores/:id/password — la secretaría restablece la contraseña del profesor
router.put('/:id/password', verificarToken, soloSecretaria, async (req, res) => {
  const { contrasena } = req.body;
  if (!contrasena || contrasena.length < 4) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
  }
  try {
    const usuario = await Usuario.findOne({ where: { id_profesor: req.params.id } });
    if (!usuario) {
      return res.status(404).json({ error: 'Este profesor no tiene una cuenta de acceso asociada' });
    }
    const hash = await bcrypt.hash(contrasena, 10);
    await usuario.update({ contrasena: hash });
    res.json({ mensaje: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

// DELETE /profesores/:id
router.delete('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const profesor = await Profesor.findByPk(req.params.id);
    if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });

    await Curso.update({ id_profesor: null }, { where: { id_profesor: req.params.id } });
    await Usuario.destroy({ where: { id_profesor: req.params.id } });

    await profesor.destroy();
    res.json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar profesor' });
  }
});

module.exports = router;