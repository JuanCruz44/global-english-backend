const express = require('express');
const router = express.Router();
const { Pago, Inscripcion, Alumno, Curso } = require('../models/index');
const { obtenerDeudores, obtenerMesesAdeudados, obtenerResumenPagos } = require('../utils/morosidad');
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

// GET /pagos/resumen/:id_inscripcion
router.get('/resumen/:id_inscripcion', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const resumen = await obtenerResumenPagos(req.params.id_inscripcion);
    if (!resumen) return res.status(404).json({ error: 'Inscripción no encontrada' });
    res.json(resumen);
  } catch {
    res.status(500).json({ error: 'Error al obtener resumen de pagos' });
  }
});

// GET /pagos/historial/:id_curso — pagos de un curso específico, agrupado por alumno
router.get('/historial/:id_curso', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      where: { id_curso: req.params.id_curso },
      include: [{ model: Alumno, attributes: ['id_alumno', 'nombre', 'apellido', 'dni'] }]
    });

    const resultado = await Promise.all(inscripciones.map(async (insc) => {
      const resumen = await obtenerResumenPagos(insc.id_inscripcion);
      return {
        id_alumno: insc.Alumno.id_alumno,
        nombre: insc.Alumno.nombre,
        apellido: insc.Alumno.apellido,
        dni: insc.Alumno.dni,
        ...resumen
      };
    }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener historial del curso' });
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