"use client";

import { useRef as useMobileSnapRailtsx_Ref, useState as useMobileSnapRailtsx_State, type ReactNode as MobileSnapRailtsx_ReactNode } from "react";
import GreenPumpHerotsx_Image from "next/image";
import { useRef as useGreenPumpHerotsx_Ref } from "react";
import useGreenPumpHerotsx_ViewportVideo from "@/components/media/useViewportVideo";
import { FiUser as GreenPumpHerotsx_FiUser, FiFeather as GreenPumpHerotsx_FiFeather, FiRefreshCw as GreenPumpHerotsx_FiRefreshCw } from "react-icons/fi";
import GreenPumpLinktsx_Link from "next/link";
import { FiArrowDownRight as GreenPumpLinktsx_FiArrowDownRight } from "react-icons/fi";
import GreenPumpLinktsx_slidingCircleStyles from "@/components/ui/slidingCircleStyles";
import { useState as useCarbonFootprintSectiontsx_State } from "react";
import { FiActivity as CarbonFootprintSectiontsx_FiActivity, FiArrowDownRight as CarbonFootprintSectiontsx_FiArrowDownRight, FiAward as CarbonFootprintSectiontsx_FiAward, FiCheck as CarbonFootprintSectiontsx_FiCheck, FiInfo as CarbonFootprintSectiontsx_FiInfo, FiShield as CarbonFootprintSectiontsx_FiShield, FiTarget as CarbonFootprintSectiontsx_FiTarget, FiZap as CarbonFootprintSectiontsx_FiZap } from "react-icons/fi";
import CarbonFootprintSectiontsx_slidingCircleStyles from "@/components/ui/slidingCircleStyles";
import { useEffect as useSustainableManufacturingtsx_Effect, useRef as useSustainableManufacturingtsx_Ref, useState as useSustainableManufacturingtsx_State } from "react";
import useSustainableManufacturingtsx_ViewportVideo from "@/components/media/useViewportVideo";
import { FiClock as SustainableManufacturingtsx_FiClock, FiRefreshCw as SustainableManufacturingtsx_FiRefreshCw, FiZap as SustainableManufacturingtsx_FiZap } from "react-icons/fi";
import { useEffect as useManufacturingBenefitsCarouseltsx_Effect, useRef as useManufacturingBenefitsCarouseltsx_Ref, useState as useManufacturingBenefitsCarouseltsx_State, type KeyboardEvent as ManufacturingBenefitsCarouseltsx_KeyboardEvent, type PointerEvent as ManufacturingBenefitsCarouseltsx_PointerEvent } from "react";
import { FiArrowLeft as ManufacturingBenefitsCarouseltsx_FiArrowLeft, FiArrowRight as ManufacturingBenefitsCarouseltsx_FiArrowRight, FiArrowUpRight as ManufacturingBenefitsCarouseltsx_FiArrowUpRight } from "react-icons/fi";
import { useRef as useApproachAndProductstsx_Ref } from "react";
import useApproachAndProductstsx_ViewportVideo from "@/components/media/useViewportVideo";
import { FiAward as ApproachAndProductstsx_FiAward, FiFileText as ApproachAndProductstsx_FiFileText, FiSun as ApproachAndProductstsx_FiSun, FiTrendingUp as ApproachAndProductstsx_FiTrendingUp, FiZap as ApproachAndProductstsx_FiZap } from "react-icons/fi";
import Image from "next/image";
import type { CSSProperties } from "react";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";

function MobileSnapRailtsx_MobileSnapRail({ children, label, count, desktopClassName }: {
    children: MobileSnapRailtsx_ReactNode;
    label: string;
    count: number;
    desktopClassName: string;
}) {
    const rail = useMobileSnapRailtsx_Ref<HTMLDivElement>(null);
    const [active, setActive] = useMobileSnapRailtsx_State(0);
    function updateActive() {
        const element = rail.current;
        if (!element)
            return;
        const start = element.getBoundingClientRect().left;
        const maximum = element.scrollWidth - element.clientWidth;
        const distances = [...element.children].map(child => Math.abs(element.scrollLeft - Math.min(maximum, child.getBoundingClientRect().left - start + element.scrollLeft)));
        setActive(distances.indexOf(Math.min(...distances)));
    }
    return <div className="min-w-0">
    <div ref={rail} role="region" aria-label={label} tabIndex={0} onScroll={updateActive} className={`flex max-w-full snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] after:block after:w-[max(0px,calc(100%_-_var(--rail-card-width)))] after:shrink-0 after:content-[''] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-[#2c7e4e] md:overflow-visible md:pb-0 md:after:hidden ${desktopClassName}`}>
      {children}
    </div>
    <div className="mt-5 flex justify-center gap-1.5 md:hidden" aria-label={`${label} navigation`}>
      {Array.from({ length: count }, (_, index) => <button key={index} type="button" aria-label={`Show card ${index + 1}`} aria-pressed={active === index} onClick={() => {
                const element = rail.current;
                const child = element?.children[index];
                if (element && child)
                    element.scrollBy({ left: child.getBoundingClientRect().left - element.getBoundingClientRect().left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
            }} className="flex h-8 min-w-5 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#2c7e4e]">
        <span className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${active === index ? "w-7 bg-[#a5c843]" : "w-2 bg-[#dce4d7]"}`}/>
      </button>)}
    </div>
  </div>;
}

const GreenPumpHerotsx_approaches = [
    { label: "Human-Centric Green Approach", Icon: GreenPumpHerotsx_FiUser, position: "md:top-[42%] md:left-8 min-[90rem]:left-[max(32px,calc((100%-1080px)/2))]", delay: "[animation-delay:80ms]" },
    { label: "Environment-Centric Green Approach", Icon: GreenPumpHerotsx_FiFeather, position: "md:top-[47%] md:right-8 min-[90rem]:right-[max(32px,calc((100%-1040px)/2))]", delay: "[animation-delay:180ms]" },
    { label: "Production-Centric Green Approach", Icon: GreenPumpHerotsx_FiRefreshCw, position: "md:right-1/2 md:translate-x-1/2 md:bottom-[19%]", delay: "[animation-delay:280ms]" },
];

function GreenLeafWords({ text, offset = 0 }: { text: string; offset?: number }) {
    let character = offset;
    return <>{text.split(" ").map((word, wordIndex) => <span key={wordIndex} className="inline-block whitespace-nowrap">{Array.from(word, (letter, index) => {
        const seed = character++;
        return <span key={index} className="green-leaf-letter inline-block" style={{ "--leaf-delay": `${(seed * 293 % 1450)}ms`, "--leaf-turn": `${seed % 2 ? -7 : 7}deg`, "--leaf-shift": `${seed % 2 ? -3 : 3}px` } as CSSProperties}>{letter}</span>;
    })}{wordIndex < text.split(" ").length - 1 ? "\u00a0" : ""}</span>)}</>;
}

function GreenPumpHerotsx_GreenPumpHero() {
    const title = useRepeatingTitle(2900);
    const video = useGreenPumpHerotsx_Ref<HTMLVideoElement>(null);
    useGreenPumpHerotsx_ViewportVideo(video);
    return (<section aria-labelledby="green-pump-title" className="box-content! pt-[var(--site-header-height,97px)] relative isolate w-full overflow-hidden bg-white pb-6 md:pb-0 md:h-[clamp(740px,63vw,900px)]">
      <div className="absolute inset-x-0 top-0 h-[calc(clamp(580px,155vw,760px)+var(--site-header-height,97px))] md:inset-0 md:h-full" aria-hidden="true">
        <GreenPumpHerotsx_Image src="/green-pump/green-pump-hero-poster.webp" alt="" fill preload sizes="100vw" className="object-cover object-center"/>
        <video ref={video} muted loop playsInline preload="metadata" poster="/green-pump/green-pump-hero-poster.webp" className="absolute inset-0 h-full w-full object-cover object-center" tabIndex={-1}>
          <source src="/green-pump/green-pump-hero.webm" type="video/webm"/>
        </video>
      </div>
      <h1 ref={title} aria-label="A MORE EFFICIENT PUMP, A MORE SUSTAINABLE FUTURE" id="green-pump-title" className="relative z-10 mx-auto max-w-[300px] px-4 pt-10 text-center text-[clamp(24px,6.4vw,28px)] md:absolute md:inset-x-5 md:max-w-[760px] md:px-0 md:pt-0 leading-[1.12] [font-weight:650] [font-variation-settings:'wght'_650,'wdth'_125] tracking-[-0.04em] text-[#2c7e4e] md:top-[calc(80px+var(--site-header-height,97px))] md:text-[30px]"><span aria-hidden="true"><GreenLeafWords text="A MORE EFFICIENT PUMP,"/><br className="hidden md:block"/> <GreenLeafWords text="A MORE SUSTAINABLE FUTURE" offset={21}/></span>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 bottom-0 md:top-0">{Array.from({ length: 12 }, (_, index) => <svg key={index} viewBox="0 0 24 40" className="green-title-leaf absolute h-[22px] w-[13px] opacity-0" style={{ left: `${4 + index * 8}%`, top: `${index % 3 * 18}%`, color: ["#608c31", "#98b84f", "#bdad59"][index % 3], "--fall-delay": `${index * 97 % 950}ms`, "--fall-drift": `${index % 2 ? -28 : 24}px`, "--fall-turn": `${index % 2 ? -110 : 130}deg` } as CSSProperties}>
          <path d="M12 1C-4 10-1 29 11 37C26 27 29 11 12 1Z" fill="currentColor"/><path d="M12 5Q8 23 11 39M10 18L4 13M10 25L18 18" fill="none" stroke="#395e27" strokeWidth=".8" opacity=".55"/>
        </svg>)}</span>
      </h1>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          #green-pump-title[data-title-revealing] .green-leaf-letter {
            animation: green-leaf-reveal 900ms cubic-bezier(.2,.65,.25,1) var(--leaf-delay) both;
          }
          #green-pump-title[data-title-revealing] .green-title-leaf {
            animation: green-title-fall 1900ms ease-in-out var(--fall-delay) both;
          }
        }
        @keyframes green-leaf-reveal {
          0% { opacity: 0; transform: translate(var(--leaf-shift),5px) rotate(var(--leaf-turn)); clip-path: polygon(23% 45%,35% 37%,43% 48%,55% 31%,66% 46%,57% 58%,70% 67%,42% 59%,26% 71%,31% 56%); }
          45% { opacity: .55; clip-path: polygon(0 24%,24% 9%,44% 21%,71% 0,100% 29%,83% 60%,100% 100%,42% 85%,0 100%,14% 53%); }
          100% { opacity: 1; transform: translate(0,0) rotate(0); clip-path: polygon(0 0,24% 0,44% 0,71% 0,100% 0,100% 60%,100% 100%,42% 100%,0 100%,0 53%); }
        }
        @keyframes green-title-fall {
          0% { opacity: 0; transform: translate(0,-26px) rotate(-25deg) scale(.7); }
          15% { opacity: .75; }
          40% { opacity: .8; transform: translate(var(--fall-drift),12px) rotate(30deg) scale(.95); }
          70% { opacity: .5; transform: translate(0,45px) rotate(-15deg) scale(.8); }
          100% { opacity: 0; transform: translate(var(--fall-drift),85px) rotate(var(--fall-turn)) scale(.55); }
        }
      `}</style>
      {/* The film contains the leaf sculpture; the supplied SVG supplies the Green Pump wordmark. */}
      <GreenPumpHerotsx_Image src="/green-pump/green-pump-icon.svg" alt="Green Pump by Sempa" width={1541} height={842} sizes="(min-width: 768px) 344px, 200px" className="relative z-10 mx-auto mt-[clamp(230px,65vw,330px)] h-auto w-[min(95%,360px)] md:absolute md:top-[48%] md:left-1/2 md:mt-0 md:w-[344px] md:-translate-x-1/2"/>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[430px] h-44 md:top-auto md:bottom-0 md:h-40 bg-linear-to-b from-transparent via-white/60 to-white"/>
      <div aria-hidden="true" className="pointer-events-none hidden md:absolute md:inset-x-0 md:bottom-0 md:block md:h-24 bg-linear-to-b from-white/0 to-white backdrop-blur-[3px] [mask-image:linear-gradient(to_bottom,transparent,#000)]"/>
      <ul aria-label="Our green approaches" className="relative z-20 mx-auto mt-6 grid max-w-[380px] gap-3 px-5 md:static md:mt-0 md:max-w-none md:px-0">
        {GreenPumpHerotsx_approaches.map(({ label, Icon, position, delay }) => <li key={label} className={`z-20 min-w-0 md:absolute md:w-[min(30vw,344px)] ${position}`}>
          <div className={`animate-news-card-reveal [animation-duration:500ms] [animation-fill-mode:backwards] motion-reduce:animate-none ${delay}`}>
            <div className="flex min-h-[76px] items-center justify-between gap-4 rounded-[25px] border-[0.5px] md:rounded-[30px] border-[#f7f7f7]/65 bg-[#a5c843]/25 px-5 py-4 text-[15px] leading-[1.12] text-[#27272a] md:bg-white/15 md:text-[#f7f7f7] shadow-[0_7px_25px_#2c7e4e0c] backdrop-blur-[18px] transition-[translate,background-color,box-shadow] duration-[350ms] hover:-translate-y-1 hover:bg-white/25 hover:shadow-[0_10px_30px_#2c7e4e18] motion-reduce:translate-none! motion-reduce:transform-none motion-reduce:transition-none md:min-h-[95px] md:px-[25px] md:text-[15px]">
              <span className="max-w-[225px]">{label}</span>
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#a5c843]/20 text-[#63e535] shadow-[0_0_22px_#a5c84380] md:h-12 md:w-12"><Icon className="h-6 w-6"/></span>
            </div>
          </div>
        </li>)}
      </ul>
    </section>);
}

function GreenPumpLinktsx_GreenPumpLink({ href, children, variant = "forest" }: {
    href: string;
    children: string;
    variant?: "forest" | "lime";
}) {
    const forest = variant === "forest";
    return <GreenPumpLinktsx_Link href={href} className={`${GreenPumpLinktsx_slidingCircleStyles.viewButton} group overflow-hidden [&&]:h-11 [&&]:max-w-full [&&]:border-0 [&&]:text-[13px]! [&&]:shadow-none [&&]:[transition:--blog-orb-offset_350ms_ease-in-out,box-shadow_350ms_ease,background-color_350ms_ease] motion-reduce:[&&]:transition-none ${forest ? "[&&]:w-[289px] [&&]:rounded-lg [&&]:bg-[#2c7e4e] [&&]:text-[#d9ed9a]! [&&]:[--blog-orb-offset:245px] hover:[&&]:bg-[#246b41] hover:[&&]:shadow-[0_4px_20px_#a5c84333]" : "[&&]:w-[251px] [&&]:rounded-[19px] [&&]:bg-[#a5c843] [&&]:text-[#27272a]! [&&]:[--blog-orb-offset:207px] hover:[&&]:bg-[#b0d451] hover:[&&]:shadow-[0_4px_20px_#2c7e4e22]"} [&&:is(:hover,:focus-visible)]:[--blog-orb-offset:0px] [&&:focus-visible]:outline-[#2c7e4e]`}>
    <span className={`${GreenPumpLinktsx_slidingCircleStyles.buttonLabel} ${forest ? "[&&]:[padding-left:calc(53px_-_var(--blog-orb-offset)_*_0.151020408)]" : "[&&]:[padding-left:calc(53px_-_var(--blog-orb-offset)_*_0.178743961)]"}`}>{children}</span>
    <span aria-hidden="true" className={`${GreenPumpLinktsx_slidingCircleStyles.buttonOrb} flex items-center justify-center [&&]:bg-none [&&]:text-[#2c7e4e] [&&]:shadow-none! ${forest ? "[&&]:bg-[#a5c843]/25" : "[&&]:bg-[#2c7e4e]/10"}`}><GreenPumpLinktsx_FiArrowDownRight className="h-[18px] w-[18px]"/></span>
  </GreenPumpLinktsx_Link>;
}

const CarbonFootprintSectiontsx_cards = [
    {
        id: "emissions", title: "Emission Identification", tag: "Scope 1 & 2 Direct Audit", kind: "emissions",
        description: "Pinpointing the exact sources of Scope 1, 2, and 3 emissions across every department, facility, and supply-chain tier.",
        metric: "GRANULARITY", value: "100% Audited",
        details: "Scope 1 covers direct emissions from owned or controlled sources. Scope 2 covers purchased energy. Scope 3 covers indirect emissions throughout the value chain, including suppliers and transport.",
    },
    {
        id: "resources", title: "Resource Evaluation", tag: "ISO 50001 Synergies", kind: "resources",
        description: "Analyzing and optimizing energy, fuel, and raw material efficiency to eliminate baseline operational waste.",
        metric: "ENERGY EFFICIENCY", value: "+18.4% Efficiency",
        details: "Resource evaluation connects energy, fuel, and raw-material consumption to an operational baseline. This provides a consistent basis for identifying waste and prioritizing efficiency opportunities.",
    },
    {
        id: "improvement", title: "Continuous Improvement", tag: "Dynamic Tracking", kind: "improvement",
        description: "Revealing precise areas for ongoing efficiency improvements and tracking verified year-over-year decarbonization.",
        metric: "GRANULARITY", value: "100% Audited",
        details: "Year-over-year tracking compares emissions and efficiency using consistent boundaries and reporting periods. Reviewing these indicators helps identify where further operational improvements can be made.",
    },
    {
        id: "future", title: "Future Goal Setting", tag: "SBTi Aligned", kind: "future",
        description: "Establishing data-driven, science-based targets (SBTi) to achieve verified net-zero milestones with transparent roadmaps.",
        metric: "NET ZERO TARGET", value: "2030 Horizon",
        details: "Science-based target setting links a defined emissions baseline to measurable milestones. Transparent roadmaps identify actions, review progress, and guide the next steps toward the stated 2030 horizon.",
    },
] as const;

const CarbonFootprintSectiontsx_cardStyle = "min-w-0 rounded-[30px] border p-6 transition-[transform,translate,box-shadow,background-color,border-color] duration-[350ms] hover:-translate-y-1 hover:shadow-[0_10px_25px_#2c7e4e12] motion-reduce:translate-none! motion-reduce:transform-none motion-reduce:transition-none";

function CarbonFootprintSectiontsx_DetailButton({ label, expanded, panelId, onClick, dark = false }: {
    label: "Inspect" | "Protocol Details";
    expanded: boolean;
    panelId: string;
    onClick: () => void;
    dark?: boolean;
}) {
    const protocol = label === "Protocol Details";
    return <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={onClick} className={`${CarbonFootprintSectiontsx_slidingCircleStyles.viewButton} cursor-pointer overflow-hidden [&&]:h-[30px] [&&]:min-h-11 [&&]:rounded-full [&&]:border-0 [&&]:text-[10px]! [&&]:shadow-none [&&]:[transition:--blog-orb-offset_350ms_ease-in-out,background-color_350ms_ease] [&&:focus-visible]:outline-[#2c7e4e] md:[&&]:min-h-0 ${protocol ? "[&&]:w-[120px] [&&]:[--blog-orb-offset:90px]" : "[&&]:w-[90px] [&&]:[--blog-orb-offset:60px]"} ${dark ? "[&&]:bg-[#a5c843] [&&]:text-[#183e28]! hover:[&&]:bg-[#b3d452]" : "[&&]:bg-[#2c7e4e] [&&]:text-[#d9ed9a]! hover:[&&]:bg-[#246c41]"} [&&:is(:hover,:focus-visible)]:[--blog-orb-offset:0px] motion-reduce:[&&]:transition-none`}>
    <span className={`${CarbonFootprintSectiontsx_slidingCircleStyles.buttonLabel} [&&]:[mask-image:radial-gradient(circle_at_calc(15px_+_var(--blog-orb-offset))_50%,transparent_10px,#000_11px)] ${protocol ? "[&&]:[padding-left:calc(31px_-_var(--blog-orb-offset)_*_0.233333333)]" : "[&&]:[padding-left:calc(31px_-_var(--blog-orb-offset)_*_0.35)]"}`}>{label}</span>
    <span aria-hidden="true" className={`${CarbonFootprintSectiontsx_slidingCircleStyles.buttonOrb} flex items-center justify-center [&&]:h-[18px] [&&]:w-[18px] [&&]:bg-none [&&]:shadow-none!`}><CarbonFootprintSectiontsx_FiArrowDownRight className="h-3.5 w-3.5"/></span>
  </button>;
}

function CarbonFootprintSectiontsx_CertificateBadge({ audited = false }: {
    audited?: boolean;
}) {
    return <span className={`inline-flex max-w-full items-center gap-2 rounded-lg bg-[#f7f7f7] px-1.5 py-1 text-[11px] leading-[1.12] text-[#9eb7d0] ${audited ? "min-h-[37px] w-[277px]" : "min-h-8 w-[266px]"}`}>
    <span aria-hidden="true" className="relative flex h-6 w-6 shrink-0 items-center justify-center text-[#a5c843]">{audited ? <CarbonFootprintSectiontsx_FiShield className="h-6 w-6"/> : <CarbonFootprintSectiontsx_FiAward className="h-6 w-6"/>}<CarbonFootprintSectiontsx_FiCheck className="absolute h-2.5 w-2.5"/></span>
    {audited ? "Audited GHG Protocol standard" : "Verified Governance Standard"}
  </span>;
}

function CarbonFootprintSectiontsx_CardIcon({ kind }: {
    kind: (typeof CarbonFootprintSectiontsx_cards)[number]["kind"];
}) {
    if (kind === "emissions")
        return <span aria-hidden="true" className="text-[22px] leading-none font-[540] text-[#2c7e4e]">CO₂</span>;
    if (kind === "resources")
        return <CarbonFootprintSectiontsx_FiZap aria-hidden="true" className="h-6 w-6 shrink-0 text-white"/>;
    if (kind === "improvement")
        return <CarbonFootprintSectiontsx_FiActivity aria-hidden="true" className="h-6 w-6 shrink-0 text-[#85b62d] drop-shadow-[0_0_6px_#a5c84366]"/>;
    return <CarbonFootprintSectiontsx_FiTarget aria-hidden="true" className="h-6 w-6 shrink-0 text-[#e76d4d]"/>;
}

function CarbonFootprintSectiontsx_CarbonFootprintSection() {
    const [expanded, setExpanded] = useCarbonFootprintSectiontsx_State<Record<string, boolean>>({});
    const toggle = (id: string) => setExpanded(previous => ({ ...previous, [id]: !previous[id] }));
    return (<section aria-labelledby="carbon-footprint-title" className="bg-[radial-gradient(ellipse_at_50%_40%,#d0efa92e,transparent_65%),linear-gradient(to_bottom,#fff_0%,#fafff6_50%,#fff_100%)] px-5 pt-10 pb-12 md:px-8 md:pt-14 md:pb-40">
      <div className="mx-auto grid max-w-[1200px] items-stretch gap-4 min-[75rem]:grid-cols-[minmax(0,563fr)_minmax(0,621fr)]">
        <article aria-labelledby="carbon-footprint-title" className="flex min-h-[960px] min-w-0 flex-col rounded-[30px] bg-[#a5c843] md:min-h-0 p-6 md:p-[34px] min-[75rem]:min-h-[707px]">
          <div className="flex min-h-[50px] w-full max-w-[330px] items-center gap-3 rounded-[15px] bg-[#f7f7f7]/80 px-4 py-3 text-[13px] leading-[1.12] text-[#2c7e4e]">
            <span aria-hidden="true" className="h-[21px] w-[21px] shrink-0 rounded-full border-2 border-[#f7f7f7] bg-[#2c7e4e]"/>
            <span className="flex-1">ISO 14064-1:2018 Certified</span><CarbonFootprintSectiontsx_FiInfo aria-hidden="true" className="h-6 w-6 shrink-0"/>
          </div>
          <h2 id="carbon-footprint-title" className="mt-8 max-w-[460px] text-[25px] leading-[1.12] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125]">Measuring Our Carbon Footprint, Planning Our Future.</h2>
          <p className="mt-10 max-w-[472px] md:mt-14 text-[15px] leading-[1.12] text-[#2c7e4e]">A crucial step in our sustainability journey is the measurement and monitoring of greenhouse gas emissions. By systematically tracking our direct and indirect carbon output across all operational scopes, we transform environmental metrics into decisive strategic insights.</p>
          <p className="mt-16 max-w-[403px] md:mt-16 text-[12px] leading-[1.12] text-[#2c7e4e]">For us, calculating our carbon footprint is not merely a reporting exercise; it is a critical management tool.</p>
          <div className="mt-4"><CarbonFootprintSectiontsx_CertificateBadge /></div>

          <div className="mt-auto pt-8">
            <h3 className="text-[12px] leading-none font-[410]">OPERATIONAL MANTRA</h3>
            <ol className="mt-3.5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
              {["WE MEASURE", "WE MONITOR", "WE IMPROVE"].map((mantra, index) => <li key={mantra} className="flex min-h-[69px] flex-col justify-between gap-2 rounded-[15px] border border-white/60 bg-[#f7f7f7] p-3">
                <div className="flex items-center justify-between gap-2 text-[12px] leading-none text-[#2c7e4e]"><span>{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true" className="h-[8.5px] w-[8.5px] rounded-full bg-[#2c7e4e]"/></div>
                <p className="text-[11px] leading-[1.12] md:text-[15px]">{mantra}</p>
              </li>)}
            </ol>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-3 md:mt-3.5 md:justify-between">
              <CarbonFootprintSectiontsx_CertificateBadge audited/>
              <CarbonFootprintSectiontsx_DetailButton label="Protocol Details" panelId="green-protocol-details" expanded={Boolean(expanded.protocol)} onClick={() => toggle("protocol")}/>
            </div>
            <div id="green-protocol-details" role="region" aria-labelledby="green-protocol-heading" hidden={!expanded.protocol} className="mt-4 rounded-xl border border-white/60 bg-white/35 p-4 text-[12px] leading-[1.35] text-[#194f30]">
              <h4 id="green-protocol-heading" className="mb-2 font-[540]">GHG Protocol reporting scopes</h4>
              <p>The GHG Protocol distinguishes direct emissions (Scope 1), purchased energy (Scope 2), and other value-chain emissions (Scope 3). Consistent reporting boundaries, activity data, and emission factors support measurement, monitoring, and improvement over time.</p>
            </div>
          </div>
        </article>

        <MobileSnapRailtsx_MobileSnapRail label="Carbon footprint insights" count={4} desktopClassName="[--rail-card-width:min(80vw,330px)] md:grid md:grid-cols-2 md:gap-3.5 min-[75rem]:grid-rows-[minmax(300px,1.65fr)_minmax(175px,1fr)_minmax(175px,1fr)]">
          {CarbonFootprintSectiontsx_cards.map(card => {
            const dark = card.kind === "resources";
            const wide = card.kind === "improvement" || card.kind === "future";
            const panelId = `green-${card.id}-details`;
            return <article key={card.id} aria-labelledby={`green-${card.id}-title`} className={`${CarbonFootprintSectiontsx_cardStyle} w-[min(80vw,330px)] shrink-0 snap-start md:w-auto min-h-[300px] md:min-h-0 ${wide ? "md:col-span-2 shadow-[0_12px_18px_#25351a1a]" : ""} ${dark ? "border-[#2c7e4e] bg-[#2c7e4e] text-white hover:border-[#3f9461] hover:bg-[#308654]" : "border-[#dce9d4]/50 bg-white/30 backdrop-blur-xl hover:border-[#b8cfab] hover:bg-white/50"}`}>
              <div className={`grid h-full min-w-0 gap-5 ${wide ? "md:grid-cols-[minmax(0,1fr)_125px] md:gap-6" : "grid-rows-[1fr_auto]"}`}>
                <div className="min-w-0">
                  <div className={`flex min-h-6 items-center gap-2.5 text-[10px] leading-[1.12] ${dark ? "text-[#d9ed9a]" : "text-[#9eb7d0]"}`}>
                    <CarbonFootprintSectiontsx_CardIcon kind={card.kind}/><span className={card.kind === "future" ? "rounded-md bg-white/70 px-2 py-1" : ""}>{card.tag}</span>
                  </div>
                  <h3 id={`green-${card.id}-title`} className={`mt-4 text-[20px] leading-[1.12] font-[410] ${wide ? "" : "max-w-[180px]"} ${dark ? "text-[#d9ed9a]" : "text-[#2c7e4e]"}`}>{card.title}</h3>
                  <p className="mt-3 text-[12px] leading-[1.12]">{card.description}</p>
                </div>
                <div className={`flex gap-3 ${wide ? "items-end justify-between md:flex-col md:items-end md:justify-between" : "items-end justify-between"}`}>
                  <div className={wide ? "md:text-right" : ""}>
                    <p className={`text-[9px] leading-[1.12] ${dark ? "text-[#d9ed9a]" : "text-[#9eb7d0]"}`}>{card.metric}</p>
                    <p className={`mt-1.5 text-[12px] leading-[1.12] ${dark ? "text-white" : "text-[#2c7e4e]"}`}>{card.value}</p>
                  </div>
                  <CarbonFootprintSectiontsx_DetailButton label="Inspect" panelId={panelId} expanded={Boolean(expanded[card.id])} onClick={() => toggle(card.id)} dark={dark}/>
                </div>
                <div id={panelId} role="region" aria-labelledby={`green-${card.id}-title`} hidden={!expanded[card.id]} className={`rounded-xl border p-4 text-[12px] leading-[1.35] ${wide ? "md:col-span-2" : ""} ${dark ? "border-white/20 bg-white/10" : "border-[#dce9d4] bg-white/60"}`}>{card.details}</div>
              </div>
            </article>;
        })}
        </MobileSnapRailtsx_MobileSnapRail>
      </div>
    </section>);
}

const SustainableManufacturingtsx_metrics = [
    { label: "Efficiency Standard", value: "IE4 / IE5", Icon: SustainableManufacturingtsx_FiZap, position: "top-[25%] left-1/2 -translate-x-1/2 md:translate-x-0 md:top-[32%] md:left-0", duration: 4600, delay: -1200 },
    { label: "Recyclability", value: "%97", Icon: SustainableManufacturingtsx_FiRefreshCw, position: "top-0 left-1/2 -translate-x-1/2 md:top-[37%] md:left-auto md:right-0 md:translate-x-0", duration: 5400, delay: -3600 },
    { label: "Service Life", value: "25 Year", Icon: SustainableManufacturingtsx_FiClock, position: "bottom-0 left-1/2 -translate-x-1/2 md:bottom-10", duration: 6100, delay: -2100 },
];

function SustainableManufacturingtsx_SustainableManufacturing() {
    const section = useSustainableManufacturingtsx_Ref<HTMLElement>(null);
    const video = useSustainableManufacturingtsx_Ref<HTMLVideoElement>(null);
    const [failed, setFailed] = useSustainableManufacturingtsx_State(false);
    useSustainableManufacturingtsx_ViewportVideo(video);
    useSustainableManufacturingtsx_Effect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        let animations: Animation[] = [];
        let visible = false;
        const syncAnimations = () => animations.forEach(animation => {
            if (visible && !document.hidden && !preference.matches)
                animation.play();
            else
                animation.pause();
        });
        function updateMotion() {
            animations.forEach(animation => animation.cancel());
            animations = [];
            if (!preference.matches) {
                section.current?.querySelectorAll<HTMLElement>("[data-manufacturing-float]").forEach((element, index) => {
                    animations.push(element.animate([{ transform: "translateY(0px)" }, { transform: "translateY(-5px)" }], { duration: SustainableManufacturingtsx_metrics[index].duration, delay: SustainableManufacturingtsx_metrics[index].delay, iterations: Infinity, direction: "alternate", easing: "ease-in-out" }));
                });
            }
            syncAnimations();
        }
        const observer = new IntersectionObserver(entries => {
            visible = entries.some(entry => entry.isIntersecting);
            syncAnimations();
        }, { rootMargin: "200px 0px" });
        if (section.current)
            observer.observe(section.current);
        updateMotion();
        preference.addEventListener("change", updateMotion);
        document.addEventListener("visibilitychange", syncAnimations);
        return () => { observer.disconnect(); document.removeEventListener("visibilitychange", syncAnimations); preference.removeEventListener("change", updateMotion); animations.forEach(animation => animation.cancel()); };
    }, []);
    return (<section ref={section} aria-labelledby="sustainable-manufacturing-title" className="bg-[radial-gradient(ellipse_at_50%_65%,#bee6a533_0%,#ebfae11a_50%,transparent_75%),linear-gradient(to_bottom,#fff,#fafff6)] px-5 pt-10 pb-10 md:px-8 md:pt-20 md:pb-10">
      <header className="sr-only text-center md:not-sr-only md:mx-auto md:max-w-[900px]">
        <h2 id="sustainable-manufacturing-title" className="text-[clamp(30px,4vw,50px)] leading-none font-[410] text-[#2c7e4e]">Sustainable Manufacturing</h2>
        <p className="mx-auto mt-4 max-w-[680px] text-[14px] leading-[1.12] md:text-[15px]">At SEMPA Pump, sustainability is not limited merely to energy consumption. We aim to reduce our environmental impacts through the efficient utilization of resources in production and the continuous development of processes.</p>
      </header>
      <div className="relative mx-auto max-w-[1000px] md:mt-14">
        <div className="relative mx-auto mt-8 aspect-square w-full max-w-[662px] md:mt-0 overflow-hidden rounded-[24px] bg-[radial-gradient(ellipse_at_center,#e2f3d6aa,transparent_72%)]">
          <div role="img" aria-label="97 percent recyclability" aria-hidden={!failed} className="absolute inset-0 flex flex-col items-center justify-center text-[#2c7e4e]"><span className="text-[clamp(72px,16vw,150px)] leading-none font-[540]">97%</span><span className="mt-4 text-[14px] text-[#2c7e4e]">Recyclability</span></div>
          <video ref={video} muted loop playsInline preload="metadata" onLoadedData={() => setFailed(false)} onError={() => setFailed(true)} aria-label="Leaf-formed 97 percent figure representing recyclable manufacturing materials" className={`absolute inset-0 h-full w-full object-contain [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent),linear-gradient(to_bottom,transparent,#000_7%,#000_93%,transparent)] [mask-composite:intersect] transition-opacity duration-300 motion-reduce:transition-none ${failed ? "opacity-0" : "opacity-100"}`}>
            <source src="/green-pump/97percent.webm" type="video/webm"/>
          </video>
        </div>
        <ul aria-label="Sustainable manufacturing metrics" className="absolute inset-0">
          {SustainableManufacturingtsx_metrics.map(({ label, value, Icon, position }) => <li key={label} className={`absolute w-[min(72%,300px)] min-w-0 md:w-[220px] md:first:w-[262px] ${position}`}>
            <div data-manufacturing-float>
              <div className="relative flex min-h-[72px] md:min-h-[93px] flex-col justify-center rounded-[15px] border-[0.5px] border-white/75 bg-white/15 p-3 md:p-4 text-[#2c7e4e] shadow-[0_12px_35px_#2d6e411f,inset_0_1px_0_#ffffff73] backdrop-blur-[30px] transition-[translate,box-shadow,backdrop-filter] duration-[350ms] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_#2d6e4129] hover:backdrop-blur-[24px] motion-reduce:translate-none! motion-reduce:transition-none">
                <Icon aria-hidden="true" className="absolute top-4 right-4 h-4 w-4"/>
                <p className="pr-5 text-[12px] leading-[1.12]">{label}</p>
                <p className="mt-2 text-[22px] leading-none md:text-[25px] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125]">{value}</p>
              </div>
            </div>
          </li>)}
        </ul>
      </div>
    </section>);
}

const ManufacturingBenefitsCarouseltsx_benefits = [
    { id: "waste", title: "Waste Reduction", description: "Metal shavings, casting slag, and packaging materials from manufacturing processes are segregated at source and transferred to certified recyclers, minimizing disposed waste volume.", label: "Material Recovery", value: "Certified Recyclers" },
    { id: "energy", title: "Energy Efficiency", description: "High-efficiency motors, hydraulic flow optimization, and energy-saving production lines.", label: "Motor & Flow Efficiency", value: "IE4 / IE5 Standart" },
    { id: "lifespan", title: "Extended Product Lifespan", description: "SEMPA pumps are engineered with mechanical robustness to operate reliably for decades. Wear-resistant specialized alloys, anti-corrosive epoxy coatings, and dynamically balanced bearings multiply operational lifespan.", label: "Built for Longevity", value: "Wear-Resistant Design" },
    { id: "maintenance", title: "Streamlined Maintenance & Service", description: "The Back Pull-Out modular design allows maintenance without dismantling piping, reducing downtime and service requirements.", label: "Modular Service Design", value: "Back Pull-Out" },
    { id: "resources", title: "Effective Resource Utilization", description: "Every gram of material, each kilowatt of energy, and every production resource is managed through optimized and responsible manufacturing processes.", label: "Responsible Manufacturing", value: "Optimized Resources" },
];

const ManufacturingBenefitsCarouseltsx_count = ManufacturingBenefitsCarouseltsx_benefits.length;

const ManufacturingBenefitsCarouseltsx_slides = Array.from({ length: ManufacturingBenefitsCarouseltsx_count * 3 }, (_, position) => ({ ...ManufacturingBenefitsCarouseltsx_benefits[position % ManufacturingBenefitsCarouseltsx_count], position }));

const ManufacturingBenefitsCarouseltsx_wrap = (index: number) => (index % ManufacturingBenefitsCarouseltsx_count + ManufacturingBenefitsCarouseltsx_count) % ManufacturingBenefitsCarouseltsx_count;

function ManufacturingBenefitsCarouseltsx_ManufacturingBenefitsCarousel() {
    const [position, setPosition] = useManufacturingBenefitsCarouseltsx_State(ManufacturingBenefitsCarouseltsx_count + 1);
    const [animated, setAnimated] = useManufacturingBenefitsCarouseltsx_State(true);
    const [moving, setMoving] = useManufacturingBenefitsCarouseltsx_State(false);
    const region = useManufacturingBenefitsCarouseltsx_Ref<HTMLDivElement>(null);
    const gesture = useManufacturingBenefitsCarouseltsx_Ref<{
        x: number;
        y: number;
        id: number;
    } | null>(null);
    const suppressClick = useManufacturingBenefitsCarouseltsx_Ref(false);
    const active = ManufacturingBenefitsCarouseltsx_benefits[ManufacturingBenefitsCarouseltsx_wrap(position)];
    useManufacturingBenefitsCarouseltsx_Effect(() => {
        if (animated)
            return;
        let secondFrame = 0;
        const firstFrame = requestAnimationFrame(() => { secondFrame = requestAnimationFrame(() => setAnimated(true)); });
        return () => { cancelAnimationFrame(firstFrame); cancelAnimationFrame(secondFrame); };
    }, [animated]);
    function moveTo(next: number) {
        if (moving || next === position)
            return;
        if (region.current?.contains(document.activeElement))
            region.current.focus({ preventScroll: true });
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setAnimated(false);
            setPosition(ManufacturingBenefitsCarouseltsx_count + ManufacturingBenefitsCarouseltsx_wrap(next));
            return;
        }
        setMoving(true);
        setPosition(next);
    }
    function finishMovement() {
        if (position < ManufacturingBenefitsCarouseltsx_count || position >= ManufacturingBenefitsCarouseltsx_count * 2) {
            setAnimated(false);
            setPosition(ManufacturingBenefitsCarouseltsx_count + ManufacturingBenefitsCarouseltsx_wrap(position));
        }
        setMoving(false);
    }
    function onKeyDown(event: ManufacturingBenefitsCarouseltsx_KeyboardEvent<HTMLDivElement>) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            moveTo(position + (event.key === "ArrowRight" ? 1 : -1));
        }
        else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            moveTo(ManufacturingBenefitsCarouseltsx_count + (event.key === "Home" ? 0 : ManufacturingBenefitsCarouseltsx_count - 1));
        }
    }
    function onPointerUp(event: ManufacturingBenefitsCarouseltsx_PointerEvent<HTMLDivElement>) {
        const start = gesture.current;
        gesture.current = null;
        if (!start || start.id !== event.pointerId)
            return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            suppressClick.current = true;
            moveTo(position + (dx < 0 ? 1 : -1));
        }
    }
    return (<section aria-labelledby="manufacturing-benefits-title" className="overflow-hidden bg-[linear-gradient(to_bottom,#fafff6_0%,#f5fdeb_45%,#fff_100%)] px-3 pt-4 pb-32 md:px-8 md:pb-28">
      <h2 id="manufacturing-benefits-title" className="sr-only">Manufacturing benefits</h2>
      <p id="manufacturing-carousel-help" className="sr-only">Use the left and right arrow keys, the navigation buttons, or swipe to explore the manufacturing benefits.</p>
      <div ref={region} role="region" aria-roledescription="carousel" aria-label="Explore manufacturing benefits" aria-describedby="manufacturing-carousel-help" tabIndex={0} onKeyDown={onKeyDown} onPointerDown={event => { suppressClick.current = false; gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId }; }} onPointerUp={onPointerUp} onPointerCancel={() => { gesture.current = null; }} onClickCapture={event => { if (suppressClick.current) {
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
    } }} className="relative mx-auto h-[670px] max-w-[1100px] touch-pan-y overflow-hidden rounded-[15px] [--benefit-passive:140px] [--benefit-active:clamp(164px,48vw,200px)] [--benefit-gap:40px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2c7e4e] md:[--benefit-passive:160px] md:[--benefit-active:180px] md:[--benefit-gap:60px]">
        <div className={`absolute top-2 left-1/2 flex w-max items-start gap-[var(--benefit-gap)] ${animated ? "transition-transform duration-500 ease-in-out" : "transition-none"} motion-reduce:transition-none`} style={{ transform: `translate3d(calc(-${position} * (var(--benefit-passive) + var(--benefit-gap)) - var(--benefit-active) / 2), 0, 0)` }} onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === "transform")
        finishMovement(); }}>
          {ManufacturingBenefitsCarouseltsx_slides.map(slide => {
            const selected = slide.position === position;
            const visible = Math.abs(slide.position - position) <= 2;
            return <article key={slide.position} role="group" aria-roledescription="slide" aria-label={`${ManufacturingBenefitsCarouseltsx_wrap(slide.position) + 1} of ${ManufacturingBenefitsCarouseltsx_count}: ${slide.title}`} aria-hidden={!visible} inert={!visible} data-active={selected ? "true" : "false"} className={`relative flex shrink-0 flex-col overflow-hidden rounded-[15px] [&>*]:relative border px-4 py-5 ${animated ? "transition-[width,height,margin,background-color,box-shadow] duration-[350ms] ease-in-out" : "transition-none"} motion-reduce:transition-none ${selected ? "mt-0 h-[640px] w-[var(--benefit-active)] border-transparent bg-transparent text-center before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[245px] before:rounded-[15px] before:bg-white/65 md:border-white/40 md:bg-white/65 md:before:hidden shadow-[inset_0_1px_8px_#fff,0_10px_30px_#2c7e4e0a]" : "mt-5 h-[600px] w-[var(--benefit-passive)] border-transparent bg-transparent "}`}>
              <h3 className={`${selected ? `max-w-[190px] leading-none [font-weight:410] ${slide.id === "energy" ? "text-[clamp(21px,6vw,25px)]" : "text-[18px] md:text-[20px]"}` : "text-[15px] leading-[1.12] font-[410]"}`}>{slide.title}</h3>
              {selected ? <>
                <span aria-hidden="true" className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a5c843] text-[#2c7e4e] shadow-[0_0_18px_#a5c84366] mt-14"><ManufacturingBenefitsCarouseltsx_FiArrowUpRight className="h-5 w-5"/></span>
                <div className="flex shrink-0 items-center justify-center gap-5 mt-10">
                  <button type="button" aria-label="Previous manufacturing benefit" aria-disabled={moving} onClick={() => moveTo(position - 1)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#9eb7d0]! transition-colors duration-200 hover:bg-[#e4efda] hover:text-[#2c7e4e]! focus-visible:outline-2 focus-visible:outline-[#2c7e4e]"><ManufacturingBenefitsCarouseltsx_FiArrowLeft className="h-5 w-5"/></button>
                  <button type="button" aria-label="Next manufacturing benefit" aria-disabled={moving} onClick={() => moveTo(position + 1)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#9eb7d0]! transition-colors duration-200 hover:bg-[#e4efda] hover:text-[#2c7e4e]! focus-visible:outline-2 focus-visible:outline-[#2c7e4e]"><ManufacturingBenefitsCarouseltsx_FiArrowRight className="h-5 w-5"/></button>
                </div>
              </> : <button type="button" tabIndex={-1} aria-label={`Show ${slide.title}`} aria-disabled={moving} onClick={() => moveTo(slide.position)} className="mt-4 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#27272a] text-white! transition-[background-color,transform] duration-200 hover:rotate-6 hover:bg-[#2c7e4e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c7e4e]"><ManufacturingBenefitsCarouseltsx_FiArrowUpRight className="h-4 w-4"/></button>}
              <p className={`text-[12px] leading-[1.12] ${selected ? "text-[#9eb7d0] mt-8" : "text-[#9eb7d0] mt-10"}`}>{slide.description}</p>
              {selected && <div className="mt-auto flex min-h-[90px] shrink-0 flex-col justify-center rounded-lg bg-[#a5c843] p-3 text-[#27272a] md:mx-auto md:w-full">
                <p className="text-[11px] leading-[1.12]">{slide.label}</p>
                <p className="mt-3 text-[15px] leading-[1.12] [font-weight:540]">{slide.value}</p>
              </div>}
            </article>;
        })}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-linear-to-r from-[#f8fff2] to-transparent md:w-12"/>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-linear-to-l from-[#f8fff2] to-transparent md:w-12"/>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{active.title}. {ManufacturingBenefitsCarouseltsx_wrap(position) + 1} of {ManufacturingBenefitsCarouseltsx_count}.</p>
    </section>);
}

const ApproachAndProductstsx_approachCards = [
    { title: "More Efficient", description: "We focus on maximizing energy efficiency across pump systems.", Icon: ApproachAndProductstsx_FiTrendingUp, color: "text-[#2c7e4e]" },
    { title: "Less Energy", description: "We support the reduction of energy consumption through optimum pump selection and high-efficiency solutions.", Icon: ApproachAndProductstsx_FiZap, color: "text-[#2c7e4e]" },
    { title: "Longer Lifespan", description: "We aim to increase operational lifespan through durable, reliable, and easily maintainable products.", Icon: ApproachAndProductstsx_FiAward, color: "text-[#d58b43]" },
    { title: "Cleaner Energy", description: "We reduce the environmental impact of our manufacturing processes by scaling up renewable energy investments.", Icon: ApproachAndProductstsx_FiSun, color: "text-[#d58b43]" },
];

const ApproachAndProductstsx_productCards = [
    { title: "Quality", description: "Tight machining tolerances, high-grade metallurgical casting, and zero-defect quality inspection protocols at every step." },
    { title: "Durability", description: "Special alloy ductile iron casings, corrosion-proof stainless/bronze impellers, and heavy-duty bearing arrangements endure for decades without wear." },
    { title: "Reliability", description: "Optimized hydraulic geometries and thermal stability ensure consistent flow rates and pressure heads even under extreme duty cycles." },
    { title: "Maintainability", description: "Thanks to the Back Pull-Out design philosophy, seal, bearing, and motor replacements are executed in minutes without pipe dismantling." },
];

function ApproachAndProductstsx_ApproachAndProducts() {
    const pump = useApproachAndProductstsx_Ref<HTMLVideoElement>(null);
    const forest = useApproachAndProductstsx_Ref<HTMLVideoElement>(null);
    useApproachAndProductstsx_ViewportVideo(pump);
    useApproachAndProductstsx_ViewportVideo(forest);
    return (<>
      <section aria-labelledby="lasting-products-title" className="relative isolate bg-white text-[#f7f7f7] md:bg-[#163626]">
        <video ref={forest} muted loop playsInline preload="metadata" aria-label="A green forest forming the Sempa symbol" className="absolute inset-x-0 top-0 -z-10 h-[440px] w-full object-cover md:h-full object-center">
          <source src="/green-pump/green-flow-slider.mp4" type="video/mp4"/>
        </video>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[440px] md:h-full bg-[linear-gradient(to_bottom,#0000002e,#0000001f_45%,#0000006b)]"/>
        <div className="relative mx-auto flex min-h-[500px] max-w-[1264px] flex-col px-5 pt-12 pb-0 md:px-8 md:pt-24 md:pb-0">
          <header className="text-center">
            <h2 id="lasting-products-title" className="mx-auto max-w-[900px] text-[clamp(30px,4vw,50px)] leading-none">Long-Lasting Products,<br className="hidden md:block"/> Less Resource Consumption</h2>
            <p className="mx-auto mt-28 max-w-[760px] md:mt-4 text-[13px] leading-[1.12] md:text-[15px]">A product operating reliably for an extended lifespan contributes directly to reducing the need for new equipment and replacement parts.</p>
          </header>
          <ul className="mt-12 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-2 lg:mt-auto lg:-mb-3 lg:grid-cols-4">
            {ApproachAndProductstsx_productCards.map(({ title, description }) => (<li key={title} className="relative isolate min-w-0 rounded-[15px] border-[0.5px] border-white/75 bg-[#232323]/50 p-5 text-[#f7f7f7] shadow-[0_8px_25px_#0000001f] backdrop-blur-[28px] transition-[translate,backdrop-filter,background-color,color,border-color,box-shadow] duration-300 ease-in-out after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:hidden after:rounded-[inherit] after:bg-[linear-gradient(to_bottom,transparent_60%,#9da395_96%,#9da395_100%)] after:transition-opacity after:duration-300 hover:-translate-y-[5px] hover:border-white hover:bg-[#d0f053] hover:text-[#27272a] hover:shadow-[0_8px_25px_#d0f05340] hover:backdrop-blur-[22px] hover:after:opacity-0 motion-reduce:translate-none! motion-reduce:transition-none motion-reduce:after:transition-none md:bg-[#232323]/30 md:hover:bg-[#d0f053] lg:min-h-[130px] lg:after:block">
                <h3 className="text-[19px] leading-[1.05]">{title}</h3>
                <p className="mt-3 text-[12px] leading-[1.12]">{description}</p>
              </li>))}
          </ul>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-5 lg:hidden bg-linear-to-b from-transparent to-[#fafff6]/20"/>
      </section>

      <section aria-labelledby="green-approach-title" className="bg-[radial-gradient(ellipse_at_75%_50%,#ecf9df66,transparent_65%),linear-gradient(to_bottom,#fafff6,#fff_30%,#fafff6_75%,#fff)] px-5 pt-14 md:px-8 md:pt-40">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[minmax(0,620fr)_minmax(0,560fr)] lg:gap-5">
          <div className="order-2 min-w-0 md:order-1">
            <h2 id="green-approach-title" className="max-w-[300px] text-[clamp(36px,12vw,50px)] md:max-w-[520px] md:text-[clamp(36px,4vw,50px)] leading-none text-[#2c7e4e]">Our Green Pump<br />Approach</h2>
            <p className="mt-8 max-w-[640px] text-[14px] leading-[1.12] md:mt-10 md:text-[15px]">SEMPA Pump&apos;s “Green Pump” approach represents a philosophy that considers not merely the manufacturing phase, but the complete product lifecycle extending from initial design through to end-of-life.</p>
            <ul className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 md:mt-9 md:gap-4">
              {ApproachAndProductstsx_approachCards.map(({ title, description, Icon, color }) => (<li key={title} className="group min-h-[150px] min-w-0 rounded-[15px] border border-[#9eb7d0]/25 bg-white/80 p-5 transition-[translate,border-color,background-color,box-shadow] duration-300 ease-in-out hover:-translate-y-1 hover:border-[#2c7e4e]/50 hover:bg-[#f7fff2] hover:shadow-[0_10px_25px_#2c7e4e12] motion-reduce:translate-none! motion-reduce:transition-none md:min-h-[150px] md:p-[22px]">
                  <Icon aria-hidden="true" className={`h-5 w-5 transition-[filter] duration-300 group-hover:drop-shadow-[0_0_5px_#a5c84399] motion-reduce:transition-none ${color}`}/>
                  <h3 className="mt-3 text-[18px] leading-[1.05] md:text-[20px]">{title}</h3>
                  <p className="mt-3 text-[12px] leading-[1.12]">{description}</p>
                </li>))}
            </ul>
          </div>
          <div className="relative order-1 mx-auto w-full min-w-0 max-w-[650px] md:order-2 lg:self-center">
            <div className="relative aspect-[0.85] w-full overflow-hidden bg-white md:aspect-square [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent),linear-gradient(to_bottom,transparent,#000_5%,#000_92%,transparent)] [mask-composite:intersect]">
              {/* The source contains black sidebars. Crop those margins without stretching or cropping the pump. */}
              <video ref={pump} muted loop playsInline preload="metadata" aria-label="Blue Sempa pump demonstrating durable pump engineering" className="absolute top-1/2 left-1/2 h-auto w-[255%] max-w-none md:w-[199%] -translate-x-1/2 -translate-y-1/2 object-contain">
                <source src="/green-pump/pump-video.webm" type="video/webm"/>
              </video>
            </div>
            <div className="relative z-10 mx-auto -mt-5 max-w-[360px] text-center lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:w-[360px]">
              <div className="relative ml-auto flex min-h-[60px] max-w-[180px] md:min-h-[85px] md:max-w-[240px] items-center justify-center gap-3 px-2 py-4 before:pointer-events-none before:absolute before:inset-y-1 before:left-0 before:aspect-square before:rounded-full before:border-2 before:border-[#8df1e0]/70 before:shadow-[0_0_18px_#73d5de99,inset_0_0_15px_#73d5de66]">
                <h3 className="relative max-w-[120px] text-right text-[11px] md:max-w-[160px] md:text-[15px] leading-none text-[#27272a]">We Are Reporting Our Carbon Footprint</h3>
                <ApproachAndProductstsx_FiFileText aria-hidden="true" className="relative h-8 w-7 shrink-0 md:h-11 md:w-9 rounded-lg bg-[#a5c843]/45 p-1 text-[#a5c843] drop-shadow-[0_0_9px_#a5c84399]"/>
              </div>
              <p className="sr-only text-[12px] leading-[1.12] text-[#9eb7d0] md:not-sr-only md:mt-4">Under ISO 14064 GHG verification and ISO 50001 Energy Management frameworks, we rigorously audit Scope 1, Scope 2, and Scope 3 emissions to ensure data-driven decarbonization.</p>
            </div>
          </div>
        </div>
        <p className="mx-auto max-w-[850px] pt-16 pb-28 text-center text-[clamp(30px,10.5vw,44px)] md:text-[clamp(32px,3vw,40px)] leading-none md:pt-32 md:pb-40">Green Pump: It&apos;s the step we&apos;re taking toward a future with less energy consumption, <span className="text-[#2c7e4e]">lower carbon emissions, and greater efficiency.</span></p>
      </section>

    </>);
}

const technologyTags = ["Energy Efficiency", "Sustainable Design", "Eco-Friendly", "High Performance", "Low Carbon", "GreenFlow Initiative"];

const advantages = [
    { title: "Optimal Performance", description: "Ideal operating conditions supported by precise pump selection.", surface: "border-[#dce4e7]/75 bg-[linear-gradient(to_bottom,#ffffff26_0%,#ffffff26_45%,#ffffffb3_100%)] text-[#27272a] backdrop-blur-[30px] hover:bg-white/25" },
    { title: "Low Energy Consumption", description: "Maximum hydraulic efficiency with minimal power usage.", surface: "border-[#a5c843] bg-[#a5c843] text-[#27272a] hover:bg-[#afd14d]" },
    { title: "Lower Operating Costs", description: "Increased operational profitability driven by energy savings.", surface: "border-[#dce4e7]/75 bg-[linear-gradient(to_bottom,#ffffff26_0%,#ffffff26_45%,#ffffffb3_100%)] text-[#27272a] backdrop-blur-[30px] hover:bg-white/25" },
    { title: "Reduced Carbon Emissions", description: "An eco-friendly infrastructure that mitigates fossil fuel impact.", surface: "border-[#2c7e4e] bg-[#2c7e4e] text-white hover:bg-[#328b57]" },
];

export default function GreenPumpPage() {
    return (<main data-header-underlay className="-mt-[var(--site-header-height,97px)] w-full font-sans text-[#27272a] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,'wdth'_125] tracking-[-0.04em]">
      <div className="bg-[radial-gradient(ellipse_at_55%_65%,#dcf6c166,transparent_60%),linear-gradient(135deg,#fff_0%,#f7fff2_55%,#f2ffe8_100%)]">
      <GreenPumpHerotsx_GreenPumpHero />

      <section aria-labelledby="green-technology-title" className="relative bg-[linear-gradient(to_bottom,#fff_0%,transparent_160px)] px-5 pt-12 pb-10 md:px-8 md:pt-10 md:pb-10">
        <div className="mx-auto grid max-w-[1200px] items-center gap-x-6 gap-y-10 md:grid-cols-2 min-[75rem]:grid-cols-[minmax(0,289fr)_minmax(0,594fr)_minmax(0,251fr)]">
          <div className="order-3 min-w-0 md:order-none">
            <h2 id="green-technology-title" className="max-w-[329px] text-[25px] leading-[1.12] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125]">Energy-Efficient Pump Technologies for a Sustainable Future</h2>
            <ul aria-label="Technology features" className="mt-4 grid max-w-[329px] grid-cols-2 gap-1.5">
              {technologyTags.map(tag => <li key={tag} className="rounded-md bg-[#f7f7f7]/85 px-2 py-1.5 text-[10px] leading-[1.12] text-[#9eb7d0]">{tag}</li>)}
            </ul>
            <p className="mt-4 max-w-[289px] text-[15px] leading-[1.12]">The environmental impact lies in the energy consumed over the product’s lifespan.</p>
            <div className="mt-5"><GreenPumpLinktsx_GreenPumpLink href="/contact#contact-write-title">Request Efficiency Analysis</GreenPumpLinktsx_GreenPumpLink></div>
          </div>

          <div className="relative order-1 min-w-0 md:order-none md:col-span-2 md:row-start-2 min-[75rem]:col-span-1 min-[75rem]:row-start-auto">
            <Image src="/green-pump/01.jpg" alt="Metallic Sempa symbol with solar panels" width={1376} height={768} sizes="(min-width: 1200px) 604px, (min-width: 768px) 90vw, 100vw" className="h-auto w-full object-contain mix-blend-multiply [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent),linear-gradient(to_bottom,transparent,#000_8%,#000_94%,transparent)] [mask-composite:intersect]"/>
          </div>

          <div className="order-2 min-w-0 md:order-none md:col-start-2 md:row-start-1 min-[75rem]:col-start-3 min-[75rem]:row-start-auto">
            <h2 className="max-w-[300px] text-[25px] leading-[1.12] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125] text-[#a5c843]">2MW Solar Plant Provides 40% of Energy</h2>
            <p className="mt-6 max-w-[300px] text-[15px] leading-[1.12] min-[75rem]:max-w-[251px]">At Sempa Pump, we view sustainability not merely as an environmental responsibility, but as an integral part of our product development, production, and business practices.</p>
            <div className="mt-5"><GreenPumpLinktsx_GreenPumpLink href="/e-mission" variant="lime">Discover Sustainability</GreenPumpLinktsx_GreenPumpLink></div>
          </div>
        </div>
      </section>

      <section aria-label="Green Pump advantages" className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom,transparent_0%,#f2ffe866_45%,#fff_100%)] px-5 pt-[220px] pb-8 md:px-8 md:pt-44 md:pb-44 min-[75rem]:pt-[240px] min-[75rem]:pb-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-[1280px]" aria-hidden="true">
          <Image src="/green-pump/02.png" alt="" width={1654} height={1009} sizes="(min-width: 1280px) 1280px, (min-width: 768px) 100vw, 760px" className="absolute bottom-[72px] left-1/2 h-auto w-[760px] max-w-none -translate-x-[60%] object-contain md:bottom-4 md:w-full md:-translate-x-1/2"/>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-white"/>
        </div>
        <div className="relative mx-auto max-w-[998px]"><MobileSnapRailtsx_MobileSnapRail label="Green Pump advantages" count={4} desktopClassName="[--rail-card-width:min(72vw,280px)] md:grid md:grid-cols-2 md:gap-[22px] min-[75rem]:grid-cols-4">
          {advantages.map(advantage => <article key={advantage.title} className={`flex w-[min(72vw,280px)] shrink-0 snap-start min-h-[195px] md:w-auto flex-col items-center rounded-[30px] border-[0.2px] px-[14px] pt-9 pb-[23px] text-center transition-[translate,box-shadow,background-color] duration-[350ms] hover:-translate-y-[5px] hover:shadow-[0_12px_30px_#2c7e4e20] motion-reduce:translate-none! motion-reduce:transform-none motion-reduce:transition-none min-[75rem]:min-h-[195px] min-[75rem]:pt-[42px] ${advantage.surface}`}>
            <h2 className="text-[17px] leading-[1.12] [font-weight:540] [font-variation-settings:'wght'_540,'wdth'_125]">{advantage.title}</h2>
            <p className="mt-4 max-w-[205px] text-[13px] leading-[1.12]">{advantage.description}</p>
          </article>)}
        </MobileSnapRailtsx_MobileSnapRail></div>
      </section>
      </div>
      <CarbonFootprintSectiontsx_CarbonFootprintSection />
      <SustainableManufacturingtsx_SustainableManufacturing />
      <ManufacturingBenefitsCarouseltsx_ManufacturingBenefitsCarousel />
      <ApproachAndProductstsx_ApproachAndProducts />
    </main>);
}
