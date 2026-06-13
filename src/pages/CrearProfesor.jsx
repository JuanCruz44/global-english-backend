import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CrearProfesor() {
  const [form, setForm] = useState({ nombre: '', apellido: '', usuario: '', contrasena: '' });
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellido || !form.usuario || !form.contrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }
    try {
      await api.post('/profesores', form);
      setExito('Profesor creado correctamente');
      setError('');
      setTimeout(() => navigate('/profesores'), 1500);
    } catch {
      setError('Error al crear el profesor');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Crear Profesor</h1>

      {exito && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{exito}</p>}
      {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>}

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input name="nombre" className="w-full border p-2 rounded"
            placeholder="Nombre" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Apellido</label>
          <input name="apellido" className="w-full border p-2 rounded"
            placeholder="Apellido" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Usuario</label>
          <input name="usuario" className="w-full border p-2 rounded"
            placeholder="Usuario para el login" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Contraseña</label>
          <input name="contrasena" type="password" className="w-full border p-2 rounded"
            placeholder="Contraseña" onChange={handleChange} />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleSubmit}
          className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900">
          Crear profesor
        </button>
        <button onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">
          Cancelar
        </button>
      </div>
    </div>
  );
}