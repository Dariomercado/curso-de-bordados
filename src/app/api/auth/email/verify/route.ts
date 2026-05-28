import { NextResponse } from "next/server";
import {
  buildEmailVerificationResultUrl,
  type EmailVerificationResultCode,
} from "@/lib/auth/email-verification";
import { getRequestOrigin } from "@/lib/http/request-origin";
import { verifyEmail } from "@/server/use-cases/auth/verify-email";

function redirectToResult(request: Request, code: EmailVerificationResultCode) {
  const origin = getRequestOrigin(request);
  return NextResponse.redirect(buildEmailVerificationResultUrl(origin, code));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const result = await verifyEmail({
    token,
  });

  switch (result.outcome) {
    case "success":
      return redirectToResult(request, "success");
    case "expired":
      return redirectToResult(request, "expired");
    case "already_used":
      return redirectToResult(request, "used");
    case "invalid":
    default:
      return redirectToResult(request, "invalid");
  }
}
