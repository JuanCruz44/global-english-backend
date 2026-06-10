import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ usuario: '', contrasena: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('rol', res.data.rol);
      localStorage.setItem('id_profesor', res.data.id_profesor);
      if (res.data.rol === 'secretaria') navigate('/alumnos');
      else navigate('/asistencias');
    } catch {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Global English</h1>
        <input className="w-full border p-2 rounded mb-3" placeholder="Usuario"
          onChange={e => setForm({ ...form, usuario: e.target.value })} />
        <input className="w-full border p-2 rounded mb-3" type="password" placeholder="Contraseña"
          onChange={e => setForm({ ...form, contrasena: e.target.value })} />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button onClick={handleSubmit}
          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900">
          Ingresar
        </button>
      </div>
    </div>
  );
}