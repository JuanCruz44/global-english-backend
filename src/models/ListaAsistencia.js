const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ListaAsistencia = sequelize.define('ListaAsistencia', {
  id_lista: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_curso: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  cerrada: { type: DataTypes.BOOLEAN, defaultValue: false },
  fecha_cierre: { type: DataTypes.DATE }
}, { tableName: 'listas_asistencia', timestamps: false });

module.exports = ListaAsistencia;