"use client";

import { useState } from 'react';
import { useStorage } from '@/context/StorageContext';
import { Account } from '@/types';
import { formatCurrency } from '@/utils/format';

interface PayCardModalProps {
    account: Account;
    currentDebt: number;
    onClose: () => void;
}

export default function PayCardModal({ account, currentDebt, onClose }: PayCardModalProps) {
    const { accounts, addTransaction } = useStorage();
    const [amount, setAmount] = useState(currentDebt.toString());
    const [sourceAccountId, setSourceAccountId] = useState('');

    // Filter accounts to show only valid funding sources (Cash or Bank)
    const fundingAccounts = accounts.filter(a => a.type === 'cash' || a.type === 'bank');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceAccountId || !amount) return;

        addTransaction({
            amount: parseFloat(amount),
            description: `Pago Tarjeta ${account.name}`,
            type: 'transfer',
            accountId: sourceAccountId, // From Bank/Cash
            toAccountId: account.id,    // To Credit Card (reduces debt)
            date: new Date().toISOString(),
        });

        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                background: 'var(--bg-secondary)'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Pagar {account.name}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Monto a Pagar</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
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
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Deuda total: {formatCurrency(currentDebt)}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pagar desde</label>
                        <select
                            value={sourceAccountId}
                            onChange={(e) => setSourceAccountId(e.target.value)}
                            required
                            style={{
                                padding: '1rem',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-medium)',
                                borderRadius: 'var(--radius-md)',
                                color: 'white'
                            }}
                        >
                            <option value="">Seleccionar cuenta...</option>
                            {fundingAccounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'transparent',
                                border: '1px solid var(--border-medium)',
                                color: 'var(--text-secondary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'var(--accent-success)',
                                border: 'none',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Confirmar Pago
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
