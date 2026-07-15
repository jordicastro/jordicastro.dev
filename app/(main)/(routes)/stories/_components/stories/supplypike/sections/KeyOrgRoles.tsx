"use client"

import { Paragraph } from "../SupplyPikeStory"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils";
import { Database, Search } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CodeText from "@/components/CodeText";
import { Arrow, DoubleArrow } from "@/components/svgs/svgs";
import { Courier_Prime } from "next/font/google";

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: "400",
});

const KeyOrgRoles = () => {
  return (
    <div className="w-full h-auto section-content flex flex-col items-start gap-4">
          <KeyOrgRolesDemo/>
          <Paragraph title="Guess Who?">
            Every customer account in the SupplyPike platform has a team managing the account. However, the application's interface did not display which employees were assigned to each account. This made cross-team communication inefficient, as employees who needed to contact an account manager or another team member first had to ask around to identify who was responsible for that account.
          </Paragraph>
          <Paragraph>
            A previous implementation partially addressed this issue by displaying the email addresses of the employees assigned to each account. However, it still lacked important context because it did not display each employee's name or role. For example, if terry@supplypike.com appeared under the ABC Farms account, admins had no easy way to determine which Terry it was or whether they were the account manager, customer success representative, or another member of the team.
          </Paragraph>
          <Paragraph title="Fetching & Fallback">
            Since a full refactor was outside the scope of the feature, I worked within the constraints of the existing codebase. Using the account data already available in MongoDB, I created a backend route that returned the email addresses of an account's key organization roles when given the account ID.
          </Paragraph>
          <Paragraph>
            At the time, the company was preparing to migrate from SupplyPike email addresses to SPS Commerce email addresses, which resulted in inconsistent data throughout the database. Additionally, the database only stored employee email addresses—not their full names. To display each team member’s name, I made a separate request to the Users route for each key organization role returned by the initial query.
          </Paragraph>
          <Paragraph>
            Since the email migration was still in progress, I implemented a fallback mechanism to handle missing or outdated records. If a user could not be found by their email address or the request failed for any reason, the application displayed the email address instead of the name. This allowed the feature to remain functional despite temporary inconsistencies during the migration.
          </Paragraph>
          <FetchingDiagraph />
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

const FetchingDiagraph = () => {
  const rowOneTexts = ["GET", "KEY ORG ROLES", "returns email list"];
  const rowTwoTexts = ["GET", "USER FROM EMAIL", "returns user obj"];
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // cascade animation when component mounts
      const root = scope.current;
      if (!root) return;

      const rows = gsap.utils.toArray<HTMLDivElement>(".rows", root);

      if (!rows.length) return;

      console.log('rows, ', rows);

      gsap.set(rows, { autoAlpha: 0, y: 15 });

      const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.out" } });

      rows.forEach((row, i) => {
        const rowItem = row.querySelectorAll(".row-item");
        if (!rowItem.length) return;
        tl.fromTo(row, {
          autoAlpha: 0,
          y: 15
        }, {
          autoAlpha: 1,
          y: 0,
        }, i === 0 ? "0.1" : i === 1 ? "<=0.09" : "<=0.08")
      })
    },
    { scope, dependencies: []}
  )

  return (
    <div ref={scope} className="w-full h-auto flex-center">
      <div className="fetching-diagraph-wrapper w-157 lg:w-full h-74 border border-bg-tertiary bg-none rounded-lg p-4 flex flex-col items-start justify-around gap-2 overflow-y-hidden overflow-x-auto">
        <div className="rows w-full h-auto flex items-center gap-4">
          <ClientBox className="row-item shrink-0" />
          <DoubleArrowComponent texts={rowOneTexts} className="row-item min-w-0" parentContainer={scope} />
          <Database className="row-item w-6 h-auto shrink-0 text-orange" />
        </div>
        <div className="rows w-auto h-auto ml-8">
          <Arrow className="row-item" />
        </div>
        <div className="rows w-full h-auto flex items-center gap-4">
          <EmailsBox className="row-item" />
          <DoubleArrowComponent texts={rowTwoTexts} className="row-item min-w-0" parentContainer={scope}/>
          <Database className="row-item w-6 h-auto shrink-0 text-orange" />
        </div>
        <div className="rows w-auto h-auto ml-8">
          <Arrow className="row-item" />
        </div>
        <div className="rows w-full h-autoflex-center">
          <KeyOrgNamesBox className="row-item" />
        </div>
      </div>
    </div>
  )
}

const ClientBox = ({ className }: { className?: string}) => (
  <div className={cn("client-box row-one w-[75px] h-[40px] rounded-lg border-2 border-(--sp-blue) flex-center", className)}>
    <p className="font-mono text-sm font-semibold tracking-wide">
      Client
    </p>
  </div>
)
const EmailsBox = ({ className }: { className?: string}) => (
  <div className={cn("client-box row-two w-[123px] h-[40px] rounded-lg border-2 border-(--sp-blue) flex-center", className)}>
    <CodeText
      text="emails.forEach"
      className="font-mono tracking-wide font-light text-xs"
    />  
  </div>
)
const KeyOrgNamesBox = ({ className }: { className?: string}) => (
  <div className={cn("client-box row-two w-118.75 h-10 rounded-lg border-2 border-(--sp-blue) flex-center", className)}>
    <CodeText
      text="const keyOrgNames = users.map((user, i) => user.name ?? emails[i]);"
      className="font-mono font-semibold text-[11px] text-purple"
    />  
  </div>
)
const DoubleArrowComponent = ({ className, texts, parentContainer }: { className?: string, texts: string[], parentContainer?: React.RefObject<HTMLDivElement | null>}) => {
  const [rightPos, setRightPos] = useState("right-0");

  useEffect(() => {
    const container = parentContainer?.current;
    if (!container) return;

    console.log('container.offsetWidth, ', container.offsetWidth);
  }, [parentContainer?.current?.offsetWidth])

  useEffect(() => {
    const container = parentContainer?.current;
    if (!container) return;

    const updateRightPos = () => {
      setRightPos(container.offsetWidth < 415 ? "-right-28" : container.offsetWidth < 460 ? "-right-12" : "right-0");
    };

    updateRightPos();

    const resizeObserver = new ResizeObserver(updateRightPos);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [parentContainer]);

  return (
    <div className={cn("relative double-arrow-component min-w-0 flex-1 py-6", className)}>
      <DoubleArrow className="w-full" />
      <DiagramText text={texts[0]} className="absolute -top-2 left-0 text-md"/>
      <DiagramText text={texts[1]} className="absolute -bottom-2 left-0 bg-bg-primary z-10"/>
      <DiagramText text={texts[2]} className={cn("absolute -bottom-2", rightPos)}/>
    </div>
  )
}

const DiagramText = ({ text, className }: { text: string; className?: string }) => (
  <p className={cn("diagram-text tracking-wider text-xs font-semibold text-text-secondary", courierPrime.className, className)}>
    {text}
  </p>
)

export default KeyOrgRoles