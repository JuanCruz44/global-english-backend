import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Alumnos from './pages/Alumnos';
import AlumnoPerfil from './pages/AlumnoPerfil';
import Cursos from './pages/Cursos';
import CursoDetalle from './pages/CursoDetalle';
import Navbar from './components/Navbar';
import Inscripciones from './pages/Inscripciones';
import Pagos from './pages/Pagos';
import Asistencias from './pages/Asistencias';
import Reportes from './pages/Reportes';
import CrearProfesor from './pages/CrearProfesor';
import Inscripcion from './pages/Inscripcion';
import InscripcionPublica from './pages/InscripcionPublica';
import Pagos from './pages/Pagos';

function RutaProtegida({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
    // Esta va ANTES de la ruta del login, fuera de RutaProtegida
<Route path="/inscripcion" element={<InscripcionPublica />} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <RutaProtegida>
            <Navbar />
            <div className="p-6">
              <Routes>
                <Route path="/alumnos" element={<Alumnos />} />
                <Route path="/alumnos/:id" element={<AlumnoPerfil />} />
                <Route path="/cursos" element={<Cursos />} />
                <Route path="/cursos/:id" element={<CursoDetalle />} />
                <Route path="/inscripciones" element={<Inscripciones />} />
                <Route path="/pagos" element={<Pagos />} />
                <Route path="/asistencias" element={<Asistencias />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/profesores/nuevo" element={<CrearProfesor />} />
                <Route path="/inscribir" element={<Inscripcion />} />
                <Route path="/pagos" element={<Pagos />} />
              </Routes>
            </div>
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;