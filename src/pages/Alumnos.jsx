import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => { cargarAlumnos(); }, []);

  const cargarAlumnos = async () => {
    const res = await api.get('/alumnos');
    setAlumnos(res.data);
  };

  const buscar = async () => {
    if (!busqueda.trim()) return cargarAlumnos();
    const res = await api.get(`/alumnos/buscar?q=${busqueda}`);
    setAlumnos(res.data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Alumnos</h1>
      <div className="flex gap-2 mb-4">
        <input className="border p-2 rounded w-72" placeholder="Buscar por nombre o DNI"
          value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <button onClick={buscar} className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900">
          Buscar
        </button>
      </div>
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">DNI</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map(a => (
            <tr key={a.id_alumno} className="border-b hover:bg-gray-50">
              <td className="p-3">{a.nombre} {a.apellido}</td>
              <td className="p-3">{a.dni}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${a.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {a.estado}
                </span>
              </td>
              <td className="p-3">
                <button onClick={() => navigate(`/alumnos/${a.id_alumno}`)}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">
                  Ver perfil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}