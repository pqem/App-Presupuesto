"use client";

import { useStorage } from '@/context/StorageContext';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';

export default function AccountsPageNew() {
  const { accounts, addAccount, deleteAccount } = useStorage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'cash' | 'bank' | 'credit'>('cash');
  const [newAccountBalance, setNewAccountBalance] = useState('');
  const [newCreditLimit, setNewCreditLimit] = useState('');

  const handleAddAccount = async () => {
    if (!newAccountName || !newAccountBalance) {
      alert('Completa todos los campos');
      return;
    }

    await addAccount({
      id: Date.now().toString(),
      name: newAccountName,
      type: newAccountType,
      initialBalance: parseFloat(newAccountBalance),
      currentBalance: parseFloat(newAccountBalance),
      currency: 'USD',
      color: '#8b5cf6',
      limit: newAccountType === 'credit' ? parseFloat(newCreditLimit || '0') : undefined
    });

    setNewAccountName('');
    setNewAccountBalance('');
    setNewCreditLimit('');
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta cuenta?')) {
      await deleteAccount(id);
    }
  };

  // Separar cuentas por tipo
  const cashAccounts = accounts.filter(a => a.type === 'cash');
  const bankAccounts = accounts.filter(a => a.type === 'bank');
  const creditAccounts = accounts.filter(a => a.type === 'credit');

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
          Mis Cuentas
        </h1>
      </div>

      {/* SECCIÓN 1: EFECTIVO Y BANCOS - DISEÑO MAGICPATH */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ 
          color: '#9ca3af', 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          margin: 0,
          marginBottom: '12px'
        }}>
          Efectivo y Bancos
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* EFECTIVO - Verde */}
          {cashAccounts.map(account => (
            <div 
              key={account.id}
              style={{
                borderRadius: '1rem',
                padding: '1.25rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              {/* Icono grande */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0
              }}>
                💵
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '1.125rem',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {account.name}
                </p>
                <p style={{ 
                  color: '#10b981', 
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {formatCurrency(account.currentBalance)}
                </p>
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(account.id)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}
              >
                🗑️
              </button>
            </div>
          ))}

          {/* BANCO - Azul */}
          {bankAccounts.map(account => (
            <div 
              key={account.id}
              style={{
                borderRadius: '1rem',
                padding: '1.25rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              {/* Icono grande */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0
              }}>
                🏦
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '1.125rem',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {account.name}
                </p>
                <p style={{ 
                  color: 'white', 
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {formatCurrency(account.currentBalance)}
                </p>
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => handleDelete(account.id)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: TARJETAS DE CRÉDITO - DISEÑO MAGICPATH */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ 
          color: '#9ca3af', 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          margin: 0,
          marginBottom: '12px'
        }}>
          Tarjetas de Crédito
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {creditAccounts.map(account => {
            const debt = Math.abs(account.currentBalance);
            const limit = account.creditLimit || 0;
            const available = limit - debt;

            return (
              <div 
                key={account.id}
                style={{
                  borderRadius: '16px',
                  padding: '24px',
                  background: 'linear-gradient(135deg, #f97316, #dc2626)',
                  boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)',
                  position: 'relative'
                }}
              >
                {/* Nombre arriba izquierda */}
                <p style={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '1.125rem',
                  margin: 0,
                  marginBottom: '16px'
                }}>
                  {account.name}
                </p>

                {/* Balance grande centrado */}
                <p style={{ 
                  color: 'white', 
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  margin: 0,
                  marginBottom: '16px'
                }}>
                  {formatCurrency(debt)}
                </p>

                {/* Detalles */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                    Deuda:
                  </span>
                  <span style={{ color: '#fca5a5', fontWeight: '600', fontSize: '0.875rem' }}>
                    {formatCurrency(debt)}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                    Disponible:
                  </span>
                  <span style={{ color: '#6ee7b7', fontWeight: '600', fontSize: '0.875rem' }}>
                    {formatCurrency(available)}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                    Límite:
                  </span>
                  <span style={{ color: '#9ca3af', fontWeight: '600', fontSize: '0.875rem' }}>
                    {formatCurrency(limit)}
                  </span>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => handleDelete(account.id)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.125rem'
                  }}
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTÓN AGREGAR - DISEÑO MAGICPATH */}
      <div style={{ padding: '0 1.5rem' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: '1rem',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            color: 'white',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + Agregar Cuenta
        </button>
      </div>

      {/* MODAL AGREGAR CUENTA - DISEÑO MAGICPATH (ARREGLADO) */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto',
            paddingTop: '3rem',
            paddingBottom: '3rem'
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '28rem',
              borderRadius: '1.5rem',
              background: '#1e293b',
              padding: '1.5rem',
              maxHeight: 'calc(100vh - 6rem)',
              overflowY: 'auto'
            }}
          >
            <h2 style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              margin: 0,
              marginBottom: '24px'
            }}>
              Nueva Cuenta
            </h2>

            {/* Nombre */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                color: '#9ca3af', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem', 
                display: 'block' 
              }}>
                Nombre de cuenta
              </label>
              <input
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Ej: Efectivo, Banco Nación..."
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

            {/* Tipo */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                color: '#9ca3af', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem', 
                display: 'block' 
              }}>
                Tipo
              </label>
              <select
                value={newAccountType}
                onChange={(e) => setNewAccountType(e.target.value as any)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 1rem',
                  borderRadius: '0.75rem',
                  color: 'white',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <option value="cash">💵 Efectivo</option>
                <option value="bank">🏦 Banco</option>
                <option value="credit">💳 Tarjeta de Crédito</option>
              </select>
            </div>

            {/* Balance inicial */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                color: '#9ca3af', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem', 
                display: 'block' 
              }}>
                {newAccountType === 'credit' ? 'Deuda actual' : 'Balance inicial'}
              </label>
              <input
                type="number"
                value={newAccountBalance}
                onChange={(e) => setNewAccountBalance(e.target.value)}
                placeholder="0.00"
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

            {/* Límite de crédito (solo para tarjetas) */}
            {newAccountType === 'credit' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  color: '#9ca3af', 
                  fontSize: '0.875rem', 
                  marginBottom: '0.5rem', 
                  display: 'block' 
                }}>
                  Límite de crédito
                </label>
                <input
                  type="number"
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(e.target.value)}
                  placeholder="0.00"
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
            )}

            {/* Botón Crear */}
            <button
              onClick={handleAddAccount}
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
              Crear Cuenta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
