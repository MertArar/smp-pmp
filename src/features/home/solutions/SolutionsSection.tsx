"use client";

import { useHomeCompact } from "../HomeMobileSections";

import HomeMediaVideo from "@/features/home/HomeMediaVideo";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pageWheelDelta, stopSmoothScroll } from "@/lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

// Figma reference: 1440 × 1024. The blur is deliberately kept at 25 CSS px:
// scaling it by viewport width would over-blur the image at 1920px.
const FIGMA_BLUR_PX = 25;
const REVEAL_SCROLL_SCREENS = 1.5;
const IMAGE_HOLD_SCROLL_SCREENS = 2;
// Minimum cover kadraj: görsel küçülür ama section dışında boşluk kalmaz.
const ARTWORK_ASPECT = 1561.19 / 871.31;
const ARTWORK_EXTRA_PX = 4;
const CAMERA_ZOOM_DESKTOP = 1.1;
const CAMERA_ZOOM_MOBILE = 1.06;

// Hotspot coordinates taken from the supplied illustration (699 × 418).
// Image and hotspots share one Figma-scaled stage, so they never drift apart.
const HOTSPOTS = [
  { id: 1, x: 85, y: 327, label: "Marine and coastal systems" },
  { id: 2, x: 226, y: 126, label: "Industrial facilities" },
  { id: 3, x: 257, y: 42, label: "Infrastructure systems" },
  { id: 4, x: 421, y: 69, label: "Energy and process plants" },
  { id: 5, x: 474, y: 236, label: "Fluid transfer networks" },
  { id: 6, x: 539, y: 320, label: "Urban water systems" },
  { id: 7, x: 607, y: 133, label: "Mountain installations" },
] as const;

function SolutionHotspots({ onSelect }: { onSelect: (id: number) => void }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div
      className="solutions-hotspots absolute inset-0 z-[25] opacity-0"
      aria-label="Solution areas"
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 699 418"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="solution-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E9F7FF" />
            <stop offset="0.52" stopColor="#A7E7FF" />
            <stop offset="1" stopColor="#1264E8" />
          </linearGradient>
        </defs>
        {HOTSPOTS.map((spot) => (
          <g
            key={spot.id}
            className={`solution-hotspot ${active === spot.id ? "is-active" : ""}`}
            transform={`translate(${spot.x} ${spot.y})`}
            onPointerEnter={() => setActive(spot.id)}
            onPointerLeave={() =>
              setActive((current) => (current === spot.id ? null : current))
            }
            onFocus={() => setActive(spot.id)}
            onBlur={() =>
              setActive((current) => (current === spot.id ? null : current))
            }
            tabIndex={0}
            role="button"
            aria-label={`${spot.label} detaylarını aç`}
            onClick={() => onSelect(spot.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(spot.id);
              }
            }}
          >
            <circle className="solution-hit" r="33" fill="transparent" />
            {/* Always-visible marker; hover rings are an additional layer. */}
            <g className="solution-marker" pointerEvents="none">
              <circle className="solution-marker-halo" r="25" />
              <circle className="solution-marker-outer" r="19" />
              <circle className="solution-marker-middle" r="16" />
              <circle className="solution-marker-core" r="12.5" />
            </g>
            <g className="solution-rings" pointerEvents="none">
              <circle className="solution-ring solution-ring-1" r="29" />
              <circle className="solution-ring solution-ring-2" r="32" />
              <circle className="solution-ring solution-ring-3" r="35" />
            </g>
          </g>
        ))}
      </svg>
      <style jsx>{`
        .solutions-hotspots {
          pointer-events: none;
        }
        .solutions-hotspots svg {
          pointer-events: none;
        }
        .solution-hotspot {
          cursor: pointer;
          outline: none;
          pointer-events: auto;
        }
        .solution-marker-halo {
          fill: #62caff;
          opacity: 0.19;
        }
        .solution-marker-outer {
          fill: #c9f2ff;
          stroke: #f3fcff;
          stroke-width: 1.1;
          filter: drop-shadow(0 1px 3px rgba(0, 61, 192, 0.35));
        }
        .solution-marker-middle {
          fill: #159df4;
          stroke: #7edfff;
          stroke-width: 1;
        }
        .solution-marker-core {
          fill: #064ce5;
          stroke: #d7f5ff;
          stroke-width: 1.2;
        }
        .solution-marker {
          transition: transform 0.3s ease;
          transform-box: fill-box;
          transform-origin: center;
        }
        .solution-hotspot.is-active .solution-marker {
          transform: scale(1.07);
        }
        .solution-rings {
          opacity: 0;
          transition: opacity 0.18s ease;
        }
        .solution-ring {
          fill: none;
          stroke: url(#solution-ring);
          stroke-width: 1.8;
          opacity: 0.92;
          transform-box: fill-box;
          transform-origin: center;
          filter: drop-shadow(0 0 1.5px rgba(218, 247, 255, 0.85));
        }
        .solution-hotspot.is-active .solution-rings {
          opacity: 1;
        }
        .solution-hotspot.is-active .solution-ring-1 {
          animation: solution-pulse 1.85s ease-out infinite;
        }
        .solution-hotspot.is-active .solution-ring-2 {
          animation: solution-pulse 1.85s ease-out 0.35s infinite;
        }
        .solution-hotspot.is-active .solution-ring-3 {
          animation: solution-pulse 1.85s ease-out 0.7s infinite;
        }
        @keyframes solution-pulse {
          0% {
            transform: scale(0.84);
            opacity: 0;
            stroke-width: 2.4;
          }
          22% {
            opacity: 0.96;
          }
          70% {
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
            stroke-width: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .solution-hotspot.is-active .solution-ring {
            animation: none;
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
}

type SolutionsProps = {
  variant?: "home" | "catalog";
  assetBase?: string;
  children?: ReactNode;
  mobileHome?: boolean;
};
function SolutionsScene({
  variant = "home",
  assetBase = "/home/solution",
  children,
  mobileHome = false,
}: SolutionsProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const catalogPanRef = useRef<HTMLDivElement>(null);
  const cameraTweenRef = useRef<gsap.core.Tween | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);

  useEffect(() => {
    if (selectedHotspot === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedHotspot(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedHotspot]);

  // Zoom and pan the illustration and all seven hotspots as a single scene.
  // A second selection retargets the current tween instead of snapping back.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const artwork = artworkRef.current;
    const panel = panelRef.current;
    if (!section || !artwork) return;

    const updateCamera = (animate: boolean) => {
      const viewWidth = section.clientWidth;
      const viewHeight = section.clientHeight;
      if (!viewWidth || !viewHeight) return;

      // Zoom yokken dahi arka plan daima section'ı tam kaplar.
      // Böylece daha geniş kadraj mümkün olan en küçük "cover" ölçüsüne iner.
      const coverWidth =
        Math.max(viewWidth, viewHeight * ARTWORK_ASPECT) + ARTWORK_EXTRA_PX;
      artwork.style.width = `${coverWidth}px`;

      const artworkWidth = coverWidth;
      const artworkHeight = coverWidth / ARTWORK_ASPECT;
      const spot = HOTSPOTS.find((item) => item.id === selectedHotspot);
      const isMobile = viewWidth < (mobileHome ? 1024 : 768);
      const scale = spot
        ? isMobile
          ? CAMERA_ZOOM_MOBILE
          : CAMERA_ZOOM_DESKTOP
        : 1;

      const panelOnLeft = !!spot && spot.x / 699 > 0.56 && !isMobile;
      const focusX = isMobile ? 0.5 : panelOnLeft ? 0.7 : 0.3;
      const focusY = isMobile ? 0.51 : 0.49;

      const desiredX = spot
        ? viewWidth * (focusX - 0.5) -
          (spot.x / 699 - 0.5) * artworkWidth * scale
        : 0;
      const desiredY = spot
        ? viewHeight * (focusY - 0.5) -
          (spot.y / 418 - 0.5) * artworkHeight * scale
        : 0;

      // Görselin kenarları viewport'un içine giremez: hiçbir noktada
      // soldan/sağdan/üstten/alttan arka plan rengi açığa çıkmaz.
      const limit = (
        offset: number,
        scaledSize: number,
        viewportSize: number,
      ) => {
        const maxOffset = Math.max(0, (scaledSize - viewportSize) / 2);
        return gsap.utils.clamp(-maxOffset, maxOffset, offset);
      };

      const targetX = limit(desiredX, artworkWidth * scale, viewWidth);
      const targetY = limit(desiredY, artworkHeight * scale, viewHeight);

      // Geçişin ARA karelerini de sınırla: sadece başlangıç ve bitiş
      // kontrol edilirse nokta değişiminde anlık boşluk görülebilir.
      if (variant === "catalog" && isMobile) {
        cameraTweenRef.current?.kill();
        gsap.set(artwork, { x: 0, y: 0, scale: 1 });
        const pan = catalogPanRef.current;
        if (pan) {
          if (spot) {
            pan.scrollTo({
              left: (spot.x / 699) * artworkWidth - viewWidth / 2,
              behavior:
                animate &&
                !matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "smooth"
                  : "instant",
            });
          } else if (!pan.dataset.positioned) {
            pan.scrollLeft = (artworkWidth - viewWidth) / 2;
            pan.dataset.positioned = "true";
          }
        }
      } else {
        if (variant === "catalog" && catalogPanRef.current) {
          catalogPanRef.current.scrollLeft = 0;
          delete catalogPanRef.current.dataset.positioned;
        }
        cameraTweenRef.current?.kill();
        const motion = {
          x: Number(gsap.getProperty(artwork, "x")) || 0,
          y: Number(gsap.getProperty(artwork, "y")) || 0,
          scale: Number(gsap.getProperty(artwork, "scale")) || 1,
        };
        const applyCamera = () => {
          const safeX = limit(motion.x, artworkWidth * motion.scale, viewWidth);
          const safeY = limit(
            motion.y,
            artworkHeight * motion.scale,
            viewHeight,
          );
          gsap.set(artwork, {
            x: safeX,
            y: safeY,
            scale: motion.scale,
            transformOrigin: "center center",
          });
        };
        cameraTweenRef.current = gsap.to(motion, {
          x: targetX,
          y: targetY,
          scale,
          duration: animate ? 0.95 : 0,
          ease: "power2.inOut",
          onUpdate: applyCamera,
          onComplete: applyCamera,
        });
      }

      if (panel && spot) {
        const panelZoom =
          variant === "catalog"
            ? Math.min(
                1,
                (viewHeight - 32) / panel.offsetHeight,
                (viewWidth - 32) / panel.offsetWidth,
              )
            : 1;
        panel.style.zoom = String(panelZoom);
        const panelWidth = panel.offsetWidth * panelZoom;
        const panelHeight = panel.offsetHeight * panelZoom;
        const gap = 28;
        // Kart viewport içinde kalır; noktanın yanında uygun tarafa konur.
        const pointX = viewWidth * focusX;
        const pointY = viewHeight * focusY;
        const left = isMobile
          ? (viewWidth - panelWidth) / 2
          : panelOnLeft
            ? pointX - gap - panelWidth
            : pointX + gap;
        const top = pointY - panelHeight * (isMobile ? 0.55 : 0.48);
        const safeLeft = gsap.utils.clamp(
          12,
          Math.max(12, viewWidth - panelWidth - 12),
          left,
        );
        const safeTop = gsap.utils.clamp(
          12,
          Math.max(12, viewHeight - panelHeight - 12),
          top,
        );
        gsap.to(panel, {
          left: safeLeft / panelZoom,
          top: safeTop / panelZoom,
          duration: animate ? 0.85 : 0,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    };

    updateCamera(true);
    const handleResize = () => updateCamera(false);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cameraTweenRef.current?.kill();
    };
  }, [selectedHotspot, variant, mobileHome]);

  useLayoutEffect(() => {
    if (variant === "catalog") return;
    const section = sectionRef.current;
    const content = contentRef.current;
    const blur = blurRef.current;
    const gradient = gradientRef.current;
    const fog = fogRef.current;
    if (!section || !content || !blur || !gradient || !fog) return;
    let introTween: gsap.core.Tween | null = null;
    let trigger: ScrollTrigger | undefined;
    let hasEntered = false;
    let waitingForNewGesture = false;
    let titleReadyAt = 0;
    let lastWheelAt = 0;
    let touchStartY = 0;
    let freshTouch = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = () =>
      window.matchMedia("(max-width: 1023px)").matches;
    const stopAtTitle = () => {
      if (compactViewport()) return;
      if (!trigger || hasEntered) return;
      stopSmoothScroll();
      hasEntered = true;
      waitingForNewGesture = true;
      titleReadyAt = performance.now() + 450;
      lastWheelAt = performance.now();
      introTween?.kill();
      introTween = null;
      window.scrollTo({ top: Math.ceil(trigger.start), behavior: "instant" });
    };
    const finishIntro = (open: boolean) => {
      if (!trigger || introTween) return;
      const destination = Math.ceil(
        trigger.start + (open ? window.innerHeight * REVEAL_SCROLL_SCREENS : 0),
      );
      if (reduced.matches) {
        window.scrollTo({ top: destination, behavior: "instant" });
        return;
      }
      const motion = { y: window.scrollY };
      introTween = gsap.to(motion, {
        y: destination,
        duration: 0.85,
        ease: "power2.inOut",
        onUpdate: () => window.scrollTo({ top: motion.y, behavior: "instant" }),
        onComplete: () => {
          introTween = null;
        },
      });
    };
    const onWheel = (event: WheelEvent) => {
      if (compactViewport()) return;
      const delta = pageWheelDelta(event);
      if (!trigger || !delta) return;
      const start = trigger.start;
      if (window.scrollY < start - 2 && !introTween) {
        hasEntered = false;
        waitingForNewGesture = false;
      }
      const end = start + window.innerHeight * REVEAL_SCROLL_SCREENS;
      const now = performance.now();
      const gap = event.timeStamp - lastWheelAt;
      lastWheelAt = event.timeStamp;
      // Stop the arriving gesture at the complete heading, even on a large wheel step.
      if (
        !hasEntered &&
        event.deltaY > 0 &&
        window.scrollY <= start + 1 &&
        window.scrollY + delta >= start
      ) {
        event.preventDefault();
        stopAtTitle();
        return;
      }
      if (waitingForNewGesture) {
        if (event.deltaY < 0) {
          waitingForNewGesture = false;
          return;
        }
        event.preventDefault();
        if (now >= titleReadyAt && gap >= 240) {
          waitingForNewGesture = false;
          finishIntro(true);
        }
        return;
      }
      if (introTween) {
        event.preventDefault();
        return;
      }
      if (window.scrollY >= start - 1 && window.scrollY < end - 1) {
        if (event.deltaY > 0 || window.scrollY > start + 1) {
          event.preventDefault();
          finishIntro(event.deltaY > 0);
        }
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      freshTouch = waitingForNewGesture && performance.now() >= titleReadyAt;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (compactViewport()) return;
      if (event.touches.length !== 1) return;
      if (waitingForNewGesture) {
        const delta = touchStartY - event.touches[0].clientY;
        if (delta < -6) {
          waitingForNewGesture = false;
          return;
        }
        event.preventDefault();
        if (freshTouch && delta > 6) {
          waitingForNewGesture = false;
          finishIntro(true);
        }
        return;
      }
      if (introTween && event.touches.length === 1) event.preventDefault();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (compactViewport()) return;
      if (
        !trigger ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.target as HTMLElement).closest(
          "a,button,input,textarea,select,[contenteditable='true']",
        )
      )
        return;
      const down =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey);
      if (!down) return;
      const step = event.key === "ArrowDown" ? 40 : innerHeight;
      if (
        !hasEntered &&
        scrollY < trigger.start &&
        scrollY + step >= trigger.start
      ) {
        event.preventDefault();
        stopAtTitle();
        return;
      }
      if (waitingForNewGesture) {
        event.preventDefault();
        if (!event.repeat && performance.now() >= titleReadyAt) {
          waitingForNewGesture = false;
          finishIntro(true);
        }
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      // Allow a new mouse/scrollbar interaction after the title has settled.
      if (
        event.pointerType === "mouse" &&
        waitingForNewGesture &&
        performance.now() >= titleReadyAt
      )
        waitingForNewGesture = false;
    };
    const onPageScroll = () => {
      // At progress zero ScrollTrigger need not emit onLeaveBack again.
      if (trigger && !introTween && window.scrollY < trigger.start - 2) {
        hasEntered = false;
        waitingForNewGesture = false;
      }
    };

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () =>
            `+=${window.innerHeight * (REVEAL_SCROLL_SCREENS + IMAGE_HOLD_SCROLL_SCREENS)}`,
          pin: true,
          pinSpacing: true,
          scrub: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? true
            : 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: (self) => {
            trigger = self;
            stopAtTitle();
          },
          onEnterBack: () => {
            if (!waitingForNewGesture) hasEntered = true;
          },
          onLeaveBack: (self) => {
            // Returning to progress zero is still the heading, not an exit.
            if (self.scroll() < self.start - 2) {
              hasEntered = false;
              waitingForNewGesture = false;
            }
          },
          onUpdate: (self) => {
            trigger = self;
            if (compactViewport()) return;
            if (
              !hasEntered &&
              self.direction > 0 &&
              self.scroll() >= self.start
            )
              stopAtTitle();
            if (waitingForNewGesture) {
              if (self.scroll() > self.start + 1)
                window.scrollTo({
                  top: Math.ceil(self.start),
                  behavior: "instant",
                });
              return;
            }
            const introEnd =
              self.start + window.innerHeight * REVEAL_SCROLL_SCREENS;
            // Keyboard, scrollbar and touch input complete the same reveal too.
            if (
              !introTween &&
              self.scroll() > self.start + 1 &&
              self.scroll() < introEnd - 1
            )
              finishIntro(self.direction > 0);
          },
        },
      });
      trigger = timeline.scrollTrigger;

      // First 1.5 screen-heights reveal the original image.
      timeline.to(
        content,
        {
          y: () => -window.innerHeight * 0.65,
          opacity: 0,
          duration: REVEAL_SCROLL_SCREENS,
          pointerEvents: "none",
        },
        0,
      );
      timeline.to(
        blur,
        {
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
          duration: REVEAL_SCROLL_SCREENS,
        },
        0,
      );
      timeline.to(gradient, { opacity: 0, duration: REVEAL_SCROLL_SCREENS }, 0);

      // Make hotspots available as the image finishes clearing.
      const hotspots = section.querySelector<HTMLElement>(
        ".solutions-hotspots",
      );
      if (hotspots) {
        timeline.fromTo(
          hotspots,
          { opacity: 0 },
          { opacity: 1, duration: 0.28, ease: "none" },
          REVEAL_SCROLL_SCREENS - 0.28,
        );
      }

      // Keep the shortened two-screen map interaction window.
      timeline.to({}, { duration: IMAGE_HOLD_SCROLL_SCREENS });
      // The narrow mist meets Factory's background exactly at the shared edge.
      timeline.fromTo(
        fog,
        { opacity: 0 },
        {
          opacity: 0.25,
          duration: 0.3,
          ease: "none",
        },
        REVEAL_SCROLL_SCREENS - 0.3,
      );
      timeline.to(
        fog,
        {
          opacity: 1,
          duration: IMAGE_HOLD_SCROLL_SCREENS,
          ease: "sine.inOut",
        },
        REVEAL_SCROLL_SCREENS,
      );
    }, section);

    window.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });
    window.addEventListener("scroll", onPageScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("scroll", onPageScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
      introTween?.kill();
      context.revert();
    };
  }, [variant]);

  const panelAnimation = (
    <style jsx>{`
      .solution-detail-panel {
        animation: solution-panel-in 0.42s cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }
      @keyframes solution-panel-in {
        from {
          opacity: 0;
          transform: translate3d(0, 18px, 0) scale(0.975);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .solution-detail-panel {
          animation: none;
        }
      }
    `}</style>
  );

  const detailPanel =
    selectedHotspot !== null ? (
      <div
        className="absolute inset-0 z-[60] pointer-events-none"
        aria-live="polite"
      >
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Wastewater Management"
          ref={panelRef}
          className="solution-detail-panel pointer-events-auto absolute left-[52%] top-[10%] flex w-[min(490px,calc(100vw-32px))] flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_30px_90px_rgba(13,40,77,0.19)] max-md:rounded-[22px]"
        >
          <div
            className="relative flex h-[143px] shrink-0 items-center gap-[28px] overflow-hidden px-[37px] max-md:h-[115px] max-md:gap-5 max-md:px-6"
            style={{
              background:
                "radial-gradient(ellipse at 24% -30%,rgba(255,255,255,0.84),transparent 63%),linear-gradient(115deg,rgba(184,204,227,0.84) 0%,rgba(204,221,239,0.66) 47%,rgba(162,197,231,0.73) 100%)",
              backdropFilter: "blur(34px) saturate(170%)",
              WebkitBackdropFilter: "blur(34px) saturate(170%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.86),inset 0 -1px 0 rgba(255,255,255,0.27)",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(165deg,rgba(255,255,255,0.38) 0%,transparent 42%,rgba(110,157,207,0.12) 100%)",
              }}
            />
            <div className="relative h-[67px] w-[67px] shrink-0 max-md:h-[56px] max-md:w-[56px]">
              <Image
                src={`${assetBase}/atik-su.gif`}
                alt="Wastewater Management icon"
                fill
                unoptimized
                className="object-contain"
                sizes="67px"
              />
            </div>
            <h2
              className="relative m-0 max-w-[290px] text-[34px] leading-[1.03] tracking-[-0.025em] text-white max-md:text-[27px]"
              style={{
                fontFamily:
                  "var(--font-sf-pro), -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 290,
                fontVariationSettings: '"wght" 290',
                fontSynthesis: "none",
              }}
            >
              Wastewater
              <br />
              Management
            </h2>
            <button
              type="button"
              onClick={() => setSelectedHotspot(null)}
              aria-label="Kartı kapat"
              className="absolute right-[25px] top-[25px] z-10 flex h-8 w-8 cursor-pointer items-center justify-center text-black transition-transform duration-200 hover:scale-110 max-md:right-4 max-md:top-4"
            >
              <svg
                viewBox="0 0 32 32"
                width="30"
                height="30"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 5 27 27M27 5 5 27"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="grid h-[334px] grid-cols-2 max-md:h-[280px]">
            <div className="group relative min-w-0 overflow-hidden border-r border-[#e8eff5] bg-white">
              <Image
                src={`${assetBase}/02.webp`}
                alt="DPT pump"
                fill
                sizes="(max-width:768px) 50vw,245px"
                className="object-contain p-[14px] transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[43%] translate-y-4 items-center justify-center bg-[linear-gradient(180deg,rgba(217,230,241,0.46),rgba(107,128,148,0.52))] opacity-0 backdrop-blur-[22px] backdrop-saturate-150 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <span
                  className="text-[42px] font-normal tracking-[-0.04em] text-white drop-shadow-[0_2px_12px_rgba(31,45,67,0.2)]"
                  style={{
                    fontFamily: "var(--font-sf-pro), Arial, sans-serif",
                  }}
                >
                  DPT
                </span>
              </div>
            </div>
            <div className="group relative min-w-0 overflow-hidden bg-white">
              <Image
                src={`${assetBase}/03.png`}
                alt="Blue centrifugal pump"
                fill
                sizes="(max-width:768px) 50vw,245px"
                className="object-contain p-[14px] transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[43%] translate-y-4 items-center justify-center bg-[linear-gradient(180deg,rgba(217,230,241,0.46),rgba(107,128,148,0.52))] opacity-0 backdrop-blur-[22px] backdrop-saturate-150 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <span
                  className="text-[42px] font-normal tracking-[-0.04em] text-white drop-shadow-[0_2px_12px_rgba(31,45,67,0.2)]"
                  style={{
                    fontFamily: "var(--font-sf-pro), Arial, sans-serif",
                  }}
                >
                  DPT-DI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  // Reuse the Home illustration, camera aspect and exact hotspot coordinates in
  // a contained catalog view, without installing Home's full-screen scroll scene.
  if (variant === "catalog") {
    return (
      <div
        ref={(element) => {
          sectionRef.current = element;
        }}
        data-solutions-catalog
        className="relative isolate aspect-[1561.19/871.31] w-full overflow-hidden rounded-[30px] bg-[#e0eff9] max-md:aspect-auto max-md:h-[clamp(540px,150vw,720px)] max-sm:rounded-[20px] [&_.solutions-hotspots]:opacity-100"
      >
        <div
          ref={catalogPanRef}
          data-map-pan
          className={`absolute inset-0 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${mobileHome ? "" : "md:pointer-events-none md:flex md:items-center md:justify-center md:overflow-hidden"}`}
        >
          <div
            ref={artworkRef}
            className="pointer-events-auto relative shrink-0 will-change-transform"
            style={{ width: "100%", aspectRatio: "1561.19 / 871.31" }}
          >
            <Image
              src={`${assetBase}/solutions.webp`}
              alt="Industrial pumping solutions"
              fill
              sizes="(min-width:1800px) 1520px, 92vw"
              className="object-fill"
            />
            <SolutionHotspots onSelect={setSelectedHotspot} />
          </div>
        </div>
        {children}
        {mobileHome && (
          <div
            aria-label="Choose a solution area"
            className="absolute inset-x-0 bottom-0 z-40 flex gap-2 overflow-x-auto bg-white/80 p-3 backdrop-blur-md [scrollbar-width:none]"
          >
            {HOTSPOTS.map((spot) => (
              <button
                type="button"
                key={spot.id}
                onClick={() => setSelectedHotspot(spot.id)}
                aria-pressed={selectedHotspot === spot.id}
                className="shrink-0 rounded-full border border-[#9eb7d080] bg-white px-3 py-2 text-xs text-[#0d5792]"
              >
                {spot.label}
              </button>
            ))}
          </div>
        )}
        <span className="pointer-events-none absolute top-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-3 py-2 text-[11px] text-[#0d5792] shadow-sm md:hidden">
          &larr; Swipe to explore &rarr;
        </span>
        {detailPanel}
        {panelAnimation}
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative isolate h-[100svh] min-h-[650px] w-full overflow-hidden bg-[#0E2D42]"
    >
      {/* Merkezleme ayrı katmanda: GSAP yalnızca iç görselin x/y/scale değerlerini değiştirir. */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div
          ref={artworkRef}
          className="pointer-events-auto relative shrink-0 will-change-transform"
          style={{
            width: "max(calc(100vw + 4px), calc(100svh * 1.7917 + 4px))",
            aspectRatio: "1561.19 / 871.31",
          }}
        >
          <Image
            src="/home/solution/solutions.webp"
            alt="Industrial pumping solutions"
            fill
            priority={false}
            sizes="(min-width: 1440px) 109vw, 109vw"
            quality={90}
            className="object-fill"
          />
          <SolutionHotspots onSelect={setSelectedHotspot} />
        </div>
      </div>

      {/* Upper-edge #0E2D42 gradient; the original 25px blur stays intact. */}
      <div
        ref={gradientRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,45,66,0.38) 0%, rgba(14,45,66,0.17) 20%, rgba(14,45,66,0.05) 42%, rgba(14,45,66,0) 60%)",
        }}
      />

      <div
        ref={blurRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          backdropFilter: `blur(${FIGMA_BLUR_PX}px)`,
          WebkitBackdropFilter: `blur(${FIGMA_BLUR_PX}px)`,
        }}
      />

      <div
        ref={contentRef}
        className="relative z-30 flex h-full w-full flex-col items-center justify-center px-6"
      >
        <h1
          className="m-0 text-center text-[#F7F7F7]"
          style={{
            width: "1056px",
            maxWidth: "100%",
            fontFamily: "var(--font-sf-pro)",
            fontSize: "clamp(36px, 3.472vw, 66.67px)",
            fontWeight: 350,
            fontVariationSettings: '"wght" 350, "wdth" 125, "opsz" 28',
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontSynthesis: "none",
          }}
        >
          High-Performance Pumping
          <br />
          Solutions for Global Industries
        </h1>

        <p
          className="m-0 mt-[20px] text-center text-[#F7F7F7]"
          style={{
            width: "969.33px",
            maxWidth: "100%",
            fontFamily: "var(--font-sf-pro)",
            fontSize: "clamp(14px, 1.042vw, 20px)",
            fontWeight: 220,
            fontVariationSettings: '"wght" 220, "wdth" 125, "opsz" 20',
            lineHeight: 1.07,
            letterSpacing: "-0.02em",
            fontSynthesis: "none",
          }}
        >
          Sempa Pompa delivers advanced engineering and innovative fluid
          transfer technologies tailored to the unique demands of diverse
          sectors.
        </p>

        <div
          className="relative mt-[32px] shrink-0"
          style={{
            width: "133.33px",
            height: "133.33px",
            borderRadius: "53.33px",
            border: "1.33px solid transparent",
            background:
              "linear-gradient(180deg, #005EFF 0%, #001EA2 100%) padding-box, linear-gradient(180deg, #9ABFFF 0%, #001EA2 100%) border-box",
            boxShadow: "inset 0 0 5.33px 0 #6DB7E0",
          }}
        >
          <span
            className="absolute block text-center text-[#F7F7F7]"
            style={{
              top: "26.67px",
              left: "23.11px",
              width: "83.56px",
              height: "58.67px",
              fontFamily: "var(--font-sf-pro)",
              fontSize: "13.33px",
              fontWeight: 380,
              fontVariationSettings: '"wght" 380, "wdth" 125, "opsz" 13',
              lineHeight: 1.07,
              letterSpacing: "-0.05em",
              fontSynthesis: "none",
            }}
          >
            EXPLORE OUR SOLUTION AREAS
          </span>
          <HomeMediaVideo
            src="/home/solution/scroll-down.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="pointer-events-none absolute mix-blend-screen"
            style={{
              top: "85.33px",
              left: "47.11px",
              width: "39.11px",
              height: "39.11px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      {/* Mist stays on the shared bottom edge, independently of map zoom. */}
      <div
        ref={fogRef}
        aria-hidden="true"
        className="solutions-bottom-fog pointer-events-none absolute inset-x-0 bottom-0 z-30"
        style={{
          height: "clamp(90px, 18svh, 190px)",
          opacity: 0,
          background:
            "linear-gradient(to bottom, rgba(224,239,249,0), rgba(224,239,249,0.2) 40%, rgba(224,239,249,0.65) 75%, #E0EFF9 100%)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          maskImage: "linear-gradient(to bottom, transparent, black 55%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 55%)",
        }}
      />

      {detailPanel}

      {panelAnimation}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40"
        style={{ boxShadow: "inset 0 0 0 0.2px #FFFFFF" }}
      />
    </section>
  );
}

export default function SolutionsSection(props: SolutionsProps = {}) {
  const compact = useHomeCompact();
  if (compact && (!props.variant || props.variant === "home"))
    return (
      <section
        id="solutions"
        data-home-mobile-solutions
        className="relative bg-linear-to-b from-[#123849] to-[#e0eff9] px-4 pb-10 pt-14 text-white"
      >
        <div className="mx-auto max-w-[760px]">
          <h2
            className="mx-auto max-w-xl text-center text-[clamp(28px,6.8vw,44px)] leading-[1.04] tracking-[-.04em]"
            style={{ fontVariationSettings: '"wght" 350,"wdth" 125' }}
          >
            High-Performance Pumping Solutions for Global Industries
          </h2>
          <p className="mx-auto mb-8 mt-5 max-w-xl text-center text-base leading-[1.2] text-[#e0eff9]">
            Sempa Pompa delivers advanced engineering and innovative fluid
            transfer technologies tailored to the unique demands of diverse
            sectors.
          </p>
          <div className="[&_[data-solutions-catalog]]:h-[520px]! [&_[data-solutions-catalog]]:min-h-0 [&_[data-solutions-catalog]]:shadow-[0_18px_50px_#0d579225] md:[&_[data-solutions-catalog]]:h-[620px]!">
            <SolutionsScene {...props} variant="catalog" mobileHome />
          </div>
        </div>
      </section>
    );
  return <SolutionsScene {...props} />;
}
