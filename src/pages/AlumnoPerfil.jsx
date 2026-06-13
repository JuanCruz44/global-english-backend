import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AlumnoPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/alumnos/${id}`).then(res => {
      setAlumno(res.data);
      setForm(res.data);
    });
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGuardar = async () => {
    try {
      await api.put(`/alumnos/${id}`, form);
      setAlumno(form);
      setEditando(false);
      setExito('Alumno actualizado correctamente');
      setTimeout(() => setExito(''), 3000);
    } catch {
      setError('Error al actualizar el alumno');
    }
  };

  if (!alumno) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">
        {alumno.nombre} {alumno.apellido}
      </h1>

      {exito && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{exito}</p>}
      {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>}

      {!editando ? (
        <div className="flex flex-col gap-3">
          <p><span className="font-semibold">DNI:</span> {alumno.dni}</p>
          <p><span className="font-semibold">Email:</span> {alumno.email}</p>
          <p><span className="font-semibold">Teléfono:</span> {alumno.telefono}</p>
          <p>
            <span className="font-semibold">Estado: </span>
            <span className={`px-2 py-1 rounded text-sm ${alumno.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {alumno.estado}
            </span>
          </p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setEditando(true)}
              className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900">
              Editar
            </button>
            <button onClick={() => navigate(-1)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
              Volver
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre</label>
            <input name="nombre" defaultValue={alumno.nombre}
              className="w-full border p-2 rounded" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Apellido</label>
            <input name="apellido" defaultValue={alumno.apellido}
              className="w-full border p-2 rounded" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">DNI</label>
            <input name="dni" defaultValue={alumno.dni}
              className="w-full border p-2 rounded" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input name="email" defaultValue={alumno.email}
              className="w-full border p-2 rounded" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Teléfono</label>
            <input name="telefono" defaultValue={alumno.telefono}
              className="w-full border p-2 rounded" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Estado</label>
            <select name="estado" defaultValue={alumno.estado}
              className="w-full border p-2 rounded" onChange={handleChange}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={handleGuardar}
              className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900">
              Guardar
            </button>
            <button onClick={() => setEditando(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}