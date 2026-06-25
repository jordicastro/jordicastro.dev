"use client"

import { Paragraph } from "../SupplyPikeStory"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useScreenMask } from "@/hooks/useScreenMask";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SearchItem, SearchName } from "@/types/types";

gsap.registerPlugin(useGSAP);

const AdminSearch = () => {
  return (
    <div className="w-full h-auto section-content flex flex-col items-start gap-4">
      <AdminSearchDemo/>
      <Paragraph>
        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
      </Paragraph>
      <Paragraph title="Local Storage Stack">
        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
      </Paragraph>
      <Paragraph title="Readability & Functionality">
        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
      </Paragraph>
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
    return crypto.randomUUID();
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
      <div className="w-full h-auto border-debug flex items-center justify-between p-2 border border-transparent hover:border-(--sp-blue) transition-all duration-400 rounded-md ease-out">
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

export default AdminSearch