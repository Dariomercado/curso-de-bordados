import { afterEach, describe, expect, it, vi } from "vitest";

import { BrevoTransactionalEmailSender } from "@/server/email/providers/brevo-transactional-email-sender";
import type { TransactionalEmailConfig } from "@/server/email/types";

const config: TransactionalEmailConfig = {
  provider: "brevo",
  from: "Atelier Bordado <no-reply@atelierbordado.test>",
  replyTo: "hola@atelierbordado.test",
  baseUrl: "https://atelierbordado.test",
  brevoApiKey: "brevo-test-key",
};

const message = {
  to: "alumna@example.com",
  subject: "Activa tu acceso",
  html: "<p>Hola</p>",
  text: "Hola",
  tags: [{ name: "type", value: "access-activation" }],
  idempotencyKey: "order-123",
};

function stubFetch(
  response: { ok: boolean; status: number; body?: unknown } | Error,
) {
  const fetchMock = vi.fn();

  if (response instanceof Error) {
    fetchMock.mockRejectedValue(response);
  } else {
    fetchMock.mockResolvedValue({
      ok: response.ok,
      status: response.status,
      text: async () =>
        response.body === undefined ? "" : JSON.stringify(response.body),
    });
  }

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("BrevoTransactionalEmailSender", () => {
  it("posts the message to the Brevo transactional endpoint", async () => {
    const fetchMock = stubFetch({
      ok: true,
      status: 201,
      body: { messageId: "<abc@relay.domain.com>" },
    });

    const result = await new BrevoTransactionalEmailSender(config).send(message);

    expect(result).toEqual({
      ok: true,
      provider: "brevo",
      messageId: "<abc@relay.domain.com>",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(init.method).toBe("POST");
    expect(init.headers["api-key"]).toBe("brevo-test-key");
    expect(init.headers["content-type"]).toBe("application/json");

    expect(JSON.parse(init.body)).toEqual({
      sender: { email: "no-reply@atelierbordado.test", name: "Atelier Bordado" },
      to: [{ email: "alumna@example.com" }],
      subject: "Activa tu acceso",
      htmlContent: "<p>Hola</p>",
      textContent: "Hola",
      replyTo: { email: "hola@atelierbordado.test" },
      tags: ["access-activation"],
      headers: { IdempotencyKey: "order-123" },
    });
  });

  it("omits optional fields when the message does not provide them", async () => {
    const fetchMock = stubFetch({
      ok: true,
      status: 201,
      body: { messageId: "id" },
    });

    await new BrevoTransactionalEmailSender({
      provider: "brevo",
      from: "no-reply@atelierbordado.test",
      baseUrl: "https://atelierbordado.test",
      brevoApiKey: "brevo-test-key",
    }).send({ to: "alumna@example.com", subject: "Hola", html: "<p>Hola</p>" });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);

    expect(body.sender).toEqual({ email: "no-reply@atelierbordado.test" });
    expect(body).not.toHaveProperty("textContent");
    expect(body).not.toHaveProperty("replyTo");
    expect(body).not.toHaveProperty("tags");
    expect(body).not.toHaveProperty("headers");
  });

  it("reports a configuration error when the API key is rejected", async () => {
    stubFetch({
      ok: false,
      status: 401,
      body: { code: "unauthorized", message: "Key not found" },
    });

    const result = await new BrevoTransactionalEmailSender(config).send(message);

    expect(result).toEqual({
      ok: false,
      provider: "brevo",
      code: "config_error",
      message: "Key not found",
      retryable: false,
    });
  });

  it("reports a retryable rate limit when Brevo throttles the request", async () => {
    stubFetch({
      ok: false,
      status: 429,
      body: { code: "too_many_requests", message: "Too many requests" },
    });

    const result = await new BrevoTransactionalEmailSender(config).send(message);

    expect(result).toMatchObject({
      ok: false,
      code: "rate_limit",
      retryable: true,
    });
  });

  it("reports an exhausted credit balance as a non retryable provider error", async () => {
    stubFetch({
      ok: false,
      status: 402,
      body: { code: "not_enough_credits", message: "Not enough credits" },
    });

    const result = await new BrevoTransactionalEmailSender(config).send(message);

    expect(result).toMatchObject({
      ok: false,
      code: "provider_error",
      message: "Not enough credits",
      retryable: false,
    });
  });

  it("reports an invalid request without retrying", async () => {
    stubFetch({
      ok: false,
      status: 400,
      body: { code: "invalid_parameter", message: "Invalid sender" },
    });

    const result = await new BrevoTransactionalEmailSender(config).send(message);

    expect(result).toMatchObject({
      ok: false,
      code: "invalid_request",
      retryable: false,
    });
  });

  it("reports a retryable provider error when Brevo fails with 5xx", async () => {
    stubFetch({ ok: false, status: 503, body: { message: "Service unavailable" } });

    const result = await new BrevoTransactionalEmailSender(config).send(message);

    expect(result).toMatchObject({
      ok: false,
      code: "provider_error",
      retryable: true,
    });
  });

  it("returns a retryable provider error instead of throwing on network failure", async () => {
    stubFetch(new Error("socket hang up"));

    const result = await new BrevoTransactionalEmailSender(config).send(message);

    expect(result).toMatchObject({
      ok: false,
      provider: "brevo",
      code: "provider_error",
      message: "socket hang up",
      retryable: true,
    });
  });
});
