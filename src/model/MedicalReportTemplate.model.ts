// MedicalReportTemplate.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const TEMPLATE_STATUSES = ["Active", "Inactive"] as const;

export type TemplateStatus = (typeof TEMPLATE_STATUSES)[number];

export interface IMedicalReportTemplate {
    template_id: string; // e.g. TPL-0001
    code: string; // Short code punched in the frontend to load the template
    name: string; // e.g. Blood Test, X-Ray Chest
    content: string; // Template body, pasted into a new report and then edited
    status: TemplateStatus;
    created_at: Date;
    updated_at?: Date;
}

export interface IMedicalReportTemplateDocument
    extends IMedicalReportTemplate,
    Document { }

const medicalReportTemplateSchema = new Schema<IMedicalReportTemplateDocument>(
    {
        template_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: TEMPLATE_STATUSES,
            default: "Active"
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const MedicalReportTemplate: Model<IMedicalReportTemplateDocument> =
    model<IMedicalReportTemplateDocument>(
        "MedicalReportTemplate",
        medicalReportTemplateSchema
    );

export default MedicalReportTemplate;