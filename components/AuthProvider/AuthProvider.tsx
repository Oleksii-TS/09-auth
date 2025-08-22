"use client";

import { useEffect, useState } from "react";
import { checkClientSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const isAuthenticated = await checkClientSession();
      if (isAuthenticated) {
        const user = await getMe();
        if (user) setUser(user);
      } else {
        clearUser();
      }
      setLoading(false);
    };
    fetchUser();
  }, [setUser, clearUser]);

  if (loading) return null;

  return <>{children}</>;
}
