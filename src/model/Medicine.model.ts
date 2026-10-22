// Medicine.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const MEDICINE_STATUSES = ["Active", "Inactive"] as const;

export type MedicineStatus = (typeof MEDICINE_STATUSES)[number];

export interface IMedicine {
    medicine_id: string; // e.g. MED-0001
    barcode: string; // Generated once per drug type
    name: string;
    unit_price: number;
    status: MedicineStatus;
    created_at: Date;
    updated_at?: Date;
}

export interface IMedicineDocument extends IMedicine, Document { }

const medicineSchema = new Schema<IMedicineDocument>(
    {
        medicine_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        barcode: {
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
        unit_price: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            required: true,
            enum: MEDICINE_STATUSES,
            default: "Active"
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const Medicine: Model<IMedicineDocument> = model<IMedicineDocument>("Medicine", medicineSchema);

export default Medicine;