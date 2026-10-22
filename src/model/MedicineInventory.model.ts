// MedicineInventory.model.ts
import { Schema, model, Document, Model } from "mongoose";

export interface IMedicineInventory {
    inventory_id: string; // e.g. INV-0001
    medicine_id: string; // References Medicines.medicine_id
    batch_number: string;
    expiry_date: Date;
    quantity: number; // Current stock in this batch
    reorder_level: number; // Alert when total stock falls below this
    received_at: Date;
    created_at: Date;
    updated_at?: Date;
}

export interface IMedicineInventoryDocument extends IMedicineInventory, Document { }

const medicineInventorySchema = new Schema<IMedicineInventoryDocument>(
    {
        inventory_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        medicine_id: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        batch_number: {
            type: String,
            required: true,
            trim: true
        },
        expiry_date: {
            type: Date,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "quantity must be a whole number",
            },
        },
        reorder_level: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "reorder_level must be a whole number",
            },
        },
        received_at: {
            type: Date,
            required: true,
            default: Date.now
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Find batches of a medicine by earliest expiry (FEFO dispensing)
medicineInventorySchema.index({ medicine_id: 1, expiry_date: 1 });
// Expiry alerts across all medicines
medicineInventorySchema.index({ expiry_date: 1 });

const MedicineInventory: Model<IMedicineInventoryDocument> =
    model<IMedicineInventoryDocument>("MedicineInventory", medicineInventorySchema);

export default MedicineInventory;