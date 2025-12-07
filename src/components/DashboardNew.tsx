"use client";

import { useStorage } from '@/context/StorageContext';
import { formatCurrency } from '@/utils/format';
import { useMemo } from 'react';

export default function DashboardNew() {
  const { transactions, accounts, user } = useStorage();

  // Calcular totales
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    const percentage = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

    return { balance, totalIncome, totalExpense, percentage };
  }, [transactions]);

  // Agrupar transacciones por categoría
  const categoryExpenses = useMemo(() => {
    const groups: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = t.category || 'Sin categoría';
        groups[category] = (groups[category] || 0) + t.amount;
      });

    return Object.entries(groups)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [transactions]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', background: '#0f172a' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '2rem' }}>📱</div>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Presupuesto</h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Panel Principal</p>
          </div>
        </div>
        {user && (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.125rem'
          }}>
            {user.email?.[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* Tarjeta Principal */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          borderRadius: '1.5rem',
          padding: '2rem',
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Presupuesto Total</p>
          <h2 style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', margin: 0 }}>
            {formatCurrency(stats.balance)}
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Gastado:</p>
              <p style={{ color: '#f87171', fontWeight: 600, margin: 0 }}>{formatCurrency(stats.totalExpense)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Restante:</p>
              <p style={{ color: '#34d399', fontWeight: 600, margin: 0 }}>{formatCurrency(stats.balance)}</p>
            </div>
          </div>

          {/* Gráfica circular */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '128px', height: '128px' }}>
              <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="12"
                  strokeDasharray={`${(stats.percentage * 352) / 100} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <button style={{
          width: '100%',
          height: '3.5rem',
          borderRadius: '1rem',
          fontWeight: 600,
          color: 'white',
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '0.75rem'
        }}>
          + Nuevo Presupuesto
        </button>
        <button style={{
          width: '100%',
          height: '3.5rem',
          borderRadius: '1rem',
          fontWeight: 600,
          color: 'white',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer'
        }}>
          📊 Ver Reportes
        </button>
      </div>

      {/* Mis Presupuestos */}
      <div style={{ padding: '0 1.5rem' }}>
        <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Mis Presupuestos
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {categoryExpenses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
              <p>No hay gastos aún</p>
            </div>
          ) : (
            categoryExpenses.map((cat, index) => {
              const icons = ['🍽️', '🏠', '🚗'];
              const colors = ['#10b981', '#f59e0b', '#ef4444'];
              const used = Math.min(Math.round((cat.amount / stats.totalExpense) * 100), 100);
              
              return (
                <div key={cat.name} style={{
                  borderRadius: '1rem',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    backgroundColor: colors[index] + '40'
                  }}>
                    {icons[index]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'white', fontWeight: 600 }}>{cat.name}</span>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>{formatCurrency(cat.amount)}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#374151', borderRadius: '9999px', marginTop: '0.5rem' }}>
                      <div style={{
                        height: '100%',
                        borderRadius: '9999px',
                        width: `${used}%`,
                        backgroundColor: colors[index],
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>{used}% utilizado</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
