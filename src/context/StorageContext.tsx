"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Account, Category, Transaction, Budget, RecurringTransaction, Household, UserProfile } from '@/types';
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
    getDoc,
    getDocs,
    where
} from 'firebase/firestore';
import LoginPageNew from '@/components/LoginPageNew';
import HouseholdSetup from '@/components/HouseholdSetup';

interface StorageContextType {
    user: User | null;
    userProfile: UserProfile | null;
    household: Household | null;
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
    createHousehold: (name: string) => Promise<string>;
    joinHousehold: (inviteCode: string) => Promise<boolean>;
    loading: boolean;
    needsHousehold: boolean;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);

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

// Generate a random invite code
function generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export function StorageProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [household, setHousehold] = useState<Household | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [needsHousehold, setNeedsHousehold] = useState(false);

    // 1. Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setLoading(false);
                setUserProfile(null);
                setHousehold(null);
                setAccounts([]);
                setCategories([]);
                setTransactions([]);
                setRecurring([]);
                setNeedsHousehold(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Load/Create User Profile
    useEffect(() => {
        if (!user) return;

        const loadUserProfile = async () => {
            setLoading(true);
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const profile = { id: userDoc.id, ...userDoc.data() } as UserProfile;
                setUserProfile(profile);

                if (profile.householdId) {
                    // Load household
                    const householdDoc = await getDoc(doc(db, 'households', profile.householdId));
                    if (householdDoc.exists()) {
                        setHousehold({ id: householdDoc.id, ...householdDoc.data() } as Household);
                        setNeedsHousehold(false);
                    } else {
                        setNeedsHousehold(true);
                    }
                } else {
                    setNeedsHousehold(true);
                }
            } else {
                // Create new user profile
                const newProfile: Omit<UserProfile, 'id'> = {
                    email: user.email || '',
                    displayName: user.displayName || '',
                    householdId: null,
                    createdAt: new Date().toISOString()
                };
                await setDoc(userDocRef, newProfile);
                setUserProfile({ id: user.uid, ...newProfile });
                setNeedsHousehold(true);
            }
            setLoading(false);
        };

        loadUserProfile();
    }, [user]);

    // 3. Data Sync (Only when household exists)
    useEffect(() => {
        if (!user || !household) return;

        setLoading(true);

        const subscribeToCollection = (collectionName: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
            const q = query(collection(db, 'households/' + household.id + '/' + collectionName));
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
    }, [user, household]);

    // 4. Initial Population (If empty household)
    useEffect(() => {
        if (!user || !household || loading) return;

        const seedData = async () => {
            const catsSnapshot = await getDocs(collection(db, 'households/' + household.id + '/categories'));
            const accsSnapshot = await getDocs(collection(db, 'households/' + household.id + '/accounts'));

            if (catsSnapshot.empty && accsSnapshot.empty) {
                for (const cat of INITIAL_CATEGORIES) {
                    await setDoc(doc(db, 'households/' + household.id + '/categories', cat.id), cat);
                }
                for (const acc of INITIAL_ACCOUNTS) {
                    await setDoc(doc(db, 'households/' + household.id + '/accounts', acc.id), acc);
                }
            }
        };

        seedData();
    }, [user, household, loading]);

    // Create a new household
    const createHousehold = useCallback(async (name: string): Promise<string> => {
        if (!user) throw new Error('No user');

        const inviteCode = generateInviteCode();
        const newHousehold: Omit<Household, 'id'> = {
            name,
            inviteCode,
            members: [user.uid],
            createdBy: user.uid,
            createdAt: new Date().toISOString()
        };

        const householdRef = await addDoc(collection(db, 'households'), newHousehold);

        // Update user profile with household ID
        await updateDoc(doc(db, 'users', user.uid), { householdId: householdRef.id });

        const createdHousehold = { id: householdRef.id, ...newHousehold };
        setHousehold(createdHousehold);
        setUserProfile(prev => prev ? { ...prev, householdId: householdRef.id } : null);
        setNeedsHousehold(false);

        return inviteCode;
    }, [user]);

    // Join existing household with invite code
    const joinHousehold = useCallback(async (inviteCode: string): Promise<boolean> => {
        if (!user) throw new Error('No user');

        const householdsQuery = query(
            collection(db, 'households'),
            where('inviteCode', '==', inviteCode.toUpperCase())
        );
        const snapshot = await getDocs(householdsQuery);

        if (snapshot.empty) {
            return false;
        }

        const householdDoc = snapshot.docs[0];
        const householdData = householdDoc.data() as Omit<Household, 'id'>;

        // Add user to household members
        const updatedMembers = [...householdData.members, user.uid];
        await updateDoc(doc(db, 'households', householdDoc.id), { members: updatedMembers });

        // Update user profile
        await updateDoc(doc(db, 'users', user.uid), { householdId: householdDoc.id });

        setHousehold({ id: householdDoc.id, ...householdData, members: updatedMembers });
        setUserProfile(prev => prev ? { ...prev, householdId: householdDoc.id } : null);
        setNeedsHousehold(false);

        return true;
    }, [user]);

    // Actions
    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        if (!user || !household) return;
        await addDoc(collection(db, 'households/' + household.id + '/transactions'), {
            ...transaction,
            date: transaction.date
        });
    };

    const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
        if (!user || !household) return;
        await updateDoc(doc(db, 'households/' + household.id + '/transactions', id), transaction as any);
    };

    const deleteTransaction = async (id: string) => {
        if (!user || !household) return;
        await deleteDoc(doc(db, 'households/' + household.id + '/transactions', id));
    };

    const addAccount = async (account: Account) => {
        if (!user || !household) return;
        await addDoc(collection(db, 'households/' + household.id + '/accounts'), account);
    };

    const updateAccount = async (updatedAccount: Account) => {
        if (!user || !household) return;
        const { id, ...data } = updatedAccount;
        await updateDoc(doc(db, 'households/' + household.id + '/accounts', id), data as any);
    };

    const deleteAccount = async (id: string) => {
        if (!user || !household) return;
        await deleteDoc(doc(db, 'households/' + household.id + '/accounts', id));
    };

    const addRecurring = async (recurringTx: Omit<RecurringTransaction, 'id' | 'nextRunDate'>) => {
        if (!user || !household) return;
        await addDoc(collection(db, 'households/' + household.id + '/recurring'), {
            ...recurringTx,
            nextRunDate: recurringTx.startDate
        });
    };

    const deleteRecurring = async (id: string) => {
        if (!user || !household) return;
        await deleteDoc(doc(db, 'households/' + household.id + '/recurring', id));
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
        return <LoginPageNew />;
    }

    if (needsHousehold && !loading) {
        return (
            <StorageContext.Provider value={{
                user,
                userProfile,
                household,
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
                createHousehold,
                joinHousehold,
                loading,
                needsHousehold
            }}>
                <HouseholdSetup />
            </StorageContext.Provider>
        );
    }

    return (
        <StorageContext.Provider value={{
            user,
            userProfile,
            household,
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
            createHousehold,
            joinHousehold,
            loading,
            needsHousehold
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
