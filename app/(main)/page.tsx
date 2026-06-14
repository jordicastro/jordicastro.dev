"use client";
import Hero from "./_components/sections/Hero";
import CalloutMarathon from "./_components/sections/CalloutMarathon";
import ProgrammingTimeline from "./_components/sections/ProgrammingTimeline";
import ToC from "@/components/ToC";
import { homeSections } from "@/constants/constants";
import ScrollMask from "@/components/ScrollMask";
import IdentitySection from "./_components/sections/IdentitySection";
import StoriesSection from "./_components/sections/StoriesSection";
import { useMediaQuery } from "usehooks-ts";
import { useEffect } from "react";

export default function Home() {

  const isMobile = useMediaQuery("(max-width: 463px)", { initializeWithValue: false });

  if (isMobile) {
    // remove the identiy section and the scrollMask from mobile
    const mobileHomeSections = homeSections.filter(s => s.id !== "identity")
    return (
      <>
          <ToC sections={mobileHomeSections} />
          <Hero id={mobileHomeSections[0].id}/>
          <CalloutMarathon id={mobileHomeSections[1].id}/>
          <ProgrammingTimeline id={mobileHomeSections[2].id} shouldScrollMask={false} />
          <StoriesSection id={mobileHomeSections[3].id} shouldScrollMask={false} />
      </>
    )
  }

  return (
    <>
      <ScrollMask />
      <ToC sections={homeSections} />
        <Hero id={homeSections[0].id}/>
        <CalloutMarathon id={homeSections[1].id}/>
        <ProgrammingTimeline id={homeSections[2].id} shouldScrollMask={true} />
        <IdentitySection id={homeSections[3].id}/>
        <StoriesSection id={homeSections[4].id} shouldScrollMask={true} />
    </> 
  );
}
