"use client";

import { useState, useEffect } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithRedirect,
    getRedirectResult 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Manejar resultado de redirect cuando vuelve de Google
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    console.log('✅ Login exitoso con Google');
                }
            } catch (err: any) {
                console.error('❌ Error en redirect:', err);
                setError('Error: ' + (err.message || 'No se pudo iniciar sesión con Google'));
            }
        };
        handleRedirectResult();
    }, []);

    const handleGoogleLogin = async () => {
        console.log('🚀 Iniciando Google Sign-In...');
        setError('');
        setLoading(true);
        
        const provider = new GoogleAuthProvider();
        
        try {
            console.log('📱 Redirigiendo a Google...');
            await signInWithRedirect(auth, provider);
            // La página se recargará automáticamente después del redirect
        } catch (err: any) {
            console.error('❌ Error:', err);
            setLoading(false);
            
            if (err.code === 'auth/operation-not-allowed') {
                setError('⚠️ Google Sign-In no está habilitado en Firebase Console');
            } else if (err.code === 'auth/unauthorized-domain') {
                setError('⚠️ Este dominio no está autorizado en Firebase');
            } else if (err.code === 'auth/popup-blocked') {
                setError('⚠️ El navegador bloqueó el popup. Intenta de nuevo');
            } else {
                setError('❌ Error: ' + err.message);
            }
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
                setError('❌ Email o contraseña incorrectos');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('⚠️ Este email ya está registrado');
            } else if (err.code === 'auth/weak-password') {
                setError('⚠️ La contraseña debe tener al menos 6 caracteres');
            } else if (err.code === 'auth/invalid-email') {
                setError('⚠️ Email inválido');
            } else {
                setError('❌ Error: ' + err.message);
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
            padding: '1rem',
            background: 'var(--bg-primary)'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                {/* Logo/Título */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        💰 Presupuesto
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
                    </p>
                </div>

                {/* Botón de Google */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1rem',
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
                        gap: '0.75rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                        <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                        <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                        <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
                    </svg>
                    {loading ? 'Redirigiendo...' : 'Continuar con Google'}
                </button>

                {/* Separador */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-medium)' }}></div>
                    <span style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        o usa tu email
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-medium)' }}></div>
                </div>

                {/* Formulario Email/Password */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--text-secondary)', 
                            fontSize: '0.875rem',
                            fontWeight: 500 
                        }}>
                            📧 Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-medium)',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: 'var(--text-secondary)', 
                            fontSize: '0.875rem',
                            fontWeight: 500 
                        }}>
                            🔒 Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-medium)',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div style={{ 
                            padding: '1rem', 
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-danger)', 
                            fontSize: '0.875rem',
                            lineHeight: 1.5
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Botón de submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '1rem',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            cursor: loading ? 'wait' : 'pointer',
                            fontSize: '1rem',
                            marginTop: '0.5rem',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? '⏳ Procesando...' : (isLogin ? '🚀 Iniciar Sesión' : '✨ Crear Cuenta')}
                    </button>
                </form>

                {/* Toggle Login/Registro */}
                <p style={{ 
                    textAlign: 'center', 
                    marginTop: '1.5rem', 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.875rem' 
                }}>
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        disabled={loading}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            cursor: loading ? 'wait' : 'pointer',
                            marginLeft: '0.5rem',
                            fontWeight: 600,
                            textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                    </button>
                </p>
            </div>

            {/* Nota de desarrollo (puedes quitarla después) */}
            <p style={{ 
                marginTop: '2rem', 
                color: 'var(--text-muted)', 
                fontSize: '0.75rem',
                textAlign: 'center',
                maxWidth: '400px'
            }}>
                💡 Si "Continuar con Google" no funciona, usa Email y Contraseña
            </p>
        </div>
    );
}
