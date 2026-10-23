import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/db/index'
import { ApiError } from "./ApiError";

type Handler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export function asyncHandler(handler: Handler): Handler {
  return async (request, context) => {
    try {
      await connect()
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: error.message, errors: error.errors },
          { status: error.statusCode }
        );
      }
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  };
}