import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getTransactionalEmailConfig } from "@/server/email/config";

beforeEach(() => {
  vi.stubEnv("AUTH_EMAIL_FROM", "no-reply@atelierbordado.test");
  vi.stubEnv("AUTH_EMAIL_BASE_URL", "https://atelierbordado.test");
  vi.stubEnv("AUTH_EMAIL_REPLY_TO", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getTransactionalEmailConfig", () => {
  it("defaults to the console provider when no provider is set", () => {
    vi.stubEnv("AUTH_EMAIL_PROVIDER", "");

    expect(getTransactionalEmailConfig()).toEqual({
      provider: "console",
      from: "no-reply@atelierbordado.test",
      replyTo: undefined,
      baseUrl: "https://atelierbordado.test",
    });
  });

  it("still resolves the resend provider with its API key", () => {
    vi.stubEnv("AUTH_EMAIL_PROVIDER", "resend");
    vi.stubEnv("RESEND_API_KEY", "re-test-key");

    expect(getTransactionalEmailConfig()).toMatchObject({
      provider: "resend",
      resendApiKey: "re-test-key",
    });
  });

  it("resolves the brevo provider with its API key", () => {
    vi.stubEnv("AUTH_EMAIL_PROVIDER", "brevo");
    vi.stubEnv("BREVO_API_KEY", "brevo-test-key");

    expect(getTransactionalEmailConfig()).toMatchObject({
      provider: "brevo",
      brevoApiKey: "brevo-test-key",
      from: "no-reply@atelierbordado.test",
    });
  });

  it("requires BREVO_API_KEY when the brevo provider is selected", () => {
    vi.stubEnv("AUTH_EMAIL_PROVIDER", "brevo");
    vi.stubEnv("BREVO_API_KEY", "");

    expect(() => getTransactionalEmailConfig()).toThrow(
      "Define BREVO_API_KEY para usar AUTH_EMAIL_PROVIDER=brevo.",
    );
  });

  it("rejects an unsupported provider naming every supported value", () => {
    vi.stubEnv("AUTH_EMAIL_PROVIDER", "sendgrid");

    expect(() => getTransactionalEmailConfig()).toThrow(
      "AUTH_EMAIL_PROVIDER debe ser 'console', 'resend' o 'brevo'.",
    );
  });
});
