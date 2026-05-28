function getFirstForwardedValue(value: string | null) {
  return value?.split(",")[0]?.trim() ?? "";
}

function isLocalHost(host: string) {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost")
  );
}

export function getRequestOrigin(request: Request) {
  const requestUrl = new URL(request.url);
  const forwardedHost = getFirstForwardedValue(request.headers.get("x-forwarded-host"));
  const forwardedProto = getFirstForwardedValue(request.headers.get("x-forwarded-proto"));
  const host = forwardedHost || request.headers.get("host")?.trim() || requestUrl.host;
  const protocol = isLocalHost(host)
    ? "http"
    : forwardedProto || requestUrl.protocol.replace(":", "") || "https";

  return `${protocol}://${host}`;
}
