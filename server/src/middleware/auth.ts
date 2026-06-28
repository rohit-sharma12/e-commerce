import type { Request, Response, NextFunction } from 'express'
import { AppError } from "../utils/AppError";
import { User } from '../model/User';
import { asyncHandler } from '../utils/asyncHandler';
import { getAuth } from "@clerk/express";

//Checks if user is logged in
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const { userId } = getAuth(req);

    if (!userId) {
        return next(
            new AppError(401, "User is not logged in")
        )
    }

    next();
}

//Gets the current user from MongoDB
export async function getDbUserFromReq(req: Request) {
    const { userId } = getAuth(req);

    if (!userId) {
        throw new AppError(401, "User is not logged in")
    }

    const dbUser = await User.findOne({ clerkUserId: userId });

    if (!dbUser) {
        throw new AppError(401, "User is not found in DB")
    }

    return dbUser;
}

//for admin -->> user logges in + admin access

export const requireAdmin = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
        const extractCurrentDbUser = await getDbUserFromReq(req);

        if (extractCurrentDbUser.role !== "admin") {
            throw new AppError(403, "Admin access only")
        }
        next();
    }
)
