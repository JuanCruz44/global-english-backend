const express = require('express');
const router = express.Router();
const { Inscripcion, Alumno, Curso } = require('../models/index');
const { verificarToken, soloSecretaria } = require('../middleware/auth');

router.post('/', verificarToken, soloSecretaria, async (req, res) => {
  const { id_alumno, id_curso } = req.body;
  try {
    const yaInscripto = await Inscripcion.findOne({ where: { id_alumno, id_curso } });
    if (yaInscripto) return res.status(400).json({ error: 'El alumno ya está inscripto en ese curso' });
    const inscripcion = await Inscripcion.create({
      id_alumno, id_curso, fecha_inscripcion: new Date()
    });
    res.status(201).json(inscripcion);
  } catch {
    res.status(500).json({ error: 'Error al inscribir alumno' });
  }
});

// POST /inscripciones/nueva — crea el alumno e inscripcion en un solo paso
router.post('/nueva', verificarToken, soloSecretaria, async (req, res) => {
  const { nombre, apellido, dni, email, telefono, id_curso } = req.body;
  try {
    // Verificar que no exista un alumno con ese DNI
    const { Alumno, Inscripcion } = require('../models/index');
    const existe = await Alumno.findOne({ where: { dni } });
    if (existe) return res.status(400).json({ error: 'Ya existe un alumno con ese DNI' });

    // Crear el alumno
    const alumno = await Alumno.create({
      nombre, apellido, dni, email, telefono,
      fecha_inscripcion: new Date(),
      estado: 'activo'
    });

    // Inscribirlo al curso
    const inscripcion = await Inscripcion.create({
      id_alumno: alumno.id_alumno,
      id_curso,
      fecha_inscripcion: new Date()
    });

    res.status(201).json({ alumno, inscripcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al inscribir al alumno' });
  }
});

// PUT /inscripciones/cambiar-curso — cambia al alumno de curso
router.put('/cambiar-curso', verificarToken, soloSecretaria, async (req, res) => {
  const { id_alumno, id_curso_nuevo } = req.body;
  try {
    const inscripcion = await Inscripcion.findOne({ where: { id_alumno } });
    if (!inscripcion) return res.status(404).json({ error: 'El alumno no tiene una inscripción activa' });
    await inscripcion.update({
      id_curso: id_curso_nuevo,
      fecha_inscripcion: new Date().toISOString().split('T')[0]
    });
    res.json({ mensaje: 'Curso actualizado correctamente', inscripcion });
  } catch {
    res.status(500).json({ error: 'Error al cambiar de curso' });
  }
});

// GET /inscripciones/alumno/:id_alumno — obtener inscripción de un alumno con su curso
router.get('/alumno/:id_alumno', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findOne({
      where: { id_alumno: req.params.id_alumno },
      include: [{ model: Curso, attributes: ['nombre', 'cuota_mensual'] }]
    });
    if (!inscripcion) return res.status(404).json({ error: 'El alumno no está inscripto en ningún curso' });
    res.json(inscripcion);
  } catch {
    res.status(500).json({ error: 'Error al obtener inscripción' });
  }
});

router.delete('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id);
    if (!inscripcion) return res.status(404).json({ error: 'Inscripción no encontrada' });
    await inscripcion.destroy();
    res.json({ mensaje: 'Inscripción eliminada correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
});

module.exports = router;