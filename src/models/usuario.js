const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  contrasena: { type: DataTypes.STRING(255), allowNull: false },
  rol: { type: DataTypes.ENUM('secretaria', 'profesor'), allowNull: false },
  id_profesor: { type: DataTypes.INTEGER }
}, { tableName: 'usuarios', timestamps: false });

module.exports = Usuario;