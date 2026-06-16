const express = require('express');
const router = express.Router();
const { Pago, Inscripcion, Alumno, Curso } = require('../models/index');
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

// GET /pagos/morosidad — alumnos con cuotas impagas
router.get('/morosidad', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [
        { model: Alumno, where: { estado: 'activo' }, attributes: ['nombre', 'apellido', 'dni', 'id_alumno'] },
        { model: Curso, attributes: ['nombre', 'cuota_mensual'] }
      ]
    });

    const hoy = new Date();
    const resultado = [];

    for (const insc of inscripciones) {
      // Calcular todos los meses que debería haber pagado
      const fechaInicio = new Date(insc.fecha_inscripcion);
      const mesesEsperados = [];
      const cursor = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);

      while (cursor <= new Date(hoy.getFullYear(), hoy.getMonth(), 1)) {
        const mes = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
        mesesEsperados.push(mes);
        cursor.setMonth(cursor.getMonth() + 1);
      }

      // Traer los pagos registrados para esta inscripción
      const pagosRegistrados = await Pago.findAll({
        where: { id_inscripcion: insc.id_inscripcion, estado: 'pagado' }
      });
      const mesesPagados = pagosRegistrados.map(p => p.mes_correspondiente);

      // Calcular meses impagos
      const mesesImpagos = mesesEsperados.filter(m => !mesesPagados.includes(m));

      if (mesesImpagos.length > 0) {
        resultado.push({
          id_alumno: insc.Alumno.id_alumno,
          nombre: `${insc.Alumno.nombre} ${insc.Alumno.apellido}`,
          dni: insc.Alumno.dni,
          curso: insc.Curso.nombre,
          cuota_mensual: insc.Curso.cuota_mensual,
          meses_impagos: mesesImpagos,
          cantidad_cuotas: mesesImpagos.length,
          total_deuda: mesesImpagos.length * insc.Curso.cuota_mensual,
          id_inscripcion: insc.id_inscripcion
        });
      }
    }

    // Ordenar por total de deuda descendente
    resultado.sort((a, b) => b.total_deuda - a.total_deuda);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al calcular morosidad' });
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