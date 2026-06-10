import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Reportes() {
  const [deudores, setDeudores] = useState([]);

  useEffect(() => {
    api.get('/pagos/deudores').then(res => setDeudores(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Reportes</h1>
      <h2 className="text-lg font-semibold mb-3">Alumnos con pagos pendientes o vencidos</h2>
      <table className="w-full bg-white shadow rounded border-collapse">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-3 text-left">Alumno</th>
            <th className="p-3 text-left">DNI</th>
            <th className="p-3 text-left">Mes</th>
            <th className="p-3 text-left">Monto</th>
            <th className="p-3 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {deudores.map(p => (
            <tr key={p.id_pago} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.Inscripcion?.Alumno?.nombre} {p.Inscripcion?.Alumno?.apellido}</td>
              <td className="p-3">{p.Inscripcion?.Alumno?.dni}</td>
              <td className="p-3">{p.mes_correspondiente}</td>
              <td className="p-3">${p.monto}</td>
              <td className="p-3">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">{p.estado}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
