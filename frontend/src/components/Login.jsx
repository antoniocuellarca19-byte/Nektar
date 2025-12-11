import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            setError('Credenciales incorrectas');
        }
    };

    return (
        // Usamos w-100 y h-100 para ocupar toda la pantalla real
        <div className="d-flex justify-content-center align-items-center w-100 h-100 bg-light position-fixed top-0 start-0">
            <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: '400px', maxWidth: '90%' }}>
                <div className="text-center mb-4">
                    <h1 className="display-1">☕</h1>
                    <h3 className="fw-bold text-dark">Nektar Sistema</h3>
                </div>

                {error && <div className="alert alert-danger text-center py-2">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-floating mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="floatingInput" 
                            placeholder="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />
                        <label htmlFor="floatingInput">Usuario</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="floatingPassword" 
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingPassword">Contraseña</label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-pill">INGRESAR</button>
                </form>
            </div>
        </div>
    );
};

export default Login;