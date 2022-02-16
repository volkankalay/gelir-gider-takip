export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface UserType {
    token: string;
    user: User;
}

export interface CategoryType {
    id: number;
    is_income: boolean;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface Currency {
    id: number;
    code: string;
    name: string;
    created_at?: any;
    updated_at?: any;
}

export interface ExpenseType {
    id: number;
    transaction_date: string;
    amount: string;
    currency_id: number;
    category_id: number;
    description: string;
    created_at: Date;
    updated_at: Date;
    category: CategoryType;
    currency: Currency;
}
