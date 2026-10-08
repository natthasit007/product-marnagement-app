import test from "node:test";
import assert from "node:assert/strict";
import {
  parseProductId,
  validateProductInput,
} from "../validation/productValidation.js";

test("validates and normalizes a new product", () => {
  assert.deepEqual(
    validateProductInput({
      name: "  Keyboard  ",
      price: "1250.50",
      description: "  Mechanical  ",
      image: "https://example.com/keyboard.jpg",
    }),
    {
      data: {
        name: "Keyboard",
        price: 1250.5,
        description: "Mechanical",
        image: "https://example.com/keyboard.jpg",
      },
    },
  );
});

test("rejects blank names and invalid prices", () => {
  assert.match(
    validateProductInput({ name: "  ", price: 10 }).error,
    /Name is required/,
  );

  for (const price of ["", " ", "invalid", -1, true, null]) {
    assert.match(
      validateProductInput({ name: "Keyboard", price }).error,
      /Price must be a non-negative number/,
    );
  }
});

test("allows a zero price", () => {
  assert.deepEqual(validateProductInput({ name: "Free item", price: 0 }), {
    data: { name: "Free item", price: 0 },
  });
});

test("allows partial updates and clears optional text fields", () => {
  assert.deepEqual(
    validateProductInput({ description: "", image: null }, { partial: true }),
    { data: { description: null, image: null } },
  );
});

test("rejects empty updates and non-HTTP image URLs", () => {
  assert.match(validateProductInput({}, { partial: true }).error, /At least one/);
  assert.match(
    validateProductInput(
      { name: "Keyboard", price: 10, image: "javascript:alert(1)" },
    ).error,
    /HTTP or HTTPS/,
  );
});

test("accepts only positive safe-integer product IDs", () => {
  assert.equal(parseProductId("42"), 42);
  assert.equal(parseProductId("0"), null);
  assert.equal(parseProductId("-1"), null);
  assert.equal(parseProductId("1.5"), null);
  assert.equal(parseProductId("9007199254740992"), null);
});
