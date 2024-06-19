export function fieldValidator<T extends Record<string, unknown>>(
  fields: string[],
  data: T
): Record<string, string> {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    // Check for missing field and provide a generic error message
    if (typeof data[field] === "undefined") {
      errors[field] = `${field} is required`;
    }

    // Specific validation logic for email
    if (
      field === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((data[field] as string) || "")
    ) {
      errors.email = "Invalid email format";
    }

    // Specific validation logic for password
    if (
      field === "password" &&
      typeof data[field] === "string" &&
      (data[field] as string).length < 6
    ) {
      errors.password = "Password must be at least 6 characters long";
    }
  });

  return errors;
}
