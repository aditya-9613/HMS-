// Transaction.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const TRANSACTION_DIRECTIONS = ["In", "Out"] as const;
export const TRANSACTION_METHODS = [
    "Cash",
    "Card",
    "UPI",
    "Bank Transfer",
    "Cheque",
] as const;
export const TRANSACTION_SOURCE_TYPES = [
    "Patient Payment",
    "Insurance Settlement",
    "Supplier Payment",
    "Expense",
    "Salary",
    "Refund",
] as const;
export const TRANSACTION_STATUSES = [
    "Pending",
    "Completed",
    "Failed",
    "Reversed",
] as const;

export type TransactionDirection = (typeof TRANSACTION_DIRECTIONS)[number];
export type TransactionMethod = (typeof TRANSACTION_METHODS)[number];
export type TransactionSourceType = (typeof TRANSACTION_SOURCE_TYPES)[number];
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

// Money coming in vs going out, per source type
const INCOMING_SOURCES: TransactionSourceType[] = [
    "Patient Payment",
    "Insurance Settlement",
];

export interface ITransaction {
    transaction_id: string; // e.g. TXN-0001
    direction: TransactionDirection;
    amount: number;
    method: TransactionMethod;
    source_type: TransactionSourceType;
    reference_id: string; // Bill, claim, purchase, expense or payslip ID, as per source_type
    transaction_reference?: string | null; // Receipt number, UTR or cheque number
    status: TransactionStatus;
    transacted_at: Date;
    remarks?: string | null;
    created_by?: string | null; // References Users.user_id, null for automatic payouts
    created_at: Date;
    updated_at?: Date;
}

export interface ITransactionDocument extends ITransaction, Document { }

const transactionSchema = new Schema<ITransactionDocument>(
    {
        transaction_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        direction: {
            type: String,
            required: true,
            enum: TRANSACTION_DIRECTIONS
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        method: {
            type: String,
            required: true,
            enum: TRANSACTION_METHODS
        },
        source_type: {
            type: String,
            required: true,
            enum: TRANSACTION_SOURCE_TYPES
        },
        reference_id: {
            type: String,
            required: true,
            trim: true
        },
        transaction_reference: {
            type: String,
            default: null,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: TRANSACTION_STATUSES,
            default: "Pending"
        },
        transacted_at: {
            type: Date,
            required: true,
            default: Date.now
        },
        remarks: {
            type: String,
            default: null,
            trim: true
        },
        created_by: {
            type: String,
            default: null,
            trim: true
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Direction must match the source (Refund is the only source that can go either way)
transactionSchema.pre("validate", function () {
    if (this.source_type === "Refund") return;
    const expected: TransactionDirection = INCOMING_SOURCES.includes(this.source_type)
        ? "In"
        : "Out";
    if (this.direction !== expected) {
        this.invalidate(
            "direction",
            `direction must be ${expected} for source_type ${this.source_type}`
        );
    }
});

// All transactions of one bill, claim, purchase, expense or payslip
transactionSchema.index({ source_type: 1, reference_id: 1 });
// Day book and cash flow reports
transactionSchema.index({ transacted_at: -1 });
transactionSchema.index({ direction: 1, status: 1, transacted_at: -1 });

const Transaction: Model<ITransactionDocument> = model<ITransactionDocument>(
    "Transaction",
    transactionSchema
);

export default Transaction;