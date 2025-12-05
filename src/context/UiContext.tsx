"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UiContextType {
    isTransactionModalOpen: boolean;
    openTransactionModal: () => void;
    closeTransactionModal: () => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: ReactNode }) {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const openTransactionModal = () => setIsTransactionModalOpen(true);
    const closeTransactionModal = () => setIsTransactionModalOpen(false);

    return (
        <UiContext.Provider value={{
            isTransactionModalOpen,
            openTransactionModal,
            closeTransactionModal
        }}>
            {children}
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
