const express = require('express');
const router = express.Router();
const { Pago, Inscripcion, Alumno, Curso } = require('../models/index');
const { obtenerDeudores } = require('../utils/morosidad');
const { verificarToken, soloSecretaria } = require('../middleware/auth');
const { Op } = require('sequelize');

// GET /reportes/resumen-mes — resumen del mes actual
router.get('/resumen-mes', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;

    // Total de inscripciones activas
    const totalInscripciones = await Inscripcion.count({
      include: [{ model: Alumno, where: { estado: 'activo' } }]
    });

    // Pagos registrados este mes (solo de alumnos activos, para que los números
    // sean consistentes con el total de inscripciones activas)
    const pagosEsteMes = await Pago.findAll({
      where: { mes_correspondiente: mesActual, estado: 'pagado' },
      include: [{
        model: Inscripcion,
        required: true,
        include: [
          { model: Alumno, where: { estado: 'activo' }, required: true, attributes: [] },
          { model: Curso, attributes: ['cuota_mensual'] }
        ]
      }]
    });

    const alumnosPagaron = pagosEsteMes.length;
    const totalRecaudado = pagosEsteMes.reduce((acc, p) => acc + Number(p.monto), 0);

    const alumnosSinPagar = totalInscripciones - alumnosPagaron;
    const porcentajeCobranza = totalInscripciones > 0
      ? Math.round((alumnosPagaron / totalInscripciones) * 100)
      : 0;

    // Estimar lo que falta recaudar (alumnos activos que aún no pagaron este mes)
    const inscripcionesActivas = await Inscripcion.findAll({
      include: [
        { model: Alumno, where: { estado: 'activo' } },
        { model: Curso, attributes: ['cuota_mensual'] }
      ]
    });
    const idsPagaronEsteMes = new Set(pagosEsteMes.map(p => p.id_inscripcion));
    const montoPendiente = inscripcionesActivas
      .filter(i => !idsPagaronEsteMes.has(i.id_inscripcion))
      .reduce((acc, i) => acc + Number(i.Curso.cuota_mensual), 0);

    res.json({
      mes: mesActual,
      total_inscripciones: totalInscripciones,
      alumnos_pagaron: alumnosPagaron,
      alumnos_sin_pagar: alumnosSinPagar,
      total_recaudado: totalRecaudado,
      monto_pendiente: montoPendiente,
      porcentaje_cobranza: porcentajeCobranza
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener resumen del mes' });
  }
});

// GET /reportes/ingresos — ingresos mes a mes y ranking de cursos
router.get('/ingresos', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      where: { estado: 'pagado' },
      include: [{
        model: Inscripcion,
        include: [{ model: Curso, attributes: ['nombre'] }]
      }],
      order: [['mes_correspondiente', 'ASC']]
    });

    // Agrupar por mes
    const porMes = {};
    pagos.forEach(p => {
      const mes = p.mes_correspondiente;
      if (!porMes[mes]) porMes[mes] = 0;
      porMes[mes] += Number(p.monto);
    });

    const ingresosMensuales = Object.keys(porMes).sort().reverse().map(mes => ({
      mes,
      total: porMes[mes]
    }));

    // Agrupar por curso
    const porCurso = {};
    pagos.forEach(p => {
      const curso = p.Inscripcion?.Curso?.nombre || 'Sin curso';
      if (!porCurso[curso]) porCurso[curso] = 0;
      porCurso[curso] += Number(p.monto);
    });

    const rankingCursos = Object.entries(porCurso)
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total);

    res.json({ ingresos_mensuales: ingresosMensuales, ranking_cursos: rankingCursos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ingresos' });
  }
});

// GET /reportes/morosos-graves — alumnos con 3 o más cuotas impagas
router.get('/morosos-graves', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const deudores = await obtenerDeudores();
    const morososGraves = deudores.filter(d => d.cantidad_cuotas >= 3);
    res.json(morososGraves);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener morosos graves' });
  }
});

module.exports = router;