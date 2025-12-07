"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useUi } from '@/context/UiContext';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { openTransactionModal } = useUi();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 z-50"
         style={{
           background: '#1e293b',
           backdropFilter: 'blur(10px)',
           borderTop: '1px solid rgba(255, 255, 255, 0.1)'
         }}>
      <div className="flex items-center justify-evenly h-full px-2">
        
        {/* Inicio */}
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] h-16 rounded-lg transition-colors"
          style={{
            color: isActive('/') ? '#8b5cf6' : '#6b7280'
          }}>
          <span className="text-2xl">📊</span>
          <span className="text-[10px] font-medium">Inicio</span>
        </button>

        {/* Historial */}
        <button
          onClick={() => router.push('/transactions')}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] h-16 rounded-lg transition-colors"
          style={{
            color: isActive('/transactions') ? '#8b5cf6' : '#6b7280'
          }}>
          <span className="text-2xl">📝</span>
          <span className="text-[10px] font-medium">Historial</span>
        </button>

        {/* Botón Central + */}
        <button
          onClick={openTransactionModal}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl -mt-8 border-4"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            borderColor: '#1e293b',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)'
          }}>
          +
        </button>

        {/* Cuentas */}
        <button
          onClick={() => router.push('/accounts')}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] h-16 rounded-lg transition-colors"
          style={{
            color: isActive('/accounts') ? '#8b5cf6' : '#6b7280'
          }}>
          <span className="text-2xl">💳</span>
          <span className="text-[10px] font-medium">Cuentas</span>
        </button>

        {/* Más */}
        <button
          onClick={() => router.push('/settings')}
          className="flex flex-col items-center justify-center gap-1 min-w-[60px] h-16 rounded-lg transition-colors"
          style={{
            color: isActive('/settings') ? '#8b5cf6' : '#6b7280'
          }}>
          <span className="text-2xl">⚙️</span>
          <span className="text-[10px] font-medium">Más</span>
        </button>
      </div>
    </nav>
  );
}
