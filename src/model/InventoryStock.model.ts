// InventoryStock.model.ts
import { Schema, model, Document, Model } from "mongoose";

export interface IInventoryStock {
    stock_id: string; // e.g. STK-0001
    item_id: string; // References InventoryItems.item_id
    batch_number?: string | null;
    expiry_date?: Date | null; // For items that expire
    quantity: number; // Current stock
    reorder_level: number; // Alert when stock falls below this
    location?: string | null; // Store or shelf
    received_at: Date;
    created_at: Date;
    updated_at?: Date;
}

export interface IInventoryStockDocument extends IInventoryStock, Document { }

const inventoryStockSchema = new Schema<IInventoryStockDocument>(
    {
        stock_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        item_id: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        batch_number: {
            type: String,
            default: null,
            trim: true
        },
        expiry_date: {
            type: Date,
            default: null
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
        location: {
            type: String,
            default: null,
            trim: true
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

// Expiry alerts (documents without an expiry date are skipped)
inventoryStockSchema.index({ expiry_date: 1 });
// Stock of one item by earliest expiry
inventoryStockSchema.index({ item_id: 1, expiry_date: 1 });

const InventoryStock: Model<IInventoryStockDocument> =
    model<IInventoryStockDocument>("InventoryStock", inventoryStockSchema);

export default InventoryStock;