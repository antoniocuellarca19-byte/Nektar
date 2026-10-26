import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api';

const obtenerImagen = (producto) => {
    const nombre = producto.nombre ? producto.nombre.toLowerCase() : "";
    const categoria = producto.categoria || "";

    if (nombre.includes("matcha")) return 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&q=80';
    if (nombre.includes("jamón") && nombre.includes("queso")) return 'https://images.unsplash.com/photo-1623334044303-241021148842?w=500&q=80';
    if ((nombre.includes("nutella") || nombre.includes("dulce")) && nombre.includes("croissant")) return 'https://images.unsplash.com/photo-1555507036-ab1f40388085?w=500&q=80';

    const mapCategorias = {
        'Lattes Fríos': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80',
        'Cafés Calientes': 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80',
        'Jugos': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80',
        'Postres': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
        'Croissants': 'https://images.unsplash.com/photo-1555507036-ab1f40388085?w=500&q=80',
        'Frappes': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&q=80',
        'Matcha': 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&q=80',
        'Bubba': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
        'Limonadas': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80',
        'Focaccias': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&q=80',
        'Cinnamons': 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&q=80',
        'Frappuccinos': 'https://images.unsplash.com/photo-1461023058943-716124547061?w=500&q=80'
    };

    if (mapCategorias[categoria]) return mapCategorias[categoria];

    return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; 
};

const CajeroDashboard = () => {
  const [mesas, setMesas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [observacion, setObservacion] = useState("");
  const [categoriaActual, setCategoriaActual] = useState("TODOS");
  
  const navigate = useNavigate();

  const logout = () => { localStorage.removeItem('user'); navigate('/'); };

  useEffect(() => {
    cargarMesas();
    cargarProductos();
    const intervalo = setInterval(cargarMesas, 5000);
    return () => clearInterval(intervalo);
  }, [])

  const cargarMesas = async () => {
    try { const res = await axios.get(`${API_URL}/mesas`); setMesas(res.data); } 
    catch (error) { console.error("Error cargando mesas:", error); }
  }

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/productos`);
      const lista = res.data;
      setProductos(lista);
      setProductosFiltrados(lista);
      const cats = ["TODOS", ...new Set(lista.map(p => p.categoria))];
      setCategorias(cats);
    } catch (error) { console.error("Error productos:", error); }
  }

  const abrirMesa = async (id) => {
    try { await axios.put(`${API_URL}/mesas/${id}/ocupar`); cargarMesas(); } catch(e){}
  }
  const cerrarMesa = async (id) => {
    if(!window.confirm("¿Liberar mesa?")) return;
    try { await axios.put(`${API_URL}/mesas/${id}/liberar`); cargarMesas(); } catch(e){}
  }
  
  const irAPedido = (mesa) => {
    setMesaSeleccionada(mesa);
    setCarrito([]); setTotal(0); setObservacion(""); setCategoriaActual("TODOS"); setProductosFiltrados(productos);
  }

  const agregarProducto = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      const nuevo = existe 
        ? prev.map(item => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1, subtotal: item.subtotal + producto.precio } : item)
        : [...prev, { producto: producto, cantidad: 1, subtotal: producto.precio }];
      calcularTotal(nuevo);
      return nuevo;
    });
  }

  const quitarProducto = (id) => {
    const nuevo = carrito.filter(item => item.producto.id !== id);
    setCarrito(nuevo); calcularTotal(nuevo);
  }

  const calcularTotal = (lista) => setTotal(lista.reduce((acc, item) => acc + item.subtotal, 0));

  const confirmarPedido = async (metodo) => {
    if (carrito.length === 0) return alert("Carrito vacío");
    const pedido = { total, metodoPago: metodo, estado: "PAGADO", observacion, mesa: mesaSeleccionada, detalles: carrito.map(i => ({ cantidad: i.cantidad, subtotal: i.subtotal, producto: i.producto })) };
    try {
      const res = await axios.post(`${API_URL}/pedidos`, pedido);
      alert(`✅ Venta #${res.data.id} registrada!`);
      setMesaSeleccionada(null); cargarMesas();
    } catch (e) { alert("Error en venta"); }
  }

  const realizarCierreCaja = async () => {
    if(!window.confirm("¿Cerrar caja?")) return;
    try {
      const res = await axios.post(`${API_URL}/pedidos/cierre-dia`);
      alert(`✅ Cierre Total: $${res.data.totalGeneral}`);
    } catch (e) { alert("Error al cerrar"); }
  }

  // --- VISTA 1: MESAS (CENTRADA) ---
  if (!mesaSeleccionada) {
    return (
      <div className="w-100 min-vh-100" style={{backgroundColor: 'var(--nektar-bg)'}}>
        <nav className="navbar navbar-dark bg-nektar-dark px-4 shadow-sm sticky-top w-100">
          <div className="container-fluid">
             <span className="navbar-brand fw-bold fs-4">☕ Nektar POS</span>
             <div className="d-flex gap-2">
                <button className="btn btn-outline-light btn-sm fw-medium px-3 rounded-pill" onClick={realizarCierreCaja}>📊 Cierre</button>
                <button className="btn btn-danger btn-sm px-3 rounded-pill" onClick={logout}>Salir</button>
             </div>
          </div>
        </nav>

        <div className="container py-5">
            <h2 className="text-center fw-bold mb-5 text-dark">Control de Mesas</h2>
            <div className="row g-4 justify-content-center">
              {mesas.map((mesa) => {
                const libre = mesa.estado === 'LIBRE';
                return (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={mesa.id}>
                    <div className={`card text-center h-100 shadow border-0 overflow-hidden ${libre ? 'bg-white' : 'bg-white border border-danger'}`}>
                      <div className={`py-3 fw-bold text-white fs-5 ${libre ? 'bg-success' : 'bg-danger'}`}>
                        Mesa {mesa.numero}
                      </div>
                      <div className="card-body d-flex flex-column justify-content-center p-4">
                          <h4 className={`fw-bold mb-3 ${libre?'text-success':'text-danger'}`}>{mesa.estado}</h4>
                          {libre ? (
                            <div className="d-grid gap-2">
                               <button className="btn btn-light rounded-pill text-muted small" onClick={() => abrirMesa(mesa.id)}>Marcar Ocupada</button>
                               <button className="btn btn-primary rounded-pill fw-bold py-2" onClick={() => irAPedido(mesa)}>📝 Nuevo Pedido</button>
                            </div>
                          ) : (
                            <div className="d-grid gap-2">
                               <button className="btn btn-outline-danger rounded-pill" onClick={() => cerrarMesa(mesa.id)}>🔴 Liberar</button>
                               <button className="btn btn-primary rounded-pill fw-bold py-2" onClick={() => irAPedido(mesa)}>➕ Agregar</button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column vh-100 w-100 bg-light">
      <div className="bg-white shadow-sm py-2 px-3 d-flex align-items-center justify-content-between z-2 border-bottom">
          <button className="btn btn-light border rounded-pill px-4 fw-bold text-secondary" onClick={() => setMesaSeleccionada(null)}>⬅ Volver</button>
          <h4 className="m-0 fw-bold text-dark">Mesa {mesaSeleccionada.numero}</h4>
          <div style={{width: '100px'}}></div>
      </div>

      <div className="d-flex flex-grow-1 overflow-hidden w-100">
        {/* MENÚ VISUAL */}
        <div className="flex-grow-1 p-4 overflow-auto" style={{backgroundColor: '#fafafa'}}>
          <div className="d-flex gap-2 mb-4 overflow-auto pb-2 justify-content-start flex-wrap">
             {categorias.map(cat => (
                <button key={cat} className={`btn px-4 rounded-pill fw-bold border-0 shadow-sm ${categoriaActual === cat ? 'bg-nektar-dark text-white' : 'bg-white text-dark'}`} 
                        onClick={() => { setCategoriaActual(cat); setProductosFiltrados(cat === "TODOS" ? productos : productos.filter(p => p.categoria === cat)); }}>
                  {cat}
                </button>
             ))}
          </div>
          
          <div className="container-fluid px-0">
            <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                {productosFiltrados.map(prod => (
                <div className="col" key={prod.id}>
                    <div className="card h-100 border-0 shadow-sm overflow-hidden card-hover-effect" onClick={() => agregarProducto(prod)} style={{cursor:'pointer'}}>
                        {/* IMAGEN DE FONDO */}
                        <div style={{height: '140px', overflow: 'hidden', position: 'relative', backgroundColor: '#f0f0f0'}}>
                            <img 
                                src={obtenerImagen(prod)} 
                                alt={prod.nombre} 
                                style={{width: '100%', height:'100%', objectFit:'cover', transition: 'transform 0.3s'}}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; }} 
                            />
                        </div>
                        <div className="card-body text-center p-3 d-flex flex-column justify-content-between">
                            <h6 className="fw-bold text-dark mb-2" style={{fontSize: '0.95rem'}}>{prod.nombre}</h6>
                            <span className="badge bg-light text-dark border rounded-pill align-self-center px-3">${prod.precio}</span>
                        </div>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* TICKET MODERNO */}
        <div className="bg-white border-start shadow-lg d-flex flex-column z-1" style={{width: '400px', minWidth: '350px'}}>
          <div className="p-3 bg-nektar-dark text-white text-center shadow-sm"><h5 className="m-0 fw-bold">🛒 Ticket Actual</h5></div>
          <div className="flex-grow-1 overflow-auto p-3" style={{backgroundColor: '#fff'}}>
            {carrito.length === 0 && (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted opacity-50">
                    <span style={{fontSize: '3rem'}}>🧾</span>
                    <p className="mt-2">El carrito está vacío</p>
                </div>
            )}
            <ul className="list-group list-group-flush">
              {carrito.map((item, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-center py-3 px-2 border-bottom-dashed">
                  <div className="lh-1">
                    <div className="fw-bold text-dark mb-1">{item.producto.nombre}</div>
                    <small className="text-muted">x{item.cantidad} &nbsp; <span className="text-secondary">(${item.producto.precio})</span></small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold text-dark">${item.subtotal}</span>
                    <button className="btn btn-sm btn-light text-danger rounded-circle p-0 d-flex align-items-center justify-content-center border" style={{width:'28px', height:'28px'}} onClick={()=>quitarProducto(item.producto.id)}>✕</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-light border-top">
            <textarea className="form-control mb-3 border-0 shadow-sm" rows="2" placeholder="📝 Notas (sin hielo, extra azúcar...)" style={{fontSize: '0.9rem', resize: 'none'}} value={observacion} onChange={e=>setObservacion(e.target.value)}></textarea>
            <div className="d-flex justify-content-between align-items-end mb-4">
               <span className="text-muted text-uppercase fw-bold small">Total a Pagar</span>
               <h1 className="m-0 fw-bold text-dark">${total}</h1>
            </div>
            <div className="row g-2">
              <div className="col-6"><button className="btn btn-success w-100 fw-bold py-3 shadow-sm rounded-3" onClick={()=>confirmarPedido("EFECTIVO")} disabled={total===0}>💵 Efectivo</button></div>
              <div className="col-6"><button className="btn btn-primary w-100 fw-bold py-3 shadow-sm rounded-3" onClick={()=>confirmarPedido("QR")} disabled={total===0}>📱 QR</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CajeroDashboard;