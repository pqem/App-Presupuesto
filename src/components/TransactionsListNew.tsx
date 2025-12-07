"use client";

import { useStorage } from '@/context/StorageContext';
import { useUi } from '@/context/UiContext';
import { formatCurrency, formatDate } from '@/utils/format';
import { useState, useMemo } from 'react';
import { Transaction } from '@/types';

export default function TransactionsListNew() {
  const { transactions, accounts, deleteTransaction } = useStorage();
  const { openTransactionModal, setTransactionToEdit } = useUi();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  // Filtrar transacciones
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesAccount = filterAccount === 'all' || t.accountId === filterAccount;
      
      return matchesSearch && matchesType && matchesAccount;
    });
  }, [transactions, searchTerm, filterType, filterAccount]);

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    openTransactionModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta transacción?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', background: '#0f172a' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', margin: 0 }}>
          Transacciones
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
          {filteredTransactions.length} transacciones totales
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '1.25rem'
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              paddingLeft: '3rem',
              paddingRight: '1rem',
              borderRadius: '0.75rem',
              color: 'white',
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Filtros */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          style={{
            flex: 1,
            height: '44px',
            padding: '0 1rem',
            borderRadius: '0.75rem',
            color: 'white',
            fontSize: '0.875rem',
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
          <option value="all">Todos los tipos</option>
          <option value="income">Ingresos</option>
          <option value="expense">Gastos</option>
        </select>

        <select
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          style={{
            flex: 1,
            height: '44px',
            padding: '0 1rem',
            borderRadius: '0.75rem',
            color: 'white',
            fontSize: '0.875rem',
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
          <option value="all">Todas las cuentas</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
      </div>

      {/* Lista */}
      <div style={{ padding: '0 1.5rem' }}>
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '0.5rem' }}>No hay transacciones</p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Usa el botón + para agregar una</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTransactions.map(t => {
              const account = accounts.find(a => a.id === t.accountId);
              
              return (
                <div key={t.id} style={{
                  borderRadius: '1rem',
                  padding: '1rem',
                  background: 'rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    {/* Icono */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.125rem',
                      backgroundColor: t.type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: t.type === 'income' ? '#34d399' : '#f87171'
                    }}>
                      {t.type === 'income' ? '↓' : '↑'}
                    </div>

                    {/* Detalles */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', margin: 0, marginBottom: '0.125rem' }}>
                        {t.description}
                      </h3>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>
                        {formatDate(t.date)} • {account?.name || 'Sin cuenta'}
                      </p>
                    </div>

                    {/* Monto */}
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        margin: 0,
                        color: t.type === 'income' ? '#34d399' : 'white'
                      }}>
                        {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Botones */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(t)}
                      style={{
                        flex: 1,
                        height: '44px',
                        borderRadius: '0.75rem',
                        fontWeight: 500,
                        color: 'white',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: '#3b82f6',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{
                        flex: 1,
                        height: '44px',
                        borderRadius: '0.75rem',
                        fontWeight: 500,
                        color: 'white',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: '#ef4444',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
