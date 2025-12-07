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
      balance: parseFloat(newAccountBalance),
      currency: 'USD'
    } as any);

    setNewAccountName('');
    setNewAccountBalance('');
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
      {/* Header */}
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', margin: 0 }}>
          Mis Cuentas
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Efectivo y Bancos</p>
      </div>

      {/* Efectivo y Bancos */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Efectivo y Bancos
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cashAccounts.map(acc => (
            <div key={acc.id} style={{
              borderRadius: '1rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '0.75rem',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                💵
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', fontWeight: 600, margin: 0, marginBottom: '0.25rem' }}>
                  {acc.name}
                </h3>
                <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                  {formatCurrency(acc.balance || acc.currentBalance || 0)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(acc.id)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                🗑️
              </button>
            </div>
          ))}

          {bankAccounts.map(acc => (
            <div key={acc.id} style={{
              borderRadius: '1rem',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '0.75rem',
                background: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🏦
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: 'white', fontWeight: 600, margin: 0, marginBottom: '0.25rem' }}>
                  {acc.name}
                </h3>
                <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                  {formatCurrency(acc.balance || acc.currentBalance || 0)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(acc.id)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tarjetas de Crédito */}
      {creditAccounts.length > 0 && (
        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Tarjetas de Crédito
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {creditAccounts.map(acc => {
              const limit = acc.limit || 500000;
              const currentBalance = acc.balance || acc.currentBalance || 0;
              const available = limit - Math.abs(currentBalance);
              
              return (
                <div key={acc.id} style={{
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, #f97316, #dc2626)',
                  boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem', margin: 0 }}>
                      {acc.name}
                    </h3>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                      🗑️
                    </button>
                  </div>
                  
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    Cierra el 25/12/2025
                  </p>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      Deuda Actual
                    </p>
                    <p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                      {formatCurrency(Math.abs(currentBalance))}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <div>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Disponible:</p>
                      <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{formatCurrency(available)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>Límite:</p>
                      <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{formatCurrency(limit)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón Agregar */}
      <div style={{ padding: '0 1.5rem' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: '1rem',
            fontWeight: 'bold',
            color: 'white',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            border: 'none',
            cursor: 'pointer'
          }}>
          + Agregar Cuenta
        </button>
      </div>

      {/* Modal Agregar Cuenta */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '1rem'
        }}
        onClick={() => setShowAddModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '28rem',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              background: '#1e293b'
            }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Nueva Cuenta
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Ej: Efectivo, Banco..."
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

              <div>
                <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                  Tipo
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setNewAccountType('cash')}
                    style={{
                      flex: 1,
                      height: '40px',
                      borderRadius: '0.5rem',
                      background: newAccountType === 'cash' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                    💵 Efectivo
                  </button>
                  <button
                    onClick={() => setNewAccountType('bank')}
                    style={{
                      flex: 1,
                      height: '40px',
                      borderRadius: '0.5rem',
                      background: newAccountType === 'bank' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                    🏦 Banco
                  </button>
                  <button
                    onClick={() => setNewAccountType('credit')}
                    style={{
                      flex: 1,
                      height: '40px',
                      borderRadius: '0.5rem',
                      background: newAccountType === 'credit' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                    💳 Crédito
                  </button>
                </div>
              </div>

              <div>
                <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                  Saldo Inicial
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

              <button
                onClick={handleAddAccount}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
