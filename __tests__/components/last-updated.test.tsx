import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LastUpdated } from "@/components/ui/last-updated";

describe("LastUpdated", () => {
  beforeEach(() => {
    // Mock the current date
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T14:30:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the current timestamp when no timestamp provided", () => {
    render(<LastUpdated />);

    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 15, 2025/)).toBeInTheDocument();
  });

  it("renders the provided timestamp", () => {
    const timestamp = new Date("2025-01-10T10:00:00");
    render(<LastUpdated timestamp={timestamp} />);

    expect(screen.getByText(/Jan 10, 2025/)).toBeInTheDocument();
  });

  it("accepts string timestamp", () => {
    render(<LastUpdated timestamp="2025-01-12T08:00:00Z" />);

    expect(screen.getByText(/Jan 12, 2025/)).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<LastUpdated className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders refresh icon", () => {
    const { container } = render(<LastUpdated />);

    // Check for SVG icon
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
