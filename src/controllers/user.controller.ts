import { connect } from '@/db/index'
import User from "@/model/User.model";
import { createUserSchema } from '@/validation/user.validation'
import { ApiError } from '@/lib/ApiError'
import { ApiResponse } from '@/lib/ApiResponse'
import { asyncHandler } from '@/lib/asyncHandler'


export const createUser = asyncHandler(async (req: Request) => {
    await connect()

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
        password, // the bcrypt hook in the model hashes it
        role,
        staff_id,
        status,
    });

    return new ApiResponse(201, { user_id: user._id }, "User created successfully").send();
})

export const loginUser = asyncHandler(async (req: Request) => {
    
})