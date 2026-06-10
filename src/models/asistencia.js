const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asistencia = sequelize.define('Asistencia', {
  id_asistencia: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_inscripcion: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  presente: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'asistencias', timestamps: false });

module.exports = Asistencia;