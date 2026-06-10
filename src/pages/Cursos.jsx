import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cursos').then(res => setCursos(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Cursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cursos.map(c => (
          <div key={c.id_curso} className="bg-white shadow rounded p-5 hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/cursos/${c.id_curso}`)}>
            <h2 className="text-xl font-bold text-blue-800">{c.nombre}</h2>
            <p className="text-gray-500">{c.nivel}</p>
            <p className="text-gray-500">{c.horario}</p>
            <p className="text-gray-700 mt-2 font-semibold">Cuota: ${c.cuota_mensual}</p>
          </div>
        ))}
      </div>
    </div>
  );
}