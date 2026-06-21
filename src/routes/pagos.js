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
    const { id_inscripcion, mes_correspondiente, monto, pagado_por } = req.body;
    const pago = await Pago.create({
      id_inscripcion,
      mes_correspondiente,
      monto,
      pagado_por: pagado_por || null,
      fecha_pago: new Date(),
      estado: 'pagado'
    });
    res.status(201).json(pago);
  } catch {
    res.status(500).json({ error: 'Error al registrar pago' });
  }
});

// GET /pagos/comprobante/:id_pago — datos completos para el recibo
router.get('/comprobante/:id_pago', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id_pago, {
      include: [{
        model: Inscripcion,
        include: [
          { model: Alumno, attributes: ['nombre', 'apellido', 'dni'] },
          { model: Curso, attributes: ['nombre', 'nivel'] }
        ]
      }]
    });
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.json(pago);
  } catch {
    res.status(500).json({ error: 'Error al obtener el comprobante' });
  }
});

// PUT /pagos/:id_pago/pagado-por — guardar quién realizó el pago
router.put('/:id_pago/pagado-por', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pago = await Pago.findByPk(req.params.id_pago);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    await pago.update({ pagado_por: req.body.pagado_por });
    res.json(pago);
  } catch {
    res.status(500).json({ error: 'Error al guardar' });
  }
});

module.exports = router;