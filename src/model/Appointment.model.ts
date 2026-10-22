// Appointment.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const APPOINTMENT_STATUSES = [
    "Scheduled",
    "Completed",
    "Cancelled",
    "No Show",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface IAppointment {
    appointment_id: string; // e.g. APT-0001
    patient_id: string; // References Patients.patient_id
    staff_id: string; // Doctor, references Staff.staff_id
    scheduled_at: Date;
    reason?: string | null; // Reason for visit or complaint
    status: AppointmentStatus;
    cancelled_at?: Date | null; // Set only when cancelled
    cancel_reason?: string | null; // Set only when cancelled
    created_by: string; // References Users.user_id
    created_at: Date;
    updated_at?: Date;
}

export interface IAppointmentDocument extends IAppointment, Document { }

const appointmentSchema = new Schema<IAppointmentDocument>(
    {
        appointment_id: {
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
        staff_id: {
            type: String,
            required: true,
            trim: true
        },
        scheduled_at: {
            type: Date,
            required: true
        },
        reason: {
            type: String,
            default: null,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: APPOINTMENT_STATUSES,
            default: "Scheduled"
        },
        cancelled_at: {
            type: Date,
            default: null
        },
        cancel_reason: {
            type: String,
            default: null,
            trim: true
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

// Cancelled fields are only meaningful when status is Cancelled
appointmentSchema.pre("validate", function () {
    if (this.status === "Cancelled") {
        if (!this.cancelled_at) {
            this.cancelled_at = new Date();
        }
    } else {
        this.cancelled_at = null;
        this.cancel_reason = null;
    }
});

// A doctor's schedule for a day, and a patient's appointment history
appointmentSchema.index({ staff_id: 1, scheduled_at: 1 });
appointmentSchema.index({ patient_id: 1, scheduled_at: -1 });
appointmentSchema.index({ status: 1, scheduled_at: 1 });

const Appointment: Model<IAppointmentDocument> = model<IAppointmentDocument>(
    "Appointment",
    appointmentSchema
);

export default Appointment;