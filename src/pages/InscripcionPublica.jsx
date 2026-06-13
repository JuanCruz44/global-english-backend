import { useState, useEffect } from 'react';

export default function InscripcionPublica() {
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '', email: '', telefono: '', id_curso: ''
  });
  const [exito, setExito] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(() => setCursos([]));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellido || !form.dni || !form.id_curso) {
      setError('Nombre, apellido, DNI y curso son obligatorios');
      return;
    }
    try {
      await fetch('http://localhost:3000/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setExito('¡Inscripción enviada correctamente! La secretaría se contactará con vos.');
      setError('');
      setForm({ nombre: '', apellido: '', dni: '', email: '', telefono: '', id_curso: '' });
    } catch {
      setError('Error al enviar la inscripción. Intentá de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white shadow rounded p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-blue-800 mb-2 text-center">Global English</h1>
        <p className="text-center text-gray-500 mb-6">Formulario de inscripción</p>

        {exito && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{exito}</p>}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre</label>
            <input name="nombre" value={form.nombre} className="w-full border p-2 rounded"
              placeholder="Tu nombre" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Apellido</label>
            <input name="apellido" value={form.apellido} className="w-full border p-2 rounded"
              placeholder="Tu apellido" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">DNI</label>
            <input name="dni" value={form.dni} className="w-full border p-2 rounded"
              placeholder="Tu DNI" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input name="email" value={form.email} className="w-full border p-2 rounded"
              placeholder="Tu email" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Teléfono</label>
            <input name="telefono" value={form.telefono} className="w-full border p-2 rounded"
              placeholder="Tu teléfono" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Curso</label>
            <select name="id_curso" value={form.id_curso} className="w-full border p-2 rounded"
              onChange={handleChange}>
              <option value="">Seleccioná un curso</option>
              {cursos.map(c => (
                <option key={c.id_curso} value={c.id_curso}>
                  {c.nombre} — {c.nivel} — {c.horario}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleSubmit}
          className="mt-6 w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900">
          Enviar inscripción
        </button>
      </div>
    </div>
  );
}