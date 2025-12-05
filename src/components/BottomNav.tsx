"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUi } from '@/context/UiContext';

export default function BottomNav() {
    const pathname = usePathname();
    const { openTransactionModal } = useUi();

    const menuItems = [
        { name: 'Inicio', path: '/', icon: '📊' },
        { name: 'Historial', path: '/transactions', icon: '📝' },
        { name: 'Agregar', path: '#', icon: '+', isAction: true },
        { name: 'Cuentas', path: '/accounts', icon: '💳' },
        { name: 'Más', path: '/settings', icon: '⚙️' },
    ];

    return (
        <nav className="glass" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '0.5rem 1rem',
            zIndex: 100,
            borderTop: '1px solid var(--border-light)',
            background: 'rgba(10, 10, 10, 0.95)',
            paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))'
        }}>
            {menuItems.map((item) => {
                const isActive = pathname === item.path;

                if (item.isAction) {
                    return (
                        <button
                            key={item.name}
                            onClick={openTransactionModal}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                marginBottom: '0.5rem', // Lift it up slightly
                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{item.icon}</span>
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.7rem',
                            fontWeight: isActive ? 600 : 400,
                            padding: '0.5rem',
                            minWidth: '50px',
                            opacity: isActive ? 1 : 0.7
                        }}
                    >
                        <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
