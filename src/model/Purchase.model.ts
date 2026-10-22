// Purchase.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const PURCHASE_ITEM_TYPES = ["Item", "Medicine"] as const;
export const PURCHASE_STATUSES = ["Unpaid", "Partial", "Paid", "Cancelled"] as const;

export type PurchaseItemType = (typeof PURCHASE_ITEM_TYPES)[number];
export type PurchaseStatus = (typeof PURCHASE_STATUSES)[number];

export interface IPurchaseItem {
    item_type: PurchaseItemType;
    item_id: string; // InventoryItems.item_id or Medicines.medicine_id, as per item_type
    quantity: number;
    rate: number;
    tax: number;
    amount: number;
}

export interface IPurchase {
    purchase_id: string; // e.g. PUR-0001
    supplier_id: string; // References Suppliers.supplier_id
    invoice_number: string; // Supplier invoice number
    invoice_date: Date;
    items: IPurchaseItem[];
    subtotal: number;
    tax: number;
    total_amount: number;
    paid_amount: number; // Total paid so far
    due_date?: Date | null;
    status: PurchaseStatus;
    created_by: string; // References Users.user_id
    created_at: Date;
    updated_at?: Date;
}

export interface IPurchaseDocument extends IPurchase, Document { }

const purchaseItemSchema = new Schema<IPurchaseItem>(
    {
        item_type: { type: String, required: true, enum: PURCHASE_ITEM_TYPES },
        item_id: { type: String, required: true, trim: true },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "quantity must be a whole number",
            },
        },
        rate: { type: Number, required: true, min: 0 },
        tax: { type: Number, required: true, min: 0, default: 0 },
        amount: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const purchaseSchema = new Schema<IPurchaseDocument>(
    {
        purchase_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        supplier_id: {
            type: String,
            required: true,
            trim: true
        },
        invoice_number: {
            type: String,
            required: true,
            trim: true
        },
        invoice_date: {
            type: Date,
            required: true
        },
        items: {
            type: [purchaseItemSchema],
            required: true,
            validate: {
                validator: (v: IPurchaseItem[]) => v.length > 0,
                message: "A purchase must have at least one item",
            },
        },
        subtotal: { type: Number, required: true, min: 0 },
        tax: { type: Number, required: true, min: 0, default: 0 },
        total_amount: { type: Number, required: true, min: 0 },
        paid_amount: { type: Number, required: true, min: 0, default: 0 },
        due_date: {
            type: Date,
            default: null
        },
        status: {
            type: String,
            required: true,
            enum: PURCHASE_STATUSES,
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

const round2 = (n: number) => Math.round(n * 100) / 100;

purchaseSchema.pre("validate", function () {
    if (round2(this.subtotal + this.tax) !== round2(this.total_amount)) {
        this.invalidate("total_amount", "total_amount must equal subtotal + tax");
    }
    if (round2(this.paid_amount) > round2(this.total_amount)) {
        this.invalidate("paid_amount", "paid_amount cannot exceed total_amount");
    }
    if (this.due_date && this.due_date < this.invoice_date) {
        this.invalidate("due_date", "due_date cannot be before invoice_date");
    }
});

// The same supplier invoice should not be entered twice
purchaseSchema.index({ supplier_id: 1, invoice_number: 1 }, { unique: true });
// Payables: unpaid purchases by due date
purchaseSchema.index({ status: 1, due_date: 1 });

const Purchase: Model<IPurchaseDocument> = model<IPurchaseDocument>(
    "Purchase",
    purchaseSchema
);

export default Purchase;