"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: '📊' },
        { name: 'Transacciones', path: '/transactions', icon: '💸' },
        { name: 'Cuentas', path: '/accounts', icon: '💳' },
        { name: 'Presupuesto', path: '/budget', icon: '🎯' },
        { name: 'Configuración', path: '/settings', icon: '⚙️' },
    ];

    return (
        <aside className="sidebar glass" style={{
            width: '250px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            zIndex: 100
        }}>
            <div style={{ padding: '0 1rem' }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Finanzas
                </h2>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontWeight: isActive ? 600 : 400,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
