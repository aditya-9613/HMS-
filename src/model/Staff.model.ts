// Staff.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const STAFF_GENDERS = ["Male", "Female", "Other"] as const;
export const STAFF_STATUSES = [
    "Active",
    "On Leave",
    "Resigned",
    "Terminated",
] as const;
export const STAFF_TYPES = ["Doctor", "Nurse", "Cleaning Staff"] as const;
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

export type StaffGender = (typeof STAFF_GENDERS)[number];
export type StaffStatus = (typeof STAFF_STATUSES)[number];
export type StaffType = (typeof STAFF_TYPES)[number];
export type BloodGroup = (typeof BLOOD_GROUPS)[number];
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

export interface IStaff {
    staff_id: string; // e.g. STF-0001
    name: string;
    email?: string | null;
    blood_group?: BloodGroup | null;
    marital_status?: MaritalStatus | null;
    gender: StaffGender;
    dob: Date;
    status: StaffStatus;
    department?: string | null; // e.g. OPD, ICU, Pharmacy
    designation?: string | null; // e.g. Senior Consultant, Head Nurse
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    photo_url?: string | null;
    father_name?: string | null;
    mother_name?: string | null;
    phone: string;
    address?: string | null;
    document_number?: string | null; // ID proof number
    staff_type: StaffType;
    specialization?: string | null; // Doctors only
    qualification?: string | null;
    experience?: number | null; // Years of experience
    joining_date: Date;
    leaving_date?: Date | null; // Empty while still working
    acr?: string | null; // Annual Confidential Report grade/remark
    created_at: Date;
    updated_at?: Date;
}

export interface IStaffDocument extends IStaff, Document { }

const staffSchema = new Schema<IStaffDocument>(
    {
        staff_id: {
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
        email: {
            type: String,
            default: null,
            lowercase: true,
            trim: true
        },
        blood_group: {
            type: String,
            enum: { values: BLOOD_GROUPS, message: "Invalid blood group" },
            default: null
        },
        marital_status: {
            type: String,
            enum: { values: MARITAL_STATUSES, message: "Invalid marital status" },
            default: null
        },
        gender: {
            type: String,
            required: true,
            enum: STAFF_GENDERS
        },
        dob: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: STAFF_STATUSES,
            default: "Active"
        },
        department: {
            type: String,
            default: null,
            trim: true
        },
        designation: {
            type: String,
            default: null,
            trim: true
        },
        emergency_contact_name: {
            type: String,
            default: null,
            trim: true
        },
        emergency_contact_phone: {
            type: String,
            default: null,
            trim: true
        },
        photo_url: {
            type: String,
            default: null,
            trim: true
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
        phone: {
            type: String,
            required: true,
            trim: true
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
        staff_type: {
            type: String,
            required: true,
            enum: STAFF_TYPES
        },
        specialization: {
            type: String,
            default: null,
            trim: true
        },
        qualification: {
            type: String,
            default: null,
            trim: true
        },
        experience: {
            type: Number,
            default: null,
            min: 0
        },
        joining_date: {
            type: Date,
            required: true
        },
        leaving_date: {
            type: Date,
            default: null
        },
        acr: {
            type: String,
            default: null,
            trim: true
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Lists filtered by role, department and status (for example active doctors in OPD)
staffSchema.index({ staff_type: 1, status: 1 });
staffSchema.index({ department: 1, status: 1 });

const Staff: Model<IStaffDocument> = model<IStaffDocument>("Staff", staffSchema);

export default Staff;