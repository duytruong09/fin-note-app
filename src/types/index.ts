// User types
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  preferredLanguage: 'vi' | 'en';
  defaultCurrency: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Transaction types
export type TransactionType = 'INCOME' | 'EXPENSE';
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'EWALLET';

export interface Category {
  id: string;
  name: string;
  nameVi: string | null;
  nameEn: string | null;
  icon: string | null;
  color: string | null;
  type: TransactionType;
  isSystem: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: number;
  currency: string;
  type: TransactionType;
  description: string | null;
  transactionDate: string;
  paymentMethod: PaymentMethod | null;
  location: string | null;
  notes: string | null;
  isVoiceCreated: boolean;
  voiceAudioUrl: string | null;
  voiceTranscript: string | null;
  voiceParsingConfidence: number | null;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// Budget types
export type BudgetPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Budget {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  alertThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isExceeded: boolean;
  shouldAlert: boolean;
  transactionCount: number;
  transactions: Transaction[];
}

// User Settings types
export interface UserSettings {
  userId: string;
  theme: string;
  notificationEnabled: boolean;
  budgetAlertEnabled: boolean;
  voiceAutoSubmit: boolean;
  voiceDefaultLang: 'vi' | 'en';
  defaultPaymentMethod: PaymentMethod | null;
  timezone: string;
  updatedAt: string;
}

// Voice types
export interface ParsedExpense {
  amount: number;
  categoryName: string | null;
  description: string | null;
  transactionDate: string | null;
  confidence: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp?: string;
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
  };
}
