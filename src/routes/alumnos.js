const express = require('express');
const router = express.Router();
const Alumno = require('../models/Alumno');
const Inscripcion = require('../models/Inscripcion');
const Curso = require('../models/Curso');
const { verificarToken, soloSecretaria } = require('../middleware/auth');
const { Op } = require('sequelize');

// GET /alumnos — listar todos
router.get('/', verificarToken, soloSecretaria, async (req, res) => {
  try {
    const alumnos = await Alumno.findAll();
    res.json(alumnos);
  } catch {
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
});

// GET /alumnos/buscar?q=texto — buscar por nombre o DNI
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
      }
    });
    res.json(alumnos);
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
    const alumno = await Alumno.create({ ...req.body, fecha_registro: new Date() });
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

module.exports = router;