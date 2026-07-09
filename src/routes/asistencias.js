const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Asistencia, Inscripcion, Alumno, ListaAsistencia, Curso } = require('../models/index');
const { obtenerEstadisticasAsistencia, obtenerEstadisticasMensuales } = require('../utils/asistenciaStats');
const { verificarToken, soloProfesor, soloSecretaria } = require('../middleware/auth');

// GET /asistencias/curso/:id_curso/fecha/:fecha — ver la lista (profesor de ese curso o secretaría)
router.get('/curso/:id_curso/fecha/:fecha', verificarToken, async (req, res) => {
  const { id_curso, fecha } = req.params;
  try {
    if (req.usuario.rol === 'profesor') {
      const curso = await Curso.findByPk(id_curso);
      if (!curso || curso.id_profesor != req.usuario.id_profesor) {
        return res.status(403).json({ error: 'No tenés acceso a este curso' });
      }
    }

    const lista = await ListaAsistencia.findOne({ where: { id_curso, fecha } });

    // Solo alumnos que ya estaban inscriptos en el curso a la fecha de la planilla
    const inscripciones = await Inscripcion.findAll({
      where: { id_curso, fecha_inscripcion: { [Op.lte]: fecha } },
      include: [{ model: Alumno, attributes: ['nombre', 'apellido'] }]
    });

    const detalle = await Promise.all(inscripciones.map(async (i) => {
      const asistencia = await Asistencia.findOne({
        where: { id_inscripcion: i.id_inscripcion, fecha }
      });
      return {
        id_inscripcion: i.id_inscripcion,
        alumno: i.Alumno,
        presente: asistencia ? asistencia.presente : false,
        id_asistencia: asistencia ? asistencia.id_asistencia : null
      };
    }));

    res.json({ cerrada: lista ? lista.cerrada : false, alumnos: detalle });
  } catch {
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
});

// POST /asistencias — marcar presente/ausente (solo el profesor del curso, y solo si la lista no está cerrada)
router.post('/', verificarToken, soloProfesor, async (req, res) => {
  const { id_inscripcion, id_curso, fecha, presente } = req.body;
  try {
    const curso = await Curso.findByPk(id_curso);
    if (!curso || curso.id_profesor != req.usuario.id_profesor) {
      return res.status(403).json({ error: 'No tenés acceso a este curso' });
    }

    const lista = await ListaAsistencia.findOne({ where: { id_curso, fecha } });
    if (lista && lista.cerrada) {
      return res.status(400).json({ error: 'La lista de asistencia ya fue cerrada' });
    }

    const [asistencia, creada] = await Asistencia.findOrCreate({
      where: { id_inscripcion, fecha },
      defaults: { presente }
    });
    if (!creada) await asistencia.update({ presente });
    res.json(asistencia);
  } catch {
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
});

// POST /asistencias/cerrar — el profesor cierra la lista del día
router.post('/cerrar', verificarToken, soloProfesor, async (req, res) => {
  const { id_curso, fecha } = req.body;
  try {
    const curso = await Curso.findByPk(id_curso);
    if (!curso || curso.id_profesor != req.usuario.id_profesor) {
      return res.status(403).json({ error: 'No tenés acceso a este curso' });
    }

    const [lista, creada] = await ListaAsistencia.findOrCreate({
      where: { id_curso, fecha },
      defaults: { cerrada: true, fecha_cierre: new Date() }
    });
    if (!creada) await lista.update({ cerrada: true, fecha_cierre: new Date() });

    res.json({ mensaje: 'Lista cerrada correctamente', lista });
  } catch {
    res.status(500).json({ error: 'Error al cerrar la lista' });
  }
});

// GET /asistencias/listas — secretaría: listado de planillas cerradas
router.get('/listas', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const listas = await ListaAsistencia.findAll({
      where: { cerrada: true },
      include: [{ model: Curso, attributes: ['nombre'] }],
      order: [['fecha', 'DESC']]
    });
    res.json(listas);
  } catch {
    res.status(500).json({ error: 'Error al obtener las planillas' });
  }
});

// GET /asistencias/resumen/:id_inscripcion
router.get('/resumen/:id_inscripcion', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const resumen = await obtenerEstadisticasAsistencia(req.params.id_inscripcion);
    if (!resumen) return res.status(404).json({ error: 'Inscripción no encontrada' });
    res.json(resumen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener estadísticas de asistencia' });
  }
});

// GET /asistencias/resumen-mensual/:id_inscripcion
router.get('/resumen-mensual/:id_inscripcion', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const resultado = await obtenerEstadisticasMensuales(req.params.id_inscripcion);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener resumen mensual' });
  }
});

// GET /asistencias/planillas/cursos — cursos con cantidad de planillas cerradas
router.get('/planillas/cursos', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    const resultado = await Promise.all(cursos.map(async (c) => {
      const cantidad = await ListaAsistencia.count({ where: { id_curso: c.id_curso, cerrada: true } });
      return { id_curso: c.id_curso, nombre: c.nombre, nivel: c.nivel, cantidad_planillas: cantidad };
    }));
    res.json(resultado);
  } catch {
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// GET /asistencias/planillas/curso/:id_curso — planillas cerradas de un curso, agrupadas por mes
router.get('/planillas/curso/:id_curso', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const listas = await ListaAsistencia.findAll({
      where: { id_curso: req.params.id_curso, cerrada: true },
      order: [['fecha', 'DESC']]
    });

    const porMes = {};
    listas.forEach(l => {
      const mes = l.fecha.slice(0, 7);
      if (!porMes[mes]) porMes[mes] = 0;
      porMes[mes]++;
    });

    const resultado = Object.keys(porMes).sort().reverse().map(mes => ({
      mes,
      cantidad_planillas: porMes[mes]
    }));

    res.json(resultado);
  } catch {
    res.status(500).json({ error: 'Error al obtener planillas del curso' });
  }
});

// GET /asistencias/planillas/curso/:id_curso/mes/:mes — planillas de un mes específico
router.get('/planillas/curso/:id_curso/mes/:mes', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const [anio, mes] = req.params.mes.split('-');

    const primerDia = `${anio}-${mes}-01`;
    // Calcula el primer día del mes siguiente, para usarlo como límite superior (exclusivo)
    const siguienteMes = new Date(Number(anio), Number(mes), 1); // mes sin -1 ya da el mes siguiente
    const ultimoDiaExclusivo = `${siguienteMes.getFullYear()}-${String(siguienteMes.getMonth() + 1).padStart(2, '0')}-01`;

    const listas = await ListaAsistencia.findAll({
      where: {
        id_curso: req.params.id_curso,
        cerrada: true,
        fecha: { [Op.gte]: primerDia, [Op.lt]: ultimoDiaExclusivo }
      },
      order: [['fecha', 'ASC']]
    });
    res.json(listas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener planillas del mes' });
  }
});

module.exports = router;