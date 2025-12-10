import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h1>👨‍💼 Panel de Administrador</h1>
            <p>Bienvenido. Aquí podrás gestionar inventario, productos y ver reportes.</p>
            <div className="row mt-4">
                <div className="col-md-4"><div className="card p-3">📦 Gestión de Inventario</div></div>
                <div className="col-md-4"><div className="card p-3">📊 Reportes de Ventas</div></div>
                <div className="col-md-4"><div className="card p-3">☕ Gestión de Productos</div></div>
            </div>
            <button onClick={logout} className="btn btn-danger mt-4">Cerrar Sesión</button>
        </div>
    );
};

export default AdminDashboard;