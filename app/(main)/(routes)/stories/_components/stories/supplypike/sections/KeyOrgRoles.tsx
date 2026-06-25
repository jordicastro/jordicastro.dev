"use client"

import { Paragraph } from "../SupplyPikeStory"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useScreenMask } from "@/hooks/useScreenMask";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SearchItem, SearchName } from "@/types/types";

const KeyOrgRoles = () => {
  return (
    <div className="w-full h-auto section-content flex flex-col items-start gap-4">
          <KeyOrgRolesDemo/>
          <Paragraph title="Guess Who?">
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
          </Paragraph>
          <Paragraph>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
          </Paragraph>
          <Paragraph title="Fetching & Fallback">
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.
          </Paragraph>
        </div>
  )
}

type Role = {
  name: string;
  role: string;
  description: string;
}

const KeyOrgRolesDemo = () => {
  const scope = useRef<HTMLDivElement>(null);

  const rolesList: Role[] = [
    {
      name: "Jordi Castro",
      role: "AE",
      description: "Account Executive"
    },
    {
      name: "Nico Williams",
      role: "AM",
      description: "Account Manager"
    },
    {
      name: "Leo Davinci",
      role: "CSM",
      description: "Customer Success Manager"
    },
  ]

  return (
    <div ref={scope} className={cn("key-org-roles-demo-wrapper w-full h-auto flex-center")}>
      <div className="key-org-roles-demo relative w-fit h-60 border border-bg-secondary bg-bg-primary/75 rounded-lg flex flex-col items-start p-4 gap-0 my-2">
          {/* search */}
          <div className={cn("otp-box relative w-48 lg:w-58 h-8 border border-neutral-300 dark:border-neutral-800 rounded-sm flex-start overflow-hidden gap-2")}>
            <Search className="abs-y-center left-2 w-3.5 h-3.5 text-text-secondary" />
          </div>
          <Paragraph className="indent-0 text-xs font-medium text-text-tertiary mt-4">
            Home
            <span className="mx-2">/</span>
            SupplyPike Organization
          </Paragraph>
          <Paragraph className="indent-0 text-lg font-bold text-text-secondary mt-1">
            SupplyPike Organization
          </Paragraph>
          <Paragraph className="indent-0 text-xs font-medium text-text-tertiary mt-px">
            7ed9ac11cfbf20c6
          </Paragraph>

          <Paragraph className="indent-0 text-md font-bold text-text-secondary mt-5">
            Roles
          </Paragraph>
          <div className="roles-list w-full h-auto flex items-center justify-start gap-15 mt-2 overflow-x-auto">
            {rolesList.map((role, i) => (
              <RoleItem key={i} role={role} />
            ))}
          </div>

      </div>
    </div>
  )
}

const RoleItem = ({ role }: { role: Role }) => {
  return (
    <div className="role-item w-auto h-auto flex flex-col items-start gap-1 shrink-0">
      <Paragraph className="indent-0 text-sm font-semibold text-text-secondary">
        {role.name || "N/A"}
      </Paragraph>
      <div className="role-item-details w-auto h-auto flex items-center justify-start gap-2">
        <Paragraph className="indent-0 text-xs font-medium text-text-secondary">
          {role.role || "N/A"}
        </Paragraph>
        <Paragraph className="indent-0 text-[11px] font-normal text-text-tertiary">
          {role.description || "N/A"}
        </Paragraph>
      </div>
    </div>
  )
}

export default KeyOrgRoles