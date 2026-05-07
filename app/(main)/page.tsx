"use client";
import { ToggleTheme } from "@/components/ToggleTheme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Hero from "./_components/Hero";
import CalloutMarathon from "./_components/CalloutMarathon";
import ToC from "@/components/ToC";
import { homeSections } from "@/constants/constants";

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

  return ( // subtract the p-4 (16px) from the main layout on the hero section
    <>
      <ToC sections={homeSections} />
        <Hero id={homeSections[0].id}/>
        <CalloutMarathon id={homeSections[1].id}/>
        <div className="h-svh w-full flex-center" />
    </>
  );
}
