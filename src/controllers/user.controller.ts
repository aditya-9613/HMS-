import User from "@/model/User.model";
import { createUserSchema, loginSchema } from '@/validation/user.validation'
import { ApiError } from '@/lib/ApiError'
import { ApiResponse } from '@/lib/ApiResponse'
import { asyncHandler } from '@/lib/asyncHandler'
import { signAccessToken, signRefreshToken, verifyAccessToken } from "@/lib/auth";


export const createUser = asyncHandler(async (req: Request) => {
    const body = await req.json()
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
        throw new ApiError(
            400,
            "Validation failed",
            parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
        );
    }

    const { name, email, password, role, staff_id, status } = parsed.data;


    const user = await User.create({
        name,
        email,
        password,
        role,
        staff_id,
        status,
    });

    return new ApiResponse(201, { user_id: user._id }, "User created successfully").send();
})

export const loginUser = asyncHandler(async (req: Request) => {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        throw new ApiError(
            400,
            "Validation failed",
            parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
        );
    }

    const { email, password } = parsed.data

    const user = await User.findOne({
        $or: [
            { email: email },
            { staff_id: email },
        ],
    }).select('+password');

    if (!user) {
        throw new ApiError(401, 'Invalid Credentials')
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid Credentials')
    }

    const accessToken = await signAccessToken({ id: user._id.toString(), role: user.role })
    const refreshToken = await signRefreshToken({ id: user._id.toString(), role: user.role })

    const data = {
        name: user.name,
        role: user.role,
        accessToken,
        refreshToken
    }

    return new ApiResponse(200, data, 'User Logged In Successfully').send([
        {
            name: "accessToken",
            value: accessToken,
            options: { maxAge: 60 * 15 }, // 15 minutes, match your JWT expiry
        },
        {
            name: "refreshToken",
            value: refreshToken,
            options: { maxAge: 60 * 60 * 24 * 7 }, // 7 days, match your JWT expiry
        },
    ])
})

export const getUser = asyncHandler(async (req: Request) => {
    const token = req.headers.get("cookie")
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("token="))
        ?.slice("token=".length) || req.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Authentication required")
    }

    const verifyToken = await verifyAccessToken(token)

    if (!verifyToken?.id) {
        throw new ApiError(401, "Token Expired")
    }

    return new ApiResponse(200, {}, 'user details').send()
})

export const logoutUser = asyncHandler(async (req: Request) => {
    const token =
        req.headers
            .get("cookie")
            ?.split(";")
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith("accessToken="))
            ?.slice("accessToken=".length) ||
        req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
        throw new ApiError(401, "Authentication required")
    }

    const verifyToken = await verifyAccessToken(token)

    const findUser = await User.findByIdAndUpdate(
        verifyToken?.id,
        {
            logged_in: false
        },
        { new: true }
    );

    if ((findUser?.logged_in)) {
        throw new ApiError(500, 'User Logged Out Failure')
    }

    return new ApiResponse(200, {}, 'User Logged Out Successfully ').send()
})