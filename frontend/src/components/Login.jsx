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

            const { rol, usuario } = response.data;
            
            // Guardamos el usuario en el navegador para usarlo luego
            localStorage.setItem('user', JSON.stringify({ username, rol }));

            // Redirigir según el rol
            if (rol === 'ADMIN') {
                navigate('/admin');
            } else if (rol === 'CAJERO') {
                navigate('/cajero');
            }
        } catch (err) {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: '350px' }}>
                <h3 className="text-center mb-3">☕ Nektar Login</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Usuario</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;