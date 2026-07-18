// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TestimonialsSection } from "@/components/TestimonialsSection";

describe("TestimonialsSection", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <MemoryRouter>
        <TestimonialsSection />
      </MemoryRouter>
    );
    expect(container.querySelector("section")).toBeTruthy();
  });
});
