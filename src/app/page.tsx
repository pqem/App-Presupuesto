"use client";

import { useStorage } from "@/context/StorageContext";
import { useUi } from "@/context/UiContext";
import SummaryCard from "@/components/SummaryCard";
import { formatCurrency } from "@/utils/format";
import { useMemo } from "react";

export default function Dashboard() {
  const { transactions, accounts, getAccountBalance } = useStorage();
  const { openTransactionModal } = useUi();

  // Calculate totals con useMemo para optimización
  const totalBalance = useMemo(() => 
    accounts.reduce((acc, account) => acc + getAccountBalance(account.id), 0),
    [accounts, getAccountBalance]
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyStats = useMemo(() => {
    const income = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'income';
      })
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'expense';
      })
      .reduce((acc, t) => acc + t.amount, 0);

    return { income, expenses, savings: income - expenses };
  }, [transactions, currentMonth, currentYear]);

  const recentTransactions = useMemo(() => 
    transactions.slice(-5).reverse(),
    [transactions]
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2rem',
      animation: 'fadeIn 0.5s ease-in'
    }}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .transaction-item {
          animation: slideIn 0.3s ease-out;
        }
        .transaction-item:nth-child(1) { animation-delay: 0.1s; }
        .transaction-item:nth-child(2) { animation-delay: 0.2s; }
        .transaction-item:nth-child(3) { animation-delay: 0.3s; }
        .transaction-item:nth-child(4) { animation-delay: 0.4s; }
        .transaction-item:nth-child(5) { animation-delay: 0.5s; }
      `}</style>

      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          👋 Bienvenido al Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Resumen financiero de {new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' })}
        </p>
      </header>

      {/* Tarjetas de resumen */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <SummaryCard
          title="Balance Total"
          amount={totalBalance}
          icon="💰"
          color="var(--accent-info)"
          subtitle={`${accounts.length} cuenta${accounts.length !== 1 ? 's' : ''}`}
        />
        <SummaryCard
          title="Ingresos del Mes"
          amount={monthlyStats.income}
          icon="📈"
          color="var(--accent-success)"
          subtitle={`+${formatCurrency(monthlyStats.income)}`}
        />
        <SummaryCard
          title="Gastos del Mes"
          amount={monthlyStats.expenses}
          icon="📉"
          color="var(--accent-danger)"
          subtitle={`-${formatCurrency(monthlyStats.expenses)}`}
        />
        <SummaryCard
          title="Ahorro del Mes"
          amount={monthlyStats.savings}
          icon="🎯"
          color={monthlyStats.savings >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}
          subtitle={monthlyStats.savings >= 0 ? '¡Excelente!' : 'Cuidado'}
        />
      </div>

      {/* Actividad reciente mejorada */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            📊 Actividad Reciente
          </h2>
          <span style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-secondary)',
            padding: '0.25rem 0.75rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 'var(--radius-full)'
          }}>
            {transactions.length} transacciones totales
          </span>
        </div>

        {transactions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: 'var(--text-muted)' 
          }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              No hay transacciones aún
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Comienza agregando tu primera transacción
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentTransactions.map((t, index) => (
              <div 
                key={t.id} 
                className="transaction-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: t.type === 'income' 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    border: `2px solid ${t.type === 'income' ? 'var(--accent-success)' : 'var(--accent-danger)'}`,
                  }}>
                    {t.type === 'income' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p style={{ 
                      fontWeight: 600, 
                      marginBottom: '0.25rem',
                      fontSize: '1rem'
                    }}>
                      {t.description}
                    </p>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <span>📅 {new Date(t.date).toLocaleDateString('es-AR', { 
                        day: 'numeric',
                        month: 'short'
                      })}</span>
                      <span>•</span>
                      <span>{accounts.find(a => a.id === t.accountId)?.name || 'Cuenta'}</span>
                    </div>
                  </div>
                </div>
                <span style={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: t.type === 'income' ? 'var(--accent-success)' : 'var(--text-primary)'
                }}>
                  {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón flotante (Desktop) */}
      <button
        onClick={openTransactionModal}
        className="desktop-only"
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          padding: '1rem 2rem',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>+</span>
        Nueva Transacción
      </button>
    </div>
  );
}
