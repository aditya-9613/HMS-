// User.model.ts
import { Schema, model, Document, Model } from "mongoose";
import bcrypt from 'bcrypt'

export const USER_ROLES = [
    "Super Admin",
    "Admin",
    "Doctor",
    "Nurse",
    "Receptionist",
    "Lab Attendant",
    "Pharmacist",
    "Store Keeper",
    "Billing Executive",
    "Insurance Desk",
    "Accountant",
    "Payroll Manager",
] as const;

export const USER_STATUSES = ["Active", "Inactive", "Suspended"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    staff_id?: string | null; // References Staff.staff_id, null for Super Admin
    status: UserStatus;
    logged_in: boolean;
    must_change_password: boolean;
    failed_login_attempts: number;
    locked_until?: Date | null;
    last_login_at?: Date | null;
    created_at: Date;
    updated_at?: Date;
}

export interface IUserDocument extends IUser, Document {
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            required: true,
            enum: USER_ROLES
        },
        staff_id: {
            type: String,
            default: null
        },
        status: {
            type: String,
            required: true,
            enum: USER_STATUSES,
            default: "Active",
        },
        logged_in: {
            type: Boolean,
            required: true,
            default: false
        },
        must_change_password: {
            type: Boolean,
            required: true,
            default: true
        },
        failed_login_attempts: {
            type: Number,
            required: true,
            default: 0
        },
        locked_until: {
            type: Date,
            default: null
        },
        last_login_at: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

// Add after the schema definition, before the index and model lines
userSchema.pre("save", async function () {
    if (!this.isModified("password_hash")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password_hash);
};

// staff_id is unique only when it is set (Super Admin has none)
userSchema.index(
    { staff_id: 1 },
    { unique: true, partialFilterExpression: { staff_id: { $type: "string" } } }
);

const User: Model<IUserDocument> = model<IUserDocument>("User", userSchema);

export default User;