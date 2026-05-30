type RateLimitConfig = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
  identifiers?: Array<string | null | undefined>;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      retryAfterSeconds: number;
    };

const FALLBACK_IP = "unknown";
const MAX_KEYS = 10_000;

const store = new Map<string, RateLimitEntry>();

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function getFirstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

export function getClientIp(request: Request) {
  return (
    getFirstHeaderValue(request.headers.get("x-forwarded-for")) ??
    request.headers.get("x-real-ip")?.trim() ??
    request.headers.get("cf-connecting-ip")?.trim() ??
    FALLBACK_IP
  );
}

function pruneExpired(now: number) {
  if (store.size < MAX_KEYS) {
    return;
  }

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  request: Request,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const identifiers = [
    `ip:${getClientIp(request)}`,
    ...(config.identifiers ?? [])
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .map((value) => `id:${normalizeIdentifier(value)}`),
  ];

  const keys = identifiers.map((identifier) => `${config.keyPrefix}:${identifier}`);

  for (const key of keys) {
    const entry = store.get(key);

    if (entry && entry.resetAt > now && entry.count >= config.limit) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      };
    }
  }

  for (const key of keys) {
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      store.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });
      continue;
    }

    entry.count += 1;
  }

  return {
    allowed: true,
  };
}

export function getRateLimitHeaders(result: Exclude<RateLimitResult, { allowed: true }>) {
  return {
    "Retry-After": String(result.retryAfterSeconds),
  };
}
