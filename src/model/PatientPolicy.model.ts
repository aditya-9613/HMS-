// PatientPolicy.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const POLICY_PROVIDER_TYPES = ["Insurer", "TPA", "ECHS"] as const;
export const POLICY_STATUSES = ["Pending", "Accepted", "Rejected"] as const;

export type PolicyProviderType = (typeof POLICY_PROVIDER_TYPES)[number];
export type PolicyStatus = (typeof POLICY_STATUSES)[number];

export interface IPatientPolicy {
    policy_id: string; // e.g. POL-0001
    patient_id: string; // References Patients.patient_id
    provider_id: string; // References InsuranceProviders.provider_id
    provider_type: PolicyProviderType;
    provider_name: string; // Name of that insurer, TPA or ECHS, written in
    policy_number: string; // Policy or card number
    policyholder_name?: string | null; // When the patient is not the policyholder
    sum_insured?: number | null;
    valid_from: Date;
    valid_until: Date;
    status: PolicyStatus;
    rejection_reason?: string | null; // Set only when Rejected
    created_at: Date;
    updated_at?: Date;
}

export interface IPatientPolicyDocument extends IPatientPolicy, Document { }

const patientPolicySchema = new Schema<IPatientPolicyDocument>(
    {
        policy_id: { type: String, required: true, unique: true, trim: true },
        patient_id: { type: String, required: true, trim: true },
        provider_id: { type: String, required: true, trim: true },
        provider_type: { type: String, required: true },
        provider_name: { type: String, required: true, trim: true },
        policy_number: { type: String, required: true, trim: true },
        policyholder_name: { type: String, default: null, trim: true },
        sum_insured: { type: Number, default: null },
        valid_from: { type: Date, required: true },
        valid_until: { type: Date, required: true },
        status: { type: String, required: true, default: "Pending" },
        rejection_reason: { type: String, default: null, trim: true },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Policies of one patient, and lookup by policy number within a provider
patientPolicySchema.index({ patient_id: 1, valid_until: -1 });
patientPolicySchema.index({ provider_id: 1, policy_number: 1 });
patientPolicySchema.index({ status: 1 });

const PatientPolicy: Model<IPatientPolicyDocument> = model<IPatientPolicyDocument>(
    "PatientPolicy",
    patientPolicySchema
);

export default PatientPolicy;