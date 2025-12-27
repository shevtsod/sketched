import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the heading", () => {
    const { getByRole } = render(<App />);
    expect(
      getByRole("heading", { name: /vite \+ react/i }),
    ).toBeInTheDocument();
  });
});
