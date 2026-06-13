import { useState } from 'react';
import api from '../services/api';

export default function Pagos() {
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  const buscarAlumnos = async (valor) => {
    setBusqueda(valor);
    setAlumnoSeleccionado(null);
    if (!valor.trim()) return setSugerencias([]);
    try {
      const res = await api.get(`/alumnos/buscar?q=${valor}`);
      setSugerencias(res.data);
    } catch {
      setSugerencias([]);
    }
  };

  const seleccionarAlumno = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setBusqueda(`${alumno.nombre} ${alumno.apellido}`);
    setSugerencias([]);
  };

  const handlePago = async () => {
    if (!alumnoSeleccionado) {
      setError('Seleccioná un alumno primero');
      return;
    }
    try {
      await api.post('/pagos', {
        id_alumno: alumnoSeleccionado.id_alumno,
        monto: alumnoSeleccionado.cuota_mensual,
        id_curso: alumnoSeleccionado.id_curso
      });
      setExito(`Pago de $${alumnoSeleccionado.cuota_mensual} registrado para ${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido}`);
      setError('');
      setAlumnoSeleccionado(null);
      setBusqueda('');
      setTimeout(() => setExito(''), 4000);
    } catch {
      setError('Error al registrar el pago');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Registrar Pago</h1>

      {exito && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{exito}</p>}
      {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>}

      <div className="relative mb-6">
        <label className="block text-sm font-semibold mb-1">Buscar alumno</label>
        <input
          className="w-full border p-2 rounded"
          placeholder="Escribí el nombre del alumno"
          value={busqueda}
          onChange={e => buscarAlumnos(e.target.value)}
        />
        {sugerencias.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-48 overflow-y-auto">
            {sugerencias.map(a => (
              <li key={a.id_alumno}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b"
                onClick={() => seleccionarAlumno(a)}>
                {a.nombre} {a.apellido} — DNI: {a.dni}
              </li>
            ))}
          </ul>
        )}
      </div>

      {alumnoSeleccionado && (
        <div className="bg-gray-50 border rounded p-4 mb-6 flex flex-col gap-2">
          <p><span className="font-semibold">Alumno:</span> {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido}</p>
          <p><span className="font-semibold">Curso:</span> {alumnoSeleccionado.nombre_curso}</p>
          <p><span className="font-semibold">Monto a cobrar:</span>
            <span className="text-blue-800 font-bold text-lg ml-2">${alumnoSeleccionado.cuota_mensual}</span>
          </p>
        </div>
      )}

      <button onClick={handlePago}
        disabled={!alumnoSeleccionado}
        className={`w-full py-2 rounded text-white font-semibold ${alumnoSeleccionado ? 'bg-blue-800 hover:bg-blue-900' : 'bg-gray-300 cursor-not-allowed'}`}>
        Registrar pago
      </button>
    </div>
  );
}