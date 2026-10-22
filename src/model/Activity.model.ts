// ActivityLog.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const ACTIVITY_ACTIONS = [
    "Create",
    "Update",
    "Delete",
    "Approve",
    "Login",
    "Logout",
    "Payout",
    "Other",
] as const;

export const ACTIVITY_STATUSES = ["Success", "Failed"] as const;

export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

export interface IActivityLog {
    log_id: string; // e.g. LOG-0001
    user_id: string; // References Users.user_id
    action: ActivityAction;
    module: string; // e.g. Patients, Bills, Payroll, Inventory
    record_id?: string | null; // ID of the affected record, null for Login etc.
    description: string;
    before_data?: Record<string, unknown> | null;
    after_data?: Record<string, unknown> | null;
    status: ActivityStatus;
    ip_address?: string | null;
    device?: string | null;
    performed_at: Date;
}

export interface IActivityLogDocument extends IActivityLog, Document { }

const activityLogSchema = new Schema<IActivityLogDocument>(
    {
        log_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        user_id: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        action: {
            type: String,
            required: true,
            enum: ACTIVITY_ACTIONS
        },
        module: {
            type: String,
            required: true,
            trim: true
        },
        record_id: {
            type: String,
            default: null,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        before_data: {
            type: Schema.Types.Mixed,
            default: null
        },
        after_data: {
            type: Schema.Types.Mixed,
            default: null
        },
        status: {
            type: String,
            required: true,
            enum: ACTIVITY_STATUSES,
            default: "Success"
        },
        ip_address: {
            type: String,
            default: null,
            trim: true
        },
        device: {
            type: String,
            default: null,
            trim: true
        },
        performed_at: {
            type: Date,
            required: true,
            default: Date.now
        },
    },
    {
        // Logs are append-only, so no created_at / updated_at.
        // performed_at is the only timestamp.
        timestamps: false,
    }
);

// Common lookups: history of one record, recent activity per module, newest first
activityLogSchema.index({ module: 1, record_id: 1 });
activityLogSchema.index({ module: 1, performed_at: -1 });
activityLogSchema.index({ performed_at: -1 });

const ActivityLog: Model<IActivityLogDocument> = model<IActivityLogDocument>(
    "ActivityLog",
    activityLogSchema
);

export default ActivityLog;