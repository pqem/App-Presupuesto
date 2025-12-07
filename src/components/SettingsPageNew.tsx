"use client";

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPageNew() {
  const router = useRouter();
  const [recurringType, setRecurringType] = useState<'expense' | 'income'>('expense');
  const [recurringAmount, setRecurringAmount] = useState('');
  const [recurringDescription, setRecurringDescription] = useState('');
  const [recurringCategory, setRecurringCategory] = useState('');
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [recurringDate, setRecurringDate] = useState('');

  const handleLogout = async () => {
    if (confirm('¿Cerrar sesión?')) {
      await signOut(auth);
      router.push('/');
    }
  };

  const handleCreateRecurring = () => {
    if (!recurringAmount || !recurringDescription) {
      alert('Completa todos los campos');
      return;
    }

    alert('Funcionalidad en desarrollo');
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', background: '#0f172a' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', margin: 0 }}>
          Configuración
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
          Gestiona tus gastos fijos y recurrentes
        </p>
      </div>

      {/* Formulario Recurrencia */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          borderRadius: '1rem',
          padding: '1.5rem',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          
          {/* Tipo */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setRecurringType('expense')}
              style={{
                flex: 1,
                height: '48px',
                borderRadius: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                background: recurringType === 'expense' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                color: recurringType === 'expense' ? 'white' : '#9ca3af'
              }}>
              📉 Gasto
            </button>
            <button
              onClick={() => setRecurringType('income')}
              style={{
                flex: 1,
                height: '48px',
                borderRadius: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                background: recurringType === 'income' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                color: recurringType === 'income' ? 'white' : '#9ca3af'
              }}>
              📈 Ingreso
            </button>
          </div>

          {/* Monto */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="number"
              value={recurringAmount}
              onChange={(e) => setRecurringAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                height: '56px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              value={recurringDescription}
              onChange={(e) => setRecurringDescription(e.target.value)}
              placeholder="Ej: Alquiler..."
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>

          {/* Cuenta */}
          <div style={{ marginBottom: '1rem' }}>
            <select
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <option>Cuenta Corriente</option>
              <option>Efectivo</option>
            </select>
          </div>

          {/* Categoría */}
          <div style={{ marginBottom: '1rem' }}>
            <select
              value={recurringCategory}
              onChange={(e) => setRecurringCategory(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <option value="">Seleccionar...</option>
              <option value="Vivienda">🏠 Vivienda</option>
              <option value="Transporte">🚗 Transporte</option>
              <option value="Servicios">💡 Servicios</option>
              <option value="Suscripciones">📺 Suscripciones</option>
            </select>
          </div>

          {/* Frecuencia */}
          <div style={{ marginBottom: '1rem' }}>
            <select
              value={recurringFrequency}
              onChange={(e) => setRecurringFrequency(e.target.value as any)}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          {/* Fecha */}
          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="date"
              value={recurringDate}
              onChange={(e) => setRecurringDate(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>

          {/* Botón Crear */}
          <button
            onClick={handleCreateRecurring}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
              border: 'none',
              cursor: 'pointer'
            }}>
            Crear Recurrencia
          </button>
        </div>
      </div>

      {/* Recurrencias Activas */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Recurrencias Activas
        </h2>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p style={{ color: '#9ca3af' }}>No hay recurrencias configuradas</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Crea tu primera recurrencia arriba
          </p>
        </div>
      </div>

      {/* Opciones adicionales */}
      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          style={{
            width: '100%',
            height: '56px',
            borderRadius: '1rem',
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer'
          }}>
          📊 Ver Estadísticas
        </button>
        
        <button
          style={{
            width: '100%',
            height: '56px',
            borderRadius: '1rem',
            color: 'white',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer'
          }}>
          📥 Exportar Datos
        </button>
        
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            cursor: 'pointer'
          }}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
