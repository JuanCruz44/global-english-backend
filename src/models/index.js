const Alumno = require('./Alumno');
const Curso = require('./Curso');
const Profesor = require('./Profesor');
const Inscripcion = require('./Inscripcion');
const Pago = require('./Pago');
const Asistencia = require('./Asistencia');
const Usuario = require('./Usuario');

// Profesor tiene muchos Cursos
Profesor.hasMany(Curso, { foreignKey: 'id_profesor' });
Curso.belongsTo(Profesor, { foreignKey: 'id_profesor' });

// Alumno tiene muchas Inscripciones
Alumno.hasMany(Inscripcion, { foreignKey: 'id_alumno' });
Inscripcion.belongsTo(Alumno, { foreignKey: 'id_alumno' });

// Curso tiene muchas Inscripciones
Curso.hasMany(Inscripcion, { foreignKey: 'id_curso' });
Inscripcion.belongsTo(Curso, { foreignKey: 'id_curso' });

// Inscripcion tiene muchos Pagos
Inscripcion.hasMany(Pago, { foreignKey: 'id_inscripcion' });
Pago.belongsTo(Inscripcion, { foreignKey: 'id_inscripcion' });

// Inscripcion tiene muchas Asistencias
Inscripcion.hasMany(Asistencia, { foreignKey: 'id_inscripcion' });
Asistencia.belongsTo(Inscripcion, { foreignKey: 'id_inscripcion' });

module.exports = { Alumno, Curso, Profesor, Inscripcion, Pago, Asistencia, Usuario };