// Expense.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const EXPENSE_STATUSES = ["Unpaid", "Paid", "Cancelled"] as const;

export type ExpenseStatus = (typeof EXPENSE_STATUSES)[number];

export interface IExpense {
    expense_id: string; // e.g. EXP-0001
    category: string; // e.g. Utilities, Maintenance, Rent. Salaries are not recorded here
    description: string;
    amount: number;
    expense_date: Date;
    status: ExpenseStatus;
    created_by: string; // References Users.user_id
    created_at: Date;
    updated_at?: Date;
}

export interface IExpenseDocument extends IExpense, Document { }

const expenseSchema = new Schema<IExpenseDocument>(
    {
        expense_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        expense_date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: EXPENSE_STATUSES,
            default: "Unpaid"
        },
        created_by: {
            type: String,
            required: true,
            trim: true
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Reports by category and period
expenseSchema.index({ category: 1, expense_date: -1 });
expenseSchema.index({ expense_date: -1 });

const Expense: Model<IExpenseDocument> = model<IExpenseDocument>(
    "Expense",
    expenseSchema
);

export default Expense;