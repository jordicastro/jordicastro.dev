"use client";
import { ToggleTheme } from "@/components/ToggleTheme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading } = useAuth();
  const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
  const router = useRouter();

  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    const authenticatedAt = localStorage.getItem("authenticatedAt");
    // If the user was authenticated more than 24 hours ago, log them out
    const now = new Date().getTime();
    if (authenticatedAt && now - parseInt(authenticatedAt) > TWENTY_FOUR_HOURS_IN_MS) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authenticatedAt");
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    } else if (storedIsAuthenticated && storedIsAuthenticated) { // else, set local auth state
      setIsAuthenticated(storedIsAuthenticated === "true");
      setIsLoading(false);
    } else { // if there is no stored auth state, do nothing to allow redirect to maintenance page
      setIsAuthenticated(false);
      setIsLoading(false);
    }


  }, [setIsAuthenticated, setIsLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/maintenance");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h2 className="text-neutral-500 dark:text-amber-500">
        hi
      </h2>
      <ToggleTheme />
      <div className="w-48 h-12 border-debug" role="button" onClick={() => router.push("/meow")}>
        meow
      </div>
    </div>
  );
}
