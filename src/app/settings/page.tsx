"use client";

import RecurringForm from "@/components/RecurringForm";
import { useStorage } from "@/context/StorageContext";
import { formatCurrency } from "@/utils/format";

export default function SettingsPage() {
    const { recurring, deleteRecurring, categories, accounts } = useStorage();

    const getCategoryName = (id?: string) => {
        return categories.find(c => c.id === id)?.name || 'Sin categoría';
    };

    const getAccountName = (id: string) => {
        return accounts.find(a => a.id === id)?.name || 'Cuenta desconocida';
    };

    const getFrequencyLabel = (freq: string) => {
        switch (freq) {
            case 'monthly': return 'Mensual';
            case 'weekly': return 'Semanal';
            case 'yearly': return 'Anual';
            default: return freq;
        }
    };

    return (
        <div className="settings-layout" style={{ display: 'grid', gap: '2rem' }}>
            <style jsx>{`
        .settings-layout {
          grid-template-columns: 1fr 350px;
        }
        @media (max-width: 1024px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }
          .form-container {
            order: -1;
          }
        }
      `}</style>

            <div className="form-container">
                <RecurringForm />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <header>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Configuración</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gestiona tus gastos fijos y recurrentes</p>
                </header>

                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recurrencias Activas</h2>

                    {recurring.length === 0 ? (
                        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No tienes transacciones recurrentes configuradas.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recurring.map(r => (
                                <div key={r.id} className="glass-card" style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{r.transactionTemplate.description}</span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.1rem 0.5rem',
                                                borderRadius: 'var(--radius-full)',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                {getFrequencyLabel(r.frequency)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            <span>{getCategoryName(r.transactionTemplate.categoryId)}</span>
                                            <span>•</span>
                                            <span>{getAccountName(r.transactionTemplate.accountId)}</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                            Próxima ejecución: {new Date(r.nextRunDate).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        <span style={{
                                            fontWeight: 700,
                                            fontSize: '1.25rem',
                                            color: r.transactionTemplate.type === 'income' ? 'var(--accent-success)' : 'var(--text-primary)'
                                        }}>
                                            {formatCurrency(r.transactionTemplate.amount)}
                                        </span>
                                        <button
                                            onClick={() => deleteRecurring(r.id)}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: 'var(--accent-danger)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
