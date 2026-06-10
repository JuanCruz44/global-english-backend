import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function CursoDetalle() {
  const { id } = useParams();
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    api.get(`/cursos/${id}/alumnos`).then(res => setAlumnos(res.data));
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Alumnos del curso</h1>
      <table className="w-full bg-white shadow rounded border-collapse">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">DNI</th>
            <th className="p-3 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map(a => (
            <tr key={a.id_alumno} className="border-b hover:bg-gray-50">
              <td className="p-3">{a.nombre} {a.apellido}</td>
              <td className="p-3">{a.dni}</td>
              <td className="p-3">{a.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}