"use client";

import { useUi } from '@/context/UiContext';

export default function FloatingActionButton() {
  const { openTransactionModal } = useUi();

  return (
    <>
      {/* Botón Flotante Principal */}
      <button
        onClick={openTransactionModal}
        style={{
          position: 'fixed',
          bottom: '100px', // Sobre la barra de navegación
          right: '20px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          border: 'none',
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.6), 0 0 0 0 rgba(139, 92, 246, 0.4)',
          cursor: 'pointer',
          zIndex: 100,
          animation: 'pulse 2s infinite',
          transition: 'transform 0.2s ease'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        +
      </button>

      {/* Añadir animación de pulso */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 8px 24px rgba(139, 92, 246, 0.6), 
                        0 0 0 0 rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 8px 24px rgba(139, 92, 246, 0.6), 
                        0 0 0 10px rgba(139, 92, 246, 0);
          }
          100% {
            box-shadow: 0 8px 24px rgba(139, 92, 246, 0.6), 
                        0 0 0 0 rgba(139, 92, 246, 0);
          }
        }
      `}</style>
    </>
  );
}
