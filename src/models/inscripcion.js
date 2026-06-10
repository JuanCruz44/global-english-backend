const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inscripcion = sequelize.define('Inscripcion', {
  id_inscripcion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_alumno: { type: DataTypes.INTEGER, allowNull: false },
  id_curso: { type: DataTypes.INTEGER, allowNull: false },
  fecha_inscripcion: { type: DataTypes.DATEONLY, allowNull: false }
}, { tableName: 'inscripciones', timestamps: false });

module.exports = Inscripcion;