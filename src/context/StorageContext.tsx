"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, Category, Transaction, Budget, RecurringTransaction } from '@/types';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
    getDocs
} from 'firebase/firestore';
import LoginPage from '@/components/LoginPage';

interface StorageContextType {
    user: User | null;
    accounts: Account[];
    categories: Category[];
    transactions: Transaction[];
    budgets: Budget[];
    recurring: RecurringTransaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;
    addAccount: (account: Account) => void;
    updateAccount: (account: Account) => void;
    deleteAccount: (id: string) => void;
    getAccountBalance: (accountId: string) => number;
    addRecurring: (recurringTx: Omit<RecurringTransaction, 'id' | 'nextRunDate'>) => void;
    deleteRecurring: (id: string) => void;
    loading: boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Initial Data Seeding
const INITIAL_CATEGORIES: Category[] = [
    { id: 'cat_1', name: 'Alimentación', type: 'expense', icon: '🛒', color: '#10b981' },
    { id: 'cat_2', name: 'Vivienda', type: 'expense', icon: '🏠', color: '#3b82f6' },
    { id: 'cat_3', name: 'Transporte', type: 'expense', icon: '🚗', color: '#f59e0b' },
    { id: 'cat_4', name: 'Entretenimiento', type: 'expense', icon: '🎬', color: '#8b5cf6' },
    { id: 'cat_5', name: 'Salud', type: 'expense', icon: '💊', color: '#ef4444' },
    { id: 'cat_6', name: 'Servicios', type: 'expense', icon: '⚡', color: '#84cc16' },
    { id: 'cat_7', name: 'Salario', type: 'income', icon: '💰', color: '#10b981' },
    { id: 'cat_8', name: 'Inversiones', type: 'income', icon: '📈', color: '#8b5cf6' },
];

const INITIAL_ACCOUNTS: Account[] = [
    { id: 'acc_1', name: 'Efectivo', type: 'cash', initialBalance: 0, currentBalance: 0, currency: 'ARS', color: '#10b981' },
    { id: 'acc_2', name: 'Banco Principal', type: 'bank', initialBalance: 0, currentBalance: 0, currency: 'ARS', color: '#3b82f6' },
    {
        id: 'acc_3',
        name: 'Visa Crédito',
        type: 'credit',
        initialBalance: 0,
        currentBalance: 0,
        currency: 'ARS',
        color: '#ef4444',
        limit: 500000,
        closingDate: 25,
        paymentDate: 5
    },
];

export function StorageProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setLoading(false);
                setAccounts([]);
                setCategories([]);
                setTransactions([]);
                setRecurring([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Data Sync (Only when logged in)
    useEffect(() => {
        if (!user) return;

        setLoading(true);

        const subscribeToCollection = (collectionName: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
            const q = query(collection(db, 'users/' + user.uid + '/' + collectionName));
            return onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setter(data);
            });
        };

        const unsubAccounts = subscribeToCollection('accounts', setAccounts);
        const unsubCategories = subscribeToCollection('categories', setCategories);
        const unsubTransactions = subscribeToCollection('transactions', setTransactions);
        const unsubRecurring = subscribeToCollection('recurring', setRecurring);

        setLoading(false);

        return () => {
            unsubAccounts();
            unsubCategories();
            unsubTransactions();
            unsubRecurring();
        };
    }, [user]);

    // 3. Initial Population (If empty)
    useEffect(() => {
        if (!user || loading) return;

        const seedData = async () => {
            // Check if data actually exists in DB to avoid overwriting on initial load delay
            const catsSnapshot = await getDocs(collection(db, 'users/' + user.uid + '/categories'));
            const accsSnapshot = await getDocs(collection(db, 'users/' + user.uid + '/accounts'));

            if (catsSnapshot.empty && accsSnapshot.empty) {
                // Seed Categories
                for (const cat of INITIAL_CATEGORIES) {
                    await setDoc(doc(db, 'users/' + user.uid + '/categories', cat.id), cat);
                }
                // Seed Accounts
                for (const acc of INITIAL_ACCOUNTS) {
                    await setDoc(doc(db, 'users/' + user.uid + '/accounts', acc.id), acc);
                }
            }
        };

        seedData();
    }, [user, loading]);

    // Actions
    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        if (!user) return;
        await addDoc(collection(db, 'users/' + user.uid + '/transactions'), {
            ...transaction,
            date: transaction.date
        });
    };

    const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
        if (!user) return;
        await updateDoc(doc(db, 'users/' + user.uid + '/transactions', id), transaction as any);
    };

    const deleteTransaction = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users/' + user.uid + '/transactions', id));
    };

    const addAccount = async (account: Account) => {
        if (!user) return;
        await addDoc(collection(db, 'users/' + user.uid + '/accounts'), account);
    };

    const updateAccount = async (updatedAccount: Account) => {
        if (!user) return;
        const { id, ...data } = updatedAccount;
        await updateDoc(doc(db, 'users/' + user.uid + '/accounts', id), data as any);
    };

    const deleteAccount = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users/' + user.uid + '/accounts', id));
    };

    const addRecurring = async (recurringTx: Omit<RecurringTransaction, 'id' | 'nextRunDate'>) => {
        if (!user) return;
        await addDoc(collection(db, 'users/' + user.uid + '/recurring'), {
            ...recurringTx,
            nextRunDate: recurringTx.startDate
        });
    };

    const deleteRecurring = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users/' + user.uid + '/recurring', id));
    };

    const getAccountBalance = (accountId: string) => {
        const account = accounts.find(a => a.id === accountId);
        if (!account) return 0;

        let balance = account.initialBalance;

        transactions.forEach(t => {
            if (t.accountId === accountId) {
                if (t.type === 'income') balance += t.amount;
                if (t.type === 'expense') balance -= t.amount;
                if (t.type === 'transfer') balance -= t.amount;
            }
            if (t.toAccountId === accountId && t.type === 'transfer') {
                balance += t.amount;
            }
        });

        return balance;
    };

    if (!user) {
        return <LoginPage />;
    }

    return (
        <StorageContext.Provider value={{
            user,
            accounts,
            categories,
            transactions,
            budgets,
            recurring,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            addAccount,
            updateAccount,
            deleteAccount,
            getAccountBalance,
            addRecurring,
            deleteRecurring,
            loading
        }}>
            {children}
        </StorageContext.Provider>
    );
}

export function useStorage() {
    const context = useContext(StorageContext);
    if (context === undefined) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
}
