const { Inscripcion, Alumno, Curso, Pago } = require('../models/index');

async function obtenerDeudores() {
  const inscripciones = await Inscripcion.findAll({
    include: [
      { model: Alumno, where: { estado: 'activo' }, attributes: ['nombre', 'apellido', 'dni', 'id_alumno'] },
      { model: Curso, attributes: ['nombre', 'cuota_mensual', 'id_curso'] }
    ]
  });

  const hoy = new Date();
  const resultado = [];

  for (const insc of inscripciones) {
    const fechaInicio = new Date(insc.fecha_inscripcion);
    const mesesEsperados = [];
    const cursor = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);

    while (cursor <= new Date(hoy.getFullYear(), hoy.getMonth(), 1)) {
      const mes = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      mesesEsperados.push(mes);
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const pagosRegistrados = await Pago.findAll({
      where: { id_inscripcion: insc.id_inscripcion, estado: 'pagado' }
    });
    const mesesPagados = pagosRegistrados.map(p => p.mes_correspondiente);
    const mesesImpagos = mesesEsperados.filter(m => !mesesPagados.includes(m));

    if (mesesImpagos.length > 0) {
      resultado.push({
        id_alumno: insc.Alumno.id_alumno,
        nombre: `${insc.Alumno.nombre} ${insc.Alumno.apellido}`,
        dni: insc.Alumno.dni,
        curso: insc.Curso.nombre,
        id_curso: insc.Curso.id_curso,
        cuota_mensual: insc.Curso.cuota_mensual,
        meses_impagos: mesesImpagos,
        cantidad_cuotas: mesesImpagos.length,
        total_deuda: mesesImpagos.length * insc.Curso.cuota_mensual,
        id_inscripcion: insc.id_inscripcion
      });
    }
  }

  resultado.sort((a, b) => b.total_deuda - a.total_deuda);
  return resultado;
}

async function obtenerMesesAdeudados(id_inscripcion) {
  const insc = await Inscripcion.findByPk(id_inscripcion, {
    include: [{ model: Curso, attributes: ['cuota_mensual'] }]
  });
  if (!insc) return [];

  const hoy = new Date();
  const fechaInicio = new Date(insc.fecha_inscripcion);
  const mesesEsperados = [];
  const cursor = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);

  while (cursor <= new Date(hoy.getFullYear(), hoy.getMonth(), 1)) {
    const mes = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
    mesesEsperados.push(mes);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const pagosRegistrados = await Pago.findAll({
    where: { id_inscripcion, estado: 'pagado' }
  });
  const mesesPagados = pagosRegistrados.map(p => p.mes_correspondiente);

  return mesesEsperados.filter(m => !mesesPagados.includes(m));
}

module.exports = { obtenerDeudores, obtenerMesesAdeudados };