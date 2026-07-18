import { describe, it, expect, vi, afterEach } from "vitest";
import { subscribeToSequence } from "@/lib/subscribe";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("subscribeToSequence", () => {
  it("POSTs a normalized email to the engine subscribe endpoint", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));

    const ok = await subscribeToSequence("  Foreman@Example.COM ");

    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      "https://email-engine-fawn.vercel.app/api/subscribe"
    );
    expect(JSON.parse(String(init?.body))).toEqual({
      product: "voicelogpro",
      email: "foreman@example.com",
    });
  });

  it("returns false on a non-2xx response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("nope", { status: 500 })
    );
    expect(await subscribeToSequence("a@b.com")).toBe(false);
  });

  it("returns false (never throws) on a network error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    expect(await subscribeToSequence("a@b.com")).toBe(false);
  });
});
