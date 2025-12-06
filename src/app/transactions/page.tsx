"use client";

import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import { useStorage } from "@/context/StorageContext";
import { formatCurrency } from "@/utils/format";
import { Transaction } from "@/types";

export default function TransactionsPage() {
    const { transactions, categories, accounts, deleteTransaction } = useStorage();
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [filterAccount, setFilterAccount] = useState<string>('all');

    const getCategoryName = (id?: string) => {
        return categories.find(c => c.id === id)?.name || 'Sin categoría';
    };

    const getAccountName = (id: string) => {
        return accounts.find(a => a.id === id)?.name || 'Cuenta desconocida';
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
            await deleteTransaction(id);
        }
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Filtrar transacciones
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesAccount = filterAccount === 'all' || t.accountId === filterAccount;
        return matchesSearch && matchesType && matchesAccount;
    });

    return (
        <div className="transactions-layout" style={{ display: 'grid', gap: '2rem' }}>
            <style jsx>{`
                .transactions-layout {
                    grid-template-columns: 1fr 400px;
                }
                @media (max-width: 1024px) {
                    .transactions-layout {
                        grid-template-columns: 1fr;
                    }
                    .form-container {
                        order: -1;
                    }
                }
            `}</style>

            {/* Sección de filtros y lista */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <header>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Transacciones</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {filteredTransactions.length} de {transactions.length} transacciones
                    </p>
                </header>

                {/* Filtros */}
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Búsqueda */}
                    <input
                        type="text"
                        placeholder="🔍 Buscar por descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-lg)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            width: '100%'
                        }}
                    />

                    {/* Filtros por tipo y cuenta */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--text-primary)',
                                flex: 1
                            }}
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="income">Ingresos</option>
                            <option value="expense">Gastos</option>
                        </select>

                        <select
                            value={filterAccount}
                            onChange={(e) => setFilterAccount(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--text-primary)',
                                flex: 1
                            }}
                        >
                            <option value="all">Todas las cuentas</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Lista de transacciones */}
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    {filteredTransactions.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
                            <p>No se encontraron transacciones</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <table className="desktop-only" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Fecha</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Descripción</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Categoría</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Cuenta</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Monto</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.slice().reverse().map(t => (
                                        <tr key={t.id} style={{ 
                                            borderTop: '1px solid var(--border-light)',
                                            transition: 'background 0.2s'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '1rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem', fontWeight: 500 }}>{t.description}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {getCategoryName(t.categoryId)}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{getAccountName(t.accountId)}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: t.type === 'income' ? 'var(--accent-success)' : 'var(--text-primary)' }}>
                                                {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => handleEdit(t)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            background: 'var(--accent-info)',
                                                            border: 'none',
                                                            borderRadius: 'var(--radius-md)',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(t.id)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            background: 'var(--accent-danger)',
                                                            border: 'none',
                                                            borderRadius: 'var(--radius-md)',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile List */}
                            <div className="mobile-only" style={{ flexDirection: 'column' }}>
                                {filteredTransactions.slice().reverse().map(t => (
                                    <div key={t.id} style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border-light)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <span style={{ fontWeight: 500 }}>{t.description}</span>
                                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    <span>{new Date(t.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{getCategoryName(t.categoryId)}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{
                                                    fontWeight: 600,
                                                    color: t.type === 'income' ? 'var(--accent-success)' : 'var(--text-primary)',
                                                    display: 'block'
                                                }}>
                                                    {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {getAccountName(t.accountId)}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(t)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    background: 'var(--accent-info)',
                                                    border: 'none',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    background: 'var(--accent-danger)',
                                                    border: 'none',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Formulario */}
            <div className="form-container">
                <TransactionForm 
                    editingTransaction={editingTransaction}
                    onCancelEdit={() => setEditingTransaction(null)}
                />
            </div>
        </div>
    );
}
