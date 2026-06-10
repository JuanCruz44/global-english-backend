import { useState } from 'react';
import api from '../services/api';

export default function Pagos() {
  const [idInscripcion, setIdInscripcion] = useState('');
  const [historial, setHistorial] = useState([]);
  const [form, setForm] = useState({ id_inscripcion: '', mes_correspondiente: '', monto: '' });
  const [mensaje, setMensaje] = useState('');

  const buscarHistorial = async () => {
    const res = await api.get(`/pagos/alumno/${idInscripcion}`);
    setHistorial(res.data);
  };

  const registrarPago = async () => {
    try {
      await api.post('/pagos', form);
      setMensaje('Pago registrado correctamente');
    } catch {
      setMensaje('Error al registrar pago');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Pagos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-5">
          <h2 className="font-bold text-lg mb-3">Registrar pago</h2>
          <input className="w-full border p-2 rounded mb-2" placeholder="ID Inscripción"
            onChange={e => setForm({ ...form, id_inscripcion: e.target.value })} />
          <input className="w-full border p-2 rounded mb-2" placeholder="Mes (ej: 2025-06)"
            onChange={e => setForm({ ...form, mes_correspondiente: e.target.value })} />
          <input className="w-full border p-2 rounded mb-2" placeholder="Monto"
            onChange={e => setForm({ ...form, monto: e.target.value })} />
          {mensaje && <p className="text-sm text-blue-700 mb-2">{mensaje}</p>}
          <button onClick={registrarPago}
            className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900">
            Registrar
          </button>
        </div>
        <div className="bg-white shadow rounded p-5">
          <h2 className="font-bold text-lg mb-3">Historial de pagos</h2>
          <div className="flex gap-2 mb-3">
            <input className="border p-2 rounded flex-1" placeholder="ID Inscripción"
              onChange={e => setIdInscripcion(e.target.value)} />
            <button onClick={buscarHistorial}
              className="bg-blue-800 text-white px-4 rounded hover:bg-blue-900">
              Buscar
            </button>
          </div>
          {historial.map(p => (
            <div key={p.id_pago} className="border-b py-2 text-sm">
              <span className="font-semibold">{p.mes_correspondiente}</span> — ${p.monto} —
              <span className={`ml-1 ${p.estado === 'pagado' ? 'text-green-600' : 'text-red-600'}`}>{p.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
