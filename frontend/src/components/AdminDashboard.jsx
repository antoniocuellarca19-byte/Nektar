import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api';

const AdminDashboard = () => {
    const [insumos, setInsumos] = useState([]);
    const [ventasHoy, setVentasHoy] = useState([]);
    const [totalVendido, setTotalVendido] = useState(0);
    const [vistaActual, setVistaActual] = useState('resumen'); 
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(() => {
        cargarDatos();
        const intervalo = setInterval(cargarDatos, 10000);
        return () => clearInterval(intervalo);
    }, []);

    const cargarDatos = async () => {
        try {
            const resInsumos = await axios.get(`${API_URL}/insumos`);
            setInsumos(resInsumos.data);

            const resPedidos = await axios.get(`${API_URL}/pedidos`);
            
            // Filtramos ventas por la fecha local de hoy
            const hoy = new Date();
            const ventasDelDia = resPedidos.data.filter(p => {
                if (!p.fecha) return false;
                const fechaVenta = new Date(p.fecha);
                return fechaVenta.getDate() === hoy.getDate() &&
                       fechaVenta.getMonth() === hoy.getMonth() &&
                       fechaVenta.getFullYear() === hoy.getFullYear();
            });

            setVentasHoy(ventasDelDia);
            setTotalVendido(ventasDelDia.reduce((acc, p) => acc + p.total, 0));
        } catch (error) { console.error("Error admin:", error); }
    };

    const VistaResumen = () => (
        <div className="row g-4 justify-content-center">
            <div className="col-md-4">
                <div className="card text-white bg-success h-100 shadow-sm border-0">
                    <div className="card-body text-center py-5">
                        <h5 className="card-title opacity-75 text-uppercase fw-bold" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>Ventas Hoy</h5>
                        <h1 className="display-4 fw-bold my-3">${totalVendido.toFixed(2)}</h1>
                        <p className="card-text fw-light">{ventasHoy.length} pedidos realizados</p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-dark bg-warning bg-opacity-25 h-100 shadow-sm border-0">
                    <div className="card-body text-center py-5">
                        <h5 className="card-title opacity-75 text-uppercase fw-bold text-dark" style={{fontSize: '0.9rem', letterSpacing: '1px'}}>Stock Crítico</h5>
                        <h1 className="display-4 fw-bold my-3 text-dark">{insumos.filter(i => i.stockActual < 5).length}</h1>
                        <p className="card-text text-dark fw-light">Insumos por agotarse</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const VistaInventario = () => (
        <div className="card shadow-sm border-0 overflow-hidden">
            <div className="table-responsive">
                <table className="table table-hover mb-0 text-center align-middle">
                    <thead className="bg-light text-secondary">
                        <tr>
                            <th className="py-3 border-0">Nombre</th>
                            <th className="py-3 border-0">Stock</th>
                            <th className="py-3 border-0">Unidad</th>
                            <th className="py-3 border-0">Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insumos.map(ins => (
                            <tr key={ins.id}>
                                <td className="text-start ps-4 fw-bold text-dark">{ins.nombre}</td>
                                <td className={ins.stockActual < 5 ? "text-danger fw-bold bg-danger-subtle" : "text-success fw-bold"}>
                                    {ins.stockActual.toFixed(2)}
                                </td>
                                <td className="text-muted">{ins.unidadMedida}</td>
                                <td>{ins.proveedor?.nombre || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const VistaVentas = () => (
        <div className="card shadow-sm border-0 overflow-hidden">
            <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                    <thead className="bg-light text-secondary">
                        <tr>
                            <th className="py-3 border-0 ps-4">#ID</th>
                            <th className="py-3 border-0">Hora</th>
                            <th className="py-3 border-0">Detalle</th>
                            <th className="py-3 border-0">Mesa</th>
                            <th className="py-3 border-0">Método</th>
                            <th className="py-3 border-0 text-end pe-4">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasHoy.length === 0 ? <tr><td colSpan="6" className="text-center py-5 text-muted">Sin ventas registradas hoy</td></tr> : 
                        ventasHoy.map(p => (
                            <tr key={p.id}>
                                <td className="ps-4 fw-bold text-muted">#{p.id}</td>
                                <td>{new Date(p.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                <td className="text-start">
                                    <small className="text-muted">
                                        {p.detalles.map(d => (
                                            <div key={d.id}>• {d.cantidad}x {d.producto.nombre}</div>
                                        ))}
                                    </small>
                                </td>
                                <td>{p.mesa ? <span className="badge bg-primary rounded-pill">Mesa {p.mesa.numero}</span> : <span className="badge bg-secondary rounded-pill">Barra</span>}</td>
                                <td><span className="badge bg-light text-dark border">{p.metodoPago}</span></td>
                                <td className="text-end pe-4 fw-bold text-success">${p.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-vh-100" style={{backgroundColor: 'var(--nektar-bg)'}}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-nektar-dark px-4 shadow-sm sticky-top">
                <div className="container">
                    <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
                        <span style={{fontSize: '1.5rem'}}>☕</span> Nektar Admin
                    </span>
                    <div className="d-flex gap-2">
                        {['resumen', 'inventario', 'ventas'].map(v => (
                            <button 
                                key={v} 
                                className={`btn btn-sm text-capitalize px-3 rounded-pill fw-medium ${vistaActual===v ? 'btn-light text-dark' : 'btn-outline-light border-0'}`} 
                                onClick={()=>setVistaActual(v)}
                            >
                                {v}
                            </button>
                        ))}
                        <button className="btn btn-sm btn-danger ms-3 px-3 rounded-pill" onClick={logout}>Salir</button>
                    </div>
                </div>
            </nav>
            <div className="container py-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h3 className="fw-bold text-dark text-capitalize m-0">{vistaActual}</h3>
                    <span className="text-muted small">{new Date().toLocaleDateString()}</span>
                </div>
                {vistaActual === 'resumen' && <VistaResumen />}
                {vistaActual === 'inventario' && <VistaInventario />}
                {vistaActual === 'ventas' && <VistaVentas />}
            </div>
        </div>
    );
};

export default AdminDashboard;