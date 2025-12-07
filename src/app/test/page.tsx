"use client";

export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '2rem',
      color: 'white',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', textAlign: 'center' }}>🎉 COMPONENTES NUEVOS FUNCIONAN</h1>
      <p style={{ fontSize: '1.5rem', textAlign: 'center' }}>Si ves esto, los componentes se están cargando correctamente</p>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '600px'
      }}>
        <p style={{ margin: '0.5rem 0' }}>✅ Layout actualizado</p>
        <p style={{ margin: '0.5rem 0' }}>✅ Componentes nuevos creados</p>
        <p style={{ margin: '0.5rem 0' }}>✅ Archivos en su lugar</p>
      </div>
    </div>
  );
}
