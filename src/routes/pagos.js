const express = require('express');
const router = express.Router();
const Pago = require('../models/Pago');
const Inscripcion = require('../models/Inscripcion');
const Alumno = require('../models/Alumno');
const { verificarToken, soloSecretaria } = require('../middleware/auth');

router.get('/deudores', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      where: { estado: ['pendiente', 'vencido'] },
      include: [{
        model: Inscripcion,
        include: [{ model: Alumno, attributes: ['nombre', 'apellido', 'dni'] }]
      }]
    });
    res.json(pagos);
  } catch {
    res.status(500).json({ error: 'Error al obtener deudores' });
  }
});

router.get('/alumno/:id_inscripcion', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pagos = await Pago.findAll({ where: { id_inscripcion: req.params.id_inscripcion } });
    res.json(pagos);
  } catch {
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
});

router.post('/', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pago = await Pago.create({ ...req.body, fecha_pago: new Date(), estado: 'pagado' });
    res.status(201).json(pago);
  } catch {
    res.status(500).json({ error: 'Error al registrar pago' });
  }
});

module.exports = router;