const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profesor = sequelize.define('Profesor', {
  id_profesor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dni: { type: DataTypes.STRING(10), allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  apellido: { type: DataTypes.STRING(50), allowNull: false },
  telefono: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(100) },
  estado: { type: DataTypes.ENUM('activo', 'inactivo'), defaultValue: 'activo' }
}, { tableName: 'profesores', timestamps: false });

module.exports = Profesor;