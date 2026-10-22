// Patient.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const PATIENT_GENDERS = ["Male", "Female", "Other"] as const;
export const PAYMENT_TYPES = ["Cash", "TPA"] as const;
export const TPA_TYPES = ["Insurance Company", "ECHS", "Other"] as const;
export const BLOOD_GROUPS = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
] as const;
export const MARITAL_STATUSES = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
] as const;

export type PatientGender = (typeof PATIENT_GENDERS)[number];
export type PaymentType = (typeof PAYMENT_TYPES)[number];
export type TpaType = (typeof TPA_TYPES)[number];
export type BloodGroup = (typeof BLOOD_GROUPS)[number];
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

export interface IPatient {
    patient_id: string; // e.g. PAT-0001
    name: string;
    father_name?: string | null;
    mother_name?: string | null;
    dob: Date;
    gender: PatientGender;
    phone: string;
    address?: string | null;
    document_number?: string | null; // ID proof number
    payment_type: PaymentType;
    tpa_type?: TpaType | null; // Set only when payment_type is TPA
    attendant_name?: string | null;
    attendant_phone?: string | null;
    attendant_relation?: string | null; // e.g. Father, Spouse
    email?: string | null;
    blood_group?: BloodGroup | null;
    marital_status?: MaritalStatus | null;
    registered_at: Date;
    created_at: Date;
    updated_at?: Date;
}

export interface IPatientDocument extends IPatient, Document { }

const patientSchema = new Schema<IPatientDocument>(
    {
        patient_id: {
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
        father_name: {
            type: String,
            default: null,
            trim: true
        },
        mother_name: {
            type: String,
            default: null,
            trim: true
        },
        dob: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            required: true,
            enum: PATIENT_GENDERS
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        address: {
            type: String,
            default: null,
            trim: true
        },
        document_number: {
            type: String,
            default: null,
            trim: true
        },
        payment_type: {
            type: String,
            required: true,
            enum: PAYMENT_TYPES
        },
        tpa_type: {
            type: String,
            default: null,
            enum: { values: [...TPA_TYPES, null], message: "Invalid TPA type" },
            required: [
                function (this: IPatientDocument) {
                    return this.payment_type === "TPA";
                },
                "tpa_type is required when payment_type is TPA",
            ],
        },
        attendant_name: {
            type: String,
            default: null,
            trim: true
        },
        attendant_phone: {
            type: String,
            default: null,
            trim: true
        },
        attendant_relation: {
            type: String,
            default: null,
            trim: true
        },
        email: {
            type: String,
            default: null,
            lowercase: true,
            trim: true
        },
        blood_group: {
            type: String,
            enum: { values: [...BLOOD_GROUPS, null], message: "Invalid blood group" },
            default: null
        },
        marital_status: {
            type: String,
            enum: {
                values: [...MARITAL_STATUSES, null],
                message: "Invalid marital status",
            },
            default: null
        },
        registered_at: {
            type: Date,
            required: true,
            default: Date.now
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Clear tpa_type for cash patients so stale values never stay
patientSchema.pre("validate", function () {
    if (this.payment_type === "Cash") {
        this.tpa_type = null;
    }
});

// Search by name or phone at the reception desk
patientSchema.index({ name: 1, phone: 1 });

const Patient: Model<IPatientDocument> = model<IPatientDocument>(
    "Patient",
    patientSchema
);

export default Patient;