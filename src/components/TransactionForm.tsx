"use client";

import { useState, useEffect } from 'react';
import { useStorage } from '@/context/StorageContext';
import { Transaction, TransactionType } from '@/types';

interface TransactionFormProps {
    onClose?: () => void;
    editingTransaction?: Transaction | null;
    onCancelEdit?: () => void;
}

export default function TransactionForm({ onClose, editingTransaction, onCancelEdit }: TransactionFormProps) {
    const { addTransaction, updateTransaction, categories, accounts } = useStorage();

    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState(accounts[0]?.id || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Cargar datos de la transacción en edición
    useEffect(() => {
        if (editingTransaction) {
            setType(editingTransaction.type);
            setAmount(editingTransaction.amount.toString());
            setDescription(editingTransaction.description);
            setCategoryId(editingTransaction.categoryId || '');
            setAccountId(editingTransaction.accountId);
            setDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
        }
    }, [editingTransaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !description || !accountId) return;

        const transactionData = {
            amount: parseFloat(amount),
            description,
            type,
            categoryId: type === 'transfer' ? undefined : categoryId,
            accountId,
            date: new Date(date).toISOString(),
        };

        if (editingTransaction) {
            // Actualizar transacción existente
            await updateTransaction(editingTransaction.id, transactionData);
            if (onCancelEdit) onCancelEdit();
        } else {
            // Crear nueva transacción
            await addTransaction(transactionData);
        }

        // Reset form
        resetForm();
        if (onClose) onClose();
    };

    const resetForm = () => {
        setAmount('');
        setDescription('');
        setCategoryId('');
        setType('expense');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleCancel = () => {
        resetForm();
        if (onCancelEdit) onCancelEdit();
    };

    const filteredCategories = categories.filter(c => c.type === type);

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {editingTransaction ? '✏️ Editar Transacción' : '➕ Nueva Transacción'}
                </h2>
                {editingTransaction && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--accent-danger)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        ❌ Cancelar
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                {(['expense', 'income', 'transfer'] as TransactionType[]).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-medium)',
                            background: type === t ? 'var(--accent-primary)' : 'transparent',
                            color: type === t ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: type === t ? 600 : 400
                        }}
                    >
                        {t === 'expense' ? '💸 Gasto' : t === 'income' ? '💰 Ingreso' : '🔄 Transferencia'}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    💵 Monto
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    required
                    style={{
                        padding: '1rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        fontSize: '1.25rem',
                        fontWeight: 600
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    📝 Descripción
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Supermercado, Salario..."
                    required
                    style={{
                        padding: '1rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        color: 'white'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: type !== 'transfer' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        🏦 Cuenta
                    </label>
                    <select
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        required
                        style={{
                            padding: '1rem',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white'
                        }}
                    >
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>
                </div>

                {type !== 'transfer' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            🏷️ Categoría
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            style={{
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-medium)',
                                borderRadius: 'var(--radius-md)',
                                color: 'white'
                            }}
                        >
                            <option value="">Seleccionar...</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    📅 Fecha
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                        padding: '1rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        color: 'white'
                    }}
                />
            </div>

            <button
                type="submit"
                style={{
                    padding: '1rem',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {editingTransaction ? '💾 Actualizar Transacción' : '➕ Guardar Transacción'}
            </button>
        </form>
    );
}
