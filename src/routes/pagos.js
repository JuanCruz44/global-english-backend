const express = require('express');
const router = express.Router();
const { Pago, Inscripcion, Alumno, Curso } = require('../models/index');
const { obtenerDeudores, obtenerMesesAdeudados } = require('../utils/morosidad');
const { verificarToken, soloSecretaria } = require('../middleware/auth');

// GET /pagos/meses-adeudados/:id_inscripcion
router.get('/meses-adeudados/:id_inscripcion', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const meses = await obtenerMesesAdeudados(req.params.id_inscripcion);
    res.json(meses);
  } catch {
    res.status(500).json({ error: 'Error al obtener meses adeudados' });
  }
});

// GET /pagos/alumno/:id_inscripcion — historial de un alumno
router.get('/alumno/:id_inscripcion', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pagos = await Pago.findAll({ where: { id_inscripcion: req.params.id_inscripcion } });
    res.json(pagos);
  } catch {
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
});

// GET /pagos/historial — todos los pagos registrados
router.get('/historial', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      include: [{
        model: Inscripcion,
        include: [
          { model: Alumno, attributes: ['nombre', 'apellido', 'dni'] },
          { model: Curso, attributes: ['nombre'] }
        ]
      }],
      order: [['fecha_pago', 'DESC']]
    });
    res.json(pagos);
  } catch {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// GET /pagos/morosidad
router.get('/morosidad', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const resultado = await obtenerDeudores();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al calcular morosidad' });
  }
});

// POST /pagos — registrar un pago
router.post('/', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pago = await Pago.create({ ...req.body, fecha_pago: new Date(), estado: 'pagado' });
    res.status(201).json(pago);
  } catch {
    res.status(500).json({ error: 'Error al registrar pago' });
  }
});

module.exports = router;