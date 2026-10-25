import { NextRequest, NextResponse } from "next/server";
import {
    signAccessToken,
    verifyRefreshToken,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        // Get refresh token from the HttpOnly cookie
        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Refresh token missing. Please log in again.",
                },
                { status: 401 }
            );
        }

        // Verify the refresh token
        const payload = await verifyRefreshToken(refreshToken);

        if (!payload) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired refresh token. Please log in again.",
                },
                { status: 401 }
            );

            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");

            return response;
        }

        // Generate a new access token
        const accessToken = await signAccessToken({
            id: payload.id,
            role: payload.role,
        });

        // Return response and update access-token cookie
        const response = NextResponse.json({
            success: true,
            message: "Access token refreshed successfully",
            data: { accessToken },
        });

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60, // 15 minutes
        });

        return response;
    } catch (error) {
        console.error("Refresh token error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to refresh session",
            },
            { status: 500 }
        );
    }
}
