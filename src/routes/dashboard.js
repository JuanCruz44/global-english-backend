const express = require('express');
const router = express.Router();
const { Alumno, Curso, Pago, Inscripcion } = require('../models/index');
const { obtenerDeudores } = require('../utils/morosidad');
const { verificarToken, soloSecretaria } = require('../middleware/auth');
const { Op } = require('sequelize');

// GET /dashboard/resumen
router.get('/resumen', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const alumnosActivos = await Alumno.count({ where: { estado: 'activo' } });
    const cursosActivos = await Curso.count();
    const deudores = await obtenerDeudores();
    const conDeuda = deudores.length;
    const alDia = alumnosActivos - conDeuda;

    res.json({
      alumnos_activos: alumnosActivos,
      al_dia: alDia,
      con_deuda: conDeuda,
      cursos_activos: cursosActivos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
});

// GET /dashboard/ingresos-mes — Ingresos por mes (últimos 12 meses)
router.get('/ingresos-mes', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const hace12Meses = new Date();
    hace12Meses.setMonth(hace12Meses.getMonth() - 12);

    const pagos = await Pago.findAll({
      where: {
        fecha_pago: { [Op.gte]: hace12Meses },
        estado: 'pagado'
      },
      attributes: ['fecha_pago', 'monto'],
      raw: true
    });

    // Agrupar por mes
    const ingresosPorMes = {};
    pagos.forEach(pago => {
      const fecha = new Date(pago.fecha_pago);
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      ingresosPorMes[mes] = (ingresosPorMes[mes] || 0) + pago.monto;
    });

    res.json(ingresosPorMes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ingresos por mes' });
  }
});

// GET /dashboard/inscripciones-mes — Inscripciones por mes (últimos 12 meses)
router.get('/inscripciones-mes', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const hace12Meses = new Date();
    hace12Meses.setMonth(hace12Meses.getMonth() - 12);

    const inscripciones = await Inscripcion.findAll({
      where: {
        createdAt: { [Op.gte]: hace12Meses }
      },
      attributes: ['createdAt'],
      raw: true
    });

    // Agrupar por mes
    const inscripcionesPorMes = {};
    inscripciones.forEach(insc => {
      const fecha = new Date(insc.createdAt);
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      inscripcionesPorMes[mes] = (inscripcionesPorMes[mes] || 0) + 1;
    });

    res.json(inscripcionesPorMes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener inscripciones por mes' });
  }
});

// GET /dashboard/tasa-cobranza — Tasa de cobranza actual
router.get('/tasa-cobranza', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const alumnosActivos = await Alumno.count({ where: { estado: 'activo' } });
    const deudores = await obtenerDeudores();
    const conDeuda = deudores.length;
    const alDia = alumnosActivos - conDeuda;

    const tasaCobranza = alumnosActivos > 0 ? ((alDia / alumnosActivos) * 100).toFixed(2) : 0;

    res.json({
      al_dia: alDia,
      con_deuda: conDeuda,
      total: alumnosActivos,
      tasa_cobranza: parseFloat(tasaCobranza),
      deudores: deudores
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tasa de cobranza' });
  }
});

module.exports = router;