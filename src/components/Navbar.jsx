import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
      <span className="font-bold text-lg">Global English</span>
      <div className="flex gap-6">
        {rol === 'secretaria' && <>
          <Link to="/alumnos" className="hover:underline">Alumnos</Link>
          <Link to="/cursos" className="hover:underline">Cursos</Link>
          <Link to="/inscripciones" className="hover:underline">Inscripciones</Link>
          <Link to="/pagos" className="hover:underline">Pagos</Link>
          <Link to="/asistencias" className="hover:underline">Asistencias</Link>
          <Link to="/reportes" className="hover:underline">Reportes</Link>
        </>}
      </div>
      <button onClick={cerrarSesion} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
        Cerrar sesión
      </button>
    </nav>
  );
}
