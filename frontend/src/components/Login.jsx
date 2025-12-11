import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// IMPORTANTE: Asegúrate de haber guardado la imagen del logo aquí:
import nektarLogo from '../assets/nektar-logo.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Estilo del fondo degradado (combina con el marrón oscuro del logo)
    const backgroundStyle = {
        background: 'linear-gradient(135deg, #5D4037 0%, #3E2723 100%)', // Un poco más profundo para contraste
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password
            });
            const { rol } = response.data;
            localStorage.setItem('user', JSON.stringify({ username, rol }));
            if (rol === 'ADMIN') navigate('/admin');
            else if (rol === 'CAJERO') navigate('/cajero');
        } catch (err) {
            setError('Credenciales incorrectas. Verifica usuario y contraseña.');
        }
    };

    return (
        <div style={backgroundStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4" style={{maxWidth: '450px'}}>
                        <div className="card fade-in border-0 shadow-lg" style={{borderRadius: '28px'}}>
                            <div className="card-body p-5">
                                <div className="text-center mb-5">
                                    {/* --- LOGO INTEGRADO --- */}
                                    <img 
                                        src={nektarLogo} 
                                        alt="Nektar Logo" 
                                        className="img-fluid mb-3"
                                        // Ajusta el width si lo quieres más grande o pequeño
                                        style={{ width: '180px', height: 'auto', filter: 'drop-shadow(0 8px 16px rgba(62, 39, 35, 0.15))' }}
                                    />
                                    {/* Hemos quitado el título H3 redundante */}
                                    <p className="text-muted small text-uppercase fw-bold" style={{letterSpacing: '2px', color: '#8D6E63'}}>Sistema de Gestión</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger border-0 text-center py-2 mb-4 bg-danger-subtle text-danger fw-medium" role="alert" style={{borderRadius: '12px', fontSize: '0.9rem'}}>
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                                    </div>
                                )}

                                <form onSubmit={handleLogin}>
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="text" 
                                            className="form-control bg-light border-0" 
                                            id="floatingInput" 
                                            placeholder="Usuario"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            style={{borderRadius: '12px', boxShadow: 'none'}}
                                            autoFocus
                                        />
                                        <label htmlFor="floatingInput" className="text-muted">Usuario</label>
                                    </div>
                                    <div className="form-floating mb-4">
                                        <input 
                                            type="password" 
                                            className="form-control bg-light border-0" 
                                            id="floatingPassword" 
                                            placeholder="Contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{borderRadius: '12px', boxShadow: 'none'}}
                                        />
                                        <label htmlFor="floatingPassword" className="text-muted">Contraseña</label>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-3 fw-bold rounded-pill text-uppercase shadow-sm"
                                        style={{letterSpacing: '1px', backgroundColor: '#4E342E', borderColor: '#4E342E'}}
                                    >
                                        Iniciar Sesión
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="text-center mt-4 text-white-50">
                            <small>© 2025 Nektar Coffee. Todos los derechos reservados.</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;