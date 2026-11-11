"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

type ScatterController = {
  scatter: () => void;
  restore: () => void;
};

type Pose = {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotation: number;
};

// The reference keeps each UI block intact, floating on its own plane.
// Only the outer blocks move; their letter and hover timelines keep running.
export function useHeroScatter(
  sectionRef: RefObject<HTMLElement | null>,
  blastRef: { current: boolean },
) {
  const controllerRef = useRef<ScatterController | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const header = document.querySelector<HTMLElement>(".site-header");
    const setHeaderBlast = (active: boolean) =>
      header?.toggleAttribute("data-hero-blasting", active);
    let context: gsap.Context | null = null;
    let timelines: gsap.core.Timeline[] = [];
    let restoreTween: gsap.core.Tween | null = null;
    let scattered = false;
    let resizeFrame = 0;

    const getPieces = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "[data-hero-scatter]",
        ),
      ).filter(
        (element) =>
          (section.contains(element) || element.closest(".site-header")) &&
          element.getClientRects().length > 0 &&
          element.offsetWidth > 0 &&
          element.offsetHeight > 0,
      );

    const stopTimelines = () => {
      timelines.forEach((timeline) => timeline.kill());
      timelines = [];
      restoreTween?.kill();
      restoreTween = null;
    };

    const reset = () => {
      stopTimelines();
      context?.revert();
      context = null;
    };

    const scatter = (currentPoses?: Map<HTMLElement, Pose>) => {
      if (scattered) return;
      scattered = true;
      // The named header controls have a dedicated CSS exit, independent of
      // the decorative GSAP orbit and the user's motion preference.
      setHeaderBlast(true);
      if (motionQuery.matches) return;
      // Keep the current transforms when a returning animation is interrupted.
      stopTimelines();
      const pieces = getPieces();
      const width = section.clientWidth;
      const height = Math.min(section.clientHeight, window.innerHeight);
      const compact = width < 768;
      const motionScale = compact ? 0.55 : 1;

      if (!context) context = gsap.context(() => {}, section);
      context.add(() => {
        pieces.forEach((element, index) => {
          const role = element.dataset.heroScatter;
          const rect = element.getBoundingClientRect();
          const side = rect.left + rect.width / 2 < width / 2 ? 1 : -1;
          const alternate = index % 2 ? -1 : 1;
          const isHeader = role === "header";
          const isLogo = role === "logo";
          const isCue = role === "cue";
          const pieceMotionScale = isHeader ? 1 : motionScale;

          let base: Pose;
          if (isLogo) {
            // Give the Sempa logo its own orbit, inset from the hero edges.
            base = {
              x: 36 + width * 0.07,
              y: 36 + height * 0.07,
              z: 0,
              rotationX: -6,
              rotationY: 8,
              rotation: 0,
            };
          } else if (role === "heading") {
            base = {
              x: width * 0.025,
              y: -height * 0.045,
              z: 95,
              rotationX: -12,
              rotationY: -17,
              rotation: -8,
            };
          } else if (role === "links") {
            base = {
              x: -width * 0.012,
              y: height * 0.035,
              z: 55,
              rotationX: 14,
              rotationY: -12,
              rotation: -11,
            };
          } else if (isHeader) {
            // Center this orbit beyond the top edge so controls spend the
            // held state offscreen, rather than repeatedly floating back in.
            const headerBottom = Math.max(
              0,
              element.closest(".site-header")?.getBoundingClientRect().bottom ?? 0,
            );
            const exitDistance = Math.max(
              height * 0.38,
              headerBottom +
                Math.hypot(element.offsetWidth, element.offsetHeight) +
                height * 0.08,
            );
            base = {
              x: -side * width * (0.28 + (index % 3) * 0.055),
              y: -exitDistance,
              z: -70 + (index % 3) * 55,
              rotationX: alternate * 17,
              rotationY: side * 24,
              rotation: alternate * 13,
            };
          } else if (isCue) {
            base = {
              x: width * 0.008,
              y: -height * 0.01,
              z: 12,
              rotationX: 6,
              rotationY: -8,
              rotation: -4,
            };
          } else {
            base = {
              x: side * width * 0.018,
              y: -height * (role === "info-label" ? 0.065 : 0.015),
              z: role === "info-label" ? -45 : 65,
              rotationX: alternate * 13,
              rotationY: side * 22,
              rotation: role === "info-label" ? -14 : 10,
            };
          }

          const pose = (phase: number): Pose => {
            const wave = Math.sin(phase + index * 0.72);
            const sway = Math.cos(phase + index * 0.53);
            const strength = isCue ? 0.22 : isLogo ? 0.45 : 1;
            const horizontalDrift = isHeader ? 0.1 : 0.045;
            const verticalDrift = isHeader ? 0.1 : 0.065;
            return {
              x:
                (base.x + wave * width * horizontalDrift * strength) *
                pieceMotionScale,
              y:
                (base.y + sway * height * verticalDrift * strength) *
                pieceMotionScale,
              z: (base.z + wave * 130 * strength) * pieceMotionScale,
              rotationX:
                (base.rotationX + sway * 17 * strength) * pieceMotionScale,
              rotationY:
                (base.rotationY + wave * 23 * strength) * pieceMotionScale,
              rotation:
                (base.rotation + wave * (isHeader ? 38 : 15) * strength) *
                pieceMotionScale,
            };
          };

          gsap.set(element, {
            transformPerspective: compact ? 850 : 1100,
            transformOrigin: "50% 50%",
            willChange: "transform",
            force3D: true,
            ...currentPoses?.get(element),
          });

          const timeline = gsap.timeline({ delay: 0.12 + (index % 4) * 0.035 });
          timeline.to(element, {
            ...pose(0),
            duration: isHeader ? 0.85 : 1.35,
            ease: "power3.out",
          });
          const drift = gsap.timeline({ repeat: -1 });
          // A closed orbit avoids a jump when the long, weightless drift repeats.
          [Math.PI / 2, Math.PI, Math.PI * 1.5, Math.PI * 2].forEach((phase) => {
            drift.to(element, {
              ...pose(phase),
              duration: 2.6 + (index % 3) * 0.22,
              ease: "sine.inOut",
            });
          });
          timeline.add(drift);
          timelines.push(timeline);
        });
      });
    };

    const restore = () => {
      setHeaderBlast(false);
      if (!scattered) return;
      scattered = false;
      stopTimelines();
      const activeContext = context;
      if (!activeContext) return;
      activeContext.add(() => {
        restoreTween = gsap.to(getPieces(), {
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          rotation: 0,
          duration: motionQuery.matches ? 0 : 1.05,
          ease: "power3.inOut",
          onComplete: reset,
        });
      });
    };

    const resize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!scattered) return;
        const currentPoses = new Map<HTMLElement, Pose>();
        getPieces().forEach((element) => {
          currentPoses.set(element, {
            x: Number(gsap.getProperty(element, "x")),
            y: Number(gsap.getProperty(element, "y")),
            z: Number(gsap.getProperty(element, "z")),
            rotationX: Number(gsap.getProperty(element, "rotationX")),
            rotationY: Number(gsap.getProperty(element, "rotationY")),
            rotation: Number(gsap.getProperty(element, "rotation")),
          });
        });
        reset();
        scattered = false;
        scatter(currentPoses);
      });
    };
    const motionChange = () => {
      reset();
      scattered = false;
      if (blastRef.current) scatter();
      else setHeaderBlast(false);
    };

    controllerRef.current = { scatter, restore };
    // Fast Refresh preserves the held pump state while re-running effects.
    if (blastRef.current) scatter();
    window.addEventListener("resize", resize);
    motionQuery.addEventListener("change", motionChange);

    return () => {
      controllerRef.current = null;
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", motionChange);
      setHeaderBlast(false);
      reset();
    };
  }, [sectionRef, blastRef]);

  return controllerRef;
}
