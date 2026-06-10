"use client";
import Hero from "./_components/sections/Hero";
import CalloutMarathon from "./_components/sections/CalloutMarathon";
import ProgrammingTimeline from "./_components/sections/ProgrammingTimeline";
import ToC from "@/components/ToC";
import { homeSections } from "@/constants/constants";
import ScrollMask from "@/components/ScrollMask";
import IdentitySection from "./_components/sections/IdentitySection";
import StoriesSection from "./_components/sections/StoriesSection";

export default function Home() {

  return (
    <>
      <ScrollMask />
      <ToC sections={homeSections} />
        <Hero id={homeSections[0].id}/>
        <CalloutMarathon id={homeSections[1].id}/>
        <ProgrammingTimeline id={homeSections[2].id}/>
        <IdentitySection id={homeSections[3].id}/>
        <StoriesSection id={homeSections[4].id}/>
    </> 
  );
}
