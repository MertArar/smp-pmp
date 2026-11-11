"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { LuCheck, LuCloudDownload, LuFactory, LuFlame, LuLayers, LuScale, LuScanLine, LuShieldCheck, LuTrendingUp } from "react-icons/lu";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useViewportVideo from "@/components/media/useViewportVideo";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
const asset = (name: string) => `/foundry/${encodeURIComponent(name)}`;
const frame = "mx-auto w-[calc(100%-24px)] min-[768px]:w-[90%] min-[1200px]:w-5/6";
const heading = "m-0 text-[clamp(26px,7.7vw,34px)] leading-none tracking-[-0.04em] min-[768px]:text-[36px] min-[1200px]:text-[calc(50*var(--foundry-unit))]";
const redText = "bg-linear-to-b from-[#E30A17] to-[#7D060D] bg-clip-text text-transparent";
const body = "text-[16px] leading-[1.05] tracking-[-0.04em] min-[768px]:leading-[1.15] min-[1200px]:text-[calc(15*var(--foundry-unit))]";
const small = "text-[12px] leading-[1.12] tracking-[-0.04em] min-[1200px]:text-[calc(12*var(--foundry-unit))]";
const glass = "border border-white/20 bg-white/15 backdrop-blur-[30px]";
const heroGlass = "border border-white/25 bg-white/[0.08] backdrop-blur-[8px]";
function FoundryFireWord({ children }: { children: string }) {
    return <span className="foundry-fire-word relative inline-block whitespace-nowrap">
      {Array.from(children, (letter, index) => <span key={index} className="foundry-fire-letter relative inline-block" style={{ "--burn-delay": `${index / children.length * 1250 + (index % 3) * 35}ms`, "--spark-drift": `${index % 2 ? -0.16 : 0.2}em` } as CSSProperties}>
        <span className="foundry-fire-paper inline-block">{letter}</span>
        <span aria-hidden="true" className="foundry-fire-ember absolute inset-0">{letter}</span>
      </span>)}
    </span>;
}
const tableText = "bg-[linear-gradient(90deg,#F7F7F7_0%,rgba(247,247,247,0.2)_100%)] bg-clip-text text-transparent";
const tableRedText = "bg-[linear-gradient(90deg,#E30A17_0%,rgba(227,10,23,0.25)_100%)] bg-clip-text text-transparent";
const descriptionText = "bg-[linear-gradient(180deg,#F7F7F7_0%,rgba(247,247,247,0.22)_100%)] bg-clip-text text-transparent";
const capacity = [
    { value: "4,000 kg", label: "MAX SINGLE PIECE", description: "Project-specific envelope & pit casting", color: "text-white" },
    { value: "3", label: "MOLDING ROUTES", description: "Automatic green sand, resin line & hand", color: "text-white" },
    { value: "95%", label: "SAND RECLAMATION", description: "Automatic green sand, resin line & hand", color: "text-[#00FF26]" },
    { value: "100+", label: "CNC MACHINES", description: "5-Axis vertical, horizontal & CMM inspection", color: "text-[#E30A17]" },
];
const production = [
    { process: "Automatic Green Sand", machine: "Flaskless automated", weight: "1–60 kg", envelope: "800 × 800 × 500 mm", rate: "90 molds / hour", fit: "Repeatable small and medium parts", detail: "High-speed automated flaskless green sand molding for serial impellers, flanges, and compact volute production with tight dimensional tolerances." },
    { process: "Resin Molding Line", machine: "No-bake furan resin", weight: "30–600 kg", envelope: "2,000 × 2,500 × 2,000 mm", rate: "30 molds / day", fit: "Medium batches and complex geometry", detail: "Chemically bonded no-bake resin sand line optimized for intricate core packages, multi-stage pump diffusers, and medium-size pump bodies." },
    { process: "Resin Hand Molding", machine: "Heavy section", weight: "200–4,000 kg", envelope: "Project-specific envelope", rate: "Project-based schedule", fit: "Large, low-volume heavy castings", detail: "Heavy floor and pit molding for double-suction split-case volute casings, large municipal pump housings, and custom heavy industrial rotating equipment." },
];
const inHouseMaterials = [
    { name: "Grey Cast Iron", standard: "EN-GJL-200 / 250 / 300 (GG20–GG30) | ASTM A48 Class 30 / 35 / 40", description: "Excellent vibration damping, high machinability, and superior dimensional stability for standard industrial pump volutes and bearing brackets.", points: ["Tensile: 200–300 MPa", "Brinell Hardness: 160–240 HB", "Thermal stability"] },
    { name: "Ductile Cast Iron", standard: "EN-GJS-400-15 / 500-7 / 600-3 (GGG40–GGG60) | ASTM A536", description: "Spheroidal graphite microstructure delivering exceptional tensile strength, impact resistance, and elongation for high-pressure multi-stage casings.", points: ["Tensile: up to 600 MPa", "Elongation: up to 15%", "High impact resilience"] },
    { name: "Bronze & Copper Alloys", standard: "CuSn10, CuSn12 (RG10), CuAl10Fe5Ni5 (Nickel Aluminum Bronze)", description: "Superior corrosion and cavitation resistance for seawater intake pumps, marine propulsion, and aggressive industrial fluids.", points: ["Seawater resistant", "Anti-cavitation", "Self-lubricating qualities"] },
];
const partnerMaterials = [
    { name: "Stainless Steel", standard: "Stainless steel · approved-partner route", description: "Sourced through Sempa’s approved-partner network and fully inspected and machined by Sempa.", points: ["Approved-partner sourcing", "Sempa inspection", "Documented acceptance"] },
    { name: "Duplex Alloys", standard: "Duplex · approved-partner route", description: "Project requirements, grade selection, inspection scope and documentation are agreed before production release.", points: ["Project-specific grade selection", "Inspection and machining", "Single-interface coordination"] },
    { name: "Superalloys", standard: "Special alloys · approved-partner route", description: "Special-alloy castings follow the same coordinated inspection, machining and documented release process.", points: ["Approved-partner sourcing", "Coordinated machining", "Documented release"] },
];
const machiningStages = [
    { title: "AS-CAST", text: "Visual & receipt check", position: "top-[14%] left-[2%] min-[768px]:top-[28%]" },
    { title: "DATUM", text: "Rough alignment", position: "top-[8%] right-[12%] min-[768px]:top-[15%]" },
    { title: "FULL CNC", text: "Critical tolerances", position: "bottom-0 left-[4%] min-[768px]:bottom-[15%]" },
    { title: "CMM METRO", text: "Documented release", position: "bottom-0 right-[10%] min-[768px]:bottom-[5%] min-[768px]:right-[26%]" },
];
const castingFilters = ["All Castings", "Casing", "Impeller", "Bracket", "Special"] as const;
const analysisTabs = [
    { label: "Alloys Comparison", Icon: LuScale }, { label: "Melting Thermal Cycle", Icon: LuFlame },
    { label: "Sand & Ecology", Icon: LuLayers }, { label: "3D Print Breakeven", Icon: LuTrendingUp }, { label: "Metrology Deviation", Icon: LuScanLine },
];
const parameters = ["Tensile (Rm)", "Yield (Rp0.2)", "Elongation (A5)", "Hardness (HB)"] as const;
const alloys = [
    { name: "EN-GJL-250", value: 250 }, { name: "EN-GJS-400-15", value: 400 }, { name: "EN-GJS-500-7", value: 500 },
    { name: "EN-GJS-600-3", value: 600 }, { name: "CuAl10Fe5Ni5", value: 650 }, { name: "AISI 316 (CF8M)", value: 500 }, { name: "Duplex 2205", value: 700 },
];
const qualityRows = [
    ["Chemical Composition", "Spectrometric analysis, Optical Emission Spectroscopy (OES), PMI", "Every melt ladle and heat lot against EN/ASTM chemical limits", "Spectro analysis report & Melt heat log"],
    ["Mechanical Properties", "Tensile test, yield strength, elongation, Brinell hardness (HBW), Charpy impact", "Test bars poured in the same heat lot as the castings", "Mechanical test certificate per EN 10204 3.1"],
    ["Microstructure Review", "Metallographic microscope inspection, nodularity percent, pearlite/ferrite ratio", "Critical ductile iron grades to ensure spheroidal graphite nodularity", "Microstructure micrographs & evaluation"],
    ["Non-Destructive Testing (NDT)", "Visual (VT), Liquid Penetrant (PT), Magnetic Particle (MT), Ultrasonic (UT), Radiographic (RT)", "Pressure-retaining walls, impeller vanes, and critical hydraulic zones", "Level I/II certified NDT inspection sheets"],
    ["Dimensional Metrology", "Precision CMM, 3D blue laser optical scanning", "Critical machining datums, wall thickness, flange bolt circles, runner profiles", "Full CMM dimensional report & CAD deviation color map"],
    ["Pressure & Hydrostatic", "Hydrostatic pressure testing up to 100 bar, helium leak testing", "100% of pressure-bearing casings and hydraulic assemblies", "Calibrated hydrostatic pressure test certificate"],
];
const finishing = ["SHAKE OUT", "SHOT BLASTING", "FETTLING", "GRINDING", "EXTERNAL PROCESSING", "SURFACE FINISHING"];
function FoundryCarousel({ children, label, kind }: {
    children: ReactNode[];
    label: string;
    kind: "routes" | "finishing";
}) {
    const trackId = useId();
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const compactQuery = kind === "routes" ? "(max-width: 767px)" : "(max-width: 1199px)";
    useEffect(() => {
        const track = trackRef.current;
        if (!track)
            return;
        const compact = matchMedia(compactQuery);
        const update = () => {
            if (!compact.matches)
                return;
            const max = track.scrollWidth - track.clientWidth;
            if (max < 1) {
                setActive(0);
                return;
            }
            if (track.scrollLeft >= max - 2) {
                setActive(children.length - 1);
                return;
            }
            const cards = Array.from(track.children) as HTMLElement[];
            const origin = cards[0]?.offsetLeft ?? 0;
            let closest = 0;
            cards.forEach((card, index) => {
                if (Math.abs(card.offsetLeft - origin - track.scrollLeft) < Math.abs(cards[closest].offsetLeft - origin - track.scrollLeft))
                    closest = index;
            });
            setActive(closest);
        };
        const resize = new ResizeObserver(() => { if (!compact.matches)
            track.scrollLeft = 0; update(); });
        resize.observe(track);
        track.addEventListener("scroll", update, { passive: true });
        return () => { resize.disconnect(); track.removeEventListener("scroll", update); };
    }, [children.length, compactQuery]);
    const goTo = (index: number) => {
        const track = trackRef.current;
        const card = track?.children[index] as HTMLElement | undefined;
        const first = track?.children[0] as HTMLElement | undefined;
        if (!track || !card || !first)
            return;
        track.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    };
    return <div className={kind === "routes" ? "order-3 min-w-0 min-[768px]:col-span-2 min-[1200px]:order-none min-[1200px]:mt-[calc(110*var(--foundry-unit))]" : "mt-20 min-w-0 min-[1200px]:mt-[calc(80*var(--foundry-unit))]"}>
    <div ref={trackRef} id={trackId} role="region" aria-label={label} tabIndex={0} data-active={active} onKeyDown={event => { if (!matchMedia(compactQuery).matches)
        return; const next = event.key === "ArrowRight" ? Math.min(children.length - 1, active + 1) : event.key === "ArrowLeft" ? Math.max(0, active - 1) : event.key === "Home" ? 0 : event.key === "End" ? children.length - 1 : null; if (next !== null) {
        event.preventDefault();
        goTo(next);
    } }} className={`relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E30A17] ${kind === "routes" ? "min-[768px]:grid min-[768px]:grid-cols-2 min-[768px]:overflow-visible min-[768px]:pb-0" : "px-4 [scroll-padding-inline:16px] min-[1200px]:px-0 min-[1200px]:grid min-[1200px]:grid-cols-6 min-[1200px]:gap-[calc(12*var(--foundry-unit))] min-[1200px]:overflow-visible min-[1200px]:pb-0"}`}>
      {children.map((child, index) => <div key={index} className={`min-w-0 shrink-0 snap-start ${kind === "routes" ? "basis-[85%] min-[768px]:basis-auto" : "basis-[55%] min-[768px]:basis-[32%] min-[1200px]:basis-auto"}`}>{child}</div>)}
    </div>
    <div className={`flex justify-center ${kind === "routes" ? "mt-2 min-[768px]:hidden" : "mt-4 min-[1200px]:hidden"}`}>
      {children.map((_, index) => <button key={index} type="button" aria-label={`${label}: show card ${index + 1}`} aria-controls={trackId} aria-pressed={active === index} onClick={() => goTo(index)} className={`flex min-h-8 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white ${kind === "finishing" ? active === index ? "w-9" : "w-3.5" : "w-8"}`}><span aria-hidden="true" className={`h-1.5 rounded-full transition-[width,background-color] motion-reduce:transition-none ${active === index ? "w-6 bg-[#E30A17]" : "w-1.5 bg-white/70"}`}/></button>)}
    </div>
  </div>;
}
function FoundryVideo({ src, className, label }: {
    src: string;
    className: string;
    label?: string;
}) {
    const ref = useRef<HTMLVideoElement>(null);
    useViewportVideo(ref);
    return <video ref={ref} muted loop playsInline preload="metadata" controls={false} className={className} aria-hidden={label ? undefined : true} aria-label={label}><source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}/></video>;
}
function SectionTitle({ children, description, eyebrow, titleClassName = "" }: {
    children: ReactNode;
    description?: string;
    eyebrow?: string;
    titleClassName?: string;
}) {
    return <div className="mx-auto max-w-[760px] text-center min-[1200px]:max-w-[calc(883*var(--foundry-unit))]">
    {eyebrow && <p className={`${body} mx-auto mt-0 mb-4 max-w-[88%] text-[#BABACA] min-[768px]:max-w-none`}>{eyebrow}</p>}
    <h2 className={`${heading} ${redText} mx-auto max-w-[92%] min-[768px]:max-w-none ${titleClassName}`}>{children}</h2>
    {description && <p className={`${body} ${descriptionText} mx-auto mt-5 mb-0 max-w-[82%] min-[768px]:max-w-[68ch] min-[1200px]:mt-[calc(18*var(--foundry-unit))]`}>{description}</p>}
  </div>;
}
function TensileChart() {
    const id = useId().replaceAll(":", "");
    return <div tabIndex={0} role="img" aria-label="Tensile strength comparison in MPa: EN-GJL-250 250; EN-GJS-400-15 400; EN-GJS-500-7 500; EN-GJS-600-3 600; CuAl10Fe5Ni5 650; AISI 316 CF8M 500; Duplex 2205 700." className="overflow-x-auto overscroll-x-contain pb-2 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#E30A17]">
    <svg viewBox="0 0 1200 445" preserveAspectRatio="none" className="block h-[clamp(400px,123vw,520px)] w-full min-w-[1000px] min-[768px]:h-auto min-[768px]:min-w-[850px] min-[1200px]:min-w-[650px]" aria-hidden="true">
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#E30A17"/><stop offset="1" stopColor="#27272A" stopOpacity="0"/></linearGradient></defs>
      {[0, 200, 400, 600, 800].map(value => <g key={value}><text x="44" y={386 - value * .43} fill="#F7F7F7" fontSize="14" textAnchor="end">{value}</text><text x="44" y={399 - value * .43} fill="#BABACA" fontSize="9" textAnchor="end">MPa</text><line x1="65" x2="1190" y1={380 - value * .43} y2={380 - value * .43} stroke="#9EB7D0" strokeWidth="1" strokeDasharray={value ? "3 4" : undefined} opacity=".65"/></g>)}
      <g className="max-[767px]:translate-x-[50px]">{alloys.map((alloy, index) => <g key={alloy.name} className="max-[767px]:translate-x-[var(--mobile-bar-offset)]" style={{ "--mobile-bar-offset": `${index * -23}px` } as CSSProperties}><rect x={108 + index * 155} y={380 - alloy.value * .43} width="54" height={alloy.value * .43} rx="6" fill={`url(#${id})`}/><text x={135 + index * 155} y="412" fill="#BABACA" fontSize="10" className="max-[767px]:text-[12px]" textAnchor="middle">{alloy.name}</text><title>{`${alloy.name}: ${alloy.value} MPa`}</title></g>)}</g>
    </svg>
  </div>;
}
function EngineeringAnalytics() {
    const [tab, setTab] = useState(0);
    const [parameter, setParameter] = useState<(typeof parameters)[number]>("Tensile (Rm)");
    const [costs, setCosts] = useState({ tooling: "", conventional: "", printed: "" });
    const tabId = useId();
    const difference = Number(costs.printed) - Number(costs.conventional);
    const breakEven = costs.tooling && costs.conventional && costs.printed && Number(costs.tooling) > 0 && difference > 0 ? Math.ceil(Number(costs.tooling) / difference) : null;
    return <section id="foundry-analytics" className={`${frame} pt-24 min-[1200px]:pt-[calc(170*var(--foundry-unit))]`}>
    <SectionTitle description="Comparative mechanical properties, additive tooling breakeven economics, induction furnace thermal control, and laser metrology tolerance curves.">Foundry Engineering &amp;<br />Process Analytics.</SectionTitle>
    <div role="tablist" aria-label="Engineering analysis" onKeyDown={event => {
            const next = event.key === "ArrowDown" || event.key === "ArrowRight" ? (tab + 1) % analysisTabs.length : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (tab + analysisTabs.length - 1) % analysisTabs.length : event.key === "Home" ? 0 : event.key === "End" ? analysisTabs.length - 1 : null;
            if (next !== null) {
                event.preventDefault();
                setTab(next);
                event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
            }
        }} className="mx-auto mt-8 flex w-full max-w-[440px] flex-col gap-2 rounded-2xl border border-white/5 bg-black/65 p-4 min-[768px]:w-fit min-[768px]:max-w-full min-[768px]:flex-row min-[768px]:flex-wrap min-[768px]:justify-center min-[1200px]:gap-1 min-[1200px]:bg-black/25 min-[1200px]:p-3 shadow-[0_5px_25px_rgba(0,0,0,.6)] min-[1200px]:mt-[calc(50*var(--foundry-unit))]">
      {analysisTabs.map(({ label, Icon }, index) => <button key={label} id={`${tabId}-tab-${index}`} role="tab" aria-selected={tab === index} aria-controls={`${tabId}-panel`} onClick={() => setTab(index)} className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none ${tab === index ? "border-white/50 bg-[#E30A17]" : "border-transparent hover:bg-white/10"}`}><Icon aria-hidden="true" className="size-4 shrink-0"/><span className={`${small} ${tab === index ? "font-bold text-white" : "text-white/65"}`}>{label}</span></button>)}
    </div>
    <div id={`${tabId}-panel`} role="tabpanel" aria-labelledby={`${tabId}-tab-${tab}`} className="mt-12 min-[1200px]:mt-[calc(130*var(--foundry-unit))]">
      {tab === 0 && <>
        <div className="flex flex-col justify-between gap-8 min-[1200px]:flex-row min-[1200px]:items-center min-[1200px]:border-b min-[1200px]:border-white/60 min-[1200px]:pb-7">
          <div className="min-w-0 border-b border-white/60 pb-7 text-center min-[768px]:text-left min-[1200px]:border-0 min-[1200px]:pb-0"><h3 className="m-0 flex flex-col items-center gap-2 min-[768px]:flex-row min-[768px]:flex-wrap min-[768px]:gap-3 text-[clamp(25px,7.7vw,32px)] leading-none tracking-[-0.04em] min-[1200px]:text-[calc(36*var(--foundry-unit))]">{parameter === "Tensile (Rm)" ? "Tensile Strength Rm" : parameter}<span className="rounded border border-white/25 bg-[#E30A17] px-2 py-1 text-[12px] font-bold">{parameter === "Elongation (A5)" ? "%" : parameter === "Hardness (HB)" ? "HB" : "MPa"}</span></h3><p className={`${body} mt-2 mb-0 text-white/70`}>{parameter === "Tensile (Rm)" ? "Ultimate tensile resistance before plastic rupture." : "Material properties are confirmed against the selected grade and inspection scope."}</p></div>
          <div role="group" aria-label="Material parameter" className="mx-auto grid w-full max-w-[330px] grid-cols-2 items-center gap-2 min-[768px]:flex min-[768px]:w-auto min-[768px]:max-w-none min-[768px]:flex-wrap min-[768px]:justify-start min-[1200px]:mx-0"><span className={`${body} col-span-2 w-full text-center min-[768px]:w-auto min-[768px]:text-left`}>Parameter:</span>{parameters.map(item => <button key={item} type="button" aria-pressed={parameter === item} onClick={() => setParameter(item)} className={`cursor-pointer rounded-lg px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${parameter === item ? "bg-[#E30A17]" : "bg-[#F7F7F7]"}`}><span className={`${body} ${parameter === item ? "text-white" : "text-[#A1A1A1]"}`}>{item}</span></button>)}</div>
        </div>
        {parameter === "Tensile (Rm)" ? <div className="mt-6"><TensileChart /></div> : <div className="flex min-h-[300px] flex-col items-center justify-center gap-5 py-12 text-center"><p className={`${body} max-w-[50ch] text-white/65`}>Ask our engineering team for the {parameter.toLowerCase()} values for your selected material grade.</p><Link href="/contact" className="rounded-lg border border-[#E30A17] px-5 py-3 text-[13px] text-white">Discuss material requirements</Link></div>}
        <div className="mt-8 grid gap-4 min-[768px]:grid-cols-3">{["EN-GJL-250 (GG25):", "EN-GJS-400/500/600:", "CuAl10 & Duplex 2205:"].map((label, i) => <div key={label} className={`min-h-[96px] rounded-xl border border-white/60 p-4 ${i === 1 ? "bg-[#E30A17]" : "bg-[#F7F7F7]"}`}><h4 className={`${small} m-0 font-semibold ${i === 1 ? "text-white" : "text-[#E30A17]"}`}>{label}</h4><p className={`${body} mt-2 mb-0 ${i === 1 ? "text-white" : "text-[#27272A]"}`}>{i === 0 ? "Superior vibration damping and low resonant transmission for standard volute bodies." : i === 1 ? "Spheroidal graphite iron reaching up to 600 MPa tensile and 15% elongation for pressure casings." : "Corrosion, cavitation, and brine resistance for reverse osmosis and marine systems."}</p></div>)}</div>
      </>}
      {tab === 1 && <div className="grid gap-8 rounded-2xl border border-white/15 bg-white/5 p-7 min-[768px]:grid-cols-2"><div><h3 className={`${heading} ${redText}`}>Melting Thermal Cycle</h3><p className={`${body} mt-5 text-white/65`}>Sempa Foundry Bay 1 · induction melting</p><p className="my-8 text-[64px] leading-none">45 <span className="text-[22px] text-white/60">min</span></p><p className={body}>Published melt cycle</p></div><div className="flex flex-col justify-center gap-6"><div className={`${glass} rounded-xl p-6`}><p className={`${small} mt-0 text-white/60`}>INDUCTION FURNACES</p><p className="m-0 text-[26px] leading-tight">2 × 2,000 kg<br />+ 1 × 500 kg</p></div><p className={`${body} text-white/65`}>Thermal records and heat-lot documentation are included in the agreed inspection and release package.</p></div></div>}
      {tab === 2 && <div className="rounded-2xl border border-white/15 bg-white/5 p-7"><h3 className={`${heading} ${redText}`}>Sand &amp; Ecology</h3><p className="my-10 text-[80px] leading-none text-[#00FF26]">95%</p><p className={body}>Sand reclamation</p><div role="meter" aria-label="Sand reclamation" aria-valuemin={0} aria-valuemax={100} aria-valuenow={95} className="mt-8 h-5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[95%] rounded-full bg-linear-to-r from-[#E30A17] to-[#00B954]"/></div></div>}
      {tab === 3 && <div className="grid gap-8 rounded-2xl border border-white/15 bg-white/5 p-7 min-[768px]:grid-cols-2"><div><h3 className={`${heading} ${redText}`}>3D Print Breakeven</h3><p className={`${body} mt-6 text-white/65`}>Compare conventional pattern tooling with printed sand molds using your project costs in the same currency.</p><p className={`${small} mt-6 text-white/60`}>Breakeven quantity = tooling cost ÷ (printed cost per casting − conventional cost per casting).</p></div><div className="flex flex-col gap-4">{([{ key: "tooling", label: "Conventional tooling cost" }, { key: "conventional", label: "Conventional cost per casting" }, { key: "printed", label: "Printed cost per casting" }] as const).map(item => <label key={item.key} className={`${body} flex flex-col gap-2`}>{item.label}<input type="number" min="0" step="any" value={costs[item.key]} onChange={event => setCosts(current => ({ ...current, [item.key]: event.target.value }))} className="w-full rounded-lg border border-white/25 bg-black/30 px-4 py-3 outline-none focus:border-[#E30A17]"/></label>)}<output aria-live="polite" className="rounded-xl bg-[#E30A17]/20 p-5 text-[20px]">{breakEven ? `${breakEven.toLocaleString()} castings` : "Enter your project costs to compare."}</output>{costs.printed && costs.conventional && difference <= 0 && <p className={`${small} m-0 text-white/65`}>At these inputs, printing has no higher per-casting cost; there is no finite crossover quantity.</p>}</div></div>}
      {tab === 4 && <div className="grid gap-8 rounded-2xl border border-white/15 bg-white/5 p-7 min-[768px]:grid-cols-2"><div><h3 className={`${heading} ${redText}`}>Metrology Deviation</h3><p className={`${body} mt-6 text-white/65`}>CAD-to-part color deviation analysis and dimensional verification of casting stock allowances and critical wall thicknesses.</p><p className="my-8 text-[54px] leading-none">0.020 <span className="text-[22px] text-white/60">mm</span></p><p className={small}>Optical scanning accuracy with photogrammetry grid</p></div><div className="relative min-h-[240px] overflow-hidden rounded-xl"><Image src={asset("image.webp")} alt="Optical dimensional inspection" fill sizes="(min-width:768px) 40vw, 85vw" className="object-cover"/></div></div>}
    </div>
  </section>;
}
export default function FoundryPage() {
    const titleRef = useRepeatingTitle(2600);
    const [materialRoute, setMaterialRoute] = useState<"in-house" | "partner">("in-house");
    const [castingFilter, setCastingFilter] = useState<(typeof castingFilters)[number]>("All Castings");
    const materials = materialRoute === "in-house" ? inHouseMaterials : partnerMaterials;
    return <main data-foundry-page className="relative isolate w-full overflow-x-clip bg-[#111011] text-[#F7F7F7] before:pointer-events-none before:absolute before:inset-x-0 before:-top-[200px] before:-z-10 before:h-[200px] before:bg-[#111011] before:content-[''] [--foundry-unit:1px] min-[1200px]:[--foundry-unit:clamp(0.833333px,0.0694444444vw,1.777778px)] [font-family:var(--font-sf-pro),_sans-serif]! [font-weight:410]! [font-variation-settings:'wght'_410,_'wdth'_132,_'opsz'_28]! [font-optical-sizing:none] [background-image:linear-gradient(140deg,#100D0D_0%,#151213_52%,#363335_100%)]">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden"><FoundryVideo src={asset("fire_bp1.webm")} className="sticky top-0 h-svh w-full object-cover opacity-25 mix-blend-screen"/></div>
    <style>{`
      .foundry-fire-ember { opacity: 0; pointer-events: none; }
      @media (prefers-reduced-motion: no-preference) {
        #foundry-hero-title[data-title-revealing] .foundry-fire-paper {
          animation: foundry-paper-burn 1150ms linear var(--burn-delay) both;
        }
        #foundry-hero-title[data-title-revealing] .foundry-fire-ember {
          color: #ffe4a0;
          text-shadow: 0 0 .025em #fff7d6, 0 0 .065em #ffb426, 0 -.035em .12em #f74408;
          animation: foundry-ember-edge 1150ms linear var(--burn-delay) both;
        }
        #foundry-hero-title[data-title-revealing] .foundry-fire-letter::after {
          content: "";
          position: absolute;
          pointer-events: none;
          left: 45%; top: 45%; width: .025em; height: .045em;
          border-radius: 50%; background: #ffd88b;
          box-shadow: .13em .12em .02em #ff792b, -.1em -.08em .025em #ffc165;
          animation: foundry-burn-sparks 850ms ease-out calc(var(--burn-delay) + 120ms) both;
        }
      }
      @keyframes foundry-paper-burn {
        0% { clip-path: polygon(0 0,0 0,0 15%,0 29%,0 42%,0 57%,0 72%,0 87%,0 100%,0 100%); color: #382017; }
        12% { clip-path: polygon(0 0,4% 0,12% 15%,3% 29%,18% 42%,6% 57%,16% 72%,4% 87%,10% 100%,0 100%); color: #9c401c; }
        32% { clip-path: polygon(0 0,25% 0,39% 15%,23% 29%,48% 42%,29% 57%,42% 72%,22% 87%,31% 100%,0 100%); color: #e1aa6b; }
        55% { clip-path: polygon(0 0,59% 0,72% 15%,52% 29%,82% 42%,57% 57%,73% 72%,48% 87%,65% 100%,0 100%); color: #fff1d5; }
        78% { clip-path: polygon(0 0,86% 0,100% 15%,84% 29%,100% 42%,90% 57%,100% 72%,82% 87%,96% 100%,0 100%); color: #f7f7f7; }
        100% { clip-path: polygon(0 0,100% 0,100% 15%,100% 29%,100% 42%,100% 57%,100% 72%,100% 87%,100% 100%,0 100%); color: #f7f7f7; }
      }
      @keyframes foundry-ember-edge {
        0% { opacity: 0; clip-path: polygon(0 0,0 0,0 100%,0 100%); }
        12% { opacity: 1; clip-path: polygon(0 0,4% 0,12% 15%,3% 29%,18% 42%,6% 57%,16% 72%,4% 87%,10% 100%,0 100%,0 87%,7% 72%,0 57%,9% 42%,0 29%,3% 15%); }
        32% { opacity: 1; clip-path: polygon(16% 0,25% 0,39% 15%,23% 29%,48% 42%,29% 57%,42% 72%,22% 87%,31% 100%,22% 100%,13% 87%,33% 72%,20% 57%,39% 42%,14% 29%,30% 15%); }
        55% { opacity: .9; clip-path: polygon(50% 0,59% 0,72% 15%,52% 29%,82% 42%,57% 57%,73% 72%,48% 87%,65% 100%,56% 100%,39% 87%,64% 72%,48% 57%,73% 42%,43% 29%,63% 15%); }
        78% { opacity: .7; clip-path: polygon(77% 0,86% 0,100% 15%,84% 29%,100% 42%,90% 57%,100% 72%,82% 87%,96% 100%,87% 100%,73% 87%,91% 72%,81% 57%,91% 42%,75% 29%,91% 15%); }
        100% { opacity: 0; clip-path: polygon(100% 0,100% 0,100% 100%,100% 100%); }
      }
      @keyframes foundry-burn-sparks {
        0% { opacity: 0; transform: translate(0,0) scale(.5); }
        18% { opacity: .85; }
        65% { opacity: .45; }
        100% { opacity: 0; transform: translate(var(--spark-drift),-.65em) scale(.15); }
      }
    `}</style>
    <div className="relative">
      <section aria-labelledby="foundry-hero-title" data-foundry-hero className="relative pb-16 min-[1200px]:min-h-[calc(900*var(--foundry-unit))] min-[1200px]:pb-[calc(65*var(--foundry-unit))]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(480px,140vw,640px)] overflow-hidden min-[768px]:bottom-0 min-[768px]:h-full"><Image src={asset("dokumhane-hero.webp")} alt="" fill unoptimized loading="eager" fetchPriority="high" sizes="100vw" className="object-cover object-[55%_center] opacity-60"/><div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/35 to-black/20"/><div className="absolute inset-0 bg-linear-to-t from-[#111011] via-transparent to-transparent"/><svg viewBox="0 0 1440 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-15"><g fill="none" stroke="#BABACA" strokeWidth="1">{Array.from({ length: 50 }, (_, i) => <path key={i} d={`M-100 ${i * 19} C 350 ${i * 19 + 80}, 600 ${i * 19 + 260}, 1540 ${i * 19 - 90}`}/>)}</g></svg></div>
        <div className={`${frame} relative grid gap-6 pt-[160px] min-[768px]:grid-cols-2 min-[768px]:gap-8 min-[1200px]:grid-cols-[588fr_523fr] min-[1200px]:gap-x-[calc(89*var(--foundry-unit))] min-[1200px]:gap-y-[calc(60*var(--foundry-unit))] min-[1200px]:pt-[calc(200*var(--foundry-unit))]`}>
          <div className="contents min-[1200px]:block min-[1200px]:min-w-0"><h1 ref={titleRef} id="foundry-hero-title" aria-label="Engineered Castings. Single-Source Accountability." className="order-1 m-0 min-w-0 self-center text-[clamp(24px,6.4vw,40px)] leading-none min-[768px]:text-[clamp(30px,4.5vw,46px)] min-[1200px]:order-none leading-none tracking-[-0.04em] min-[1200px]:text-[calc(80*var(--foundry-unit))]"><span aria-hidden="true"><FoundryFireWord>Engineered</FoundryFireWord><span className="min-[1200px]:hidden"> </span><br className="hidden min-[1200px]:block"/><FoundryFireWord>Castings.</FoundryFireWord><br /><FoundryFireWord>Single-Source</FoundryFireWord><br /><FoundryFireWord>Accountability.</FoundryFireWord></span></h1>
            <FoundryCarousel kind="routes" label="Foundry production routes">{[{ title: "In-House Foundry Route", text: "Grey iron, ductile iron (nodular), and bronze melted and cast directly in Sempa’s own induction furnaces.", Icon: LuFactory }, { title: "Special-Alloy Route", text: "Stainless steel, duplex & superalloys sourced via pre-approved partners and fully inspected & machined by Sempa.", Icon: LuShieldCheck }].map(item => <article key={item.title} className={`${heroGlass} h-full rounded-[15px] p-4 min-[1200px]:p-[calc(19*var(--foundry-unit))]`}><h2 className="m-0 flex items-center gap-3 text-[19px] leading-[1.07] tracking-[-0.04em] min-[1200px]:text-[calc(20*var(--foundry-unit))]"><span className="flex size-9 shrink-0 -rotate-6 items-center justify-center rounded-lg border border-white/10 bg-linear-to-br from-[#E30A17] to-[#7D060D]"><item.Icon aria-hidden="true" className="size-5 rotate-6"/></span>{item.title}</h2><p className={`${small} mt-3 mb-0 text-[#9EB7D0]`}>{item.text}</p></article>)}</FoundryCarousel>
          </div>
          <div className="relative order-2 min-w-0 pt-8 min-[1200px]:order-none min-[1200px]:pt-[calc(30*var(--foundry-unit))]">
            <div className="relative aspect-[523/450] overflow-hidden rounded-[24px] min-[1200px]:aspect-[523/544] min-[1200px]:rounded-[calc(30*var(--foundry-unit))] border-2 border-white/65"><Image src={asset("DSC05461.webp")} alt="Sempa foundry team pouring molten metal from an induction furnace" fill unoptimized loading="eager" fetchPriority="high" sizes="(min-width:1200px) 38vw, 85vw" className="object-cover object-[75%_center]"/></div>
            <div className={`${heroGlass} absolute top-0 left-1/2 flex w-max max-w-full -translate-x-1/2 items-center gap-2 rounded-[15px] px-3 py-2 min-[1200px]:left-0 min-[1200px]:w-auto min-[1200px]:translate-x-0 min-[1200px]:gap-3 min-[1200px]:px-4 min-[1200px]:py-3`}><span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#E30A17] to-[#7D060D] text-[16px] min-[1200px]:size-10 min-[1200px]:text-[20px]">4T</span><div><p className="m-0 text-[9px] leading-tight">Max Casting Piece</p><p className={`${small} mt-1 mb-0 font-semibold`}>4,000 kg / 8,820 lb</p></div></div>
            <div className={`${heroGlass} absolute bottom-4 left-3 right-3 rounded-[15px] p-3 min-[1200px]:top-[15%] min-[1200px]:bottom-auto min-[1200px]:right-auto min-[1200px]:max-w-[95%] min-[1200px]:p-4 min-[1200px]:-left-[calc(35*var(--foundry-unit))]`}><div className="flex flex-wrap justify-between gap-3 text-[9px] leading-none"><span>SEMPA FOUNDRY BAY 1</span><span className="text-[#9EB7D0]">132,000 m² FACILITY</span></div><p className={`${small} mt-3 mb-0`}>2 × 2,000 kg + 1 × 500 kg Induction Furnaces ·<br />45 min Melt Cycle</p></div>
          </div>
          <p className={`${body} order-4 m-0 max-w-[48ch] self-start min-[1200px]:order-none`}>Sempa operates its own modern foundry in Konya, producing grey cast iron, ductile iron, and selected bronze castings with complete single-interface coordination. From 3D CAD drawing review, additive 3D sand printing, to CNC precision machining and full documented release.</p>
          <div className="order-5 grid grid-cols-2 gap-3 min-[1200px]:order-none min-[1200px]:grid-cols-4">{capacity.map(item => <article key={item.label} className={`${heroGlass} max-[767px]:bg-white/15 min-h-[160px] min-w-0 rounded-[15px] p-5 min-[1200px]:min-h-0 min-[1200px]:p-[calc(15*var(--foundry-unit))]`}><p className={`${body} ${item.color} m-0 font-semibold`}>{item.value}</p><h3 className="mt-3 mb-0 text-[10px] leading-none min-[1200px]:text-[calc(10*var(--foundry-unit))]">{item.label}</h3><p className={`${small} mt-3 mb-0`}>{item.description}</p></article>)}</div>
        </div>
      </section>

      <section aria-label="Production routing envelope" className={`${frame} pt-20 min-[1200px]:pt-[calc(120*var(--foundry-unit))]`}>
        <SectionTitle eyebrow="A clear operating envelope for faster sourcing decisions."><span className="text-[#F7F7F7]">Published Sempa production data provides the initial routing envelope.</span>{" "}<span className={redText}>Final feasibility depends on geometry, alloy grade, annual demand<br className="min-[768px]:hidden"/><span className="hidden min-[768px]:inline"> </span>profile, and inspection<br className="min-[768px]:hidden"/><span className="hidden min-[768px]:inline"> </span>scope.</span></SectionTitle>
        <div tabIndex={0} role="region" aria-label="Molding process capacity table" className="mt-12 overflow-x-auto rounded-xl border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.13)_0%,rgba(125,6,13,0.08)_55%,rgba(0,0,0,0.12)_100%)] backdrop-blur-[12px] shadow-[0_0_45px_rgba(227,10,23,.08)] min-[1200px]:mt-[calc(60*var(--foundry-unit))]">
          <div className="min-w-[1200px] min-[1200px]:min-w-0"><table className="w-full table-fixed border-collapse text-left"><caption className="sr-only">Published foundry operating envelopes by molding process</caption><thead><tr>{["MOLDING PROCESS", "CAST WEIGHT", "MOLD / FLASK ENVELOPE", "NOMINAL RATE", "BEST FIT APPLICATION"].map(label => <th key={label} scope="col" className="px-5 py-6 text-[12px] font-bold [font-variation-settings:'wght'_760,'wdth'_132] leading-tight tracking-[.08em] text-white min-[1200px]:text-[calc(12*var(--foundry-unit))]">{label}</th>)}</tr></thead><tbody>{production.map(row => <tr key={row.process} className="border-t border-white/55 align-top first:border-t-0"><th scope="row" className="px-5 py-10 font-normal"><p className={`${body} ${tableText} m-0`}>{row.process.slice(0, row.process.lastIndexOf(" "))}<br />{row.process.slice(row.process.lastIndexOf(" ") + 1)}</p><p className={`${small} ${tableText} mt-2 mb-0`}>{row.machine}</p></th><td className={`${body} px-5 py-10 font-medium`}><span className={`block ${tableRedText}`}>{row.weight}</span></td><td className={`${small} px-5 py-10`}><span className={`block ${tableText}`}>{row.envelope}</span></td><td className={`${small} px-5 py-10`}><span className={`block ${tableText}`}>{row.rate}</span></td><td className="px-5 py-10"><p className={`${body} ${tableText} m-0`}>{row.fit}</p><p className={`${tableText} mt-2 mb-0 text-[10px] leading-tight`}>{row.detail}</p></td></tr>)}</tbody></table>
          <div className="flex justify-between gap-16 whitespace-nowrap border-t border-white/40 bg-linear-to-b from-[#E30A17] to-[#7D060D] px-7 py-[14px] text-[12px] leading-tight"><span className={tableText}>* Project-specific feasibility confirmed upon 3D CAD and batch analysis review.</span><span className={tableText}>ISO 9001:2015 ACCREDITED FOUNDRY</span></div></div>
        </div>
      </section>

      <section aria-label="3D sand printing and optical scanning" className={`${frame} pt-24 min-[1200px]:pt-[calc(170*var(--foundry-unit))]`}>
        <SectionTitle description="Eliminating conventional wooden pattern tooling delays. Directly converting 3D digital CAD into functional silica sand molds and verifying cast geometries with sub-millimeter laser metrology.">3D Sand Printing &amp;<br />Optical 3D Scanning.</SectionTitle>
        <div className="mx-auto mt-14 grid max-w-[1050px] gap-8 min-[768px]:grid-cols-2 min-[1200px]:mt-[calc(100*var(--foundry-unit))] min-[1200px]:gap-[calc(90*var(--foundry-unit))]">
          {[{ eyebrow: "KOCEL AJS 2500 SYSTEM", badge: "NO PATTERN TOOLING", title: "Additive 3D Sand Printing", text: "Complex hydraulic cores, runner systems, and low-volume prototypes produced directly from CAD data. Drastically compresses lead times from months down to days while enabling undercut geometry impossible with conventional draft angles.", points: ["Build Envelope: 2,500 × 1,500 × 1,000 mm", "Shortens prototype cycle by 70% vs wooden tooling", "Zero core shifts in intricate double-curvature pump impellers"] }, { eyebrow: "SCANTECH KSCAN-MAGIC II", badge: "METROLOGY GRADE", title: "Optical 3D Scanning & Inspection", text: "Reverse engineering and dimensional inspection of patterns, as-cast surfaces, and fully machined components. CAD-to-part color deviation analysis provides immediate visual verification of casting stock allowances and critical wall thicknesses.", points: ["Accuracy down to 0.020 mm with photogrammetry grid", "Shortens prototype cycle by 70% vs wooden tooling", "Zero core shifts in intricate double-curvature pump impellers"] }].map((item, index) => <article key={item.title} className={`flex min-w-0 flex-col gap-8 rounded-[30px] border border-[#E30A17]/15 bg-linear-to-br from-white/15 to-[#7D060D]/5 p-[38px] min-[768px]:p-6 shadow-[0_20px_60px_rgba(227,10,23,.035)] backdrop-blur-[30px] min-[1200px]:p-[calc(38*var(--foundry-unit))] ${index ? "min-[1200px]:translate-y-[calc(90*var(--foundry-unit))]" : ""}`}>
            <div className="flex flex-col gap-2 text-[10px] leading-tight min-[768px]:flex-row min-[768px]:flex-wrap min-[768px]:justify-between min-[768px]:gap-3 min-[1200px]:text-[9px]"><span className="text-[#E30A17]">{item.eyebrow}</span><span className="text-white/70">{item.badge}</span></div><h3 className="m-0 text-[20px] leading-[1.07] tracking-[-0.04em] text-[#E30A17] min-[1200px]:text-[calc(20*var(--foundry-unit))]">{item.title}</h3><p className={`${body} m-0 text-[#BABACA]`}>{item.text}</p><div className="relative aspect-[414/219] overflow-hidden rounded-[15px]"><Image src={asset("image.webp")} alt={item.title} fill sizes="(min-width:900px) 35vw, 85vw" className="object-cover"/></div><ul className={`${small} m-0 space-y-3 pl-4 text-[#BABACA]`}>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
          </article>)}
        </div>
      </section>

      <section aria-label="Material routes" className={`${frame} pt-28 min-[1200px]:pt-[calc(260*var(--foundry-unit))]`}>
        <SectionTitle description="We state clearly what is cast in-house and what is supplied through Sempa’s approved-partner network. Both routes pass through Sempa’s inspection, machining, and documented acceptance.">Two material routes.<br />One Sempa release.</SectionTitle>
        <div role="group" aria-label="Choose material route" className="mt-10 flex flex-col justify-center gap-3 min-[768px]:flex-row min-[1200px]:mt-12 min-[1200px]:gap-4">{[{ key: "in-house", label: "In-House Route (Grey, Ductile, Bronze)" }, { key: "partner", label: "Special-Alloy Route (Stainless, Duplex, Superalloys)" }].map(item => <button key={item.key} type="button" aria-pressed={materialRoute === item.key} onClick={() => setMaterialRoute(item.key as "in-house" | "partner")} aria-label={item.label} className={`max-w-full cursor-pointer rounded-[15px] border px-6 py-4 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${materialRoute === item.key ? "border-[#E30A17]/70 bg-[#E30A17]/15" : "border-white/10 bg-white/15 hover:bg-white/20"}`}><span className={`${body} max-[767px]:hidden`}>{item.label}</span><span className={`${body} min-[768px]:hidden`}>{item.key === "partner" ? "Special-Alloy Route" : item.label}</span></button>)}</div>
        <div className="mt-5 flex flex-col items-center justify-center gap-5 rounded-[10px] border-2 border-[#E30A17] bg-[#E30A17]/15 px-4 py-4 text-center text-[10px] leading-tight min-[768px]:flex-row min-[768px]:justify-between min-[1200px]:mt-10 min-[1200px]:text-[9px]"><span>● {materialRoute === "in-house" ? "MELTED & CAST IN SEMPA KONYA FOUNDRY" : "APPROVED-PARTNER CASTING · SEMPA INSPECTION & MACHINING"}</span>{materialRoute === "in-house" && <span>2 × 2,000 kg + 1 × 500 kg INDUCTION FURNACES</span>}</div>
        <div className="mt-8 grid gap-4 min-[768px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1200px]:gap-6">{materials.map((item, index) => <article key={item.name} className="flex min-h-[420px] min-w-0 flex-col rounded-[30px] min-[1200px]:rounded-[20px] min-[768px]:max-[1023px]:last:col-span-2 min-[768px]:max-[1023px]:last:w-[calc(50%-8px)] min-[768px]:max-[1023px]:last:justify-self-center border-2 border-[#E30A17]/80 bg-linear-to-br from-[#E30A17]/20 to-black/30 p-8 min-[768px]:p-6 shadow-[0_1px_2px_rgba(227,10,23,.1)] backdrop-blur-[30px] min-[1200px]:min-h-[calc(429*var(--foundry-unit))] min-[1200px]:p-[calc(32*var(--foundry-unit))]"><p className="m-0 text-[10px] leading-none text-[#E30A17] min-[1200px]:text-[9px]">GRADE FAMILY 0{index + 1}</p><h3 className="mt-5 mb-0 text-[21px] leading-[1.07] tracking-[-0.04em] min-[1200px]:text-[calc(20*var(--foundry-unit))]">{item.name}</h3><p className={`${small} mt-6 mb-5 rounded-xl border border-white/40 bg-linear-to-b from-[#E30A17] to-[#7D060D] p-4`}>{item.standard}</p><p className={`${body} mt-0 mb-8`}>{item.description}</p><ul className="mt-auto mb-0 space-y-4 border-t border-white/50 pt-4 pl-0">{item.points.map(point => <li key={point} className={`${small} flex list-none items-start gap-2 text-white`}><LuCheck aria-hidden="true" className="size-4 shrink-0 text-[#059669]"/><span className={tableText}>{point}</span></li>)}</ul></article>)}</div>
      </section>

      <section aria-label="Integrated machining and release" className="relative isolate hidden pt-24 min-[768px]:block min-[1200px]:pt-[calc(140*var(--foundry-unit))]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[25%] -bottom-24 -z-10 overflow-hidden min-[1200px]:-bottom-[calc(120*var(--foundry-unit))]">
          <FoundryVideo src={asset("fire_bp2.webm")} className="h-full w-full object-cover object-bottom opacity-40 mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,black_45%)]"/>
        </div>
        <div className={`${frame} grid items-start gap-8 min-[768px]:grid-cols-2 min-[1200px]:gap-12`}>
        <div className="relative aspect-[572/482] min-w-0"><Image src={asset("dokumhane.webp")} alt="Integrated Sempa casting, machining and inspection" fill unoptimized sizes="(min-width:1200px) 42vw, 48vw" className="object-contain [mask-image:radial-gradient(ellipse,black_45%,transparent_75%)]"/>{machiningStages.map(item => <div key={item.title} className={`${glass} absolute ${item.position} w-[32%] rounded-xl p-2 min-[1200px]:w-[23%] min-[1200px]:p-3 shadow-[inset_-13px_2px_29px_rgba(227,10,23,.65)]`}><h3 className="m-0 text-[clamp(10px,1.2vw,15px)] leading-[1.12]">{item.title}</h3><p className="mt-3 mb-0 text-[clamp(9px,1vw,12px)] leading-tight">{item.text}</p></div>)}</div>
        <div className="pt-5 min-[1200px]:pt-[calc(65*var(--foundry-unit))]"><h2 className={`${heading} ${redText}`}>Cast. Machine.<br />Inspect. Deliver.</h2><p className={`${body} mt-6 mb-0 max-w-[503px]`}>Sempa’s in-house machining infrastructure converts castings into finished, assembly-ready components according to approved customer drawings. Horizontal and vertical turning and milling support both serial production and customized components.</p></div>
        </div>
      </section>

      <section aria-label="Examples of casting parts" className={`${frame} mt-24 rounded-[30px] bg-linear-to-b from-[#27272A] to-[#E30A17] p-6 min-[1200px]:mt-[calc(120*var(--foundry-unit))] min-[1200px]:p-[calc(52*var(--foundry-unit))]`}>
        <div className="flex flex-col justify-between gap-8 min-[1200px]:flex-row"><div><h2 className={`${heading} text-[#E30A17]`}>Examples of<span className="min-[1200px]:hidden"> </span><br className="hidden min-[1200px]:block"/>Casting Parts.</h2><p className={`${body} mt-5 mb-0 max-w-[50ch]`}>Precision-engineered cast components manufactured for demanding hydraulic, municipal, and industrial rotating machinery applications.</p></div><div role="group" aria-label="Filter casting examples" className={`${glass} flex h-fit max-w-full flex-wrap gap-2 rounded-[13px] p-4 min-[1200px]:p-2`}>{castingFilters.map(item => <button key={item} type="button" aria-pressed={castingFilter === item} onClick={() => setCastingFilter(item)} className={`cursor-pointer rounded-lg px-2 py-2 min-[1200px]:px-3 focus-visible:outline-2 focus-visible:outline-white ${castingFilter === item ? "bg-linear-to-b from-white to-[#BABACA]" : "hover:bg-white/10"}`}><span className={`${body} min-[1200px]:text-[calc(12*var(--foundry-unit))] ${castingFilter === item ? "text-black" : "text-white"}`}>{item}</span></button>)}</div></div>
        <div aria-live="polite" className="mt-12 grid gap-5 min-[768px]:grid-cols-2 min-[1200px]:mt-[calc(60*var(--foundry-unit))] min-[1200px]:grid-cols-3">{castingFilter === "All Castings" || castingFilter === "Casing" ? Array.from({ length: 6 }, (_, index) => <article key={index} className="min-w-0 rounded-[15px] bg-white/15 p-5 min-[1200px]:p-[calc(24*var(--foundry-unit))]"><div className="relative aspect-[325/255] overflow-hidden min-[768px]:aspect-[325/217] rounded-[15px]"><Image src={asset("image.webp")} alt="CMM inspection of a casting" fill sizes="(min-width:1200px) 25vw, (min-width:768px) 40vw, 75vw" className="object-cover"/><span className="absolute top-3 left-3 rounded-lg bg-[#E30A17] px-2 py-1 text-[11px]">85 Kg</span><span className="absolute bottom-3 left-3 max-w-[90%] rounded-lg bg-[#F7F7F7] px-2 py-1 text-[10px] text-[#E30A17]">INSPECTION: 100% CMM</span></div><p className={`${small} mt-5 mb-0`}>Ductile Iron EN-GJS-500-7</p><h3 className="mt-6 mb-0 text-[24px] leading-[1.12] tracking-normal [font-variation-settings:'wght'_540,'wdth'_132] min-[1200px]:text-[calc(25*var(--foundry-unit))]">End-Suction Volute<br />Pump Casing</h3><p className={`${small} mt-6 mb-0`}>DN 150 × DN 100 · 650 mm outer dia</p><p className={`${body} mt-6 mb-0`}>Single-stage volute pump casing per ISO 2858. Molded on the resin line with core assembly for optimized hydraulic flow and minimum wall friction.</p></article>) : <div className="col-span-full flex min-h-[240px] flex-col items-center justify-center gap-6 text-center"><p className={body}>Contact our engineering team for {castingFilter.toLowerCase()} casting examples and project requirements.</p><Link href="/contact" className="rounded-lg border border-white/60 px-5 py-3 text-[13px]">Contact Sempa</Link><button type="button" onClick={() => setCastingFilter("All Castings")} className="cursor-pointer text-[12px] underline">Show all castings</button></div>}</div>
      </section>

      <EngineeringAnalytics />

      <section aria-label="Quality and documentation" className={`${frame} pt-24 min-[1200px]:pt-[calc(170*var(--foundry-unit))]`}>
        <SectionTitle description="The governing standard, critical dimensions, test methods, acceptance criteria, witness points, and documentation package are aligned and agreed before production release.">Quality designed into<br />the quotation.</SectionTitle>
        <div className="mt-14 rounded-2xl bg-[#27272A] p-5 shadow-[0_24px_50px_rgba(0,0,0,.25)] min-[1200px]:mt-[calc(100*var(--foundry-unit))] min-[1200px]:p-[calc(40*var(--foundry-unit))]">
          <div tabIndex={0} role="region" aria-label="Quality methods and deliverable documents" className="overflow-x-auto"><table className="w-full min-w-[850px] table-fixed border-collapse text-left"><caption className="sr-only">Quality methods, application scope and deliverable documents</caption><thead><tr>{["CATEGORY", "METHOD / EVIDENCE", "APPLICATION SCOPE", "DELIVERABLE DOCUMENT"].map(label => <th key={label} scope="col" className={`${small} pb-8 pr-5 font-normal text-[#E30A17]`}>{label}</th>)}</tr></thead><tbody>{qualityRows.map(row => <tr key={row[0]} className="border-b border-white/15">{row.map((cell, index) => index === 0 ? <th key={cell} scope="row" className={`${body} max-[767px]:text-[13px] py-6 pr-5 font-medium`}>{cell}</th> : <td key={cell} className={`${small} max-[767px]:text-[11px] py-6 pr-5 ${index === 3 ? "text-[#E30A17]" : "text-[#BABACA]"}`}>{cell}</td>)}</tr>)}</tbody></table></div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="m-0 text-[9px] text-[#BABACA]">DOCUMENT PACKAGE OPTIONS:</p><div className="flex flex-wrap gap-2">{["SEMPA CoC", "EN 10204 3.1 / 3.2", "CMM DIMENSIONAL", "NDT REPORTS", "PPAP / FAI"].map(label => <span key={label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[9px]">{label}</span>)}</div></div>
        </div>
      </section>

      <section aria-label="Finishing and delivery" className={`${frame} pt-24 min-[1200px]:pt-[calc(170*var(--foundry-unit))]`}>
        <SectionTitle titleClassName="max-[767px]:max-w-[85%] max-[767px]:text-[clamp(25px,7.4vw,32px)]" description="Finishing, external processing and delivery condition are defined in the quotation so the customer knows exactly what arrives.">From shakeout to the level<span className="min-[1200px]:hidden"> </span><br className="hidden min-[1200px]:block"/>of completion you need.</SectionTitle>
        <FoundryCarousel kind="finishing" label="Finishing stages">{finishing.map((label, index) => <article key={label} className={`border border-white/65 bg-white/15 backdrop-blur-[30px] flex h-full min-h-[230px] min-w-0 flex-col justify-between gap-8 rounded-[20px] p-4 min-[1200px]:min-h-[calc(237*var(--foundry-unit))] min-[1200px]:px-[calc(13*var(--foundry-unit))] min-[1200px]:py-[calc(23*var(--foundry-unit))]`}><p className="m-0 text-[36px] leading-none min-[1200px]:text-[calc(36*var(--foundry-unit))]">0{index + 1}</p><h3 className={`${body} max-[767px]:text-[clamp(14px,4.1vw,16px)] m-0 font-medium`}>{label.split(" ").map(word => <span key={word} className="block">{word}</span>)}</h3><p className={`${body} m-0`}>Mold removal and initial separation.</p></article>)}</FoundryCarousel>
        <div className="mt-12 flex flex-col justify-between gap-7 rounded-[10px] border border-[#E30A17]/70 bg-linear-to-r from-white/15 to-[#E30A17]/0 px-6 py-6 backdrop-blur-[21.4px] min-[1200px]:mt-[calc(60*var(--foundry-unit))] min-[1200px]:flex-row min-[1200px]:items-start"><div><p className={`${small} m-0`}>Foundry Capabilities Catalog · 2026 Edition</p><h3 className="mt-4 mb-0 text-[25px] leading-none tracking-[-0.04em] text-[#E30A17] min-[1200px]:text-[calc(25*var(--foundry-unit))]">Download the Complete 20-Page PDF Document.</h3><p className="mt-4 mb-0 text-[10px] leading-tight">Includes full metallurgical tables, furnace power logs, machine park coordinates, and quality procedures.</p></div><a href={asset("foundry-capabilities-2026-v1.pdf")} download className="flex w-fit max-w-full shrink-0 items-center gap-3 rounded-[10px] bg-white/15 px-4 py-3 transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><LuCloudDownload aria-hidden="true" className="size-6 shrink-0 text-[#E30A17]"/><span className={body}>DOWNLOAD PDF (2026 v1)</span></a></div>
      </section>
      <div className={`${frame} pt-20 pb-20 min-[1200px]:pt-[calc(120*var(--foundry-unit))] min-[1200px]:pb-[calc(120*var(--foundry-unit))]`}><NewsletterSubscription /></div>
    </div>
  </main>;
}
