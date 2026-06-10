const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pago', {
  id_pago: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_inscripcion: { type: DataTypes.INTEGER, allowNull: false },
  mes_correspondiente: { type: DataTypes.STRING(7), allowNull: false },
  monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  fecha_pago: { type: DataTypes.DATEONLY, allowNull: false },
  estado: { type: DataTypes.ENUM('pagado', 'pendiente', 'vencido'), defaultValue: 'pendiente' }
}, { tableName: 'pagos', timestamps: false });

module.exports = Pago;