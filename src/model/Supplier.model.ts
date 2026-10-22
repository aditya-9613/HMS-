// Supplier.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const SUPPLIER_STATUSES = ["Active", "Inactive"] as const;

export type SupplierStatus = (typeof SUPPLIER_STATUSES)[number];

export interface ISupplier {
    supplier_id: string; // e.g. SUP-0001
    name: string;
    contact_person?: string | null;
    phone: string;
    email?: string | null;
    address?: string | null;
    gst_number?: string | null;
    supplies: string[]; // e.g. Surgical, Consumables, Equipment
    status: SupplierStatus;
    created_at: Date;
    updated_at?: Date;
}

export interface ISupplierDocument extends ISupplier, Document { }

const supplierSchema = new Schema<ISupplierDocument>(
    {
        supplier_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        contact_person: {
            type: String,
            default: null,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            default: null,
            lowercase: true,
            trim: true
        },
        address: {
            type: String,
            default: null,
            trim: true
        },
        gst_number: {
            type: String,
            default: null,
            uppercase: true,
            trim: true
        },
        supplies: {
            type: [String],
            default: []
        },
        status: {
            type: String,
            required: true,
            enum: SUPPLIER_STATUSES,
            default: "Active"
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const Supplier: Model<ISupplierDocument> = model<ISupplierDocument>(
    "Supplier",
    supplierSchema
);

export default Supplier;