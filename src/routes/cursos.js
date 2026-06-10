const express = require('express');
const router = express.Router();
const { Curso, Profesor, Inscripcion, Alumno } = require('../models/index');
const { verificarToken, soloSecretaria } = require('../middleware/auth');

router.get('/', verificarToken, async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: [{ model: Profesor, attributes: ['nombre', 'apellido'] }]
    });
    res.json(cursos);
  } catch {
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

router.get('/:id/alumnos', verificarToken, async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      where: { id_curso: req.params.id },
      include: [{ model: Alumno }]
    });
    const alumnos = inscripciones.map(i => ({
      ...i.Alumno.dataValues,
      id_inscripcion: i.id_inscripcion
    }));
    res.json(alumnos);
  } catch {
    res.status(500).json({ error: 'Error al obtener alumnos del curso' });
  }
});

router.post('/', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const curso = await Curso.create(req.body);
    res.status(201).json(curso);
  } catch {
    res.status(500).json({ error: 'Error al crear curso' });
  }
});

router.put('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const curso = await Curso.findByPk(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
    await curso.update(req.body);
    res.json(curso);
  } catch {
    res.status(500).json({ error: 'Error al modificar curso' });
  }
});

module.exports = router;