"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            console.error(err);
            setError('Error al iniciar sesión con Google: ' + err.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                setError('Credenciales incorrectas.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Este email ya está registrado.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('El inicio de sesión con email y contraseña no está habilitado en Firebase.');
            } else {
                setError('Error: ' + err.message);
            }
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '1rem'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
                </h1>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'white',
                        color: '#333',
                        border: '1px solid #ddd',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        cursor: loading ? 'wait' : 'pointer',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                    Continuar con Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-medium)' }}></div>
                    <span style={{ padding: '0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>O usa tu email</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-medium)' }}></div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-medium)',
                                borderRadius: 'var(--radius-md)',
                                color: 'white'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-medium)',
                                borderRadius: 'var(--radius-md)',
                                color: 'white'
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '1rem',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            cursor: loading ? 'wait' : 'pointer',
                            marginTop: '1rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-info)',
                            cursor: 'pointer',
                            marginLeft: '0.5rem',
                            fontWeight: 500
                        }}
                    >
                        {isLogin ? 'Regístrate' : 'Ingresa'}
                    </button>
                </p>
            </div>
        </div>
    );
}
