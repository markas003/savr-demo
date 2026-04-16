export type TabId = "home" | "discounts" | "savings" | "recurring";
export type DiscountChannel = "online" | "instore" | "inapp";
export type RecurringAction = "cancel" | "reduce";

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  accent: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  timestamp: string;
  source: string;
  accent: string;
  direction: "debit" | "credit";
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  tone: "blue" | "gold" | "slate";
}

export interface Offer {
  id: string;
  merchant: string;
  title: string;
  description: string;
  expiry: string;
  channel: DiscountChannel;
  code?: string;
  accent: string;
  savingsHint: string;
  location?: string;
  qrLabel?: string;
  applyNote?: string;
}

export interface BudgetCategory {
  id: string;
  category: string;
  spent: number;
  budget: number;
  accent: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  deadline: string;
  accent: string;
}

export interface RecurringPayment {
  id: string;
  provider: string;
  amount: number;
  category: string;
  nextBilling: string;
  frequency: string;
  accent: string;
  action: RecurringAction;
  recommendation: string;
  estimatedSavings?: number;
  statusNote?: string;
}

export interface AppData {
  totalBalance: number;
  monthlySpent: number;
  monthlySaved: number;
  opportunities: number;
  recurringDue: number;
  impactSaved: number;
  missedSavings: number;
  accounts: Account[];
  stats: Stat[];
  transactions: Transaction[];
  offers: Offer[];
  budgets: BudgetCategory[];
  goals: SavingsGoal[];
  recurring: RecurringPayment[];
}
