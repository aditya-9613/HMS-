// DutyRoster.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const DUTY_TYPES = ["Regular", "On-Call", "Overtime"] as const;
export const ROSTER_STATUSES = [
    "Scheduled",
    "Completed",
    "Absent",
    "Swapped",
    "Cancelled",
] as const;

export type DutyType = (typeof DUTY_TYPES)[number];
export type RosterStatus = (typeof ROSTER_STATUSES)[number];

export interface IDutyRoster {
    roster_id: string; // e.g. ROS-0001
    staff_id: string; // References Staff.staff_id
    shift_id: string; // References Shifts.shift_id
    duty_date: Date;
    duty_type: DutyType;
    status: RosterStatus;
    replaced_by_staff_id?: string | null; // Staff who covered if swapped or absent
    check_in?: Date | null; // Actual arrival
    check_out?: Date | null; // Actual departure
    remarks?: string | null;
    assigned_by: string; // References Users.user_id
    created_at: Date;
    updated_at?: Date;
}

export interface IDutyRosterDocument extends IDutyRoster, Document { }

const dutyRosterSchema = new Schema<IDutyRosterDocument>(
    {
        roster_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        staff_id: {
            type: String,
            required: true,
            trim: true
        },
        shift_id: {
            type: String,
            required: true,
            trim: true
        },
        duty_date: {
            type: Date,
            required: true
        },
        duty_type: {
            type: String,
            required: true,
            enum: DUTY_TYPES,
            default: "Regular"
        },
        status: {
            type: String,
            required: true,
            enum: ROSTER_STATUSES,
            default: "Scheduled"
        },
        replaced_by_staff_id: {
            type: String,
            default: null,
            trim: true
        },
        check_in: {
            type: Date,
            default: null
        },
        check_out: {
            type: Date,
            default: null,
        },
        remarks: {
            type: String,
            default: null,
            trim: true
        },
        assigned_by: {
            type: String,
            required: true,
            trim: true
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// A staff member cannot be rostered twice on the same shift and date
dutyRosterSchema.index(
    { staff_id: 1, shift_id: 1, duty_date: 1 },
    { unique: true }
);

// Roster of a date (all staff), and of one staff member over a period (payroll days_worked)
dutyRosterSchema.index({ duty_date: 1, shift_id: 1 });
dutyRosterSchema.index({ staff_id: 1, duty_date: -1 });

const DutyRoster: Model<IDutyRosterDocument> = model<IDutyRosterDocument>(
    "DutyRoster",
    dutyRosterSchema
);

export default DutyRoster;