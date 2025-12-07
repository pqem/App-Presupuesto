"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction } from '@/types';
import TransactionModalNew from '@/components/TransactionModalNew';

interface UiContextType {
    isTransactionModalOpen: boolean;
    openTransactionModal: () => void;
    closeTransactionModal: () => void;
    transactionToEdit: Transaction | null;
    setTransactionToEdit: (transaction: Transaction | null) => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: ReactNode }) {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

    const openTransactionModal = () => setIsTransactionModalOpen(true);
    
    const closeTransactionModal = () => {
        setIsTransactionModalOpen(false);
        setTransactionToEdit(null);
    };

    return (
        <UiContext.Provider value={{
            isTransactionModalOpen,
            openTransactionModal,
            closeTransactionModal,
            transactionToEdit,
            setTransactionToEdit
        }}>
            {children}
            <TransactionModalNew />
        </UiContext.Provider>
    );
}

export function useUi() {
    const context = useContext(UiContext);
    if (context === undefined) {
        throw new Error('useUi must be used within a UiProvider');
    }
    return context;
}
