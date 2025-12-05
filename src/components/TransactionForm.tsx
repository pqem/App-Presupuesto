"use client";

import { useState } from 'react';
import { useStorage } from '@/context/StorageContext';
import { TransactionType } from '@/types';

export default function TransactionForm({ onClose }: { onClose?: () => void }) {
    const { addTransaction, categories, accounts } = useStorage();

    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState(accounts[0]?.id || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !description || !accountId) return;

        addTransaction({
            amount: parseFloat(amount),
            description,
            type,
            categoryId: type === 'transfer' ? undefined : categoryId,
            accountId,
            date: new Date(date).toISOString(),
        });

        // Reset form
        setAmount('');
        setDescription('');
        if (onClose) onClose();
    };

    const filteredCategories = categories.filter(c => c.type === type);

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Nueva Transacción</h2>

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
                            transition: 'all 0.2s'
                        }}
                    >
                        {t === 'expense' ? 'Gasto' : t === 'income' ? 'Ingreso' : 'Transferencia'}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Monto</label>
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
                        fontSize: '1.25rem'
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Descripción</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Supermercado"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cuenta</label>
                    <select
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
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
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Categoría</label>
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
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Fecha</label>
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
                    marginTop: '1rem'
                }}
            >
                Guardar Transacción
            </button>
        </form>
    );
}
