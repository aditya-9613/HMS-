// IPD.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const IPD_STATUSES = ["Admitted", "Discharged"] as const;

export type IpdStatus = (typeof IPD_STATUSES)[number];

export interface IIPD {
    ipd_id: string; // e.g. IPD-0001
    patient_id: string; // References Patients.patient_id
    appointment_id?: string | null; // Appointment that led to the admission, null for direct admissions
    staff_id: string; // Admitting doctor, references Staff.staff_id
    admitted_at: Date;
    discharged_at?: Date | null; // Empty while admitted
    ward: string;
    bed_number: string;
    status: IpdStatus;
    created_at: Date;
    updated_at?: Date;
}

export interface IIPDDocument extends IIPD, Document { }

const ipdSchema = new Schema<IIPDDocument>(
    {
        ipd_id: {
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
        appointment_id: {
            type: String,
            default: null,
            trim: true
        },
        staff_id: {
            type: String,
            required: true,
            trim: true
        },
        admitted_at: {
            type: Date,
            required: true,
            default: Date.now
        },
        discharged_at: {
            type: Date,
            default: null
        },
        ward: {
            type: String,
            required: true,
            trim: true
        },
        bed_number: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: IPD_STATUSES,
            default: "Admitted"
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Keep discharge fields consistent with status
ipdSchema.pre("validate", function () {
    if (this.status === "Discharged") {
        if (!this.discharged_at) {
            this.discharged_at = new Date();
        }
        if (this.discharged_at < this.admitted_at) {
            this.invalidate("discharged_at", "discharged_at cannot be before admitted_at");
        }
    } else {
        this.discharged_at = null;
    }
});

// One patient's admissions, newest first
ipdSchema.index({ patient_id: 1, admitted_at: -1 });
// Current admissions by ward
ipdSchema.index({ status: 1, ward: 1 });
// Link back to the appointment (only when set)
ipdSchema.index(
    { appointment_id: 1 },
    { partialFilterExpression: { appointment_id: { $type: "string" } } }
);

// A bed can hold only one admitted patient at a time
ipdSchema.index(
    { ward: 1, bed_number: 1 },
    { unique: true, partialFilterExpression: { status: "Admitted" } }
);

const IPD: Model<IIPDDocument> = model<IIPDDocument>("IPD", ipdSchema);

export default IPD;