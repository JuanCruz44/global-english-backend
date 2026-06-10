const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const Alumno = require('../models/Alumno');
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