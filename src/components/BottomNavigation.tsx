"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useUi } from '@/context/UiContext';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { openTransactionModal } = useUi();

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '80px',
      zIndex: 50,
      background: '#1e293b',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: '100%',
        padding: '0 0.5rem'
      }}>
        
        {/* Inicio */}
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            minWidth: '60px',
            height: '64px',
            borderRadius: '0.5rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: isActive('/') ? '#8b5cf6' : '#6b7280',
            transition: 'color 0.2s'
          }}>
          <span style={{ fontSize: '1.5rem' }}>📊</span>
          <span style={{ fontSize: '10px', fontWeight: 500 }}>Inicio</span>
        </button>

        {/* Historial */}
        <button
          onClick={() => router.push('/transactions')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            minWidth: '60px',
            height: '64px',
            borderRadius: '0.5rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: isActive('/transactions') ? '#8b5cf6' : '#6b7280',
            transition: 'color 0.2s'
          }}>
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <span style={{ fontSize: '10px', fontWeight: 500 }}>Historial</span>
        </button>

        {/* Botón Central + */}
        <button
          onClick={openTransactionModal}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginTop: '-32px',
            border: '4px solid #1e293b',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
            cursor: 'pointer'
          }}>
          +
        </button>

        {/* Cuentas */}
        <button
          onClick={() => router.push('/accounts')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            minWidth: '60px',
            height: '64px',
            borderRadius: '0.5rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: isActive('/accounts') ? '#8b5cf6' : '#6b7280',
            transition: 'color 0.2s'
          }}>
          <span style={{ fontSize: '1.5rem' }}>💳</span>
          <span style={{ fontSize: '10px', fontWeight: 500 }}>Cuentas</span>
        </button>

        {/* Más */}
        <button
          onClick={() => router.push('/settings')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            minWidth: '60px',
            height: '64px',
            borderRadius: '0.5rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: isActive('/settings') ? '#8b5cf6' : '#6b7280',
            transition: 'color 0.2s'
          }}>
          <span style={{ fontSize: '1.5rem' }}>⚙️</span>
          <span style={{ fontSize: '10px', fontWeight: 500 }}>Más</span>
        </button>
      </div>
    </nav>
  );
}
