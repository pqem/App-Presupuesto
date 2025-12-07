"use client";

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStorage } from '@/context/StorageContext';

export default function SettingsPageNew() {
  const router = useRouter();
  const { household, user, addRecurring, accounts, categories } = useStorage();
  const [recurringType, setRecurringType] = useState<'expense' | 'income'>('expense');
  const [recurringAmount, setRecurringAmount] = useState('');
  const [recurringDescription, setRecurringDescription] = useState('');
  const [recurringCategory, setRecurringCategory] = useState('');
  const [recurringAccount, setRecurringAccount] = useState('');
  const [recurringFrequency, setRecurringFrequency] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [recurringDate, setRecurringDate] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  const handleLogout = async () => {
    if (confirm('¿Cerrar sesión?')) {
      await signOut(auth);
      router.push('/');
    }
  };

  const copyInviteCode = () => {
    if (household?.inviteCode) {
      navigator.clipboard.writeText(household.inviteCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
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
      {/* Header */}
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', margin: 0 }}>
          Configuración
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
          Ajustes de cuenta y hogar
        </p>
      </div>

      {/* Household Info */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          borderRadius: '1rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🏠</span>
            <div>
              <h2 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
                {household?.name || 'Mi Hogar'}
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                {household?.members?.length || 1} miembro(s)
              </p>
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0 0 0.5rem 0' }}>
              Código de invitación para tu pareja:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                color: '#8b5cf6',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                fontFamily: 'monospace'
              }}>
                {household?.inviteCode || '------'}
              </span>
              <button
                onClick={copyInviteCode}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  background: codeCopied ? '#10b981' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'background 0.2s'
                }}
              >
                {codeCopied ? '✓ Copiado' : '📋 Copiar'}
              </button>
            </div>
          </div>

          <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0 }}>
            Comparte este código para que tu pareja pueda unirse y ver/editar las mismas finanzas.
          </p>
        </div>
      </div>

      {/* Formulario Recurrencia */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Nueva Recurrencia
        </h2>
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
            <label style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>Monto *</label>
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
                fontSize: '1.125rem',
                fontWeight: 'bold',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>Descripción *</label>
            <input
              type="text"
              value={recurringDescription}
              onChange={(e) => setRecurringDescription(e.target.value)}
              placeholder="Ej: Alquiler, Netflix..."
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
            <label style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>Cuenta *</label>
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
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              <option value="">Seleccionar cuenta...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>Categoría</label>
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
              {categories.filter(c => c.type === recurringType).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          {/* Frecuencia */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>Frecuencia</label>
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
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </select>
          </div>

          {/* Fecha Inicio */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem', display: 'block' }}>Fecha de inicio</label>
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
            ➕ Crear Recurrencia
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          borderRadius: '1rem',
          padding: '1rem',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}>
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{user?.displayName || 'Usuario'}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ padding: '0 1.5rem' }}>
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
