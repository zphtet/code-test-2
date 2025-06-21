"use client";

import useUserStore from "@/zustand/user-store";
import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, _hasHydrated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) {
      return;
    }
    
    // Add a small delay to ensure proper hydration
    const timeout = setTimeout(() => {
      if (!user) {
        router.push("/login");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, router, _hasHydrated]);

  // Show nothing while hydrating
  if (!_hasHydrated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
