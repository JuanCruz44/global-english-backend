const express = require('express');
const router = express.Router();
const { Alumno, Curso } = require('../models/index');
const { obtenerDeudores } = require('../utils/morosidad');
const { verificarToken, soloSecretaria } = require('../middleware/auth');

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

module.exports = router;