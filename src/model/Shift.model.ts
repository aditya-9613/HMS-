// Shift.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const SHIFT_DEPARTMENTS = ["IPD", "OPD", "Pharmacy", "Lab", "Other"] as const;

export type ShiftDepartment = (typeof SHIFT_DEPARTMENTS)[number];

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:mm, 24-hour

export interface IShift {
    shift_id: string; // e.g. SFT-0001
    name: string; // e.g. Morning, Evening, Night
    department: ShiftDepartment;
    start_date: Date; // First day of the tenure
    end_date: Date; // Last day of the tenure
    start_time: string; // "HH:mm"
    end_time: string; // "HH:mm", may be earlier than start_time for night shifts
    created_at: Date;
    updated_at?: Date;
}

export interface IShiftDocument extends IShift, Document { }

const shiftSchema = new Schema<IShiftDocument>(
    {
        shift_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        department: {
            type: String,
            required: true,
            enum: SHIFT_DEPARTMENTS
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: true
        },
        start_time: {
            type: String,
            required: true,
            match: [TIME_REGEX, "start_time must be in HH:mm format"]
        },
        end_time: {
            type: String,
            required: true,
            match: [TIME_REGEX, "end_time must be in HH:mm format"]
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Find shifts active on a given date for a department
shiftSchema.index({ department: 1, start_date: 1, end_date: 1 });

const Shift: Model<IShiftDocument> = model<IShiftDocument>("Shift", shiftSchema);

export default Shift;