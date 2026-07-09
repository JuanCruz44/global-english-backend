const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curso = sequelize.define('Curso', {
  id_curso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  nivel: { type: DataTypes.STRING(30), allowNull: false },
  horario: { type: DataTypes.STRING(50) },
  cuota_mensual: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  id_profesor: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'cursos', timestamps: false });

module.exports = Curso;