import { NextResponse } from "next/server";

type CookieOptions = {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    path?: string;
    maxAge?: number;
};

type CookieItem = {
    name: string;
    value: string;
    options?: CookieOptions;
};

export class ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: T, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

    // Wraps this object in a NextResponse with the same status code
    // and optionally sets cookies on it
    send(cookies: CookieItem[] = []) {
        const res = NextResponse.json(this, { status: this.statusCode });

        for (const { name, value, options } of cookies) {
            res.cookies.set(name, value, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                ...options,
            });
        }

        return res;
    }
}