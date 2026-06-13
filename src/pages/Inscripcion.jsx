import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Inscripcion() {
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '', email: '', telefono: '', id_curso: ''
  });
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/cursos').then(res => setCursos(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellido || !form.dni || !form.id_curso) {
      setError('Nombre, apellido, DNI y curso son obligatorios');
      return;
    }
    try {
      await api.post('/inscripciones', form);
      setExito('Alumno inscripto correctamente');
      setError('');
      setForm({ nombre: '', apellido: '', dni: '', email: '', telefono: '', id_curso: '' });
      setTimeout(() => setExito(''), 3000);
    } catch {
      setError('Error al inscribir al alumno');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Inscribir Alumno</h1>

      {exito && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{exito}</p>}
      {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>}

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input name="nombre" value={form.nombre} className="w-full border p-2 rounded"
            placeholder="Nombre" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Apellido</label>
          <input name="apellido" value={form.apellido} className="w-full border p-2 rounded"
            placeholder="Apellido" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">DNI</label>
          <input name="dni" value={form.dni} className="w-full border p-2 rounded"
            placeholder="DNI" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input name="email" value={form.email} className="w-full border p-2 rounded"
            placeholder="Email" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Teléfono</label>
          <input name="telefono" value={form.telefono} className="w-full border p-2 rounded"
            placeholder="Teléfono" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Curso</label>
          <select name="id_curso" value={form.id_curso} className="w-full border p-2 rounded"
            onChange={handleChange}>
            <option value="">Seleccioná un curso</option>
            {cursos.map(c => (
              <option key={c.id_curso} value={c.id_curso}>
                {c.nombre} — {c.nivel} — {c.horario}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleSubmit}
        className="mt-6 w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900">
        Inscribir
      </button>
    </div>
  );
}