import { z } from "zod";

export const inviteFriendsSchema = z.object({
    code: z.string().min(4, {
      message: "Invite code must be at least 4 characters.",
    }),
  })