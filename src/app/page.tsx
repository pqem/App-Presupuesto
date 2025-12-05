"use client";

import { useStorage } from "@/context/StorageContext";
import SummaryCard from "@/components/SummaryCard";
import { formatCurrency } from "@/utils/format";

export default function Dashboard() {
  const { transactions, accounts, getAccountBalance } = useStorage();

  // Calculate totals
  const totalBalance = accounts.reduce((acc, account) => acc + getAccountBalance(account.id), 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'income';
    })
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
    })
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Resumen financiero de {new Date().toLocaleString('es-AR', { month: 'long' })}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <SummaryCard
          title="Balance Total"
          amount={totalBalance}
          icon="💰"
          color="var(--accent-info)"
        />
        <SummaryCard
          title="Ingresos del Mes"
          amount={monthlyIncome}
          icon="📈"
          color="var(--accent-success)"
        />
        <SummaryCard
          title="Gastos del Mes"
          amount={monthlyExpenses}
          icon="📉"
          color="var(--accent-danger)"
        />
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Actividad Reciente</h2>
        {transactions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No hay transacciones recientes</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.slice(-5).reverse().map(t => (
              <div key={t.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {t.type === 'income' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500 }}>{t.description}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span style={{
                  fontWeight: 600,
                  color: t.type === 'income' ? 'var(--accent-success)' : 'var(--text-primary)'
                }}>
                  {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
