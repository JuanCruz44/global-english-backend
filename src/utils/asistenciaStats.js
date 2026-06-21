const { ListaAsistencia, Asistencia, Inscripcion } = require('../models/index');
const { Op } = require('sequelize');

// Cuenta clases dictadas (listas cerradas) y asistencias del alumno desde que se inscribió
async function obtenerEstadisticasAsistencia(id_inscripcion) {
  const insc = await Inscripcion.findByPk(id_inscripcion);
  if (!insc) return null;

  // Clases dictadas: listas cerradas del curso actual, desde la fecha de inscripción
  const listasCerradas = await ListaAsistencia.findAll({
    where: {
      id_curso: insc.id_curso,
      cerrada: true,
      fecha: { [require('sequelize').Op.gte]: insc.fecha_inscripcion }
    },
    order: [['fecha', 'ASC']]
  });

  const clasesDictadas = listasCerradas.length;

  if (clasesDictadas === 0) {
    return {
      clases_dictadas: 0,
      clases_asistidas: 0,
      clases_ausentes: 0,
      porcentaje_asistencia: null,
      ultima_asistencia: null
    };
  }

  const fechasClases = listasCerradas.map(l => l.fecha);

  // Asistencias del alumno en esas fechas
  const asistencias = await Asistencia.findAll({
    where: {
      id_inscripcion,
      fecha: fechasClases
    }
  });

  const presentes = asistencias.filter(a => a.presente);
  const clasesAsistidas = presentes.length;
  const clasesAusentes = clasesDictadas - clasesAsistidas;
  const porcentaje = Math.round((clasesAsistidas / clasesDictadas) * 100);

  const ultimaPresente = presentes.length > 0
    ? presentes.reduce((max, a) => a.fecha > max ? a.fecha : max, presentes[0].fecha)
    : null;

  return {
    clases_dictadas: clasesDictadas,
    clases_asistidas: clasesAsistidas,
    clases_ausentes: clasesAusentes,
    porcentaje_asistencia: porcentaje,
    ultima_asistencia: ultimaPresente
  };
}

// Desglose mes a mes: cuántas clases hubo y a cuántas asistió, agrupado por mes
async function obtenerEstadisticasMensuales(id_inscripcion) {
  const insc = await Inscripcion.findByPk(id_inscripcion);
  if (!insc) return [];

  const listasCerradas = await ListaAsistencia.findAll({
    where: {
      id_curso: insc.id_curso,
      cerrada: true,
      fecha: { [Op.gte]: insc.fecha_inscripcion }
    },
    order: [['fecha', 'ASC']]
  });

  if (listasCerradas.length === 0) return [];

  const porMes = {};
  listasCerradas.forEach(l => {
    const mes = l.fecha.slice(0, 7); // "YYYY-MM"
    if (!porMes[mes]) porMes[mes] = [];
    porMes[mes].push(l.fecha);
  });

  const asistencias = await Asistencia.findAll({
    where: { id_inscripcion, fecha: listasCerradas.map(l => l.fecha) }
  });
  const presentesFechas = new Set(asistencias.filter(a => a.presente).map(a => a.fecha));

  return Object.keys(porMes).sort().map(mes => {
    const fechas = porMes[mes];
    const asistidas = fechas.filter(f => presentesFechas.has(f)).length;
    return {
      mes,
      clases_dictadas: fechas.length,
      clases_asistidas: asistidas,
      clases_ausentes: fechas.length - asistidas,
      porcentaje_asistencia: Math.round((asistidas / fechas.length) * 100)
    };
  });
}

module.exports = { obtenerEstadisticasAsistencia, obtenerEstadisticasMensuales };