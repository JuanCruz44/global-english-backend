// Script de administrador para restablecer la contraseña de cualquier usuario.
// Uso desde la carpeta del backend:
//   node resetear-password.js <usuario> <nueva_contraseña>
// Ejemplo:
//   node resetear-password.js secretaria MiNuevaClave123
//
// Sirve como plan de emergencia cuando la secretaría (o cualquier usuario)
// olvida su contraseña y no puede restablecerla desde la aplicación.

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Usuario } = require('./src/models/index');
const sequelize = require('./src/config/database');

const [, , usuarioArg, passArg] = process.argv;

(async () => {
  if (!usuarioArg || !passArg) {
    console.log('Uso: node resetear-password.js <usuario> <nueva_contraseña>');
    console.log('Ejemplo: node resetear-password.js secretaria MiNuevaClave123');
    process.exit(1);
  }

  if (passArg.length < 4) {
    console.log('✗ La contraseña debe tener al menos 4 caracteres.');
    process.exit(1);
  }

  try {
    const user = await Usuario.findOne({ where: { usuario: usuarioArg } });
    if (!user) {
      console.log(`✗ No existe ningún usuario con el nombre "${usuarioArg}".`);
      return;
    }
    const hash = await bcrypt.hash(passArg, 10);
    await user.update({ contrasena: hash });
    console.log(`✓ Contraseña de "${usuarioArg}" restablecida correctamente.`);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await sequelize.close();
  }
})();
