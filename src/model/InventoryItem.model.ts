// InventoryItem.model.ts
import { Schema, model, Document, Model } from "mongoose";

export const ITEM_TYPES = ["Surgical", "Consumable", "Equipment", "Other"] as const;
export const ITEM_STATUSES = ["Active", "Inactive"] as const;

export type ItemType = (typeof ITEM_TYPES)[number];
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export interface IInventoryItem {
    item_id: string; // e.g. ITM-0001
    item_code: string; // Inventory code, also used as the barcode
    name: string;
    item_type: ItemType;
    supplier_id: string; // References Suppliers.supplier_id
    unit: string; // e.g. Piece, Box, Pack
    buying_cost: number; // Quoted price from the supplier
    actual_buying_cost: number; // Final cost after discount and tax
    selling_cost: number;
    mrp: number;
    status: ItemStatus;
    created_at: Date;
    updated_at?: Date;
}

export interface IInventoryItemDocument extends IInventoryItem, Document { }

const inventoryItemSchema = new Schema<IInventoryItemDocument>(
    {
        item_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        item_code: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        item_type: {
            type: String,
            required: true,
            enum: ITEM_TYPES
        },
        supplier_id: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        unit: {
            type: String,
            required: true,
            trim: true
        },
        buying_cost: {
            type: Number,
            required: true,
            min: 0
        },
        actual_buying_cost: {
            type: Number,
            required: true,
            min: 0
        },
        selling_cost: {
            type: Number,
            required: true,
            min: 0
        },
        mrp: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            required: true,
            enum: ITEM_STATUSES,
            default: "Active"
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Filter the catalog by type and status
inventoryItemSchema.index({ item_type: 1, status: 1 });

const InventoryItem: Model<IInventoryItemDocument> =
    model<IInventoryItemDocument>("InventoryItem", inventoryItemSchema);

export default InventoryItem;