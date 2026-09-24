"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/app/Redux/provider";
import { loginHref } from "./LoginPrompt/LoginPrompt";

// Sends guests to the sign-in page (and back here afterwards).
// Returns the session once it is known, or null while loading/redirecting.
export default function useRequireAuth({ role } = {}) {
  const { session, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const allowed = session && (!role || session.role === role);

  useEffect(() => {
    if (!ready || allowed) return;
    router.replace(session ? "/" : loginHref(pathname));
  }, [ready, allowed, session, router, pathname]);

  return ready && allowed ? session : null;
}
