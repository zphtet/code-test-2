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
    if (!user) {
      router.push("/login");
    }
  }, [user, router, _hasHydrated]);

  if (!_hasHydrated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
