import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Inscripciones() {
  const [alumnos, setAlumnos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({ id_alumno: '', id_curso: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    api.get('/alumnos').then(res => setAlumnos(res.data));
    api.get('/cursos').then(res => setCursos(res.data));
  }, []);

  const inscribir = async () => {
    try {
      await api.post('/inscripciones', form);
      setMensaje('Alumno inscripto correctamente');
    } catch (e) {
      setMensaje(e.response?.data?.error || 'Error al inscribir');
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Nueva Inscripción</h1>
      <select className="w-full border p-2 rounded mb-3"
        onChange={e => setForm({ ...form, id_alumno: e.target.value })}>
        <option value="">Seleccionar alumno</option>
        {alumnos.map(a => <option key={a.id_alumno} value={a.id_alumno}>{a.nombre} {a.apellido} — {a.dni}</option>)}
      </select>
      <select className="w-full border p-2 rounded mb-3"
        onChange={e => setForm({ ...form, id_curso: e.target.value })}>
        <option value="">Seleccionar curso</option>
        {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombre} — {c.nivel}</option>)}
      </select>
      {mensaje && <p className="mb-3 text-sm text-blue-700">{mensaje}</p>}
      <button onClick={inscribir}
        className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900">
        Inscribir
      </button>
    </div>
  );
}
