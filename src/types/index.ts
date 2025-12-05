export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountType = 'cash' | 'bank' | 'credit' | 'investment';
export type Period = 'monthly' | 'weekly' | 'yearly';

export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
}

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    initialBalance: number;
    currentBalance: number; // Calculated
    currency: string;
    color: string;
    // Credit Card specific
    limit?: number;
    closingDate?: number; // Day of month
    paymentDate?: number; // Day of month
}

export interface Transaction {
    id: string;
    amount: number;
    date: string; // ISO Date string
    description: string;
    type: TransactionType;
    categoryId?: string; // Optional for transfers
    accountId: string; // Source account
    toAccountId?: string; // Destination account (for transfers)
    isRecurring?: boolean;
    recurringId?: string;
    notes?: string;
}

export interface Budget {
    id: string;
    categoryId: string;
    amount: number;
    period: Period;
}

export interface RecurringTransaction {
    id: string;
    transactionTemplate: Omit<Transaction, 'id' | 'date'>;
    frequency: Period;
    startDate: string;
    nextRunDate: string;
    active: boolean;
}
