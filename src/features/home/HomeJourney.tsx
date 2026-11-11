"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import dynamic from "next/dynamic";

// Hydrate the heading before loading the WebGL renderer and model decoders.
const Hero3D = dynamic(() => import("@/features/home/hero/Hero3D").then(module => module.Hero3D), { ssr: false });
import { HeroSection } from "@/features/home/hero/HeroSection";
import Product from "@/features/home/product/Product";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function rangeProgress(value: number, start: number, end: number) {
  if (end === start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

export default function HomeJourney() {
  const journeyRef = useRef<HTMLDivElement | null>(null);
  const heroWrapperRef = useRef<HTMLDivElement | null>(null);
  const productAnchorRef = useRef<HTMLDivElement | null>(null);
  const [stickyRangeHeight, setStickyRangeHeight] = useState<number | null>(
    null,
  );

  const blastRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const scrollExplosionRef = useRef(0);
  const journeyProgressRef = useRef(0);
  const canvasShakeRef = useRef<HTMLDivElement | null>(null);

  // Product kartinin geri cekilis ilerlemesini 3D parcacik animasyonuna ilet.
  const productReturnExplosionRef = useRef(0);
  useEffect(() => {
    const handleReturnExplosion = (event: Event) => {
      const detail = (event as CustomEvent<{ progress?: number }>).detail;
      productReturnExplosionRef.current = clamp01(detail?.progress ?? 0);
    };
    window.addEventListener(
      "sempa:product-upward-blast",
      handleReturnExplosion,
    );
    return () => {
      window.removeEventListener(
        "sempa:product-upward-blast",
        handleReturnExplosion,
      );
      productReturnExplosionRef.current = 0;
    };
  }, []);

  // Canvas, Hero'dan Products'a kadar gorunur; Products kendi icinde scroll kilitlemez.
  useLayoutEffect(() => {
    const hero = heroWrapperRef.current;
    const product = productAnchorRef.current;
    if (!hero || !product) return;

    const updateStickyHeight = () => {
      const heroHeight = hero.getBoundingClientRect().height;
      // Extra space below the thumbnails belongs to the gallery, not the
      // pinned model scene. Keep the pump aligned with its original viewport.
      const productViewport = product.querySelector("[data-home-product-viewport]");
      const measuredProductHeight = (productViewport ?? product).getBoundingClientRect().height;
      const productHeight = innerWidth < 1024 ? Math.min(innerHeight, measuredProductHeight) : measuredProductHeight;
      setStickyRangeHeight(heroHeight + productHeight);
    };

    updateStickyHeight();
    const resizeObserver = new ResizeObserver(updateStickyHeight);
    resizeObserver.observe(hero);
    resizeObserver.observe(product);
    window.addEventListener("resize", updateStickyHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateStickyHeight);
    };
  }, []);

  useGSAP(
    () => {
      const journey = journeyRef.current;
      const productAnchor = productAnchorRef.current;
      if (!journey || !productAnchor) return;

      const state = { progress: 0 };
      const tween = gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: journey,
          start: "top top",
          endTrigger: productAnchor,
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = clamp01(self.progress);
            let explosion = 0;

            // Ilk scroll pikselinden itibaren acilma baslar; %10 bekleme yok.
            if (progress > 0 && progress < 0.17) {
              explosion = Math.pow(rangeProgress(progress, 0, 0.17), 0.65);
            } else if (progress >= 0.17 && progress < 0.48) {
              explosion = 1;
            } else if (progress >= 0.48 && progress < 0.72) {
              explosion = 1 - smoothstep(rangeProgress(progress, 0.48, 0.72));
            }

            // Product karti geri cekilirken patlama 0 -> 1 ilerler.
            // Kart tamamen kayboldugunda (hero progress ~0.72),
            // Hero animasyonu ayni 1 degerinden devam eder.
            // Boylece model toplanip ikinci kez patlamaz.
            if (self.direction === -1 && progress >= 0.17 && progress <= 0.72) {
              explosion = 1;
            }

            scrollExplosionRef.current = explosion;
            journeyProgressRef.current = smoothstep(
              rangeProgress(progress, 0.05, 0.94),
            );
          },
          onLeave: () => {
            journeyProgressRef.current = 1;
            scrollExplosionRef.current = 0;
          },
          onEnterBack: (self) => {
            const progress = clamp01(self.progress);
            journeyProgressRef.current = smoothstep(
              rangeProgress(progress, 0.05, 0.94),
            );
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: journeyRef },
  );

  return (
    <div ref={journeyRef} className="relative w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30 w-full"
        style={{
          height:
            stickyRangeHeight !== null ? `${stickyRangeHeight}px` : "200svh",
        }}
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <div
            ref={canvasShakeRef}
            className="absolute inset-0 will-change-transform"
          >
            <Hero3D
              blastRef={blastRef}
              pointerRef={pointerRef}
              scrollExplosionRef={scrollExplosionRef}
              productReturnExplosionRef={productReturnExplosionRef}
              journeyProgressRef={journeyProgressRef}
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 min-[1024px]:z-auto">
        <div ref={heroWrapperRef} className="relative w-full min-[1024px]:z-20">
          <HeroSection
            blastRef={blastRef}
            pointerRef={pointerRef}
            canvasShakeRef={canvasShakeRef}
          />
        </div>
        <div ref={productAnchorRef} className="relative w-full">
          <Product />
        </div>
      </div>
    </div>
  );
}
