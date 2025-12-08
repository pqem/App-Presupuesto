"use client";

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStorage } from '@/context/StorageContext';

export default function SettingsPageNew() {
  const router = useRouter();
  const { accounts, addRecurring, recurringTransactions } = useStorage();
  const [recurringType, setRecurringType] = useState<'expense' | 'income'>('expense');
  const [recurringAmount, setRecurringAmount] = useState('');
  const [recurringDescription, setRecurringDescription] = useState('');
  const [recurringCategory, setRecurringCategory] = useState('');
  const [recurringAccount, setRecurringAccount] = useState('');
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [recurringDate, setRecurringDate] = useState('');

  const handleLogout = async () => {
    if (confirm('¿Cerrar sesión?')) {
      await signOut(auth);
      router.push('/');
    }
  };

  const handleCreateRecurring = async () => {
    if (!recurringAmount || !recurringDescription || !recurringAccount) {
      alert('Completa todos los campos requeridos');
      return;
    }

    await addRecurring({
      transactionTemplate: {
        amount: parseFloat(recurringAmount),
        description: recurringDescription,
        type: recurringType,
        categoryId: recurringCategory || undefined,
        accountId: recurringAccount,
        date: recurringDate || new Date().toISOString().split('T')[0]
      },
      frequency: recurringFrequency,
      startDate: recurringDate || new Date().toISOString().split('T')[0],
      active: true
    });

    // Reset form
    setRecurringAmount('');
    setRecurringDescription('');
    setRecurringCategory('');
    setRecurringDate('');
    alert('¡Recurrencia creada!');
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', background: '#0f172a' }}>
      {/* HEADER - DISEÑO MAGICPATH */}
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          margin: 0 
        }}>
          Configuración
        </h1>
      </div>

      {/* SECCIÓN: GASTOS RECURRENTES - DISEÑO MAGICPATH */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ 
          color: 'white', 
          fontSize: '1.125rem', 
          fontWeight: 600, 
          marginBottom: '1rem',
          margin: 0,
          marginBottom: '16px'
        }}>
          Gastos Recurrentes
        </h2>

        {/* FORMULARIO */}
        <div style={{
          borderRadius: '1rem',
          padding: '1.5rem',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          
          {/* Toggle Tipo: Gasto / Ingreso */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem', 
              marginBottom: '0.5rem', 
              display: 'block' 
            }}>
              Tipo
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setRecurringType('expense')}
                style={{
                  flex: 1,
                  height: '44px',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: recurringType === 'expense' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                  color: recurringType === 'expense' ? 'white' : '#9ca3af'
                }}
              >
                Gasto
              </button>
              <button
                onClick={() => setRecurringType('income')}
                style={{
                  flex: 1,
                  height: '44px',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: recurringType === 'income' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                  color: recurringType === 'income' ? 'white' : '#9ca3af'
                }}
              >
                Ingreso
              </button>
            </div>
          </div>

          {/* Campo Monto */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem', 
              marginBottom: '0.5rem', 
              display: 'block' 
            }}>
              Monto
            </label>
            <input
              type="number"
              value={recurringAmount}
              onChange={(e) => setRecurringAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem', 
              marginBottom: '0.5rem', 
              display: 'block' 
            }}>
              Descripción
            </label>
            <input
              type="text"
              value={recurringDescription}
              onChange={(e) => setRecurringDescription(e.target.value)}
              placeholder="Ej: Alquiler, Suscripción..."
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Cuenta */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem', 
              marginBottom: '0.5rem', 
              display: 'block' 
            }}>
              Cuenta
            </label>
            <select
              value={recurringAccount}
              onChange={(e) => setRecurringAccount(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleccionar cuenta...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Categoría - CON ICONOS MAGICPATH */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem', 
              marginBottom: '0.5rem', 
              display: 'block' 
            }}>
              Categoría
            </label>
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
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleccionar...</option>
              <option value="Vivienda">🏠 Vivienda</option>
              <option value="Transporte">🚗 Transporte</option>
              <option value="Servicios">💡 Servicios</option>
              <option value="Entretenimiento">📺 Entretenimiento</option>
            </select>
          </div>

          {/* Frecuencia - DISEÑO MAGICPATH */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem', 
              marginBottom: '0.5rem', 
              display: 'block' 
            }}>
              Frecuencia
            </label>
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
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1rem'
              }}
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          {/* Fecha inicio */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem', 
              marginBottom: '0.5rem', 
              display: 'block' 
            }}>
              Fecha de inicio
            </label>
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
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Botón Crear Recurrencia */}
          <button
            onClick={handleCreateRecurring}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '1.125rem',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Crear Recurrencia
          </button>
        </div>
      </div>

      {/* LISTA: RECURRENCIAS ACTIVAS - DISEÑO MAGICPATH */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ 
          color: 'white', 
          fontSize: '1.125rem', 
          fontWeight: 600, 
          marginBottom: '1rem',
          margin: 0,
          marginBottom: '16px'
        }}>
          Recurrencias Activas
        </h2>

        {(!recurringTransactions || recurringTransactions.length === 0) ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            borderRadius: '1rem',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem', margin: 0 }}>📅</p>
            <p style={{ color: '#9ca3af', margin: 0 }}>
              No hay recurrencias configuradas
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recurringTransactions.map((recurring, index) => (
              <div 
                key={index}
                style={{
                  borderRadius: '1rem',
                  padding: '1rem',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                {/* Icono categoría */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  🏠
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    {recurring.transactionTemplate.description}
                  </p>
                  <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    {recurring.frequency === 'daily' ? 'Diario' : recurring.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
                  </p>
                </div>

                {/* Monto */}
                <div style={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.125rem'
                }}>
                  ${recurring.transactionTemplate.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OPCIONES ADICIONALES - DISEÑO MAGICPATH */}
      <div style={{ padding: '0 1.5rem' }}>
        <h2 style={{ 
          color: 'white', 
          fontSize: '1.125rem', 
          fontWeight: 600, 
          marginBottom: '1rem',
          margin: 0,
          marginBottom: '16px'
        }}>
          Otras Opciones
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Ver Estadísticas */}
          <button
            onClick={() => router.push('/stats')}
            style={{
              height: '56px',
              borderRadius: '1rem',
              padding: '0 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📊</span>
              <span style={{ fontWeight: 600 }}>Ver Estadísticas</span>
            </div>
            <span style={{ color: '#9ca3af' }}>›</span>
          </button>

          {/* Exportar Datos */}
          <button
            onClick={() => alert('Función próximamente')}
            style={{
              height: '56px',
              borderRadius: '1rem',
              padding: '0 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📥</span>
              <span style={{ fontWeight: 600 }}>Exportar Datos</span>
            </div>
            <span style={{ color: '#9ca3af' }}>›</span>
          </button>

          {/* Cerrar Sesión - ROJO */}
          <button
            onClick={handleLogout}
            style={{
              height: '56px',
              borderRadius: '1rem',
              padding: '0 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              color: '#fca5a5'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚪</span>
              <span style={{ fontWeight: 600 }}>Cerrar Sesión</span>
            </div>
            <span style={{ color: '#ef4444' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
