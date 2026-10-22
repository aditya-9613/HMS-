// src/validation/user.validation.ts
import { z } from "zod";
import { USER_ROLES, USER_STATUSES } from "../model/User.model";

// Reusing the arrays exported from the model keeps Zod and Mongoose in sync
export const createUserSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().toLowerCase().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(USER_ROLES),
    staff_id: z.string().trim().min(1, "Staff ID is required"),
    status: z.enum(USER_STATUSES).default("Active"),
});

export const loginSchema = z.object({
    staff_id: z.string().trim().min(1, "Staff ID is required"),
    password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, "Current password is required"),
        new_password: z.string().min(8, "Password must be at least 8 characters"),
    })
    .refine((d) => d.current_password !== d.new_password, {
        message: "New password must be different from the current one",
        path: ["new_password"],
    });

// Update: every field optional, and password / staff_id can't be changed here
export const updateUserSchema = createUserSchema
    .omit({ password: true, staff_id: true })
    .partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;