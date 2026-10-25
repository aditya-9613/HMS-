import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that don't need a token
const PUBLIC_PATHS = [
    "/api/user/createUser",
    "/api/auth/login"
]

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Pass user info to the controller through request headers
        const headers = new Headers(req.headers);
        headers.set("x-user-id", payload.id);
        headers.set("x-user-role", payload.role);

        return NextResponse.next({
            request: { headers },
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid or expired token" },
            { status: 401 }
        );
    }
}

// Only run on API routes
export const config = {
    matcher: [
        "/api/user/viewUser"
    ],
};