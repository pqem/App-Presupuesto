"use client";

import { useState } from 'react';
import { useStorage } from '@/context/StorageContext';
import { seedDatabase, clearAllData } from '@/utils/seedData';

export default function SeedDataPage() {
  const { user, household } = useStorage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSeedData = async () => {
    if (!user || !household) {
      setError('Debes estar logueado y tener un household configurado');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const success = await seedDatabase(user.uid, household.id);
      if (success) {
        setMessage('✅ ¡Datos creados exitosamente! Refresca la página para verlos.');
      } else {
        setError('❌ Hubo un error creando los datos.');
      }
    } catch (err) {
      setError(`❌ Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!household) {
      setError('No hay household configurado');
      return;
    }

    const confirmed = window.confirm(
      '⚠️ ¿Estás seguro? Esto eliminará TODOS los datos (transacciones, cuentas y categorías). Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const success = await clearAllData(household.id);
      if (success) {
        setMessage('✅ Datos eliminados exitosamente. Refresca la página.');
      } else {
        setError('❌ Hubo un error eliminando los datos.');
      }
    } catch (err) {
      setError(`❌ Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#1a1a2e',
          textAlign: 'center',
        }}>
          🎲 Generador de Datos
        </h1>
        
        <p style={{
          color: '#666',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '14px',
        }}>
          Herramienta temporal para llenar tu app con datos de prueba
        </p>

        {!user && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            color: '#856404',
          }}>
            ⚠️ Debes iniciar sesión primero
          </div>
        )}

        {user && !household && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            color: '#856404',
          }}>
            ⚠️ Debes crear o unirte a un household primero
          </div>
        )}

        <div style={{
          background: '#e8f4ff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#0066cc',
          }}>
            📊 ¿Qué se va a crear?
          </h3>
          <ul style={{
            fontSize: '14px',
            color: '#333',
            lineHeight: '1.8',
            paddingLeft: '20px',
          }}>
            <li>14 categorías (10 gastos + 4 ingresos)</li>
            <li>4 cuentas (banco, efectivo, tarjeta, ahorro USD)</li>
            <li>~180 transacciones de los últimos 3 meses</li>
            <li>3 salarios mensuales</li>
            <li>8 ingresos freelance</li>
            <li>10 transferencias entre cuentas</li>
            <li>Datos realistas y variados</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={handleSeedData}
            disabled={loading || !user || !household}
            style={{
              width: '100%',
              padding: '15px',
              background: loading || !user || !household 
                ? '#cccccc' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading || !user || !household ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading && user && household) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? '⏳ Generando datos...' : '🚀 Generar Datos de Prueba'}
          </button>
        </div>

        <div>
          <button
            onClick={handleClearData}
            disabled={loading || !household}
            style={{
              width: '100%',
              padding: '15px',
              background: loading || !household ? '#cccccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading || !household ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading && household) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? '⏳ Limpiando...' : '🗑️ Limpiar Todos los Datos'}
          </button>
        </div>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '10px',
            color: '#155724',
            fontSize: '14px',
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '10px',
            color: '#721c24',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#fff8e1',
          borderRadius: '10px',
          fontSize: '13px',
          color: '#856404',
        }}>
          <strong>⚠️ Nota:</strong> Esta es una página temporal para desarrollo.
          Puedes eliminarla después de generar los datos de prueba.
        </div>

        <div style={{
          marginTop: '20px',
          textAlign: 'center',
        }}>
          <a
            href="/"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
