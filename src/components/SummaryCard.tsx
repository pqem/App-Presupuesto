import { formatCurrency } from "@/utils/format";

interface SummaryCardProps {
    title: string;
    amount: number;
    icon: string;
    trend?: number; // Percentage
    color?: string;
    subtitle?: string;
}

export default function SummaryCard({ 
    title, 
    amount, 
    icon, 
    trend, 
    color = 'var(--accent-primary)',
    subtitle
}: SummaryCardProps) {
    return (
        <div 
            className="glass-card" 
            style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Efecto de fondo decorativo */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `${color}15`,
                filter: 'blur(30px)',
                pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', position: 'relative' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    border: `2px solid ${color}40`,
                    boxShadow: `0 4px 12px ${color}30`
                }}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: trend >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)',
                        background: trend >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        padding: '0.375rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        border: `1px solid ${trend >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}40`
                    }}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>

            <div style={{ position: 'relative' }}>
                <h3 style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    marginBottom: '0.5rem',
                    letterSpacing: '0.5px'
                }}>
                    {title}
                </h3>
                <p style={{ 
                    fontSize: '2rem', 
                    fontWeight: 700, 
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    marginBottom: subtitle ? '0.5rem' : 0
                }}>
                    {formatCurrency(amount)}
                </p>
                {subtitle && (
                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontWeight: 500
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
