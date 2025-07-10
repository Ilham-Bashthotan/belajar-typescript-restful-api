import { z, ZodType } from "zod";

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z
            .string()
            .min(1, "First name is required")
            .max(100, "First name must be less than 100 characters"),
        last_name: z
            .string()
            .min(1, "Last name is required")
            .max(100, "Last name must be less than 100 characters")
            .optional(),
        email: z
            .string()
            .min(1, "Email is required")
            .max(100, "Email must be less than 100 characters")
            .email("Invalid email format")
            .optional(),
        phone: z
            .string()
            .min(1, "phone is required")
            .max(20, "phone must be less than 20 characters")
            .optional(),
    });
}
