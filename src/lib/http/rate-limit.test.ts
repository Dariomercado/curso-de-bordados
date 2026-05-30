import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/http/rate-limit";

function buildRequest(ip: string) {
  return new Request("https://example.com", {
    headers: {
      "x-forwarded-for": ip,
    },
  });
}

describe("checkRateLimit", () => {
  it("allows requests until the configured limit is reached", () => {
    const keyPrefix = `test:${crypto.randomUUID()}`;
    const request = buildRequest("203.0.113.1");

    expect(
      checkRateLimit(request, {
        keyPrefix,
        limit: 2,
        windowMs: 60_000,
      }).allowed,
    ).toBe(true);
    expect(
      checkRateLimit(request, {
        keyPrefix,
        limit: 2,
        windowMs: 60_000,
      }).allowed,
    ).toBe(true);
    expect(
      checkRateLimit(request, {
        keyPrefix,
        limit: 2,
        windowMs: 60_000,
      }).allowed,
    ).toBe(false);
  });

  it("also limits by normalized identifiers", () => {
    const keyPrefix = `test:${crypto.randomUUID()}`;

    expect(
      checkRateLimit(buildRequest("203.0.113.2"), {
        keyPrefix,
        limit: 1,
        windowMs: 60_000,
        identifiers: ["Buyer@Example.com"],
      }).allowed,
    ).toBe(true);
    expect(
      checkRateLimit(buildRequest("203.0.113.3"), {
        keyPrefix,
        limit: 1,
        windowMs: 60_000,
        identifiers: ["buyer@example.com"],
      }).allowed,
    ).toBe(false);
  });
});
