"use client";
import { ToggleTheme } from "@/components/ToggleTheme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(storedIsAuthenticated === "true");
    setIsLoading(false);
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
