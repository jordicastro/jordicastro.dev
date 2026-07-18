"use client"

import { Paragraph } from "../SupplyPikeStory"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useScreenMask } from "@/hooks/useScreenMask";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SearchItem, SearchName } from "@/types/types";
import CodeText from "@/components/CodeText";
import Carousel from "@/app/(main)/_components/Carousel";
import CodeBlock from "@/app/(main)/_components/CodeBlock";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

const AdminSearch = () => {
  const scope = useRef<HTMLDivElement>(null);
  const showPrevSearchTextTl = useRef<gsap.core.Timeline | null>(null);
  const prevSearchImgRef = useRef<HTMLElement | null>(null);
  const prevSearchXTo = useRef<((value: number) => gsap.core.Tween) | null>(null);
  const prevSearchYTo = useRef<((value: number) => gsap.core.Tween) | null>(null);
  const hidePrevSearchDelay = useRef<gsap.core.Tween | null>(null);

  const movePreviewToPointer = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const previousSearchImg = prevSearchImgRef.current;
    if (!previousSearchImg) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left - previousSearchImg.offsetWidth / 2 - previousSearchImg.offsetLeft;
    const y = e.clientY - bounds.top;

    prevSearchXTo.current?.(x);
    prevSearchYTo.current?.(y);
  };

  const { contextSafe } = useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const previousSearchImg = root.querySelector<HTMLElement>(".previous-search-img");
      if (!previousSearchImg) return;

      prevSearchImgRef.current = previousSearchImg;

      prevSearchXTo.current = gsap.quickTo(previousSearchImg, "x", { duration: 0.4, ease: "power2.out" });
      prevSearchYTo.current = gsap.quickTo(previousSearchImg, "y", { duration: 0.4, ease: "power2.out" });

      gsap.set(previousSearchImg, { autoAlpha: 0, scale: 0.8, yPercent: 8 });

      showPrevSearchTextTl.current = gsap.timeline({ paused: true })
      .fromTo(previousSearchImg, {
        autoAlpha: 0,
        scale: 0.8,
      }, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      })

    },
    { scope, dependencies: []}
  )

  const handleMouseEnter = contextSafe((e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    hidePrevSearchDelay.current?.kill();
    movePreviewToPointer(e);
    showPrevSearchTextTl.current?.play();
  });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    hidePrevSearchDelay.current?.kill();
    movePreviewToPointer(e);
  });

  const handleMouseLeave = contextSafe(() => {
    hidePrevSearchDelay.current?.kill();
    hidePrevSearchDelay.current = gsap.delayedCall(0.1, () => {
      prevSearchXTo.current?.(0);
      prevSearchYTo.current?.(0);
      showPrevSearchTextTl.current?.reverse();
    });
  });

  return (
    <div ref={scope} className="w-full h-auto section-content flex flex-col items-start gap-4">
      <AdminSearchDemo/>
      <Paragraph>
        Reworked the admin search results to contain accurate recent searches and organized the suppliers by retailer.
        {" "}
        <span
          className="relative inline-block whitespace-nowrap indent-0 previous-search-text underline underline-offset-4 font-bold hover:decoration-(--sp-blue)"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >The previous admin search
          <Image
            src="/images/stories/supplypike/prev-admin-search.png"
            alt="previous-admin-search"
            width={150}
            height={150}
            className="previous-search-img pointer-events-none absolute top-0 -left-7.5 z-10 max-w-none w-69 h-auto rounded-md border border-bg-secondary/50 shadow-lg"
          />
        </span>
        {" "}
        was disorganized and difficult to read. I was given creative freedom to rework the search results.
      </Paragraph>
      <Paragraph title="Local Storage Stack">
        Inspecting the recent results logic for the admin search page, I found that local storage was being used to display the top three recent results. However, only one out of the three were updating after each search. Local storage is built into browsers and enables websites to save data locally using key-value pairs. The reason two of three results were not updating was because the code was using an incorrect data structure. Instead of using a queue, which would get rid of the oldest search result first (first in, first out), the recent search logic was using a stack, which replaces only the most recent result (last in, first out). This leaves the two oldest results untouched, so the solution is to swap the stack for a queue.
      </Paragraph>
      <Paragraph title="Readability & Functionality">
        I began by improving readability by adding more space between the result text. The ID of each search result was placed at the end of its row. The team was looking to phase out the retailer name being included in the supplier name. To help prepare this refactor and to make the results cleaner, I sorted each supplier by retailer in alphabetical order. Instead of relying on the supplier name to see the retailer name, admins could now easily view all the suppliers for a specific retailer. And our team could now safely refactor the supplier name.
      </Paragraph>
      <Paragraph title="Reduce & Map">
        To sort by retailer in alphabetical order, the results are fetched from the backend as normal but are formatted on the client with the JavaScript
        {" "}
        <CodeText text=".map" className="" />
        {" "}
        and
        {" "}
        <CodeText text=".reduce" className="" />
        {" "}
        methods.
      </Paragraph>
      <CodeCarousel />
    </div>
  )
}

const AdminSearchDemo = () => {
  const scope = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const showMask = useScreenMask((state) => state.showMask);
  const hideMask = useScreenMask((state) => state.hideMask);
  const [isFocused, setIsFocused] = useState(false);
  const isSearchActive = query.trim().length > 0 && isFocused;
  const modalTl = useRef<gsap.core.Timeline | null>(null);

  const getUUID = () => {
    // TODO: just use this and delete the rest when done testing non secure http dev build
    // return crypto.randomUUID()

    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    const bytes = typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function"
      ? crypto.getRandomValues(new Uint8Array(16))
      : Uint8Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  const searchNames: SearchName[] = [
    { name: "SupplyPike" },
    { name: "SupplyPike (Amazon)" },
    { name: "SupplyPike (Home Depot)" },
    { name: "SupplyPike", supplier: "Organizations"},
    { name: "SupplyPike (Amazon)", supplier: "Amazon" },
    { name: "SupplyPike (CVS)", supplier: "CVS" },
    { name: "SupplyPike (Home Depot)", supplier: "Home Depot" },
    { name: "SupplyPike (Kroger)", supplier: "Kroger" },
    { name: "SupplyPike (Lowe's)", supplier: "Lowe's" },
    { name: "SupplyPike (Target)", supplier: "Target" },
    { name: "SupplyPike (Walgreens)", supplier: "Walgreens" },
  ]


  const searchItems: SearchItem[] = useMemo( () => {
    const items = [];
    for (let i = 0; i < searchNames.length -1; i++) {
      items.push({
        id: getUUID(),
        searchName: searchNames[i],

      })
    }
    return items;
  }, [])

  const searchSections = [
    {
      title: "Recent Searches",
      searchItems: searchItems.slice(0, 3),
    },
    {
      title: "Organizations",
      searchItems: searchItems.slice(3, 4),
    },
    {
      title: "Suppliers",
      searchItems: searchItems.slice(4, searchNames.length),
    }
  ]

  useEffect(() => {
    if (isSearchActive) {
      showMask(0.3);
      openModal();
      return;
    }

    hideMask(0.3);
    closeModal();
  }, [hideMask, isSearchActive, showMask]);

  useEffect(() => {
    return () => {
      hideMask();
    }
  }, [hideMask]);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const modal = root.querySelector(".search-modal");
      if (!modal) return;

      gsap.set(modal, { autoAlpha: 0, y: 40 });

      modalTl.current = gsap.timeline({ paused: true })
      .fromTo(modal, {
        autoAlpha: 0,
        y: 40,
      }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out"})

    },
    { scope, dependencies: []}
  )

  const openModal = () => {
    modalTl.current?.play();
  }
  const closeModal = () => {
    modalTl.current?.reverse();
  }


  return (
    <div ref={scope} className={cn("admin-search-demo-wrapper w-full h-auto flex-center")}>
      <div className="admin-search-demo relative w-7/8 sm:w-95 h-30 border border-bg-secondary bg-bg-primary/75 rounded-lg flex-center py-2 px-3 gap-4 my-2">
        <div className={cn("otp-box relative w-7/8 h-10 border border-neutral-300 dark:border-neutral-800 rounded-sm flex-start overflow-hidden gap-2", isSearchActive && "relative z-60")}>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              "pl-8 w-full h-full text-md font-semibold text-text-secondary placeholder:text-text-secondary outline-(--sp-blue)",
            )}
          />
          <Search className="abs-y-center left-2 w-4 h-4 text-text-secondary" />
        </div>
        <div className="search-modal abs-x-center -bottom-93 w-90 h-100 bg-bg-primary border border-bg-secondary rounded-md z-60 p-3 flex flex-col items-start justify-start gap-2 overflow-y-auto">
            <Paragraph className="indent-0 text-sm font-bold text-text-primary">
              Recent Searches
            </Paragraph>
            <div
              className="search-items-wrapper w-full h-full flex flex-col items-start justify-start gap-0"
            >
              {searchItems.map((item, i) => (
                <SearchResultItem i={i} key={item.id} searchName={item.searchName} id={item.id} />
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}

const SearchResultItem = ({ i, searchName, id }: { i:number, searchName: SearchName; id: string }) => {
  return (
    <div className={cn(
      "search-item w-full h-auto flex flex-col items-start justify-between gap-1",
      searchName.supplier && "mb-3",
      i === 2 && "mb-3"
      )}>
      {searchName.supplier && (
        <Paragraph className="indent-0 text-sm font-bold text-text-primary">
          {searchName.supplier}
        </Paragraph>
      )}
      <div className="w-full h-auto flex items-center justify-between p-2 border border-transparent hover:border-(--sp-blue) transition-all duration-400 rounded-md ease-out">
        <Paragraph className="indent-0 text-sm font-semibold text-text-secondary">
          {searchName.name}
        </Paragraph>
        <Paragraph className="indent-0 text-xs font-semibold text-text-secondary">
          {id.slice(0, 8)}
        </Paragraph>
      </div>
    </div>
  )
}

const CodeCarousel = () => {
  const slides = [
    <CodeBlock
      className="w-130 h-50 flex items-center overflow-auto sm:pr-0 pr-8"
      description="1. The suppliers object is fetched from the backend."
    >
      <span className="text-red-code">
        suppliers =
      </span>
      {" "}
      [
      <br />
      <span className="ml-4">
        name:
        {" "}
        <span className="text-green">
          "SupplyPike"
        </span>
        {" "}
        , retailer:
        {" "}
        <span className="text-green">
          "Amazon"
        </span>
        ,
      </span>
      <br />
      <span className="ml-4">
        name:
        {" "}
        <span className="text-green">
          "ABC Foods"
        </span>
        {" "}
        , retailer:
        {" "}
        <span className="text-green">
          "Amazon"
        </span>
        ,
      </span>
      <br />
      <span className="ml-4">
        name:
        {" "}
        <span className="text-green">
          "Sun Farm"
        </span>
        {" "}
        , retailer:
        {" "}
        <span className="text-green">
          "CVS"
        </span>
        ,
      </span>
      <br />
      ]
    </CodeBlock>,
    <CodeBlock
      className="w-130 h-50 overflow-auto sm:pr-0 pr-8"
      absolute="absolute top-0"
      description="2. The suppliers are grouped by retailer."
    >
      <span className="text-purple">
        const
      </span>
      {" "}
      <span className="text-orange">
        groupedSuppliers
      </span>
      {" "}
      =
      <br />
      <span className="ml-4">
        <span className="text-red-code">
          suppliers
        </span>
        .
        <span className="text-blue">
          reduce
        </span>
        <span className="text-purple">
          (
        </span>
        <span className="text-blue">
          (
        </span>
        acc, supplier
        <span className="text-blue">
          )
        </span>
        {" "}
        {"=>"}
        <br />
        <span className="ml-4">
          <span className="text-blue">
            {"{"}
          </span>
            <br />
            <span className="ml-8">
              acc[
              <span className="text-orange">
                supplier.retailer
              </span>
              ].push(supplier);
            </span>
            <br />
            <span className="ml-8">
              return acc;
            </span>
            <br />
          <span className="text-blue ml-4">
            {"}"}
          </span>
          <br />
          <span className="text-purple">
            )
          </span>
          ;
        </span>
      </span>
    </CodeBlock>,
    <CodeBlock
      className="w-130 h-50 overflow-auto sm:pr-0 pr-18"
      absolute="absolute top-0"
      description="3. The result is a list of supplier arrays."
    >
      {"{"}
      <br />
      <span className="ml-4">
        <span className="text-purple">
          Amazon:
        </span>
        {" "}
        <span className="text-blue">
          [
        </span>
        <br />
        <span className="ml-8">
          <span className="text-yellow">
            {"{"}
          </span>
          {" "}
          name:
          {" "}
          <span className="text-green">
            "SupplyPike"
          </span>
          , retailer:
          {" "}
          <span className="text-green">
            "Amazon"
          </span>
          {" "}
          <span className="text-yellow">
            {"}"}
          </span>
          ,
          <br />
          <span className="text-yellow ml-8">
            {"{"}
          </span>
          {" "}
          name:
          {" "}
          <span className="text-green">
            "ABC Foods"
          </span>
          , retailer:
          {" "}
          <span className="text-green">
            "Amazon"
          </span>
          {" "}
          <span className="text-yellow">
            {"}"}
          </span>
          ,
        </span>

        <br />
        <span className="text-blue ml-4">
          ]
        </span>
        ,
        <br />
        <span className="text-purple">
          CVS:
        </span>
        {" "}
        <span className="text-blue">
          [
        </span>
        <br />
        <span className="ml-8">
          <span className="text-yellow">
            {"{"}
          </span>
          {" "}
          name:
          {" "}
          <span className="text-green">
            "Sun Farm"
          </span>
          , retailer:
          {" "}
          <span className="text-green">
            "CVS"
          </span>
          {" "}
          <span className="text-yellow">
            {"}"}
          </span>
          ,
        </span>
        <br />
        <span className="text-blue ml-4">
          ]
        </span>
        ,
        <br />
      </span>
      {"}"}
    </CodeBlock>,
    <CodeBlock
      className="w-130 h-50 py-10 overflow-auto sm:pr-0 pr-8"
      absolute="absolute top-0"
      description="4. The result is sorted alphabetically."
    >
      <span className="text-purple">
          const
      </span>
      {" "}
      <span className="text-orange">
        sortedSuppliers
      </span>
      {" "}
      =
      <br />
      <span className="ml-4">
        <span className="text-purple">
          Object
        </span>
        .
        <span className="text-blue">
          entries
        </span>
        <span className="text-purple">
          (
        </span>
        groupedSuppliers
        <span className="text-purple">
          )
        </span>
      </span>
      <br />
      <span className="ml-4">
        .
        <span className="text-blue">
          sort
        </span>
        (
          <span className="text-blue">
            (
          </span>
          <span className="text-purple">
            [
          </span>
          a, b
          <span className="text-purple">
            ]
          </span>
          <span className="text-blue">
            )
          </span>
        )
        {" => "}
        a.
        <span className="text-purple">
          localeCompare
        </span>
        (b));
      </span>
    </CodeBlock>,
    <CodeBlock
      className="w-130 h-50 overflow-auto sm:pr-20 pr-34"
      absolute="absolute top-0"
      description="5. The sorted suppliers are mapped to the DOM."
      >
        <span className="text-purple">
          {"{"}
        </span>
        sortedSuppliers.
        <span className="text-blue">
          {"map("}
        </span>
        <span className="text-yellow">
          {"("}
        </span>
        <span className="text-purple">
          {"["}
        </span>
        retailer, suppliers
        <span className="text-purple">
          {"]"}
        </span>
        {" => "}
        <span className="text-yellow">
          {"("}
        </span>
        <br />
        <span className="ml-4">
          {"<"}
          <span className="text-red-code">
            div
          </span>
          {" key="}
          <span className="text-purple">
            {"{"}
          </span>
          retailer
          <span className="text-purple">
            {"}"}
          </span>
          {">"}
        </span>
        <br />
        <span className="ml-8">
          {"<"}
          <span className="text-red-code">
            h2
          </span>
          {">{retailer}</"}
          <span className="text-red-code">
            h2
          </span>
          {">"}
        </span>
        <br />
        <br />

        <span className="ml-8">
          {"{"}
          <span className="text-red-code">
            suppliers
          </span>
          {".map((supplier"}
          <span className="text-purple">
            {" => "}
          </span>
          {"("}
        </span>
        <br/>
        <span className="ml-12">
          {"<"}
          <span className="text-yellow">
            ResultItem
          </span>
          {" "}
          <span className="text-orange">
            key
          </span>
          =
          <span className="text-yellow">
            {"{"}
          </span>
          <span className="text-red-code">
            supplier.id
          </span>
          <span className="text-yellow">
            {"}"}
          </span>
          {" "}
          <span className="text-orange">
            item
          </span>
          =
          <span className="text-yellow">
            {"{"}
          </span>
          <span className="text-red-code">
            supplier
          </span>
          <span className="text-yellow">
            {"}"}
          </span>
          {" />"}
        </span>
        <br />
        <span className="ml-8">
          <span className="text-blue">
            {")"}
          </span>
          <span className="text-purple">
            {")"}
          </span>
          {"}"}
        </span>
        <br />
        <span className="ml-4">
          {"</"}
          <span className="text-red-code">
            div
          </span>
          {">"}
        </span>
        <br />
        <span>
          <span className="text-yellow">
            {")"}
          </span>
          <span className="text-blue">
            {")"}
          </span>
          <span className="text-purple">
            {"}"}
          </span>
        </span>
      </CodeBlock>
  ]

  return (
    <div className="w-full h-auto">
      <Carousel slides={slides} autoPlay={true} autoPlayInterval={6000} pagination={true} activePaginationColor="#0066FF" />
    </div>
  )
}

export default AdminSearch