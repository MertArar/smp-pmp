"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import { JoinSempaGlobal, CatalogSolutions } from "@/components/catalog/CatalogSections";
import SmartPumpAssistant from "@/components/smart-pump/SmartPumpAssistant";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";

const FAMILIES = [
  { slug: "end-suction", title: "End Suction Pumps", models: "ASL | TKF | TKF-M | TKF-AH | TKF-K | DPT-DI | DPT-TR | TKF-KE | MKF-Y | TKF-Y", image: "1-k.jpg", description: "Maximum efficiency, minimum maintenance. Our end suction pumps are the reliable solution for continuous fluid transfer." },
  { slug: "multi-stage", title: "Multi Stage Pumps", models: "ARS | ARS-DD | DPT-TR", image: "dpt-tr-100.jpg", description: "Explore our multi stage pump series for your application." },
  { slug: "sewage", title: "Sewage Pumps", models: "Sewage pump series", image: "dpt-di.jpg", description: "Discover pumping solutions for wastewater handling and transfer." },
  { slug: "in-line", title: "In-Line Pumps", models: "DPT | DPT-DI", image: "dpt-di.jpg", description: "Explore our in-line pump range for your system requirements." },
  { slug: "split-case", title: "Split Case Pumps", models: "ASL", image: "asl.jpg", description: "Discover our split case pump series for your project." },
  { slug: "self-priming", title: "Self Priming Pumps", models: "Self priming pump series", image: "tkf-ke.jpg", description: "Explore self priming pumping solutions for your application." },
  { slug: "booster", title: "Booster Pumps", models: "TKF-AH", image: "tkf-ah.jpg", description: "Find the right booster pump series for your project." },
  { slug: "fire-fighting", title: "Fire Fighting Pumps", models: "Fire fighting pump series", image: "tkf-m-80.jpg", description: "Explore our fire fighting pump range with our engineering team." },
];

export default function PumpSeriesPage({ artwork }: { artwork: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const families = useMemo(() => FAMILIES.filter(item => `${item.title} ${item.models}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  return <main data-pump-series-page data-header-underlay className="-mt-[var(--site-header-height,97px)] isolate w-full overflow-x-clip bg-[#d1e8f3] text-[#0d5792] [font-family:var(--font-sf-pro),sans-serif] [font-variation-settings:'wdth'_125,'wght'_410]">
    <div className="h-[var(--site-header-height,97px)]" />
    <section aria-labelledby="pump-series-title" className="mx-auto w-[90%] max-w-[1600px] pt-8 md:w-5/6 md:pt-12">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
        <h1 id="pump-series-title" className="text-[25px] font-[650] tracking-[-.035em]">Product Series</h1>
        <nav aria-label="Breadcrumb" className="text-[11px] text-[#9eb7d0]"><Link href="/">Home</Link> &gt; Products</nav>
        <div className="relative w-full md:ml-auto md:w-[250px]">
          <label className="sr-only" htmlFor={searchId}>Search product series</label>
          <input id={searchId} value={query} onChange={event => setQuery(event.target.value)} placeholder="SEARCH PRODUCT" className="h-11 w-full rounded-[18px] border border-white/70 bg-white/20 pr-12 pl-5 text-xs shadow-[0_5px_18px_#005eff25] outline-none placeholder:text-[#9eb7d0] focus:border-[#005eff]" />
          {query ? <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute inset-y-0 right-3 text-[#4687b8]"><FiX /></button> : <FiSearch aria-hidden className="pointer-events-none absolute top-3 right-4 size-5 text-[#63b9ed]" />}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{families.length} product families</p>
      <div data-series-grid className="mt-10 grid grid-cols-1 gap-x-7 gap-y-10 md:mt-16 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:mt-20 lg:gap-y-16">
        {families.map(item => {
          const index = FAMILIES.indexOf(item);
          const suppliedImage = artwork["pump-series"] ?? artwork[item.slug] ?? artwork[`pump${index + 1}`];
          const image = suppliedImage ?? `/pump-series/${item.image}`;
          const darkImage = artwork[`${item.slug}-dark`] ?? artwork[`pump${index + 1}-dark`];
          return <Link key={item.slug} href={`/all-products?series=${encodeURIComponent(item.title)}`} data-series-card data-series-slug={item.slug} className="ps-card group block min-w-0 rounded-[25px] outline-none focus-visible:ring-2 focus-visible:ring-[#005eff] focus-visible:ring-offset-4">
            <div className="relative aspect-[585/329] overflow-hidden rounded-[25px] bg-[#f1f1f1] shadow-[0_30px_55px_#005eff25]">
              <Image src={image} alt={item.title} fill preload={index < 2} sizes="(max-width:767px) 90vw, (max-width:1920px) 41vw, 784px" className={`ps-art ${suppliedImage ? "object-cover" : "object-contain p-8"} ${darkImage ? "group-hover:opacity-0 group-focus-visible:opacity-0" : ""}`} />
              {darkImage && <Image src={darkImage} alt="" fill sizes="(max-width:767px) 90vw, 41vw" className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />}
              <p className="absolute right-[7%] bottom-[12%] left-[7%] truncate text-[clamp(9px,.85vw,16px)] uppercase text-[#9eb7d0]">{item.models}</p>
            </div>
            <div className="relative -mt-6 h-[130px]">
              <div className="ps-caption absolute top-0 right-[1%] left-[1%] flex min-h-[100px] items-center gap-3 rounded-[25px] border border-white/60 bg-white/50 px-[6%] py-5 shadow-[0_12px_30px_#005eff0d] backdrop-blur-[15px]">
                <span aria-hidden className="ps-arrow grid size-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(145deg,#0877ff,#001ca3)] text-white shadow-[0_0_22px_#005eff66]"><FiArrowRight className="size-6" /></span>
                <h2 className="min-w-0 bg-[linear-gradient(130deg,#005eff,#001ea2)] bg-clip-text text-[clamp(17px,1.7vw,32px)] leading-[1.05] tracking-[-.035em] text-transparent uppercase">{item.title}</h2>
                <p className="ps-description ml-auto shrink-0 text-[clamp(9px,.7vw,12px)] leading-[1.12] text-[#82b7d3]">{item.description}</p>
              </div>
            </div>
          </Link>;
        })}
      </div>
      {families.length === 0 && <div className="py-20 text-center"><p>No product series found.</p><button onClick={() => setQuery("")} className="mt-4 underline">Clear search</button></div>}
    </section>
    <JoinSempaGlobal assetBase="/pump-series" />
    <CatalogSolutions assetBase="/pump-series" />
    <SmartPumpAssistant assetBase="/pump-series" />
    <div className="mx-auto w-full max-w-[1600px] px-5 pt-1 pb-32 md:w-[94%] md:px-8 md:pt-8 lg:w-[90%] lg:px-6 xl:px-10"><NewsletterSubscription /></div>
    <style>{`
      .ps-art{transition:filter .5s ease,opacity .5s ease}
      .ps-caption{transition:min-height .45s cubic-bezier(.22,1,.36,1),box-shadow .45s ease}
      .ps-arrow{width:0;opacity:0;margin-right:-12px;transform:translateX(-8px);transition:width .4s ease,opacity .4s ease,margin .4s ease,transform .4s ease}
      .ps-description{max-width:0;max-height:0;opacity:0;overflow:hidden;transition:max-width .45s ease,max-height .45s ease,opacity .4s ease}
      .ps-card:is(:hover,:focus-visible) .ps-art{filter:brightness(.42) saturate(1.15)}
      .ps-card:is(:hover,:focus-visible) .ps-caption{min-height:120px;box-shadow:0 20px 35px #005eff22}
      .ps-card:is(:hover,:focus-visible) .ps-arrow{width:32px;opacity:1;margin-right:0;transform:translateX(0)}
      .ps-card:is(:hover,:focus-visible) .ps-description{max-width:28%;max-height:130px;opacity:1}
      @media(max-width:767px){.ps-caption{flex-wrap:wrap}.ps-card:is(:hover,:focus-visible) .ps-description{max-width:100%;flex-basis:100%}}
      @media(prefers-reduced-motion:reduce){.ps-card *{transition:none!important}}
    `}</style>
  </main>;
}
