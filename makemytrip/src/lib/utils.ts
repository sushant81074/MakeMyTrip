import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleHTTPError = (status: number, message: string) => {
  switch (status) {
    case 400:
      toast.error(message || "Invalid OTP, email verification unsuccessful");
      break;
    case 404:
      toast.error(message || "User not found");
      break;
    case 500:
      toast.error(message || "Internal server error, please try again later");
      break;
    default:
      toast.error(message || "An unknown error occurred");
  }
};

export const handleValidationErrors = (
  error: z.ZodError,
  setErrors: (value: { [key: string]: string }) => void,
  setLoading: (value: boolean) => void
) => {
  const validationErrors: { [key: string]: string } = {};
  error.errors.forEach((err) => {
    if (err.path[0]) {
      validationErrors[err.path[0] as string] = err.message;
    }
  });

  console.log("validationErrors", validationErrors);

  setErrors(validationErrors);
  setLoading(false);
};

export const handleGenericError = (
  error: any,
  setLoading: (value: boolean) => void
) => {
  setLoading(false);
  toast.error(error.message || "An error occurred, please try again");
};

export const JoinAt = (date: string) => {
  // 2024-06-26T18:08:54.797Z => 26-06-2024 write a logic to convert this date to 26-06-2024 format

  const day = date.substring(0, 2);
  const month = date.split("-")[1]; // getMonth() is zero-based
  const year = date.split("-")[0];
  return `${day}-${month}-${year}`;
};
