// InsuranceClaim.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const CLAIM_STATUSES = ["Submitted", "Approved", "Rejected", "Settled"] as const;

export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export interface IInsuranceClaim {
    claim_id: string; // e.g. CLM-0001
    policy_id: string; // Only for policies with status Accepted
    bill_id: string; // Bill being claimed
    ipd_id?: string | null; // Set for IPD stays
    preauth_amount?: number | null;
    claimed_amount: number;
    approved_amount?: number | null; // Null until decided
    status: ClaimStatus;
    rejection_reason?: string | null; // Set only when Rejected
    documents?: string[]; // Document URLs
    submitted_at: Date;
    settled_at?: Date | null;
    remarks?: string | null;
    created_at: Date;
    updated_at?: Date;
}

export interface IInsuranceClaimDocument extends IInsuranceClaim, Document { }

const insuranceClaimSchema = new Schema<IInsuranceClaimDocument>(
    {
        claim_id: { type: String, required: true, unique: true, trim: true },
        policy_id: { type: String, required: true, trim: true, index: true },
        bill_id: { type: String, required: true, trim: true, index: true },
        ipd_id: { type: String, default: null, trim: true },
        preauth_amount: { type: Number, default: null },
        claimed_amount: { type: Number, required: true },
        approved_amount: { type: Number, default: null },
        status: { type: String, required: true, default: "Submitted" },
        rejection_reason: { type: String, default: null, trim: true },
        documents: { type: [String], default: [] },
        submitted_at: { type: Date, required: true, default: Date.now },
        settled_at: { type: Date, default: null },
        remarks: { type: String, default: null, trim: true },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Claims pipeline by status, newest first
insuranceClaimSchema.index({ status: 1, submitted_at: -1 });

const InsuranceClaim: Model<IInsuranceClaimDocument> = model<IInsuranceClaimDocument>(
    "InsuranceClaim",
    insuranceClaimSchema
);

export default InsuranceClaim;