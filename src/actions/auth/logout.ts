"use server";

import { redirect } from "next/navigation";

import { authFetch } from "@/lib/api";
import { clearSession, getRefreshToken } from "@/lib/session-store";

export const logout = async () => {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    const response = await authFetch("/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => null);

    if (!response?.ok) {
      console.error(
        `Logout failed on the API: ${response?.status ?? "unreachable"}. The refresh token stays valid until it expires.`,
      );
    }
  }

  await clearSession();

  redirect("/auth/login");
};
