export function fieldValidator<T extends Record<string, unknown>>(
  validFields: string[],
  data: T
): {
  missingFields: string[];
  invalidFields: { field: string; message: string }[];
} {
  const missingFields: string[] = [];
  const invalidFields: { field: string; message: string }[] = [];

  validFields.forEach((field) => {
    // Check for missing field
    if (typeof data[field] === "undefined") {
      missingFields.push(field);
    } else {
      // Specific validation logic for email
      if (
        field === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field] as string)
      ) {
        invalidFields.push({ field: "email", message: "Invalid email format" });
      }

      // Specific validation logic for password
      if (
        field === "password" &&
        typeof data[field] === "string" &&
        (data[field] as string).length < 6
      ) {
        invalidFields.push({
          field: "password",
          message: "Password must be at least 6 characters long",
        });
      }

      // Add other specific validation logic as needed
    }
  });

  return { missingFields, invalidFields };
}
