"use client";

import { useStorage } from "@/context/StorageContext";
import SummaryCard from "@/components/SummaryCard";
import CreditCard from "@/components/CreditCard";

export default function AccountsPage() {
    const { accounts, getAccountBalance } = useStorage();

    const creditAccounts = accounts.filter(a => a.type === 'credit');
    const otherAccounts = accounts.filter(a => a.type !== 'credit');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Mis Cuentas</h1>
            </header>

            {/* Cuentas Bancarias y Efectivo */}
            <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    Efectivo y Bancos
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {otherAccounts.map(account => (
                        <SummaryCard
                            key={account.id}
                            title={account.name}
                            amount={getAccountBalance(account.id)}
                            icon={account.type === 'cash' ? '💵' : '🏦'}
                            color={account.color}
                        />
                    ))}
                </div>
            </section>

            {/* Tarjetas de Crédito */}
            {creditAccounts.length > 0 && (
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        Tarjetas de Crédito
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {creditAccounts.map(account => (
                            <CreditCard
                                key={account.id}
                                account={account}
                                balance={getAccountBalance(account.id)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
