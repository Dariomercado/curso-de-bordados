"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

type SignOutButtonProps = {
  className?: string;
  size?: "sm" | "md";
  variant?: "primary" | "secondary";
};

export function SignOutButton({
  className,
  size = "md",
  variant = "secondary",
}: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    const result = await signOut({
      redirect: false,
      callbackUrl: "/",
    });

    router.replace(result.url ?? "/");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
    >
      Cerrar sesion
    </Button>
  );
}
