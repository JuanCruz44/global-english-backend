const express = require('express');
const router = express.Router();
const { Profesor } = require('../models/index');
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
    const profesor = await Profesor.create(req.body);
    res.status(201).json(profesor);
  } catch {
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

// DELETE /profesores/:id
router.delete('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const profesor = await Profesor.findByPk(req.params.id);
    if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });
    await profesor.destroy();
    res.json({ message: 'Profesor eliminado correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar profesor' });
  }
});

module.exports = router;