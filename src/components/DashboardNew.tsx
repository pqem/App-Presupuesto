"use client";

import { useStorage } from '@/context/StorageContext';
import { formatCurrency } from '@/utils/format';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUi } from '@/context/UiContext';

export default function DashboardNew() {
  const { transactions, accounts, user } = useStorage();
  const router = useRouter();
  const { openTransactionModal } = useUi();

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

  const hasTransactions = transactions.length > 0;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '96px', background: '#0f172a' }}>
      {/* Header - DISEÑO MAGICPATH */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '2rem' }}>📱</div>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Presupuesto</h1>
          </div>
        </div>
        {user && (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
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

      {/* Estado vacío - FUNCIONALIDAD ACTUAL + DISEÑO MAGICPATH */}
      {!hasTransactions && (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            borderRadius: '1.5rem',
            padding: '3rem 2rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '2px dashed rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👋</div>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              ¡Bienvenido a Presupuesto!
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              Comienza agregando tus primeras transacciones para ver tus estadísticas financieras.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>1</div>
                <span>Presiona el botón <strong style={{ color: '#a78bfa' }}>+</strong> abajo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>2</div>
                <span>Agrega tus ingresos y gastos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>3</div>
                <span>¡Visualiza tus finanzas!</span>
              </div>
            </div>

            <button
              onClick={openTransactionModal}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                color: 'white',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                border: 'none',
                cursor: 'pointer'
              }}>
              + Agregar primera transacción
            </button>
          </div>
        </div>
      )}

      {/* Dashboard normal - DISEÑO EXACTO MAGICPATH */}
      {hasTransactions && (
        <>
          {/* TARJETA PRINCIPAL - DISEÑO MAGICPATH EXACTO */}
          <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{
              borderRadius: '1.5rem',
              padding: '2rem',
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              
              {/* Label pequeño */}
              <p style={{ 
                color: '#9ca3af', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                fontWeight: 400,
                margin: 0,
                marginBottom: '8px'
              }}>
                Presupuesto Total
              </p>

              {/* Monto grande - 48px como MagicPath */}
              <h2 style={{ 
                color: 'white', 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem',
                margin: 0,
                marginBottom: '24px'
              }}>
                {formatCurrency(stats.balance)}
              </h2>

              {/* Dos columnas: Gastado y Restante */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0, marginBottom: '4px' }}>
                    Gastado:
                  </p>
                  <p style={{ color: '#f87171', fontWeight: 600, fontSize: '1.125rem', margin: 0 }}>
                    {formatCurrency(stats.totalExpense)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0, marginBottom: '4px' }}>
                    Restante:
                  </p>
                  <p style={{ color: '#34d399', fontWeight: 600, fontSize: '1.125rem', margin: 0 }}>
                    {formatCurrency(stats.balance)}
                  </p>
                </div>
              </div>

              {/* Gráfica circular - 128px como MagicPath */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '128px', height: '128px' }}>
                  <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Anillo fondo gris oscuro */}
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="12"
                    />
                    {/* Anillo morado progreso */}
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
                  {/* Porcentaje centrado */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {stats.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN - DISEÑO MAGICPATH + FUNCIONALIDAD */}
          <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
            {/* Botón 1: Gradiente morado */}
            <button
              onClick={openTransactionModal}
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '1rem',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'white',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '12px'
              }}>
              + Nuevo Presupuesto
            </button>

            {/* Botón 2: Fondo oscuro transparente con borde */}
            <button
              onClick={() => router.push('/transactions')}
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '1rem',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'white',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}>
              📊 Ver Reportes
            </button>
          </div>

          {/* MIS PRESUPUESTOS - DISEÑO EXACTO MAGICPATH */}
          <div style={{ padding: '0 1.5rem' }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              margin: 0,
              marginBottom: '16px'
            }}>
              Mis Presupuestos
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categoryExpenses.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem 1rem',
                  color: '#6b7280'
                }}>
                  <p style={{ fontSize: '3rem', marginBottom: '1rem', margin: 0 }}>📭</p>
                  <p style={{ margin: 0 }}>No hay gastos aún</p>
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
                      {/* Icono emoji grande */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        backgroundColor: colors[index] + '40'
                      }}>
                        {icons[index]}
                      </div>

                      {/* Info + barra progreso */}
                      <div style={{ flex: 1 }}>
                        {/* Nombre y monto */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          marginBottom: '8px' 
                        }}>
                          <span style={{ color: 'white', fontWeight: 600 }}>
                            {cat.name}
                          </span>
                          <span style={{ color: 'white', fontWeight: 'bold' }}>
                            {formatCurrency(cat.amount)}
                          </span>
                        </div>

                        {/* Barra de progreso */}
                        <div style={{ 
                          width: '100%', 
                          height: '6px', 
                          background: '#374151', 
                          borderRadius: '9999px',
                          marginBottom: '4px'
                        }}>
                          <div style={{
                            height: '100%',
                            borderRadius: '9999px',
                            width: `${used}%`,
                            backgroundColor: colors[index],
                            transition: 'width 0.3s ease'
                          }} />
                        </div>

                        {/* Porcentaje usado */}
                        <p style={{ 
                          color: '#9ca3af', 
                          fontSize: '0.75rem', 
                          margin: 0 
                        }}>
                          {used}% utilizado
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
