// Bill.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const BILL_TYPES = ["OPD", "IPD"] as const;
export const BILL_STATUSES = ["Unpaid", "Partial", "Paid", "Cancelled"] as const;

export type BillType = (typeof BILL_TYPES)[number];
export type BillStatus = (typeof BILL_STATUSES)[number];

export interface IBillItem {
    description: string;
    category: string;
    quantity: number;
    rate: number;
    amount: number;
    staff_id?: string | null; // Doctor for consultation lines, otherwise null
}

export interface IBill {
    bill_id: string; // e.g. BIL-0001
    patient_id: string; // References Patients.patient_id
    ipd_id?: string | null; // Set for IPD stays
    bill_type: BillType;
    items: IBillItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total_amount: number;
    patient_share: number; // Amount the patient pays
    insurer_share: number; // Amount claimed from insurer or TPA, 0 for cash
    claim_id?: string | null; // Set when an insurance claim is raised
    paid_amount: number; // Total received so far
    status: BillStatus;
    billed_at: Date;
    created_by: string; // References Users.user_id
    created_at: Date;
    updated_at?: Date;
}

export interface IBillDocument extends IBill, Document { }

const billItemSchema = new Schema<IBillItem>(
    {
        description: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 0 },
        rate: { type: Number, required: true, min: 0 },
        amount: { type: Number, required: true, min: 0 },
        staff_id: { type: String, default: null, trim: true },
    },
    { _id: false }
);

const billSchema = new Schema<IBillDocument>(
    {
        bill_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        patient_id: {
            type: String,
            required: true,
            trim: true
        },
        ipd_id: {
            type: String,
            default: null,
            trim: true
        },
        bill_type: {
            type: String,
            required: true,
            enum: BILL_TYPES
        },
        items: {
            type: [billItemSchema],
            required: true,
            validate: {
                validator: (v: IBillItem[]) => v.length > 0,
                message: "A bill must have at least one item",
            },
        },
        subtotal: { type: Number, required: true, min: 0 },
        discount: { type: Number, required: true, min: 0, default: 0 },
        tax: { type: Number, required: true, min: 0, default: 0 },
        total_amount: { type: Number, required: true, min: 0 },
        patient_share: { type: Number, required: true, min: 0 },
        insurer_share: { type: Number, required: true, min: 0, default: 0 },
        claim_id: {
            type: String,
            default: null,
            trim: true
        },
        paid_amount: { type: Number, required: true, min: 0, default: 0 },
        status: {
            type: String,
            required: true,
            enum: BILL_STATUSES,
            default: "Unpaid"
        },
        billed_at: {
            type: Date,
            required: true,
            default: Date.now
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

billSchema.pre("validate", function () {
    // IPD bills must point to an IPD stay
    if (this.bill_type === "IPD" && !this.ipd_id) {
        this.invalidate("ipd_id", "ipd_id is required for IPD bills");
    }
    // total = subtotal - discount + tax
    if (round2(this.subtotal - this.discount + this.tax) !== round2(this.total_amount)) {
        this.invalidate("total_amount", "total_amount must equal subtotal - discount + tax");
    }
    // patient + insurer shares must add up to the total
    if (round2(this.patient_share + this.insurer_share) !== round2(this.total_amount)) {
        this.invalidate("patient_share", "patient_share + insurer_share must equal total_amount");
    }
    if (round2(this.paid_amount) > round2(this.total_amount)) {
        this.invalidate("paid_amount", "paid_amount cannot exceed total_amount");
    }
});

// Bills of one patient, newest first
billSchema.index({ patient_id: 1, billed_at: -1 });
// Pending-payment lists and daily collection reports
billSchema.index({ status: 1, billed_at: -1 });
// Bills of one IPD stay (only when set)
billSchema.index(
    { ipd_id: 1 },
    { partialFilterExpression: { ipd_id: { $type: "string" } } }
);
// Doctor earnings: find consultation lines by doctor
billSchema.index({ "items.staff_id": 1 });

const Bill: Model<IBillDocument> = model<IBillDocument>("Bill", billSchema);

export default Bill;