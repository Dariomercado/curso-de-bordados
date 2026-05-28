import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function SmokeComponent() {
  return <div>Vitest setup OK</div>;
}

describe("test setup", () => {
  it("renders with Testing Library in jsdom", () => {
    render(<SmokeComponent />);

    expect(screen.getByText("Vitest setup OK")).toBeInTheDocument();
  });
});
