import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("handles falsy conditional classes", () => {
    const isActive = false;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class");
  });

  it("handles undefined and null values", () => {
    const result = cn("base-class", undefined, null, "another-class");
    expect(result).toBe("base-class another-class");
  });

  it("merges tailwind classes correctly", () => {
    // tailwind-merge should handle conflicting classes
    const result = cn("px-4", "px-8");
    expect(result).toBe("px-8");
  });

  it("handles arrays of classes", () => {
    const result = cn(["class-a", "class-b"]);
    expect(result).toBe("class-a class-b");
  });

  it("handles object syntax", () => {
    const result = cn({
      "text-red-500": true,
      "text-blue-500": false,
      "font-bold": true,
    });
    expect(result).toBe("text-red-500 font-bold");
  });

  it("returns empty string for no classes", () => {
    const result = cn();
    expect(result).toBe("");
  });
});
