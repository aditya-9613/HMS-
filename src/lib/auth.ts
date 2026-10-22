
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { ApiError } from "./ApiError";

// Get a secret from environment variables
function getSecret(name: string): Uint8Array {
    const value = process.env[name];

    if (!value) {
        throw new ApiError(500, `${name} is missing`);
    }

    return new TextEncoder().encode(value);
}

// JWT payload type
export interface AuthPayload extends JWTPayload {
    id: string;
    role: string;
    type: "access" | "refresh";
}

// Create an access token (expires in 15 minutes)
export async function signAccessToken(payload: {
    id: string;
    role: string;
}): Promise<string> {
    return new SignJWT({
        id: payload.id,
        role: payload.role,
        type: "access",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(getSecret("ACCESS_TOKEN_SECRET"));
}

// Create a refresh token (expires in 7 days)
export async function signRefreshToken(payload: {
    id: string;
    role: string;
}): Promise<string> {
    return new SignJWT({
        id: payload.id,
        role: payload.role,
        type: "refresh",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getSecret("REFRESH_TOKEN_SECRET"));
}

// Verify access tokens only
export async function verifyAccessToken(
    token: string
): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(
            token,
            getSecret("ACCESS_TOKEN_SECRET")
        );

        if (
            payload.type !== "access" ||
            typeof payload.id !== "string" ||
            typeof payload.role !== "string"
        ) {
            return null;
        }

        return payload as AuthPayload;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        return null;
    }
}

// Verify refresh tokens only
export async function verifyRefreshToken(
    token: string
): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(
            token,
            getSecret("REFRESH_TOKEN_SECRET")
        );

        if (
            payload.type !== "refresh" ||
            typeof payload.id !== "string" ||
            typeof payload.role !== "string"
        ) {
            return null;
        }

        return payload as AuthPayload;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        return null;
    }
}

// Backward compatibility for existing code.
// These functions now work with access tokens.
export const signToken = signAccessToken;
export const verifyToken = verifyAccessToken;
