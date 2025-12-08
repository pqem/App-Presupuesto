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
      {/* HEADER - DISEÑO MAGICPATH */}
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '0.25rem', 
          margin: 0,
          marginBottom: '4px'
        }}>
          Transacciones
        </h1>
        <p style={{ 
          color: '#9ca3af', 
          fontSize: '0.875rem', 
          margin: 0 
        }}>
          {filteredTransactions.length} transacciones totales
        </p>
      </div>

      {/* BARRA DE BÚSQUEDA - DISEÑO MAGICPATH */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '1.25rem',
            pointerEvents: 'none'
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
              borderRadius: '12px',
              color: 'white',
              background: '#1e293b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* FILTROS - DISEÑO MAGICPATH */}
      <div style={{ 
        padding: '0 1.5rem', 
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '0.75rem'
      }}>
        {/* Filtro 1: Tipo */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          style={{
            flex: 1,
            height: '44px',
            padding: '0 1rem',
            borderRadius: '12px',
            color: 'white',
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">Todos los tipos</option>
          <option value="income">Ingresos</option>
          <option value="expense">Gastos</option>
        </select>

        {/* Filtro 2: Cuenta */}
        <select
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          style={{
            flex: 1,
            height: '44px',
            padding: '0 1rem',
            borderRadius: '12px',
            color: 'white',
            background: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">Todas las cuentas</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
      </div>

      {/* LISTA DE TRANSACCIONES - DISEÑO EXACTO MAGICPATH */}
      <div style={{ padding: '0 1.5rem' }}>
        {filteredTransactions.length === 0 ? (
          /* ESTADO VACÍO - DISEÑO MAGICPATH */
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem', margin: 0 }}>📭</p>
            <p style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: '600' }}>
              No hay transacciones
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Presiona + para agregar
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredTransactions.map((transaction) => {
              const account = accounts.find(a => a.id === transaction.accountId);
              const isIncome = transaction.type === 'income';
              
              return (
                <div 
                  key={transaction.id} 
                  style={{
                    borderRadius: '1rem',
                    padding: '1rem',
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* CONTENIDO PRINCIPAL DE LA TARJETA */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    marginBottom: '0.75rem'
                  }}>
                    
                    {/* CÍRCULO ICONO - DISEÑO MAGICPATH (48px) */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      // Verde para ingresos, Rojo para gastos
                      background: isIncome ? '#10b981' : '#ef4444',
                      color: 'white'
                    }}>
                      {isIncome ? '↓' : '↑'}
                    </div>

                    {/* INFO CENTRO */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Descripción - blanco, bold */}
                      <p style={{ 
                        color: 'white', 
                        fontWeight: 'bold',
                        margin: 0,
                        marginBottom: '4px',
                        fontSize: '1rem'
                      }}>
                        {transaction.description}
                      </p>
                      
                      {/* Fecha + Cuenta - gris, pequeño */}
                      <p style={{ 
                        color: '#9ca3af', 
                        fontSize: '0.875rem',
                        margin: 0
                      }}>
                        {formatDate(transaction.date)} • {account?.name || 'Sin cuenta'}
                      </p>
                    </div>

                    {/* MONTO DERECHA - grande, bold */}
                    <div style={{ 
                      color: isIncome ? '#10b981' : 'white',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                  </div>

                  {/* DOS BOTONES - DISEÑO MAGICPATH */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px'
                  }}>
                    {/* Botón EDITAR - Azul #3b82f6 */}
                    <button
                      onClick={() => handleEdit(transaction)}
                      style={{
                        flex: 1,
                        height: '44px',
                        borderRadius: '0.75rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'white',
                        background: '#3b82f6',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>✏️</span>
                      <span>Editar</span>
                    </button>

                    {/* Botón ELIMINAR - Rojo #ef4444 */}
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      style={{
                        flex: 1,
                        height: '44px',
                        borderRadius: '0.75rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'white',
                        background: '#ef4444',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>🗑️</span>
                      <span>Eliminar</span>
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
