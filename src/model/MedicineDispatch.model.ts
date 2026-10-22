// MedicineDispatch.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const RECIPIENT_TYPES = ["Patient", "Doctor", "External"] as const;

export type RecipientType = (typeof RECIPIENT_TYPES)[number];

export interface IMedicineDispatch {
    dispatch_id: string; // e.g. DSP-0001
    inventory_id: string; // References MedicineInventory.inventory_id
    quantity: number;
    recipient_type: RecipientType;
    patient_id?: string | null; // Set when recipient_type is Patient
    staff_id?: string | null; // Set when recipient_type is Doctor
    external_name?: string | null; // Set when recipient_type is External
    external_phone?: string | null;
    prescription_id?: string | null; // References Prescriptions.prescription_id
    dispatched_by: string; // References Users.user_id
    dispatched_at: Date;
    remarks?: string | null;
    created_at: Date;
    updated_at?: Date;
}

export interface IMedicineDispatchDocument extends IMedicineDispatch, Document { }

const medicineDispatchSchema = new Schema<IMedicineDispatchDocument>(
    {
        dispatch_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        inventory_id: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "quantity must be a whole number",
            },
        },
        recipient_type: {
            type: String,
            required: true,
            enum: RECIPIENT_TYPES
        },
        patient_id: {
            type: String,
            default: null,
            trim: true,
            required: [
                function (this: IMedicineDispatchDocument) {
                    return this.recipient_type === "Patient";
                },
                "patient_id is required when recipient_type is Patient",
            ],
        },
        staff_id: {
            type: String,
            default: null,
            trim: true,
            required: [
                function (this: IMedicineDispatchDocument) {
                    return this.recipient_type === "Doctor";
                },
                "staff_id is required when recipient_type is Doctor",
            ],
        },
        external_name: {
            type: String,
            default: null,
            trim: true,
            required: [
                function (this: IMedicineDispatchDocument) {
                    return this.recipient_type === "External";
                },
                "external_name is required when recipient_type is External",
            ],
        },
        external_phone: {
            type: String,
            default: null,
            trim: true
        },
        prescription_id: {
            type: String,
            default: null,
            trim: true,
            index: true
        },
        dispatched_by: {
            type: String,
            required: true,
            trim: true
        },
        dispatched_at: {
            type: Date,
            required: true,
            default: Date.now
        },
        remarks: {
            type: String,
            default: null,
            trim: true
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Dispatch history per patient, newest first
medicineDispatchSchema.index({ patient_id: 1, dispatched_at: -1 });

const MedicineDispatch: Model<IMedicineDispatchDocument> =
    model<IMedicineDispatchDocument>("MedicineDispatch", medicineDispatchSchema);

export default MedicineDispatch;