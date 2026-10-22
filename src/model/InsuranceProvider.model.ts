// InsuranceProvider.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const PROVIDER_TYPES = ["Insurer", "TPA", "ECHS", "Other"] as const;
export const PROVIDER_STATUSES = ["Active", "Inactive"] as const;

export type ProviderType = (typeof PROVIDER_TYPES)[number];
export type ProviderStatus = (typeof PROVIDER_STATUSES)[number];

export interface IInsuranceProvider {
    provider_id: string; // e.g. PRV-0001
    name: string;
    provider_type: ProviderType;
    contact_person?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    status: ProviderStatus;
    created_at: Date;
    updated_at?: Date;
}

export interface IInsuranceProviderDocument extends IInsuranceProvider, Document { }

const insuranceProviderSchema = new Schema<IInsuranceProviderDocument>(
    {
        provider_id: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true, index: true },
        provider_type: { type: String, required: true },
        contact_person: { type: String, default: null, trim: true },
        phone: { type: String, default: null, trim: true },
        email: { type: String, default: null, lowercase: true, trim: true },
        address: { type: String, default: null, trim: true },
        status: { type: String, required: true, default: "Active" },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

const InsuranceProvider: Model<IInsuranceProviderDocument> =
    model<IInsuranceProviderDocument>("InsuranceProvider", insuranceProviderSchema);

export default InsuranceProvider;