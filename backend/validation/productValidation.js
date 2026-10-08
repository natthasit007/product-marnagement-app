const editableFields = ["name", "price", "description", "image"];

const validateProductInput = (input, { partial = false } = {}) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: "A product object is required" };
  }

  const data = {};
  let hasEditableField = false;

  if (!partial || Object.hasOwn(input, "name")) {
    if (typeof input.name !== "string" || !input.name.trim()) {
      return { error: "Name is required and must not be empty" };
    }
    if (input.name.trim().length > 255) {
      return { error: "Name must be 255 characters or fewer" };
    }
    data.name = input.name.trim();
    hasEditableField = true;
  }

  if (!partial || Object.hasOwn(input, "price")) {
    const isValidPriceType =
      typeof input.price === "number" || typeof input.price === "string";
    if (
      !isValidPriceType ||
      input.price === "" ||
      (typeof input.price === "string" && !input.price.trim()) ||
      !Number.isFinite(Number(input.price)) ||
      Number(input.price) < 0
    ) {
      return { error: "Price must be a non-negative number" };
    }
    data.price = Number(input.price);
    hasEditableField = true;
  }

  for (const field of ["description", "image"]) {
    if (Object.hasOwn(input, field)) {
      const value = input[field];
      if (value !== null && typeof value !== "string") {
        return { error: `${field} must be a string` };
      }

      const trimmedValue = typeof value === "string" ? value.trim() : "";
      if (trimmedValue.length > 255) {
        return { error: `${field} must be 255 characters or fewer` };
      }

      if (field === "image" && trimmedValue) {
        try {
          const imageUrl = new URL(trimmedValue);
          if (!["http:", "https:"].includes(imageUrl.protocol)) {
            return { error: "Image must be an HTTP or HTTPS URL" };
          }
        } catch {
          return { error: "Image must be a valid HTTP or HTTPS URL" };
        }
      }

      data[field] = trimmedValue || null;
      hasEditableField = true;
    }
  }

  if (partial && !hasEditableField) {
    return {
      error: `At least one of these fields is required: ${editableFields.join(", ")}`,
    };
  }

  return { data };
};

const parseProductId = (value) => {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
};

export { parseProductId, validateProductInput };
