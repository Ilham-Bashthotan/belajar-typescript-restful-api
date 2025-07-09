import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z
            .string()
            .min(1, "Username is required")
            .max(100, "Username must be at most 100 characters long"),
        password: z
            .string()
            .min(1, "Password is required")
            .max(100, "Password must be at most 100 characters long"),
        name: z
            .string()
            .min(1, "Name is required")
            .max(100, "Name must be at most 100 characters long"),
    });
}
