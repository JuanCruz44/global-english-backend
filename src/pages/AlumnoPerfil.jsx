import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function AlumnoPerfil() {
  const { id } = useParams();
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    api.get(`/alumnos/${id}`).then(res => setAlumno(res.data));
  }, [id]);

  if (!alumno) return <p className="text-gray-500">Cargando...</p>;

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">{alumno.nombre} {alumno.apellido}</h1>
      <p className="mb-2"><span className="font-semibold">DNI:</span> {alumno.dni}</p>
      <p className="mb-2"><span className="font-semibold">Email:</span> {alumno.email}</p>
      <p className="mb-2"><span className="font-semibold">Teléfono:</span> {alumno.telefono}</p>
      <p className="mb-2">
        <span className="font-semibold">Estado: </span>
        <span className={`px-2 py-1 rounded text-sm ${alumno.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {alumno.estado}
        </span>
      </p>
    </div>
  );
}