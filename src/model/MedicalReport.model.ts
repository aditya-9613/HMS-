// MedicalReport.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const REPORT_TYPES = ["Lab", "Imaging", "Diagnosis", "Other"] as const;
export const REPORT_STATUSES = ["Draft", "Final", "Cancelled"] as const;

export type ReportType = (typeof REPORT_TYPES)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface IMedicalReport {
    report_id: string; // e.g. REP-0001
    patient_id: string; // References Patients.patient_id
    title: string; // e.g. Blood Test, X-Ray Chest
    content: string; // Final edited report content
    staff_id: string; // References Staff.staff_id
    report_type: ReportType;
    status: ReportStatus;
    remarks?: string | null;
    photo_urls?: string[];
    created_at: Date;
    updated_at?: Date;
}

export interface IMedicalReportDocument extends IMedicalReport, Document { }

const medicalReportSchema = new Schema<IMedicalReportDocument>(
    {
        report_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        patient_id: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true
        },
        staff_id: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        report_type: {
            type: String,
            required: true,
            enum: REPORT_TYPES
        },
        status: {
            type: String,
            required: true,
            enum: REPORT_STATUSES,
            default: "Draft"
        },
        remarks: {
            type: String,
            default: null,
            trim: true
        },
        photo_urls: {
            type: [String],
            default: []
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Reports of one patient, newest first
medicalReportSchema.index({ patient_id: 1, created_at: -1 });

const MedicalReport: Model<IMedicalReportDocument> =
    model<IMedicalReportDocument>("MedicalReport", medicalReportSchema);

export default MedicalReport;