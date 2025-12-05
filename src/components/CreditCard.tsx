"use client";

import { Account } from "@/types";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";
import PayCardModal from "./PayCardModal";

interface CreditCardProps {
    account: Account;
    balance: number; // Current debt (negative number usually)
}

export default function CreditCard({ account, balance }: CreditCardProps) {
    const [showPayModal, setShowPayModal] = useState(false);

    // Debt is the absolute value of the negative balance
    const currentDebt = Math.abs(Math.min(balance, 0));
    const limit = account.limit || 0;
    const available = limit - currentDebt;
    const usagePercent = limit > 0 ? (currentDebt / limit) * 100 : 0;

    // Calculate dates
    const today = new Date();
    const closingDate = new Date(today.getFullYear(), today.getMonth(), account.closingDate || 1);
    const paymentDate = new Date(today.getFullYear(), today.getMonth(), account.paymentDate || 10);

    // If closing date passed, move to next month
    if (today.getDate() > (account.closingDate || 1)) {
        closingDate.setMonth(closingDate.getMonth() + 1);
    }
    // If payment date passed, move to next month
    if (today.getDate() > (account.paymentDate || 10)) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);
    }

    return (
        <>
            <div className="glass-card" style={{
                padding: '1.5rem',
                background: `linear-gradient(135deg, ${account.color}20, rgba(0,0,0,0.4))`,
                border: `1px solid ${account.color}40`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    fontSize: '10rem',
                    opacity: 0.05,
                    pointerEvents: 'none'
                }}>
                    💳
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{account.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Cierra el {closingDate.toLocaleDateString()}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Deuda Actual</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {formatCurrency(currentDebt)}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        <span>Disponible: {formatCurrency(available)}</span>
                        <span>Límite: {formatCurrency(limit)}</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${Math.min(usagePercent, 100)}%`,
                            height: '100%',
                            background: usagePercent > 90 ? 'var(--accent-danger)' : account.color,
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Vence el: </span>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                            {paymentDate.toLocaleDateString()}
                        </span>
                    </div>

                    <button
                        onClick={() => setShowPayModal(true)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        Pagar Tarjeta
                    </button>
                </div>
            </div>

            {showPayModal && (
                <PayCardModal
                    account={account}
                    currentDebt={currentDebt}
                    onClose={() => setShowPayModal(false)}
                />
            )}
        </>
    );
}
