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
                <div className="card text-white bg-success h-100 shadow border-0 rounded-4">
                    <div className="card-body text-center py-5">
                        <h5 className="card-title opacity-75">Ventas Hoy</h5>
                        <h1 className="display-4 fw-bold my-3">${totalVendido}</h1>
                        <p className="card-text">{ventasHoy.length} pedidos realizados</p>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card text-white bg-warning h-100 shadow border-0 rounded-4">
                    <div className="card-body text-center py-5">
                        <h5 className="card-title opacity-75 text-dark">Stock Crítico</h5>
                        <h1 className="display-4 fw-bold my-3 text-dark">{insumos.filter(i => i.stockActual < 5).length}</h1>
                        <p className="card-text text-dark">Insumos por agotarse</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const VistaInventario = () => (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="table-responsive">
                <table className="table table-hover mb-0 text-center align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Stock</th>
                            <th>Unidad</th>
                            <th>Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insumos.map(ins => (
                            <tr key={ins.id}>
                                <td className="text-start ps-4 fw-bold">{ins.nombre}</td>
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
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="table-responsive">
                <table className="table table-striped mb-0 align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>#ID</th>
                            <th>Hora</th>
                            <th>Productos Vendidos</th> {/* NUEVA COLUMNA */}
                            <th>Mesa</th>
                            <th>Método</th>
                            <th className="text-end pe-4">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasHoy.length === 0 ? <tr><td colSpan="6" className="text-center py-4">Sin ventas hoy</td></tr> : 
                        ventasHoy.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{new Date(p.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                
                                {/* AQUI MOSTRAMOS LOS PRODUCTOS */}
                                <td className="text-start">
                                    <small>
                                        {p.detalles.map(d => (
                                            <div key={d.id}>• {d.cantidad}x {d.producto.nombre}</div>
                                        ))}
                                    </small>
                                </td>

                                <td>{p.mesa ? `Mesa ${p.mesa.numero}` : 'Barra'}</td>
                                <td><span className="badge bg-secondary rounded-pill">{p.metodoPago}</span></td>
                                <td className="text-end pe-4 fw-bold text-success">${p.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-vh-100" style={{backgroundColor: '#f0f2f5'}}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow sticky-top">
                <div className="container">
                    <span className="navbar-brand fw-bold">👨‍💼 Admin Dashboard</span>
                    <div className="d-flex gap-2">
                        {['resumen', 'inventario', 'ventas'].map(v => (
                            <button key={v} className={`btn btn-sm text-capitalize ${vistaActual===v?'btn-light':'btn-outline-light'}`} onClick={()=>setVistaActual(v)}>{v}</button>
                        ))}
                        <button className="btn btn-sm btn-danger ms-3" onClick={logout}>Salir</button>
                    </div>
                </div>
            </nav>
            <div className="container py-5">
                <h3 className="text-center fw-bold mb-4 text-uppercase text-secondary">{vistaActual}</h3>
                {vistaActual === 'resumen' && <VistaResumen />}
                {vistaActual === 'inventario' && <VistaInventario />}
                {vistaActual === 'ventas' && <VistaVentas />}
            </div>
        </div>
    );
};
export default AdminDashboard;