"use client";

import TransactionForm from "@/components/TransactionForm";
import { useStorage } from "@/context/StorageContext";
import { formatCurrency } from "@/utils/format";

export default function TransactionsPage() {
    const { transactions, categories, accounts } = useStorage();

    const getCategoryName = (id?: string) => {
        return categories.find(c => c.id === id)?.name || 'Sin categoría';
    };

    const getAccountName = (id: string) => {
        return accounts.find(a => a.id === id)?.name || 'Cuenta desconocida';
    };

    return (
        <div className="transactions-layout" style={{ display: 'grid', gap: '2rem' }}>
            <style jsx>{`
        .transactions-layout {
          grid-template-columns: 1fr 350px;
        }
        @media (max-width: 1024px) {
          .transactions-layout {
            grid-template-columns: 1fr;
          }
          .form-container {
            order: -1; /* Form first on mobile */
          }
        }
      `}</style>

            <div className="form-container">
                <TransactionForm />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <header>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Historial</h1>
                </header>

                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    {/* Desktop Table */}
                    <table className="desktop-only" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Fecha</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Descripción</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Categoría</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Cuenta</th>
                                <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice().reverse().map(t => (
                                <tr key={t.id} style={{ borderTop: '1px solid var(--border-light)' }}>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile List */}
                    <div className="mobile-only" style={{ flexDirection: 'column' }}>
                        {transactions.slice().reverse().map(t => (
                            <div key={t.id} style={{
                                padding: '1rem',
                                borderBottom: '1px solid var(--border-light)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
