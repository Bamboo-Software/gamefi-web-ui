import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must have at least one special character"),
  timezone: z.string().min(1, "Timezone is required"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});


export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});
