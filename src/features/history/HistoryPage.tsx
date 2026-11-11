"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
import { pageWheelDelta } from "@/lib/smoothScroll";

// ============================================================
// HISTORY TIMELINE DATA
// ============================================================

const HISTORY_POINTS = [
  {
    id: "80s",
    year: "80’S",
    label: "EXPANSION",
    description: "Expansion into Industrial & Agricultural Pumps",
    x: "11.23%",
    y: "93.59%",
    phase: "-0.35s",
  },
  {
    id: "90s",
    year: "90’S",
    label: "EXPANSION",
    description: "Expansion into Industrial & Agricultural Pumps",
    x: "33.95%",
    y: "83.46%",
    phase: "-1.4s",
  },
  {
    id: "20s",
    year: "20’S",
    label: "EXPANSION",
    description: "Expansion into Industrial & Agricultural Pumps",
    x: "55.99%",
    y: "76.30%",
    phase: "-2.25s",
  },
  {
    id: "now",
    year: "NOW",
    label: "EXPANSION",
    description: "Expansion into Industrial & Agricultural Pumps",
    x: "76.85%",
    y: "68.26%",
    phase: "-0.9s",
  },
] as const;

type HistoryPoint = (typeof HISTORY_POINTS)[number];


// Detail records come from the supplied reference. Sort by year independently
// of their order in the artwork; same-year records retain their input order.
const HISTORY_EVENTS = [
  { id: "inception", year: 1972, category: "INCEPTION", title: "Sempa (under the name MSM) was established in Konya.", description: "SEMPA was founded in 1972 under the name MSM in Konya, Turkey, initially established to meet the surface water pump requirements of the Konya region." },
  { id: "turbine", year: 1989, category: "DEVELOPMENT", title: "Deep Well Turbine Pump Manufacturing", description: "In response to receding vertical shaft surface water levels, commenced the manufacturing of deep well turbine pumps." },
  { id: "submersible", year: 1991, category: "INNOVATION", title: "Submersible Pump Production Launch", description: "Initiated the production of high-efficiency submersible pumps and motors tailored for deep borehole agricultural irrigation." },
  { id: "foundry", year: 1994, category: "FOUNDRY", title: '"0 to 1" Production Philosophy & First In-House Foundry', description: 'Adopted the "0 to 1" manufacturing philosophy and established Turkey’s first specialized in-house foundry in the pump manufacturing sector.' },
  { id: "rebranding", year: 1996, category: "REBRANDING", title: "SEMPA Brand Renewal & ISO 9000 Quality Management", description: "Rebranded from MSM to SEMPA as part of corporate restructuring and expansion strategies. Established the ISO 9000 Quality Management System." },
  { id: "export", year: 1991, category: "EXPORT", title: "First International Export to the United States (USA)", description: "Achieved landmark first international export to the United States of America (USA), introducing SEMPA engineering to global markets." },
].sort((a, b) => a.year - b.year);

gsap.registerPlugin(ScrollTrigger);

const timelineWindowSize = 4;
const maximumPairRise = 64;
const maximumGroupRise = 185;

function timelineRiseForGap(yearGap: number, betweenPairs = false) {
  const gap = Math.max(0, yearGap);
  // Each pair forms a gentle slope; the next pair sits on a higher terrace.
  // Keep date-sensitive variation within both ranges without allowing cliffs.
  return betweenPairs
    ? Math.min(maximumGroupRise, 160 + gap * 8)
    : Math.min(maximumPairRise, 44 + gap * 6);
}

const historyRises = [0];
for (let index = 1; index < HISTORY_EVENTS.length; index++) {
  historyRises.push(historyRises[index - 1] + timelineRiseForGap(HISTORY_EVENTS[index].year - HISTORY_EVENTS[index - 1].year, index % 2 === 0));
}
const largestWindowRise = Math.max(...historyRises.slice(0, HISTORY_EVENTS.length - timelineWindowSize + 1).map((rise, index) => historyRises[index + timelineWindowSize - 1] - rise));

function overviewTargetYear(spot: HistoryPoint) {
  return spot.id === "80s" ? 1980 : spot.id === "90s" ? 1990 : spot.id === "20s" ? 2020 : new Date().getFullYear();
}

function historyStartIndex(year: number) {
  const next = HISTORY_EVENTS.findIndex(event => event.year >= year);
  return next < 0 ? HISTORY_EVENTS.length - 1 : next;
}

function HistoryTimeline({ targetYear }: { targetYear: number }) {
  const nearest = historyStartIndex(targetYear);
  const [windowSize, setWindowSize] = useState(timelineWindowSize);
  const maximumStart = Math.max(0, HISTORY_EVENTS.length - windowSize);
  // Enter at the left edge; later navigation moves along the mountain route.
  const [start, setStart] = useState(0);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const currentStartRef = useRef(start);
  const seekRef = useRef<((index: number) => void) | null>(null);
  const visible = HISTORY_EVENTS.slice(start, start + windowSize);
  const atEnd = start === maximumStart;
  // Keep every card mounted at a stable point on the same mountain route.
  // Each three-card climb is bounded, even when two dates are far apart.
  const rises = historyRises;
  const cameraRise = rises[Math.min(HISTORY_EVENTS.length - 1, start + windowSize - 1)];
  const mountainProgress = maximumStart ? start / maximumStart : 0;
  const move = (direction: number) => {
    const next = Math.max(0, Math.min(maximumStart, currentStartRef.current + direction * (windowSize > 1 ? 2 : 1)));
    if (seekRef.current) seekRef.current(next);
    else setStart(next);
  };

  useLayoutEffect(() => { currentStartRef.current = start; }, [start]);

  // Query navigation can retain the overview scroll position. Reset only on entry,
  // so moving between pairs never moves the document.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [targetYear]);

  useLayoutEffect(() => {
    const resize = () => {
      const count = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1;
      setWindowSize(count);
      setStart(value => Math.min(HISTORY_EVENTS.length - count, value));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useLayoutEffect(() => {
    const page = cardsRef.current?.closest<HTMLElement>("#history-page");
    if (!page || page.dataset.historyScrollScene === "true") return;
    page.style.setProperty("--history-pan-x", `${mountainProgress * 4}%`);
    page.style.setProperty("--history-pan-y", `calc(${mountainProgress * 32} * var(--history-unit, 1px))`);
  }, [mountainProgress]);

  useLayoutEffect(() => {
    const page = cardsRef.current?.closest<HTMLElement>("#history-page");
    return () => {
      page?.style.removeProperty("--history-pan-x");
      page?.style.removeProperty("--history-pan-y");
    };
  }, []);

  useLayoutEffect(() => {
    const row = cardsRef.current;
    const page = row?.closest<HTMLElement>("#history-page");
    const track = row?.querySelector<HTMLElement>("[data-history-track]");
    if (!row || !page || !track) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 0px)", () => {
      let origin = currentStartRef.current;
      const model = { progress: 0 };
      const articles = [...row.querySelectorAll<HTMLElement>("[data-history-card]")];
      let disposed = false;
      let requestedIndex = origin;
      let wheelReadyAt = 0;
      page.dataset.historyScrollScene = "true";
      const paint = () => {
        const p = model.progress;
        const routeProgress = Math.min(1, p / 0.75);
        const index = origin + (maximumStart - origin) * routeProgress;
        const left = Math.floor(index);
        const fraction = index - left;
        const last = Math.min(historyRises.length - 1, left + windowSize - 1);
        const camera = historyRises[last] + ((historyRises[last + 1] ?? historyRises[last]) - historyRises[last]) * fraction;
        const unit = windowSize === 4 ? row.getBoundingClientRect().height / (largestWindowRise + 450 + 20) : 1;
        const riseUnit = windowSize === 4
          ? Math.min(unit, Math.max(0, row.getBoundingClientRect().height - articles[0].getBoundingClientRect().height - 20 * unit) / largestWindowRise)
          : unit;
        // Keep every card inside the stage throughout the pan. Moving the track
        // upward clipped the cards against its own overflow viewport.
        track.style.setProperty("--history-scroll-transform", `translate3d(calc(${-index * 100 / windowSize}% - ${index / windowSize} * var(--history-card-gap)),0,0)`);
        articles.forEach((card, i) => card.style.setProperty("--history-scroll-rise", `${Math.max(0, Math.min(largestWindowRise, camera - historyRises[i])) * riseUnit}px`));
        page.style.setProperty("--history-pan-x", `${maximumStart ? index / maximumStart * 4 : 0}%`);
        page.style.setProperty("--history-pan-y", `${p * 32 * unit}px`);
        page.dataset.historyScrollProgress = p.toFixed(3);
        const step = windowSize > 1 ? 2 : 1;
        const selected = Math.min(maximumStart, origin + Math.floor((index - origin + 0.001) / step) * step);
        const next = routeProgress === 1 ? maximumStart : selected;
        if (currentStartRef.current !== next) {
          currentStartRef.current = next;
          setStart(next);
        }
      };
      const tween = gsap.to(model, { progress: 1, duration: 1, ease: "none", paused: true, onUpdate: paint });
      const trigger = ScrollTrigger.create({
        id: "history-detail-journey", trigger: page, pin: page,
        start: "top top", end: () => `+=${maximumStart === origin ? 1 : window.innerHeight * (1 + (maximumStart - origin) / (windowSize > 1 ? 2 : 1))}`,
        animation: tween, scrub: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? true : 0.35,
        anticipatePin: 1, invalidateOnRefresh: true,
        snap: windowSize > 1 ? undefined : {
          // Rest only at complete groups of two (one card on narrow phones).
          snapTo: (value, self) => {
            if (maximumStart === origin) return 1;
            const step = windowSize > 1 ? 2 : 1;
            const stops = [0];
            for (let next = origin + step; next < maximumStart; next += step) stops.push((next - origin) / (maximumStart - origin) * 0.75);
            stops.push(0.75, 1);
            const exact = stops.find(stop => Math.abs(stop - value) < 0.003);
            if (exact !== undefined) return exact;
            return (self?.direction ?? 1) > 0 ? stops.find(stop => stop > value) ?? 1 : [...stops].reverse().find(stop => stop < value) ?? 0;
          },
          duration: { min: 0.45, max: 0.9 }, delay: 0.12, ease: "power2.inOut", inertia: false,
        },
      });
      seekRef.current = index => {
        requestedIndex = index;
        wheelReadyAt = performance.now() + 1000;
        if (index < origin) {
          origin = index;
          currentStartRef.current = index;
          setStart(index);
          trigger.refresh();
          window.scrollTo({ top: Math.max(0, trigger.start), behavior: "instant" });
          tween.progress(0);
          return;
        }
        const p = maximumStart === origin ? 0 : (index - origin) / (maximumStart - origin) * 0.75;
        window.scrollTo({ top: Math.max(0, trigger.start + p * (trigger.end - trigger.start)), behavior: "smooth" });
      };
      const onPairWheel = (event: WheelEvent) => {
        if (windowSize < 2 || !pageWheelDelta(event)) return;
        if ((event.target as HTMLElement).closest("input,textarea,select,[contenteditable='true']")) return;
        const y = window.scrollY;
        if (y < trigger.start - 2 || y > trigger.end + 2) return;
        if (performance.now() < wheelReadyAt) { event.preventDefault(); return; }
        const direction = Math.sign(event.deltaY);
        if (direction < 0 && requestedIndex <= origin && origin === 0) return;
        event.preventDefault();
        if (direction > 0 && requestedIndex >= maximumStart) {
          window.scrollTo({ top: trigger.end + Math.max(80, Math.abs(event.deltaY)), behavior: "smooth" });
          return;
        }
        seekRef.current?.(Math.max(0, Math.min(maximumStart, requestedIndex + direction * 2)));
      };
      window.addEventListener("wheel", onPairWheel, { passive: false, capture: true });
      paint();
      document.fonts.ready.then(() => { if (!disposed) trigger.refresh(); });
      return () => {
        disposed = true;
        window.removeEventListener("wheel", onPairWheel, true);
        seekRef.current = null;
        trigger.kill(true);
        tween.kill();
        track.style.removeProperty("--history-scroll-transform");
        articles.forEach(card => card.style.removeProperty("--history-scroll-rise"));
        delete page.dataset.historyScrollScene;
        delete page.dataset.historyScrollProgress;
        page.style.removeProperty("--history-heading-rise");
        page.style.removeProperty("--history-heading-opacity");
      };
    });
    return () => media.revert();
  }, [maximumStart, windowSize]);

  return (
    <section
      aria-label="Historical milestones timeline"
      data-history-detail
      data-target-year={targetYear}
      data-nearest-year={HISTORY_EVENTS[nearest].year}
      data-timeline-start={start}
      data-timeline-end={atEnd}
      data-mountain-progress={mountainProgress}
      tabIndex={0}
      className="relative z-30 mx-auto w-11/12 pt-[320px] pb-16 outline-none focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-[#9EB7D0] lg:w-[84%] lg:max-w-none lg:pt-[calc(var(--history-header-offset,97px)+200*var(--history-unit))] lg:pb-[calc(20*var(--history-unit))]"
      onKeyDown={event => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }}
    >
      <div className="relative flex min-h-10 items-center justify-between gap-4 text-[#9EB7D0] lg:min-h-[calc(30*var(--history-unit))]">
        <Link href="/history" className="text-xs underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 lg:text-[calc(12*var(--history-unit))]">All milestones</Link>
        <div className="absolute left-1/2 flex -translate-x-1/2 gap-4 lg:gap-[calc(12*var(--history-unit))]">
          {[-1, 1].map(direction => (
            <button
              key={direction}
              type="button"
              aria-label={direction < 0 ? "Previous milestones" : "Next milestones"}
              disabled={direction < 0 ? start === 0 : atEnd}
              onClick={() => move(direction)}
              className="grid size-10 cursor-pointer place-items-center rounded-full transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-30 lg:size-[calc(30*var(--history-unit))] motion-reduce:transition-none"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 lg:size-[calc(24*var(--history-unit))]" fill="none" stroke="currentColor" strokeWidth="2.6" style={{ transform: direction > 0 ? "rotate(180deg)" : undefined }}><path d="M20 12H4m7-7-7 7 7 7" /></svg>
            </button>
          ))}
        </div>
        <span aria-live="polite" aria-atomic="true" className="text-xs lg:text-[calc(12*var(--history-unit))]">{visible[0].year}–{visible[visible.length - 1].year}</span>
      </div>

      <div
        ref={cardsRef}
        className="mt-8 h-[740px] touch-pan-y overflow-x-auto px-3 pb-5 [scroll-snap-type:x_mandatory] lg:mt-[calc(30*var(--history-unit))] lg:overflow-hidden lg:p-0 lg:h-[var(--history-stage-height)]"
        style={{ "--history-card-gap": "calc(18 * var(--history-unit, 1px))", "--history-stage-height": `calc(${largestWindowRise + 450 + 20} * var(--history-unit, 1px))`, minHeight: "var(--history-stage-height)" } as CSSProperties}
        onTouchStart={event => {
          if (event.touches.length === 1) swipeRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }}
        onTouchEnd={event => {
          const initial = swipeRef.current;
          swipeRef.current = null;
          if (!initial || !event.changedTouches[0]) return;
          const x = event.changedTouches[0].clientX - initial.x;
          const y = event.changedTouches[0].clientY - initial.y;
          if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1);
        }}
        onTouchCancel={() => { swipeRef.current = null; }}
      >
        <div
          data-history-track
          className="grid grid-flow-col auto-cols-[min(290px,78vw)] gap-5 lg:auto-cols-[calc((100%-3*var(--history-card-gap))/4)] lg:gap-[var(--history-card-gap)] [transform:var(--history-scroll-transform,var(--history-track-transform))] transition-transform duration-[1250ms] ease-[cubic-bezier(.25,.8,.25,1)] will-change-transform motion-reduce:transition-none"
          style={{ "--history-track-transform": `translate3d(calc(${-start * 100 / windowSize}% - ${start / windowSize} * var(--history-card-gap)),0,0)` } as CSSProperties}
        >
        {HISTORY_EVENTS.map((event, index) => {
          const inView = index >= start && index < start + windowSize;
          const blurred = windowSize === 4 && index >= start + 2 && !atEnd;
          const offset = cameraRise - rises[index];
          return (
            <article
              key={event.id}
              data-history-card={event.id}
              data-history-card-index={index}
              data-history-pair={Math.floor(index / 2)}
              data-in-view={inView}
              aria-hidden={!inView}
              inert={!inView}
              data-year={event.year}
              data-blurred={blurred}
              data-rise={offset}
              aria-current={event.id === HISTORY_EVENTS[nearest].id ? "date" : undefined}
              className="relative h-[390px] w-[min(290px,78vw)] shrink-0 snap-center rounded-[30px] border border-white/40 bg-white/15 text-[#F7F7F7] shadow-[0_12px_35px_#082f4c10] backdrop-blur-[10px] transition-[filter,opacity,transform] duration-[1250ms] ease-[cubic-bezier(.25,.8,.25,1)] [font-variation-settings:'wdth'_125,'wght'_410,'opsz'_20] lg:h-auto lg:aspect-[318/352] lg:w-auto lg:[container-type:inline-size] lg:[--history-card-unit:calc((100cqw_+_2px)/318)] lg:[border-radius:9.433962%/8.522727%] motion-reduce:transition-none"
              style={{ "--history-card-rise": `calc(${offset} * var(--history-unit, 1px))`, transform: "translateY(var(--history-scroll-rise,var(--history-card-rise)))", filter: blurred ? "blur(calc(8 * var(--history-unit, 1px)))" : "none", opacity: blurred ? 0.85 : 1 } as CSSProperties}
            >
              <span aria-hidden="true" className="absolute left-6 top-[30px] bottom-[30px] w-px bg-white/90 lg:left-[calc(50*var(--history-card-unit))] lg:top-[calc(45*var(--history-card-unit))] lg:bottom-[calc(59*var(--history-card-unit))]" />
              <span aria-hidden="true" className="absolute left-6 top-[30px] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white lg:left-[calc(50*var(--history-card-unit))] lg:top-[calc(45*var(--history-card-unit))] lg:size-[calc(7*var(--history-card-unit))]" />
              <div className="pl-11 pr-5 pt-5 lg:pl-[calc(75*var(--history-card-unit))] lg:pr-[calc(25*var(--history-card-unit))] lg:pt-[calc(29*var(--history-card-unit))]">
                <div className="flex flex-wrap items-center gap-2 lg:gap-[calc(7*var(--history-card-unit))]">
                  <p className="m-0 text-[15px] leading-none tracking-[-.04em] lg:text-[calc(21*var(--history-card-unit))]">{event.year}</p>
                  <span className="rounded-full border border-white/55 bg-white/15 px-2 py-1 text-[11px] leading-none lg:px-[calc(8*var(--history-card-unit))] lg:py-[calc(5*var(--history-card-unit))] lg:text-[calc(15*var(--history-card-unit))]">{event.category}</span>
                </div>
                <h2 className="mt-6 mb-0 text-[20px] leading-[1.07] tracking-[-.04em] lg:mt-[calc(22*var(--history-card-unit))] lg:max-w-[calc(198*var(--history-card-unit))] lg:text-[calc(20*var(--history-card-unit))]">{event.title}</h2>
                <p className="mt-5 mb-0 text-[12px] leading-[1.12] tracking-[-.04em] lg:mt-[calc(10*var(--history-card-unit))] lg:max-w-[calc(185*var(--history-card-unit))] lg:text-[calc(12*var(--history-card-unit))]">{event.description}</p>
              </div>
              <div className="pointer-events-none absolute left-6 bottom-[30px] lg:left-[calc(50*var(--history-card-unit))] lg:bottom-[calc(59*var(--history-card-unit))]">
                <HistoryHotspot spot={HISTORY_POINTS[index % HISTORY_POINTS.length]} />
              </div>
            </article>
          );
        })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOTSPOT ANIMATION SETTINGS
// ============================================================

const historyHotspotSettings = {
  duration: "3.1s",
  gradientStart: "#005EFF",
  gradientEnd: "#001EA2",
};

// ============================================================
// TIMELINE SETTINGS
// ============================================================

const timelineLineHeight = "var(--history-line-height,clamp(180px,17.3vw,290px))";
const timelineLineWidth = 1.5;

const timelineTextOffsetX = "calc(15 * var(--history-unit, 1px))";
const timelineTextOffsetY = "calc(12 * var(--history-unit, 1px))";

// ============================================================
// TIMELINE TYPOGRAPHY
// ============================================================

const timelineYearFontSize = "var(--history-year-size,clamp(17px, 1.375vw, 26.4px))";
const timelineYearFontWeight = 350;

const timelineBadgeFontSize = "var(--history-badge-size,clamp(12px, 1vw, 19.2px))";
const timelineBadgeFontWeight = 350;

const timelineDescriptionFontSize = "var(--history-body-size,clamp(10px, 0.75vw, 14.4px))";
const timelineDescriptionFontWeight = 300;

const timelineDescriptionGap = "var(--history-description-gap,clamp(18px, 1.52778vw, 29px))";

// ============================================================
// HISTORY HOTSPOT
// ============================================================

function HistoryHotspot({ spot }: { spot: HistoryPoint }) {
  return (
    <span
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        z-20
        block
        h-[clamp(56px,4.7vw,76px)] lg:h-[calc(60*var(--history-unit))]
        w-[clamp(56px,4.7vw,76px)] lg:w-[calc(60*var(--history-unit))]
        -translate-x-1/2
        -translate-y-1/2
        select-none
      "
      style={
        {
          left: 0,
          top: 0,
          "--history-delay": spot.phase,
          "--history-duration": historyHotspotSettings.duration,
          "--history-gradient-start": historyHotspotSettings.gradientStart,
          "--history-gradient-end": historyHotspotSettings.gradientEnd,
        } as CSSProperties
      }
    >
      {/* SOFT BLUE GLOW */}
      <span className="history-hotspot-glow absolute inset-[2%] rounded-full bg-[#71B8FF]/25 blur-[9px]" />

      {/* WHITE CIRCULAR BACKGROUND */}
      <span className="history-hotspot-white-disc absolute inset-[13%] rounded-full bg-white/85 shadow-[0_0_0_3px_rgba(255,255,255,0.35),0_0_18px_7px_rgba(255,255,255,0.65),0_3px_12px_rgba(0,94,255,0.20)]" />

      {/* OUTER GRADIENT RING */}
      <span className="history-hotspot-ring history-hotspot-ring-outer absolute inset-[3%] rounded-full">
        <span className="history-hotspot-gradient-stroke absolute inset-0 rounded-full" />
      </span>

      {/* MIDDLE GRADIENT RING */}
      <span className="history-hotspot-ring history-hotspot-ring-middle absolute inset-[10%] rounded-full">
        <span className="history-hotspot-gradient-stroke absolute inset-0 rounded-full" />
      </span>

      {/* INNER GRADIENT RING */}
      <span className="history-hotspot-ring history-hotspot-ring-inner absolute inset-[17%] rounded-full">
        <span className="history-hotspot-gradient-stroke absolute inset-0 rounded-full" />
      </span>

      {/* FIXED WHITE CENTER BORDER */}
      <span className="absolute inset-[23%] rounded-full border-[2px] border-white bg-[#257BF5] shadow-[0_0_0_1px_rgba(25,103,238,0.62),0_1px_6px_rgba(0,61,213,0.32)]" />

      {/* FIXED BLUE CENTER */}
      <span className="absolute inset-[28%] rounded-full bg-[linear-gradient(145deg,#005EFF_0%,#0348E4_40%,#00199E_100%)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.16)]" />
    </span>
  );
}

// ============================================================
// TIMELINE CONTENT
// ============================================================

function MilestoneContent({ spot }: { spot: HistoryPoint }) {
  return (
    <div className="min-w-0 text-left">
      {/* YEAR + EXPANSION BADGE */}
      <div className="flex flex-nowrap items-center gap-[clamp(10px,0.83vw,16px)] lg:gap-[calc(12*var(--history-unit))]">
        <h2
          className="m-0 shrink-0 whitespace-nowrap font-sans"
          style={{
            fontSize: timelineYearFontSize,
            fontWeight: timelineYearFontWeight,
            fontVariationSettings: `"wdth" 132, "wght" ${timelineYearFontWeight}, "opsz" 28`,
            fontSynthesis: "none",
            lineHeight: "100%",
            letterSpacing: "-0.04em",
            color: "#F7F7F7",
          }}
        >
          {spot.year}
        </h2>

        {/* EXPANSION GLASS BADGE */}
        <span
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            whitespace-nowrap
            rounded-full
            border
            border-[#F7F7F7]/60
            bg-white/15
            px-[clamp(10px,0.8333vw,16px)] lg:px-[calc(12*var(--history-unit))]
            py-[clamp(5px,0.41667vw,8px)] lg:py-[calc(6*var(--history-unit))]
            font-sans
            backdrop-blur-[4.9px]
          "
          style={{
            fontSize: timelineBadgeFontSize,
            fontWeight: timelineBadgeFontWeight,
            fontVariationSettings: `"wdth" 132, "wght" ${timelineBadgeFontWeight}, "opsz" 28`,
            fontSynthesis: "none",
            lineHeight: "100%",
            letterSpacing: "-0.04em",
            color: "#F7F7F7",
            borderWidth: "0.65px",
          }}
        >
          {spot.label}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p
        className="mb-0 max-w-[clamp(190px,16.5vw,315px)] font-sans lg:ml-[calc(7*var(--history-unit))] lg:max-w-[calc(215*var(--history-unit))]"
        style={{
          marginTop: timelineDescriptionGap,
          fontSize: timelineDescriptionFontSize,
          fontWeight: timelineDescriptionFontWeight,
          fontVariationSettings: `"wdth" 132, "wght" ${timelineDescriptionFontWeight}, "opsz" 20`,
          fontSynthesis: "none",
          lineHeight: "112%",
          letterSpacing: "-0.04em",
          color: "#F7F7F7",
        }}
      >
        {spot.description}
      </p>
    </div>
  );
}

// ============================================================
// DESKTOP TIMELINE MILESTONE
// ============================================================

function DesktopMilestone({ spot }: { spot: HistoryPoint }) {
  return (
    <div
      data-history-milestone={spot.id}
      className="pointer-events-none absolute z-20"
      style={
        {
          left: spot.x,
          top: spot.y,
        } as CSSProperties
      }
    >
      {/* VERTICAL WHITE LINE */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 bg-[#F7F7F7]/90"
        style={{
          width: `calc(${timelineLineWidth} * var(--history-unit, 1px))`,
          height: timelineLineHeight,
          transform: "translateX(-50%)",
        }}
      />

      {/* SMALL WHITE POINT */}
      <span
        aria-hidden="true"
        className="
          absolute
          left-0
          h-[clamp(10px,0.76389vw,14.67px)] lg:h-[calc(10*var(--history-unit))]
          w-[clamp(10px,0.76389vw,14.67px)] lg:w-[calc(10*var(--history-unit))]
          -translate-x-1/2
          translate-y-1/2
          rounded-full
          bg-[#F7F7F7]
        "
        style={{
          bottom: "var(--history-line-height)",
        }}
      />

      {/* MILESTONE TEXT */}
      <div
        className="pointer-events-none absolute w-max"
        style={{
          left: timelineTextOffsetX,
          top: `calc(0px - var(--history-line-height) - ${timelineTextOffsetY})`,
        }}
      >
        <Link href={`/history?year=${overviewTargetYear(spot)}`} className="pointer-events-auto block rounded-lg focus-visible:outline-2 focus-visible:outline-white" aria-label={`Explore ${spot.year} milestones`}>
          <MilestoneContent spot={spot} />
        </Link>
      </div>

      {/* ANIMATED BLUE POINT */}
      <Link href={`/history?year=${overviewTargetYear(spot)}`} aria-label={`Open ${spot.year} timeline`} className="pointer-events-auto absolute left-0 top-0 size-[calc(60*var(--history-unit))] -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-white">
        <span className="absolute left-1/2 top-1/2"><HistoryHotspot spot={spot} /></span>
      </Link>
    </div>
  );
}

// ============================================================
// MOBILE TIMELINE
// ============================================================

function MobileTimeline() {
  const overviewRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const overview = overviewRef.current;
    const viewport = overview?.firstElementChild as HTMLElement | null;
    const page = overview?.closest<HTMLElement>("#history-page");
    if (!overview || !viewport || !page) return;
    const media = gsap.matchMedia();
    media.add({ responsive: "(max-width: 1199px)", reduced: "(prefers-reduced-motion: reduce)" }, context => {
      if (!context.conditions?.responsive) return;
      const reduced = context.conditions.reduced;
      const model = { progress: 0 };
      const originalSnap = viewport.style.scrollSnapType;
      let expectedLeft = 0;
      let disposed = false;
      const steps = () => HISTORY_POINTS.length - (window.innerWidth >= 768 ? 2 : 1);
      const distance = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      // Native vertical scroll drives the existing horizontal strip. No wheel
      // or touch input is blocked, and normal page travel resumes after NOW.
      viewport.style.scrollSnapType = "none";
      const paint = () => {
        expectedLeft = model.progress * distance();
        viewport.scrollLeft = expectedLeft;
        overview.dataset.overviewProgress = model.progress.toFixed(3);
      };
      const tween = gsap.to(model, { progress: 1, duration: 1, paused: true, ease: "none", onUpdate: paint });
      const trigger = ScrollTrigger.create({
        id: "history-overview-journey",
        trigger: page,
        pin: page,
        start: () => Math.max(0, page.getBoundingClientRect().top + window.scrollY + page.offsetHeight - window.innerHeight),
        end: () => `+=${window.innerHeight * (steps() * 0.65 + 0.25)}`,
        animation: tween,
        scrub: reduced ? true : 0.3,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: reduced ? undefined : {
          snapTo: value => Math.round(value * steps()) / steps(),
          duration: { min: 0.2, max: 0.45 },
          delay: 0.15,
          ease: "power2.inOut",
          inertia: false,
        },
        onRefresh: paint,
      });
      // Keep horizontal swipes in sync with the vertical route as well.
      const onHorizontalScroll = () => {
        if (Math.abs(viewport.scrollLeft - expectedLeft) < 1 || !distance()) return;
        const progress = viewport.scrollLeft / distance();
        window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: "instant" });
      };
      viewport.addEventListener("scroll", onHorizontalScroll, { passive: true });
      paint();
      document.fonts.ready.then(() => { if (!disposed) trigger.refresh(); });
      return () => {
        disposed = true;
        viewport.removeEventListener("scroll", onHorizontalScroll);
        trigger.kill(true);
        tween.kill();
        viewport.style.scrollSnapType = originalSnap;
        viewport.scrollLeft = 0;
        delete overview.dataset.overviewProgress;
      };
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={overviewRef} data-history-overview-mobile className="relative z-20 min-[1200px]:hidden">
      <div className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]">
        {HISTORY_POINTS.map(spot => (
          <div key={spot.id} className="relative w-full shrink-0 snap-center" data-history-overview-slide>
            <Link href={`/history?year=${overviewTargetYear(spot)}`} aria-label={`Explore ${spot.year} milestones`} className="relative block text-[#F7F7F7]">
              <span className="absolute left-0 top-3 size-3 -translate-x-1/2 rounded-full bg-white" />
              <div className="flex items-center gap-4">
                <h2 className="m-0 text-[24px] leading-none tracking-[-.04em]">{spot.year}</h2>
                <span className="rounded-full border border-white/50 bg-white/15 px-3 py-2 text-[14px] leading-none">{spot.label}</span>
              </div>
              <p className="mt-6 max-w-[250px] text-[14px] leading-[1.12] tracking-[-.03em]">{spot.description}</p>
              <span data-history-overview-stem className="absolute left-0 top-3 w-px bg-white/90" />
              <span data-history-overview-hotspot className="absolute left-0"><HistoryHotspot spot={spot} /></span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HISTORY PAGE
// ============================================================

export default function HistoryPage({ initialYear = null }: { initialYear?: number | null }) {
  const snowTitle = useRepeatingTitle(3100, 4000);
  const pageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const page = pageRef.current;
    if (!header || !page) return;
    const measureHeader = () => {
      const inFlow = !["absolute", "fixed"].includes(getComputedStyle(header).position);
      page.style.setProperty("--history-header-offset", `${inFlow ? header.getBoundingClientRect().height : 0}px`);
    };
    measureHeader();
    const observer = new ResizeObserver(measureHeader);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  // ==========================================
  // BACKGROUND SETTINGS
  // ==========================================

  const imageOffsetY = -290;

  // ==========================================
  // TITLE SETTINGS
  // ==========================================

  // Önceki: 27.5svh
  // Yeni: Tüm içerik grubu biraz daha yukarıda
  const titleTop = "var(--history-title-top,25.5svh)";

  // Önceki: clamp(30px, 3.4722vw, 72px)
  const titleFontSize = "var(--history-title-size,clamp(28px,3.2vw,66px))";

  const titleFontWeight = 330;

  // ==========================================
  // DESCRIPTION SETTINGS
  // ==========================================

  // Önceki: clamp(11px, 0.83333vw, 17px)
  const descriptionFontSize = "var(--history-body-size,clamp(10px,0.77vw,15.5px))";

  const descriptionFontWeight = 250;
  const descriptionLetterSpacing = "-0.01em";
  const descriptionGap = "clamp(5px, 0.41667vw, 9px)";

  // ==========================================
  // HERITAGE BADGE SETTINGS
  // ==========================================

  const badgeMarginTop = "var(--history-heritage-gap,clamp(20px,2.08333vw,40px))";

  // Önceki: 0.9
  // Yeni: Kutucuk biraz küçüldü
  const badgeScale = 0.86;

  // İkonun önceki görünen boyutunu koruyoruz
  const badgeIconScale = 1.8 / badgeScale;

  const badgeWidth = "var(--history-heritage-width,clamp(250px,18.95833vw,364px))";

  const badgeMinHeight = "var(--history-heritage-height,clamp(40.5px,2.8125vw,54px))";

  const badgeRadius = "var(--history-heritage-radius,clamp(8px, 0.55556vw, 10.67px))";

  const badgePaddingX = "var(--history-heritage-padding-x,clamp(12px, 1.11111vw, 21.33px))";

  const badgePaddingY = "var(--history-heritage-padding-y,clamp(7px, 0.48611vw, 9.33px))";

  const badgeGap = "var(--history-heritage-gap-x,clamp(8px, 0.69444vw, 13.33px))";

  // ==========================================
  // BADGE ICON SETTINGS
  // ==========================================

  const badgeIconWidth = "var(--history-heritage-icon-width,clamp(36px, 2.91667vw, 56px))";

  const badgeIconHeight = "var(--history-heritage-icon-height,clamp(23px, 1.875vw, 36px))";

  const badgeIconOffsetX = 25;
  const badgeIconOffsetY = 2.5;

  // ==========================================
  // BADGE TEXT SETTINGS
  // ==========================================

  // Önceki: clamp(11px, 0.83333vw, 16px)
  const badgeFontSize = "var(--history-heritage-font-size,clamp(10px, 0.79vw, 15px))";

  const badgeFontWeight = 330;
  const badgeBoldFontWeight = 520;

  return (
    <>
    <main
      ref={pageRef}
      id="history-page"
      data-history-view={initialYear === null ? "overview" : "detail"}
      style={initialYear === null ? undefined : { "--history-detail-unit": "min(calc(100vw / 1440), calc((100svh - 100vw * .0674 - 20px) / 1140))", "--history-title-top": "calc(var(--history-header-offset,97px) + 50 * var(--history-unit, 1px))", "--history-breadcrumb-top": "calc(var(--history-header-offset,97px) + 20 * var(--history-unit, 1px))", minHeight: "100svh" } as CSSProperties}
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#24547A] lg:min-h-0 lg:mt-[calc(-1*var(--history-header-offset,97px))] lg:[--history-unit:var(--history-detail-unit,calc(100vw/1440))] lg:[--history-line-height:calc(250*var(--history-unit))] lg:[--history-year-size:calc(21*var(--history-unit))] lg:[--history-badge-size:calc(15*var(--history-unit))] lg:[--history-body-size:calc(13*var(--history-unit))] lg:[--history-description-gap:calc(28*var(--history-unit))] lg:[--history-title-top:calc(280*var(--history-unit))] lg:[--history-title-size:calc(50*var(--history-unit))] lg:[--history-image-offset:0px] lg:[--history-heritage-scale:1] lg:[--history-heritage-gap:calc(22*var(--history-unit))] lg:[--history-heritage-width:calc(273*var(--history-unit))] lg:[--history-heritage-height:calc(40*var(--history-unit))] lg:[--history-heritage-radius:calc(8*var(--history-unit))] lg:[--history-heritage-padding-x:calc(12*var(--history-unit))] lg:[--history-heritage-padding-y:calc(6*var(--history-unit))] lg:[--history-heritage-gap-x:calc(10*var(--history-unit))] lg:[--history-heritage-icon-width:calc(42*var(--history-unit))] lg:[--history-heritage-icon-height:calc(27*var(--history-unit))] lg:[--history-heritage-font-size:calc(11.5*var(--history-unit))] lg:[--history-heritage-icon-x:calc(25*var(--history-unit))] lg:[--history-heritage-icon-y:calc(2.5*var(--history-unit))]"
    >
      {/* ======================================
          HISTORY BACKGROUND
      ====================================== */}

      <img
        src="/history/history-hero01.webp"
        width={2880}
        height={2048}
        alt=""
        draggable={false}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className={initialYear === null ? "pointer-events-none block h-auto w-full select-none" : "pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-bottom transition-transform duration-[1250ms] ease-[cubic-bezier(.25,.8,.25,1)] will-change-transform motion-reduce:transition-none"}
        style={{
          transform: initialYear === null ? `translateY(var(--history-image-offset, ${imageOffsetY}px))` : "translate3d(var(--history-pan-x, 0%), var(--history-pan-y, 0px), 0) scale(1.25)",
          transformOrigin: "center bottom",
          imageRendering: "auto",
        }}
      />

      <div
        data-history-newsletter-blend
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px z-0 h-[clamp(140px,18vw,260px)]"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(36,84,122,0) 0%, rgba(36,84,122,.08) 20%, rgba(36,84,122,.45) 50%, rgba(36,84,122,.86) 78%, #24547a 100%)" }}
      />

      {/* ======================================
          HISTORY CONTENT
      ====================================== */}

      <div
        data-history-heading
        className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center px-4 text-center"
        style={{
          top: titleTop,
        }}
      >
        {/* HISTORY TITLE */}
        <h1
          ref={snowTitle}
          id="history-snow-title"
          aria-label="Our Historical Milestones"
          className="relative m-0 w-full max-w-full font-sans whitespace-normal text-balance lg:w-auto lg:whitespace-nowrap"
          style={{
            fontSize: titleFontSize,
            fontWeight: titleFontWeight,
            fontVariationSettings: `"wdth" 132, "wght" ${titleFontWeight}, "opsz" 28`,
            lineHeight: "100%",
            letterSpacing: "-0.04em",
            color: "#F7F7F7",
            textAlign: "center",
          }}
        >
          <span aria-hidden="true">{["Our", "Historical", "Milestones"].map((word, wordIndex) => <span key={word} className="max-lg:block">{Array.from(word, (letter, index) => <span key={index} className="history-snow-letter relative inline-block" style={{ "--snow-delay": `${(index * 137 + wordIndex * 173) % 520}ms` } as CSSProperties}>{letter}</span>)}{wordIndex < 2 ? <span className="max-lg:hidden"> </span> : null}</span>)}</span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0">
            {Array.from({ length: 32 }, (_, index) => <span key={index} className="history-snowflake absolute opacity-0" style={{ left: `${(index * 31 + 7) % 100}%`, top: `${index % 3 * 24}%`, "--snow-fall-delay": `${index * 73 % 850}ms`, "--snow-drift": `${index % 2 ? -0.3 : 0.25}em`, "--snow-size": `${index % 4 === 0 ? 4 : 2}px` } as CSSProperties}>
              <svg viewBox="0 0 12 12" className="block size-full" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 0v12M.8 3l10.4 6M.8 9l10.4-6"/></svg>
            </span>)}
          </span>
        </h1>

        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            #history-snow-title[data-title-revealing] .history-snow-letter {
              animation: history-snow-build 2150ms cubic-bezier(.25,.55,.35,1) var(--snow-delay) both;
            }
            #history-snow-title[data-title-revealing] .history-snowflake {
              width: var(--snow-size); height: var(--snow-size); color: #f7f7f7;
              animation: history-snow-fall 2100ms linear var(--snow-fall-delay) both;
            }
          }
          @keyframes history-snow-build {
            0% { opacity: 0; clip-path: polygon(0 100%,15% 100%,30% 100%,45% 100%,60% 100%,75% 100%,90% 100%,100% 100%,100% 100%,0 100%); }
            12% { opacity: .85; clip-path: polygon(0 97%,15% 91%,30% 95%,45% 87%,60% 94%,75% 89%,90% 96%,100% 92%,100% 100%,0 100%); text-shadow: 0 0 3px #d3efff; }
            38% { opacity: 1; clip-path: polygon(0 73%,15% 64%,30% 72%,45% 60%,60% 69%,75% 62%,90% 70%,100% 65%,100% 100%,0 100%); }
            65% { opacity: 1; clip-path: polygon(0 40%,15% 29%,30% 39%,45% 24%,60% 34%,75% 27%,90% 39%,100% 31%,100% 100%,0 100%); text-shadow: 0 0 2px #e2f6ff; }
            88% { opacity: 1; clip-path: polygon(0 9%,15% 0,30% 8%,45% 0,60% 5%,75% 0,90% 9%,100% 0,100% 100%,0 100%); }
            100% { opacity: 1; clip-path: polygon(0 0,15% 0,30% 0,45% 0,60% 0,75% 0,90% 0,100% 0,100% 100%,0 100%); text-shadow: none; }
          }
          @keyframes history-snow-fall {
            0% { opacity: 0; transform: translate(0,-1.5em) rotate(0); }
            12% { opacity: .85; }
            50% { opacity: .85; transform: translate(var(--snow-drift),-.2em) rotate(65deg); }
            83% { opacity: .65; transform: translate(0,.6em) rotate(125deg); }
            100% { opacity: 0; transform: translate(var(--snow-drift),.65em) rotate(140deg) scale(.3); }
          }
        `}</style>
        {/* HISTORY DESCRIPTION */}
        <p
          className="m-0 w-full max-w-full font-sans text-balance md:max-w-[47.5vw] lg:max-w-[calc(900*var(--history-unit))]"
          style={{
            marginTop: descriptionGap,
            fontSize: descriptionFontSize,
            fontWeight: descriptionFontWeight,
            fontVariationSettings: `"wdth" 132, "wght" ${descriptionFontWeight}, "opsz" 28`,
            lineHeight: "112%",
            letterSpacing: descriptionLetterSpacing,
            color: "#F7F7F7",
            textAlign: "center",
          }}
        >
          Chronicle of growth from our initial 1972 foundry in Konya to an
          international pump manufacturing leader.
        </p>

        {/* ==================================
            ENGINEERING HERITAGE BADGE
        ================================== */}

        <div
          data-history-heritage
          className="relative flex flex-shrink-0 items-center text-left"
          style={{
            marginTop: badgeMarginTop,
            width: badgeWidth,
            minHeight: badgeMinHeight,
            padding: `${badgePaddingY} ${badgePaddingX}`,
            gap: badgeGap,
            borderRadius: badgeRadius,

            backgroundColor: "rgba(255,255,255,0.15)",

            border: "0.25px solid rgba(247,247,247,0.28)",

            backdropFilter: "blur(4.9px)",
            WebkitBackdropFilter: "blur(4.9px)",

            boxShadow: "0px 22px 28.9px 0px rgba(0,85,255,0.2)",

            transform: `scale(var(--history-heritage-scale, ${badgeScale}))`,
            transformOrigin: "center top",
          }}
        >
          {/* SEMPA ICON */}
          <img
            src="/history/sempa-icon.png"
            alt=""
            draggable={false}
            className="relative z-10 block shrink-0 select-none object-contain"
            style={{
              width: badgeIconWidth,
              height: badgeIconHeight,
              transform: `translate(var(--history-heritage-icon-x, ${badgeIconOffsetX}px), var(--history-heritage-icon-y, ${badgeIconOffsetY}px)) scale(${badgeIconScale})`,
              transformOrigin: "right center",
            }}
          />

          {/* BADGE TEXT */}
          <p
            className="relative z-10 m-0 min-w-0 flex-1 font-sans"
            style={{
              fontSize: badgeFontSize,
              fontWeight: badgeFontWeight,
              fontVariationSettings: `"wdth" 132, "wght" ${badgeFontWeight}, "opsz" 28`,
              lineHeight: "112%",
              letterSpacing: "-0.04em",
              color: "#9EB7D0",
              textAlign: "left",
            }}
          >
            SINCE 1972 •{" "}
            <strong
              style={{
                fontWeight: badgeBoldFontWeight,
                fontVariationSettings: `"wdth" 132, "wght" ${badgeBoldFontWeight}, "opsz" 28`,
                letterSpacing: "0em",
              }}
            >
              50+ YEARS OF ENGINEERING
            </strong>{" "}
            HERITAGE
          </p>
        </div>
      </div>

      {/* ======================================
          DESKTOP TIMELINE
      ====================================== */}

      {initialYear === null && <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-20
          hidden
          h-full
          min-[1200px]:block
        "
      >
        {HISTORY_POINTS.map((spot) => (
          <DesktopMilestone key={spot.id} spot={spot} />
        ))}
      </div>}

      {/* ======================================
          MOBILE TIMELINE
      ====================================== */}

      {initialYear === null ? <MobileTimeline /> : <HistoryTimeline key={initialYear} targetYear={initialYear} />}

      {/* ======================================
          HOTSPOT ANIMATIONS
      ====================================== */}

      <style>{`
        #history-page[data-history-scroll-scene="true"] [data-history-track] { transition: none; }
        #history-page[data-history-scroll-scene="true"] [data-history-card] { transition-property: filter, opacity; }
        @media (max-width: 767px) {
          /* Mobile pinning can leave a fractional-pixel seam at the join.
             Overlap the backgrounds while keeping the form at the same height. */
          [data-history-newsletter] { margin-top: -2px; padding-top: 6px; }
          .pin-spacer:has(> #history-page) { background-color: #24547a; }
        }
        @media (max-width: 1023px) {
          body:has(#history-page) .site-header__inner { padding: 24px 12px 0; max-width: none; }
          body:has(#history-page) .site-header__logos img { width: 94px; }
          body:has(#history-page) .site-header__logos > a:nth-child(2) { display: none; }
          body:has(#history-page) .site-header__inner > div:nth-child(2) { display: flex; gap: 10px; }
          body:has(#history-page) .site-header__inner > div:nth-child(2) > a { display: none; }
          body:has(#history-page) .site-header__inner > button:last-child { display: none; }
          body:has(#history-page) .site-header__inner > div:nth-child(2) > button { width: 44px; height: 44px; border-radius: 15px; }
          body:has(#history-page) .site-header__inner > div:nth-child(2) > button > span:first-child { display: none; }
          body:has(#history-page) .site-header__inner > div:nth-child(2) > button > span:last-child > span { background: #9eb7d0; }
          body:has(#history-page) .site-header__inner > div:nth-child(2) > div { width: 44px; height: 44px; }
          body:has(#history-page) .site-header__inner button[aria-label="Change language"] { width: 44px; height: 44px; padding: 0; justify-content: center; background: #ffffff15; border-color: #ffffff60; border-radius: 15px; }
          body:has(#history-page) .site-header__inner button[aria-label="Change language"] > span:first-child { display: none; }
          #history-page {
            margin-top: calc(-1 * var(--history-header-offset, 80px));
            --history-unit: 1px;
            --history-mobile-unit: min(1px, calc(100vw / 428));
            --history-card-gap: 20px;
          }
          #history-page > img:first-of-type {
            position: absolute; inset: 0; width: 100%; height: 100%;
            object-fit: cover; object-position: 50% bottom;
            transform: none !important;
          }
          #history-page[data-history-view="overview"] { min-height: max(100svh, calc(960 * var(--history-mobile-unit))) !important; }
          #history-page[data-history-view="detail"] { min-height: max(100svh, calc(1040 * var(--history-mobile-unit))) !important; }
          #history-page[data-history-view="overview"] > img:first-of-type { top: -35%; height: 135%; }
          #history-page[data-history-view="detail"] > img:first-of-type { top: -100%; height: 200%; object-position: 45% bottom; transform: translateX(var(--history-pan-x, 0%)) scale(1.12) !important; transform-origin: center bottom; }
          #history-page [data-history-heading] { top: calc(114 * var(--history-mobile-unit)) !important; align-items: flex-start; padding: 0 calc(36 * var(--history-mobile-unit)); text-align: left; }
          #history-page [data-history-heading] h1 { font-size: calc(52 * var(--history-mobile-unit)) !important; width: 100%; max-width: 520px; text-align: left !important; line-height: 1.04 !important; text-wrap: initial; }
          #history-page [data-history-heading] h1 { max-width: calc(360 * var(--history-mobile-unit)); }
          #history-page [data-history-heading] > p { display: none; }
          #history-page [data-history-heritage] { margin-top: calc(36 * var(--history-mobile-unit)) !important; width: calc(298 * var(--history-mobile-unit)) !important; min-height: calc(45 * var(--history-mobile-unit)) !important; transform: none !important; padding: 6px 12px !important; gap: 12px !important; }
          #history-page [data-history-heritage] > img { width: 38px !important; height: 26px !important; transform: scale(1.5) !important; }
          #history-page [data-history-heritage] > p { font-size: calc(13 * var(--history-mobile-unit)) !important; }
          #history-page [data-history-overview-mobile] { padding-top: calc(440 * var(--history-mobile-unit)); }
          #history-page [data-history-overview-slide] a { color: #f7f7f7; }
          #history-page [data-history-overview-slide] { height: calc(500 * var(--history-mobile-unit)); padding-left: calc(104 * var(--history-mobile-unit)); padding-right: 24px; }
          #history-page [data-history-overview-slide] a > div, #history-page [data-history-overview-slide] a > p { margin-left: 24px; }
          #history-page [data-history-overview-stem] { height: calc(270 * var(--history-mobile-unit)); }
          #history-page [data-history-overview-hotspot] { top: calc(285 * var(--history-mobile-unit)); }
          #history-page [data-history-detail] { width: 81%; padding-top: calc(380 * var(--history-mobile-unit)); padding-bottom: 100px; }
          #history-page [data-history-detail] > div:first-child { justify-content: center; height: 48px; }
          #history-page [data-history-detail] > div:first-child > a, #history-page [data-history-detail] > div:first-child > span { display: none; }
          #history-page [data-history-detail] button { width: 48px; height: 48px; }
          #history-page [data-history-detail] button svg { width: 44px; height: 44px; }
          #history-page [data-history-detail] > div:nth-child(2) { margin-top: calc(28 * var(--history-mobile-unit)); padding: 0; height: 420px; min-height: 0 !important; overflow: hidden; --history-card-gap: 20px !important; }
          #history-page [data-history-track] { grid-auto-columns: 100%; gap: 20px; }
          #history-page [data-history-card] { width: auto; height: clamp(320px, 46svh, 390px); transform: none !important; filter: none !important; opacity: 1 !important; }
          #history-page [data-history-card] > div:last-child { left: 32px; bottom: 55px; }
          #history-page [data-history-card] > span:nth-child(1) { left: 32px; bottom: 55px; }
          #history-page [data-history-card] > span:nth-child(2) { left: 32px; }
          #history-page [data-history-card] > div:nth-child(3) { padding-left: 56px; padding-right: 24px; }
          #history-page [data-history-card] h2 { font-weight: 410; }
        }
        @media (max-width: 767px) and (max-height: 740px) {
          #history-page [data-history-heading] { top: 90px !important; }
          #history-page [data-history-heading] h1 { font-size: calc(46 * var(--history-mobile-unit)) !important; }
          #history-page [data-history-heritage] { margin-top: 22px !important; }
          #history-page [data-history-detail] { padding-top: calc(320 * var(--history-mobile-unit)); }
          #history-page [data-history-card] { height: 310px; }
          #history-page [data-history-card] h2 { margin-top: 18px; font-size: 18px; }
          #history-page [data-history-card] h2 + p { margin-top: 14px; font-size: 11px; }
          #history-page [data-history-card] > div:last-child { bottom: 38px; }
          #history-page [data-history-card] > span:first-child { bottom: 38px; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          #history-page { --history-mobile-unit: 1px; }
          #history-page [data-history-heading] { left: 5%; padding-left: 0; }
          #history-page [data-history-heading] h1 { max-width: 600px; font-size: 64px !important; }
          #history-page[data-history-view="overview"] { min-height: 1180px !important; }
          #history-page [data-history-overview-mobile] { padding-top: 520px; }
          #history-page [data-history-overview-slide] { width: 50%; padding-left: 70px; }
          #history-page [data-history-detail] { width: 88%; padding-top: 480px; }
          #history-page [data-history-detail] > div:nth-child(2) { height: 490px; margin-top: 70px; }
          #history-page [data-history-track] { grid-auto-columns: calc((100% - 20px) / 2); }
          #history-page [data-history-card] { height: 430px; }
          #history-page[data-history-view="detail"] { min-height: 1250px !important; }
        }
        @media (min-width: 1024px) and (max-width: 1199px) {
          #history-page[data-history-view="overview"] { min-height: 1180px; }
          #history-page[data-history-view="overview"] > img:first-of-type {
            position: absolute; inset: auto 0 0; top: -35%; height: 135%; width: 100%;
            object-fit: cover; object-position: center bottom; transform: none !important;
          }
          #history-page [data-history-overview-mobile] { padding-top: 520px; }
          #history-page [data-history-overview-slide] { width: 50%; height: 500px; padding-left: 70px; padding-right: 24px; }
          #history-page [data-history-overview-slide] a { color: #f7f7f7; }
          #history-page [data-history-overview-slide] a > div, #history-page [data-history-overview-slide] a > p { margin-left: 24px; }
          #history-page [data-history-overview-stem] { height: 270px; }
          #history-page [data-history-overview-hotspot] { top: 285px; }
        }

        #history-page .history-hotspot-gradient-stroke {
          display: block;
          position: absolute;
          inset: 0;
          box-sizing: border-box;
          border-radius: 50%;
          padding: 2px;

          background: linear-gradient(
            135deg,
            var(--history-gradient-start, #005EFF) 0%,
            var(--history-gradient-end, #001EA2) 100%
          );

          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);

          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        @keyframes historyRingCycle {
          0%, 8%, 88%, 100% {
            transform: scale(1);
            opacity: 1;
          }

          23% {
            transform: scale(0.88);
            opacity: 0.45;
          }

          32%, 61% {
            transform: scale(0.72);
            opacity: 0;
          }

          73% {
            transform: scale(0.86);
            opacity: 0.35;
          }
        }

        @keyframes historyWhiteDiscCycle {
          0%, 12%, 88%, 100% {
            opacity: 0.95;
            transform: scale(1);
          }

          35%, 58% {
            opacity: 0.60;
            transform: scale(0.94);
          }
        }

        @keyframes historyGlowCycle {
          0%, 12%, 88%, 100% {
            opacity: 0.95;
            transform: scale(1);
          }

          35%, 58% {
            opacity: 0.12;
            transform: scale(0.75);
          }
        }

        #history-page .history-hotspot-ring {
          transform-origin: center center;

          animation-name: historyRingCycle;
          animation-duration:
            var(--history-duration, 3.1s);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          animation-delay:
            var(--history-delay, 0s);

          will-change: transform, opacity;
        }

        #history-page .history-hotspot-ring-middle {
          animation-delay:
            calc(var(--history-delay, 0s) + 0.10s);
        }

        #history-page .history-hotspot-ring-inner {
          animation-delay:
            calc(var(--history-delay, 0s) + 0.18s);
        }

        #history-page .history-hotspot-white-disc {
          transform-origin: center center;

          animation:
            historyWhiteDiscCycle
            var(--history-duration, 3.1s)
            ease-in-out infinite;

          animation-delay:
            var(--history-delay, 0s);
        }

        #history-page .history-hotspot-glow {
          transform-origin: center center;

          animation:
            historyGlowCycle
            var(--history-duration, 3.1s)
            ease-in-out infinite;

          animation-delay:
            var(--history-delay, 0s);
        }

        @media (prefers-reduced-motion: reduce) {
          #history-page .history-hotspot-ring,
          #history-page .history-hotspot-white-disc,
          #history-page .history-hotspot-glow {
            animation: none;
            opacity: 1;
            transform: none;
            will-change: auto;
          }
        }
      `}</style>
    </main>
    <div data-history-newsletter className="relative z-20 bg-[#123b53] px-5 pt-1 pb-28 md:px-10 md:pb-36" style={{ backgroundImage: "linear-gradient(180deg, #24547a 0%, #224e6d 25%, #153b52 60%, #092c40 100%)" }}>
      <NewsletterSubscription />
    </div>
    </>
  );
}
