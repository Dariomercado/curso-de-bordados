"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import type { NavigationItem } from "@/types/navigation";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { Button } from "../ui/Button";

type MobileNavMenuProps = {
  items: NavigationItem[];
  isAuthenticated: boolean;
  accountHref?: string;
  accountLabel?: string;
};

export function MobileNavMenu({
  items,
  isAuthenticated,
  accountHref,
  accountLabel,
}: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-surface text-foreground shadow-soft transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-label={isOpen ? "Cerrar menu principal" : "Abrir menu principal"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="sr-only">
          {isOpen ? "Cerrar menu principal" : "Abrir menu principal"}
        </span>
        <span className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-20 z-10 bg-foreground/10"
            aria-label="Cerrar menu principal"
            onClick={() => setIsOpen(false)}
          />
          <div
            id={menuId}
            className="absolute inset-x-0 top-full z-20 border-b border-border/80 bg-background/95 backdrop-blur-xl"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6">
              <nav aria-label="Principal mobile">
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-[1.25rem] px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-strong"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex flex-col gap-3 border-t border-border/70 pt-3">
                {isAuthenticated && accountHref && accountLabel ? (
                  <>
                    <Button
                      href={accountHref}
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      {accountLabel}
                    </Button>
                    <SignOutButton className="w-full justify-center" />
                  </>
                ) : (
                  <>
                    <Button
                      href="/login"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Ingresar
                    </Button>
                    <Button
                      href="/registro"
                      variant="secondary"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Crear cuenta
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
