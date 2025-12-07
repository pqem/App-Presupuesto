"use client";

import { useStorage } from '@/context/StorageContext';
import { useUi } from '@/context/UiContext';
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';

export default function TransactionModalNew() {
  const { accounts, addTransaction, updateTransaction } = useStorage();
  const { isTransactionModalOpen, closeTransactionModal, transactionToEdit } = useUi();

  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  // Cargar datos si está editando
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type as any);
      setAmount(transactionToEdit.amount.toString());
      setDescription(transactionToEdit.description);
      setAccountId(transactionToEdit.accountId);
      setCategory(transactionToEdit.categoryId || '');
      setDate(transactionToEdit.date);
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setAccountId(accounts[0]?.id || '');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [transactionToEdit, accounts]);

  const handleSubmit = async () => {
    if (!amount || !description || !accountId) {
      alert('Completa todos los campos');
      return;
    }

    const data: Partial<Transaction> = {
      type: type as any,
      amount: parseFloat(amount),
      description,
      accountId,
      categoryId: category || undefined,
      date
    };

    if (transactionToEdit) {
      await updateTransaction(transactionToEdit.id, data);
    } else {
      await addTransaction(data as any);
    }

    closeTransactionModal();
  };

  if (!isTransactionModalOpen) return null;

  return (
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
      onClick={closeTransactionModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '28rem',
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          borderBottomLeftRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
          overflow: 'hidden',
          background: '#1e293b',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>

        {/* Header */}
        <div style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
            {transactionToEdit ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button
            onClick={closeTransactionModal}
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

        {/* Contenido */}
        <div style={{ padding: '1.5rem' }}>

          {/* Tipo de transacción */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setType('expense')}
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
                background: type === 'expense' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                color: type === 'expense' ? 'white' : '#9ca3af',
                transition: 'all 0.2s'
              }}>
              📉 Gasto
            </button>
            <button
              onClick={() => setType('income')}
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
                background: type === 'income' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                color: type === 'income' ? 'white' : '#9ca3af',
                transition: 'all 0.2s'
              }}>
              📈 Ingreso
            </button>
            <button
              onClick={() => setType('transfer')}
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
                background: type === 'transfer' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.05)',
                color: type === 'transfer' ? 'white' : '#9ca3af',
                transition: 'all 0.2s'
              }}>
              🔄 Transferencia
            </button>
          </div>

          {/* Monto */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              💵 Monto
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                height: '56px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              📝 Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Supermercado, Salario..."
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
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              💳 Cuenta
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 1rem',
                borderRadius: '0.75rem',
                color: 'white',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              🏷️ Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              <option value="Comida">🍽️ Comida</option>
              <option value="Transporte">🚗 Transporte</option>
              <option value="Vivienda">🏠 Vivienda</option>
              <option value="Entretenimiento">🎮 Entretenimiento</option>
              <option value="Salud">💊 Salud</option>
              <option value="Educación">📚 Educación</option>
              <option value="Otros">📦 Otros</option>
            </select>
          </div>

          {/* Fecha */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              📅 Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

          {/* Botón Guardar */}
          <button
            onClick={handleSubmit}
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
            }}>
            💾 Guardar Transacción
          </button>
        </div>
      </div>
    </div>
  );
}
