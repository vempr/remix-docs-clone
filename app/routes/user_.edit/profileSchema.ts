import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.optional(
    z.string().max(50, "First name can't be longer than 50 characters."),
  ),
  lastName: z.optional(
    z.string().max(50, "Last name can't be longer than 50 characters."),
  ),
  twitterHandle: z.optional(
    z.string().max(50, "Twitter handle can't be longer than 50 characters."),
  ),
  aboutMeDescription: z.optional(
    z
      .string()
      .max(150, "Your description can't be longer than 150 characters."),
  ),
});

export type ProfileValidation = z.infer<typeof profileSchema>;
