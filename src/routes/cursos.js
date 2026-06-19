const express = require('express');
const router = express.Router();
const { Curso, Profesor, Inscripcion, Alumno } = require('../models/index');
const { obtenerDeudores } = require('../utils/morosidad');
const { verificarToken, soloSecretaria } = require('../middleware/auth');

// GET /cursos
router.get('/', verificarToken, async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: [{ model: Profesor, attributes: ['nombre', 'apellido'] }]
    });
    const deudores = await obtenerDeudores();

    const resultado = await Promise.all(cursos.map(async (c) => {
      const cantidadAlumnos = await Inscripcion.count({ where: { id_curso: c.id_curso } });
      const deudoresCurso = deudores.filter(d => d.id_curso === c.id_curso);
      return {
        ...c.dataValues,
        cantidad_alumnos: cantidadAlumnos,
        alumnos_con_deuda: deudoresCurso.length
      };
    }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// GET /cursos/:id — obtener un curso específico con su profesor
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const curso = await Curso.findByPk(req.params.id, {
      include: [{ model: Profesor, attributes: ['nombre', 'apellido', 'email', 'telefono'] }]
    });
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json(curso);
  } catch {
    res.status(500).json({ error: 'Error al obtener curso' });
  }
});

// GET /cursos/:id/alumnos
router.get('/:id/alumnos', verificarToken, async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      where: { id_curso: req.params.id },
      include: [{ model: Alumno }]
    });
    const deudores = await obtenerDeudores();

    const alumnos = inscripciones.map(i => {
      const deuda = deudores.find(d => d.id_alumno === i.Alumno.id_alumno);
      return {
        ...i.Alumno.dataValues,
        id_inscripcion: i.id_inscripcion,
        cuotas_adeudadas: deuda ? deuda.cantidad_cuotas : 0
      };
    });

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