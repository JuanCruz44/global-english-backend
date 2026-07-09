const express = require('express');
const router = express.Router();
const { Alumno, Inscripcion, Curso, Pago, Asistencia } = require('../models/index');
const { verificarToken, soloSecretaria } = require('../middleware/auth');
const { obtenerDeudores } = require('../utils/morosidad');
const { Op } = require('sequelize');

// GET /alumnos — listar todos con su curso
router.get('/', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const alumnos = await Alumno.findAll({
      include: [{
        model: Inscripcion,
        required: false,
        include: [{ model: Curso, attributes: ['nombre'] }]
      }]
    });
    const resultado = alumnos.map(a => ({
      ...a.dataValues,
      curso: a.Inscripcions?.[0]?.Curso?.nombre || 'Sin curso'
    }));
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
});

// GET /alumnos/buscar?q=texto
router.get('/buscar', verificarToken, soloSecretaria, async (req, res) => {
  const { q } = req.query;
  try {
    const alumnos = await Alumno.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${q}%` } },
          { apellido: { [Op.like]: `%${q}%` } },
          { dni: { [Op.like]: `%${q}%` } }
        ]
      },
      include: [{
        model: Inscripcion, required: false,
        include: [{ model: Curso, attributes: ['nombre'] }]
      }]
    });

    const deudores = await obtenerDeudores();

    const resultado = alumnos.map(a => {
      const insc = a.Inscripcions?.[0];
      const deuda = deudores.find(d => d.id_alumno === a.id_alumno);
      return {
        ...a.dataValues,
        curso: insc?.Curso?.nombre || 'Sin curso',
        cuotas_adeudadas: deuda ? deuda.cantidad_cuotas : 0
      };
    });

    res.json(resultado);
  } catch {
    res.status(500).json({ error: 'Error al buscar alumnos' });
  }
});

// GET /alumnos/:id — ver perfil
router.get('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
    res.json(alumno);
  } catch {
    res.status(500).json({ error: 'Error al obtener alumno' });
  }
});

// POST /alumnos — crear alumno nuevo
router.post('/', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const existe = await Alumno.findOne({ where: { dni: req.body.dni } });
    if (existe) return res.status(400).json({ error: 'Ya existe un alumno con ese DNI' });
    const alumno = await Alumno.create({ ...req.body, fecha_inscripcion: new Date() });
    res.status(201).json(alumno);
  } catch {
    res.status(500).json({ error: 'Error al crear alumno' });
  }
});

// PUT /alumnos/:id — modificar alumno
router.put('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
    await alumno.update(req.body);
    res.json(alumno);
  } catch {
    res.status(500).json({ error: 'Error al modificar alumno' });
  }
});

// DELETE /alumnos/:id — dar de baja (cambia estado a inactivo)
router.delete('/:id', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });
    await alumno.update({ estado: 'inactivo' });
    res.json({ mensaje: 'Alumno dado de baja correctamente' });
  } catch {
    res.status(500).json({ error: 'Error al dar de baja' });
  }
});

// DELETE /alumnos/:id/permanente — eliminar de la base de datos
router.delete('/:id/permanente', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const alumno = await Alumno.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

    const inscripciones = await Inscripcion.findAll({ where: { id_alumno: req.params.id } });
    for (const insc of inscripciones) {
      await Pago.destroy({ where: { id_inscripcion: insc.id_inscripcion } });
      await Asistencia.destroy({ where: { id_inscripcion: insc.id_inscripcion } });
    }
    await Inscripcion.destroy({ where: { id_alumno: req.params.id } });

    await alumno.destroy();
    res.json({ mensaje: 'Alumno eliminado permanentemente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar alumno' });
  }
});

module.exports = router;