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
    <div className="h-svh w-full flex flex-col gap-4">
      <h1 className="">
        h1: Jordi Castro
      </h1>
      <h2>
        h2: In December 2025, Jordi
        <br />
        completed a marathon in
      </h2>
      <h3>
        h3: Timeline
      </h3>
      <h4>
        h4: SUB SECTION HEADING
      </h4>
      <p>
        p: this is a paragraph text example. lorem ipsum dolor sit amet, consectetur 
        <br />
        voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
      </p>
      <ToggleTheme className=""/>
    </div>
  );
}
