"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Inicio', path: '/', icon: '📊' },
        { name: 'Transac.', path: '/transactions', icon: '💸' },
        { name: 'Cuentas', path: '/accounts', icon: '💳' },
        { name: 'Config.', path: '/settings', icon: '⚙️' },
    ];

    return (
        <nav className="glass" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '0.75rem 0.5rem',
            zIndex: 100,
            borderTop: '1px solid var(--border-light)',
            background: 'rgba(10, 10, 10, 0.95)' // Slightly more opaque for better visibility
        }}>
            {menuItems.map((item) => {
                const isActive = pathname === item.path;
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
                            fontSize: '0.75rem',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all 0.2s ease',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            minWidth: '60px'
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
