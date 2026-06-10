const express = require('express');
const router = express.Router();
const Asistencia = require('../models/Asistencia');
const Inscripcion = require('../models/Inscripcion');
const Alumno = require('../models/Alumno');
const { verificarToken } = require('../middleware/auth');

router.get('/curso/:id_curso/fecha/:fecha', verificarToken, async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      where: { id_curso: req.params.id_curso },
      include: [{ model: Alumno, attributes: ['nombre', 'apellido'] }]
    });
    const lista = await Promise.all(inscripciones.map(async (i) => {
      const asistencia = await Asistencia.findOne({
        where: { id_inscripcion: i.id_inscripcion, fecha: req.params.fecha }
      });
      return {
        id_inscripcion: i.id_inscripcion,
        alumno: i.Alumno,
        presente: asistencia ? asistencia.presente : false,
        id_asistencia: asistencia ? asistencia.id_asistencia : null
      };
    }));
    res.json(lista);
  } catch {
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
});

router.post('/', verificarToken, async (req, res) => {
  const { id_inscripcion, fecha, presente } = req.body;
  try {
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

module.exports = router;