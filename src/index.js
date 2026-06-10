const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const authRoutes = require('./routes/auth');
const alumnosRoutes = require('./routes/alumnos');
const profesoresRoutes = require('./routes/profesores');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/alumnos', alumnosRoutes);
app.use('/profesores', profesoresRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor de Global English funcionando' });
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });