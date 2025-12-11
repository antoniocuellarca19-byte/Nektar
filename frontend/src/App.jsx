import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importamos tus pantallas
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CajeroDashboard from './components/CajeroDashboard'; // <--- Aquí importamos lo que acabas de crear

// Componente de seguridad: Si no hay usuario, te manda al Login
const ProtectedRoute = ({ children, roleRequired }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/" />; // Al login si no está logueado
  }

  if (roleRequired && user.rol !== roleRequired) {
    return <Navigate to="/" />; // Al login si no tiene permiso
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Login */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta Privada: Panel de Admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute roleRequired="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta Privada: Panel de Cajero (Tu pantalla de mesas) */}
        <Route 
          path="/cajero" 
          element={
            <ProtectedRoute roleRequired="CAJERO">
              <CajeroDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;