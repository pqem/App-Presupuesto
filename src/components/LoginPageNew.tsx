"use client";

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPageNew() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Error:', err);
      setError('Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        padding: '3rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        
        {/* Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Presupuesto
          </h1>
          <p style={{
            color: '#9ca3af',
            textAlign: 'center',
            fontSize: '0.875rem'
          }}>
            Inicia sesión para continuar
          </p>
        </div>

        {/* Botón Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            height: '3.5rem',
            backgroundColor: 'white',
            color: '#111827',
            borderRadius: '0.75rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
            <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
            <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
            <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
          </svg>
          {loading ? 'Cargando...' : 'Continuar con Google'}
        </button>

        {/* Nota */}
        <p style={{
          color: '#6b7280',
          fontSize: '0.75rem',
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          Solo para uso personal
        </p>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.5rem',
            color: '#f87171',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
