import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { clerkClient, getAuth } from "@clerk/express";
import { AppError } from "../../utils/AppError";


export const authRouter = Router();

authRouter.post('/sync', requireAuth,

    asyncHandler(async (req, res) => {
        const { userId } = getAuth(req)

        if (!userId) {
            throw new AppError(401, "User is not logges in!")
        }

        const clerkUser = await clerkClient.users.getUser(userId);

        const extractEmailFromUserInfo = clerkUser.emailAddresses.find(
            item=> item.id === clerkUser.primaryEmailAddressId
        ) || clerkUser.emailAddresses[0]

        const email = extractEmailFromUserInfo.emailAddress

        const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim();

        const name = fullName || clerkUser.username;

        const raw = process.env.ADMIN_EMAILS || "";
        const adminEmails = new Set(
            raw.split(",").map((item) => item.trim().toLocaleLowerCase()).filter(Boolean),
        )
    })
)
