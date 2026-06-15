const express = require('express');
const router = express.Router();
const { Asistencia, Inscripcion, Alumno, ListaAsistencia, Curso } = require('../models/index');
const { verificarToken, soloProfesor, soloSecretaria } = require('../middleware/auth');

// GET /asistencias/curso/:id_curso/fecha/:fecha — ver la lista (profesor de ese curso o secretaría)
router.get('/curso/:id_curso/fecha/:fecha', verificarToken, async (req, res) => {
  const { id_curso, fecha } = req.params;
  try {
    if (req.usuario.rol === 'profesor') {
      const curso = await Curso.findByPk(id_curso);
      if (!curso || curso.id_profesor != req.usuario.id_profesor) {
        return res.status(403).json({ error: 'No tenés acceso a este curso' });
      }
    }

    const lista = await ListaAsistencia.findOne({ where: { id_curso, fecha } });

    const inscripciones = await Inscripcion.findAll({
      where: { id_curso },
      include: [{ model: Alumno, attributes: ['nombre', 'apellido'] }]
    });

    const detalle = await Promise.all(inscripciones.map(async (i) => {
      const asistencia = await Asistencia.findOne({
        where: { id_inscripcion: i.id_inscripcion, fecha }
      });
      return {
        id_inscripcion: i.id_inscripcion,
        alumno: i.Alumno,
        presente: asistencia ? asistencia.presente : false,
        id_asistencia: asistencia ? asistencia.id_asistencia : null
      };
    }));

    res.json({ cerrada: lista ? lista.cerrada : false, alumnos: detalle });
  } catch {
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
});

// POST /asistencias — marcar presente/ausente (solo el profesor del curso, y solo si la lista no está cerrada)
router.post('/', verificarToken, soloProfesor, async (req, res) => {
  const { id_inscripcion, id_curso, fecha, presente } = req.body;
  try {
    const curso = await Curso.findByPk(id_curso);
    if (!curso || curso.id_profesor != req.usuario.id_profesor) {
      return res.status(403).json({ error: 'No tenés acceso a este curso' });
    }

    const lista = await ListaAsistencia.findOne({ where: { id_curso, fecha } });
    if (lista && lista.cerrada) {
      return res.status(400).json({ error: 'La lista de asistencia ya fue cerrada' });
    }

    const [asistencia, creada] = await Asistencia.findOrCreate({
      where: { id_inscripcion, fecha },
      defaults: { presente }
    });
    if (!creada) await asistencia.update({ presente });
    res.json(asistencia);
  } catch {
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
});

// POST /asistencias/cerrar — el profesor cierra la lista del día
router.post('/cerrar', verificarToken, soloProfesor, async (req, res) => {
  const { id_curso, fecha } = req.body;
  try {
    const curso = await Curso.findByPk(id_curso);
    if (!curso || curso.id_profesor != req.usuario.id_profesor) {
      return res.status(403).json({ error: 'No tenés acceso a este curso' });
    }

    const [lista, creada] = await ListaAsistencia.findOrCreate({
      where: { id_curso, fecha },
      defaults: { cerrada: true, fecha_cierre: new Date() }
    });
    if (!creada) await lista.update({ cerrada: true, fecha_cierre: new Date() });

    res.json({ mensaje: 'Lista cerrada correctamente', lista });
  } catch {
    res.status(500).json({ error: 'Error al cerrar la lista' });
  }
});

// GET /asistencias/listas — secretaría: listado de planillas cerradas
router.get('/listas', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const listas = await ListaAsistencia.findAll({
      where: { cerrada: true },
      include: [{ model: Curso, attributes: ['nombre'] }],
      order: [['fecha', 'DESC']]
    });
    res.json(listas);
  } catch {
    res.status(500).json({ error: 'Error al obtener las planillas' });
  }
});

module.exports = router;