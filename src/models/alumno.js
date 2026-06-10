const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alumno = sequelize.define('Alumno', {
  id_alumno: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dni: { type: DataTypes.STRING(10), allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  apellido: { type: DataTypes.STRING(50), allowNull: false },
  fecha_nacimiento: { type: DataTypes.DATEONLY },
  telefono: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(100) },
  estado: { type: DataTypes.ENUM('activo', 'inactivo'), defaultValue: 'activo' },
  fecha_inscripcion: { type: DataTypes.DATEONLY, allowNull: false }
}, { tableName: 'alumnos', timestamps: false });

module.exports = Alumno;