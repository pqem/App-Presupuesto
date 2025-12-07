"use client";

import { useState } from 'react';
import { useStorage } from '@/context/StorageContext';

export default function HouseholdSetup() {
    const { createHousehold, joinHousehold, user } = useStorage();
    const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
    const [householdName, setHouseholdName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [createdCode, setCreatedCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!householdName.trim()) {
            setError('Ingresa un nombre para el hogar');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const code = await createHousehold(householdName.trim());
            setCreatedCode(code);
        } catch (err) {
            setError('Error al crear el hogar');
            console.error(err);
        }
        setLoading(false);
    };

    const handleJoin = async () => {
        if (!inviteCode.trim()) {
            setError('Ingresa el código de invitación');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const success = await joinHousehold(inviteCode.trim());
            if (!success) {
                setError('Código de invitación inválido');
            }
        } catch (err) {
            setError('Error al unirse al hogar');
            console.error(err);
        }
        setLoading(false);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(createdCode);
        alert('¡Código copiado!');
    };

    // Show success screen with code
    if (createdCode) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '28rem',
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h1 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        ¡Hogar Creado!
                    </h1>
                    <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                        Comparte este código con tu pareja para que se una:
                    </p>

                    <div style={{
                        background: '#1e293b',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{
                            color: '#8b5cf6',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.3em',
                            fontFamily: 'monospace'
                        }}>
                            {createdCode}
                        </p>
                    </div>

                    <button
                        onClick={copyCode}
                        style={{
                            width: '100%',
                            height: '3.5rem',
                            borderRadius: '0.75rem',
                            fontWeight: 600,
                            color: 'white',
                            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '1rem'
                        }}
                    >
                        📋 Copiar Código
                    </button>

                    <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        Este código es permanente. Tu pareja puede usarlo cuando quiera.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '28rem',
                padding: '2rem',
                borderRadius: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>

                {mode === 'choose' && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👨‍👩‍👧‍👦</div>
                            <h1 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}!
                            </h1>
                            <p style={{ color: '#9ca3af' }}>
                                ¿Cómo quieres comenzar?
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={() => setMode('create')}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>🏠</span>
                                <h3 style={{ color: 'white', margin: '0.5rem 0 0.25rem' }}>Crear un Hogar</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: 0 }}>
                                    Soy el primero en usar la app
                                </p>
                            </button>

                            <button
                                onClick={() => setMode('join')}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    background: 'rgba(30, 41, 59, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>🔗</span>
                                <h3 style={{ color: 'white', margin: '0.5rem 0 0.25rem' }}>Unirme a un Hogar</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: 0 }}>
                                    Tengo un código de invitación
                                </p>
                            </button>
                        </div>
                    </>
                )}

                {mode === 'create' && (
                    <>
                        <button
                            onClick={() => setMode('choose')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            ← Volver
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏠</div>
                            <h2 style={{ color: 'white', margin: 0 }}>Crear Hogar</h2>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: '#9ca3af', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                                Nombre del Hogar
                            </label>
                            <input
                                type="text"
                                value={householdName}
                                onChange={(e) => setHouseholdName(e.target.value)}
                                placeholder="Ej: Familia García"
                                style={{
                                    width: '100%',
                                    height: '3rem',
                                    padding: '0 1rem',
                                    borderRadius: '0.75rem',
                                    color: 'white',
                                    background: '#0f172a',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {error && (
                            <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
                        )}

                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            style={{
                                width: '100%',
                                height: '3.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: 600,
                                color: 'white',
                                background: loading ? '#4b5563' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                border: 'none',
                                cursor: loading ? 'wait' : 'pointer'
                            }}
                        >
                            {loading ? 'Creando...' : 'Crear Hogar'}
                        </button>
                    </>
                )}

                {mode === 'join' && (
                    <>
                        <button
                            onClick={() => setMode('choose')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            ← Volver
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔗</div>
                            <h2 style={{ color: 'white', margin: 0 }}>Unirme a un Hogar</h2>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: '#9ca3af', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                                Código de Invitación
                            </label>
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                placeholder="Ej: ABC123"
                                maxLength={6}
                                style={{
                                    width: '100%',
                                    height: '3.5rem',
                                    padding: '0 1rem',
                                    borderRadius: '0.75rem',
                                    color: 'white',
                                    background: '#0f172a',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.2em',
                                    textAlign: 'center',
                                    fontFamily: 'monospace'
                                }}
                            />
                        </div>

                        {error && (
                            <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
                        )}

                        <button
                            onClick={handleJoin}
                            disabled={loading}
                            style={{
                                width: '100%',
                                height: '3.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: 600,
                                color: 'white',
                                background: loading ? '#4b5563' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                border: 'none',
                                cursor: loading ? 'wait' : 'pointer'
                            }}
                        >
                            {loading ? 'Uniéndose...' : 'Unirme'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
