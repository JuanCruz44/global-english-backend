import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Asistencias() {
  const [lista, setLista] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const rol = localStorage.getItem('rol');
  const id_profesor = localStorage.getItem('id_profesor');
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');

  useEffect(() => {
    api.get('/cursos').then(res => {
      const misCursos = rol === 'profesor'
        ? res.data.filter(c => c.id_profesor == id_profesor)
        : res.data;
      setCursos(misCursos);
      if (misCursos.length > 0) setCursoSeleccionado(misCursos[0].id_curso);
    });
  }, []);

  useEffect(() => {
    if (cursoSeleccionado && fecha) cargarAsistencia();
  }, [cursoSeleccionado, fecha]);

  const cargarAsistencia = async () => {
    const res = await api.get(`/asistencias/curso/${cursoSeleccionado}/fecha/${fecha}`);
    setLista(res.data);
  };

  const togglePresente = async (item) => {
    await api.post('/asistencias', {
      id_inscripcion: item.id_inscripcion,
      fecha,
      presente: !item.presente
    });
    cargarAsistencia();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Asistencias</h1>
      <div className="flex gap-3 mb-4">
        <select className="border p-2 rounded"
          value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)}>
          {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombre}</option>)}
        </select>
        <input type="date" className="border p-2 rounded"
          value={fecha} onChange={e => setFecha(e.target.value)} />
      </div>
      <table className="w-full bg-white shadow rounded border-collapse">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-3 text-left">Alumno</th>
            <th className="p-3 text-center">Presente</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(item => (
            <tr key={item.id_inscripcion} className="border-b hover:bg-gray-50">
              <td className="p-3">{item.alumno.nombre} {item.alumno.apellido}</td>
              <td className="p-3 text-center">
                <button onClick={() => togglePresente(item)}
                  className={`px-4 py-1 rounded font-semibold ${item.presente ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.presente ? 'Presente' : 'Ausente'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
