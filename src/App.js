import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Alumnos from './pages/Alumnos';
import AlumnoPerfil from './pages/AlumnoPerfil';
import Cursos from './pages/Cursos';
import CursoDetalle from './pages/CursoDetalle';
import Navbar from './components/Navbar';

function RutaProtegida({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
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
              </Routes>
            </div>
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;