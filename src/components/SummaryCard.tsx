import { formatCurrency } from "@/utils/format";

interface SummaryCardProps {
    title: string;
    amount: number;
    icon: string;
    trend?: number; // Percentage
    color?: string;
}

export default function SummaryCard({ title, amount, icon, trend, color = 'var(--accent-primary)' }: SummaryCardProps) {
    return (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: color
                }}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <span style={{
                        fontSize: '0.875rem',
                        color: trend >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)',
                        background: trend >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-full)'
                    }}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>

            <div>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {title}
                </h3>
                <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatCurrency(amount)}
                </p>
            </div>
        </div>
    );
}
