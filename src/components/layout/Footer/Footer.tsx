"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { menuItems } from "@/lib/navigation";
import { pageWheelDelta, stopSmoothScroll } from "@/lib/smoothScroll";
// Tailwind classes stay next to the component; marker classes scope descendant variants.
const styles = {
  "footer": "tw-footer-footer relative isolate w-full [background:#001a2b] [color:#9eb7d0]! [font-family:var(--font-sf-pro),_sans-serif] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,_'wdth'_125] [letter-spacing:-0.04em] [&_a]:[transition:color_250ms_ease] [&_a:hover]:[color:#fff]! [&_a:focus-visible]:[outline:2px_solid_#78baff] [&_a:focus-visible]:[outline-offset:5px] [&_a:focus-visible]:[border-radius:3px] [@media(max-width:767px)]:[--mobile-footer-unit:calc(100vw_/_393)] [@media(max-width:767px)]:[background:#00151e] [@media(prefers-reduced-motion:reduce)]:[&_a]:[transition:none] min-[1300px]:[--footer-unit:calc(100vw_/_1440)] min-[1300px]:[--footer-slogan-type:calc(35_*_var(--footer-unit))] min-[1300px]:[--footer-label-type:calc(13_*_var(--footer-unit))] min-[1300px]:[--footer-small-type:calc(12_*_var(--footer-unit))] min-[1300px]:[--footer-phone-type:calc(30_*_var(--footer-unit))]",
  "background": "tw-footer-background absolute inset-0 [z-index:-1] overflow-hidden pointer-events-none [&::after]:[content:''] [&::after]:absolute [&::after]:[inset:max(600px,_42vw)_0_0] [&::after]:[background:linear-gradient(to_bottom,_#001a2b30,_#001a2b99_70%,_#001a2b)] [&::after]:[backdrop-filter:blur(8px)] [&::after]:[mask-image:linear-gradient(to_bottom,_transparent,_#000_25px)] [@media(max-width:767px)]:[&::after]:[inset:calc(610_*_var(--mobile-footer-unit))_0_0] [@media(max-width:767px)]:[&::after]:[background:linear-gradient(to_bottom,_#001a2b26,_#001a2b70_50%,_#00151e99)] min-[1300px]:[&::after]:[inset:calc(610_*_var(--footer-unit))_0_0]",
  "backgroundImage": "tw-footer-backgroundImage w-full h-auto [mask-image:linear-gradient(to_bottom,_#000_0%,_#000_80%,_transparent_100%)] min-[1200px]:[mask-image:linear-gradient(to_bottom,_transparent_0px,_transparent_16px,_#000_96px,_#000_80%,_transparent_100%)] [@media(max-width:767px)]:[mask-image:none]",
  "container": "tw-footer-container relative [padding:0_0_35px] [@media(min-width:1200px)_and_(max-width:1299px)]:[max-width:calc(100%_-_96px)] [@media(min-width:768px)_and_(max-width:1199px)]:[max-width:calc(100%_-_80px)] [@media(max-width:767px)]:[padding:0_40px_85px] min-[1300px]:w-[83.333333%] min-[1300px]:max-w-none min-[1300px]:pb-[calc(35*var(--footer-unit))]",
  "greenPump": "tw-footer-greenPump absolute [right:0] [top:0] [transform:translateY(-50%)] [width:clamp(100px,_9.4vw,_135px)] h-auto [z-index:2] [@media(max-width:767px)]:[right:50%] [@media(max-width:767px)]:[width:82px] [@media(max-width:767px)]:[transform:translate(50%,_-50%)] min-[1300px]:w-[calc(120*var(--footer-unit))]",
  "upper": "tw-footer-upper relative [min-height:max(600px,_42vw)] [padding-top:60px] [@media(min-width:768px)_and_(max-width:1199px)]:[min-height:640px] [@media(min-width:768px)_and_(max-width:1199px)]:[padding-top:65px] [@media(max-width:767px)]:[min-height:calc(640_*_var(--mobile-footer-unit))] [@media(max-width:767px)]:[padding-top:100px] min-[1300px]:min-h-[calc(610*var(--footer-unit))] min-[1300px]:pt-[calc(70*var(--footer-unit))]",
  "contact": "tw-footer-contact [width:600px] [max-width:55%] [@media(min-width:768px)_and_(max-width:1199px)]:[max-width:45%] [@media(max-width:767px)]:w-full [@media(max-width:767px)]:max-w-none [@media(max-width:767px)]:text-center min-[1300px]:w-[calc(600*var(--footer-unit))] min-[1300px]:max-w-[55%]",
  "slogan": "tw-footer-slogan [max-width:600px] m-0 [color:#6cb7d7]! [font-size:var(--footer-slogan-type,_clamp(28px,_2.44vw,_35px))]! [line-height:1.04]! [&_span]:block [@media(min-width:768px)_and_(max-width:1199px)]:[font-size:28px]! [@media(min-width:768px)_and_(max-width:1199px)]:[&_span]:inline [@media(max-width:767px)]:w-full [@media(max-width:767px)]:[max-width:275px] [@media(max-width:767px)]:[margin-inline:auto] [@media(max-width:767px)]:[font-size:clamp(25px,_7.12vw,_28px)]! [@media(max-width:767px)]:[line-height:1.04]! [@media(max-width:767px)]:[&_span]:inline min-[1300px]:w-[calc(600*var(--footer-unit))] min-[1300px]:max-w-full",
  "sempaHome": "tw-footer-sempaHome inline-block [margin-top:100px] [@media(min-width:768px)_and_(max-width:1199px)]:[margin-top:50px] [@media(max-width:767px)]:[margin-top:55px] min-[1300px]:block min-[1300px]:w-fit min-[1300px]:mt-[calc(120*var(--footer-unit))]",
  "sempaLogo": "tw-footer-sempaLogo [width:260px] max-w-full h-auto [filter:brightness(0)_saturate(100%)_invert(78%)_sepia(16%)_saturate(588%)_hue-rotate(169deg)_brightness(91%)_contrast(88%)] [@media(min-width:768px)_and_(max-width:1199px)]:[width:230px] [@media(max-width:767px)]:[width:190px] min-[1300px]:w-[calc(260*var(--footer-unit))]",
  "address": "tw-footer-address flex flex-col items-start [margin-top:110px] [color:#75b7d7]! not-italic [font-size:var(--footer-label-type,_13px)]! [line-height:1.12]! [&_p]:m-0 [@media(min-width:768px)_and_(max-width:1199px)]:[margin-top:55px] [@media(max-width:767px)]:items-center [@media(max-width:767px)]:[margin-top:22px] [@media(max-width:767px)]:[font-size:10px]! [@media(max-width:767px)]:[line-height:1.12]! min-[1300px]:mt-[calc(110*var(--footer-unit))]",
  "email": "tw-footer-email [margin-top:0] underline! [text-underline-offset:3px] [@media(max-width:767px)]:[margin-top:0]",
  "phone": "tw-footer-phone [margin-top:28px] [font-size:var(--footer-phone-type,_30px)]! [line-height:1]! underline! [text-decoration-thickness:1px]! [text-underline-offset:6px] [@media(max-width:767px)]:[margin-top:16px] [@media(max-width:767px)]:[font-size:26px]! min-[1300px]:mt-[calc(28*var(--footer-unit))]",
  "technology": "tw-footer-technology absolute [right:0] [bottom:-22px] [width:230px] h-auto [z-index:1] [@media(min-width:768px)_and_(max-width:1199px)]:[right:4%] [@media(min-width:768px)_and_(max-width:1199px)]:[width:210px] [@media(min-width:768px)_and_(max-width:1199px)]:[bottom:15px] [@media(max-width:767px)]:[right:50%] [@media(max-width:767px)]:[bottom:-3px] [@media(max-width:767px)]:[width:min(240px,_72vw)] [@media(max-width:767px)]:[transform:translateX(50%)] min-[1300px]:bottom-[calc(-22*var(--footer-unit))] min-[1300px]:w-[calc(230*var(--footer-unit))]",
  "lower": "tw-footer-lower grid [grid-template-columns:minmax(0,_1fr)_155px] [gap:35px] [margin-top:65px] [@media(min-width:768px)_and_(max-width:1199px)]:[grid-template-columns:minmax(0,_1fr)_145px] [@media(min-width:768px)_and_(max-width:1199px)]:[gap:30px] [@media(max-width:767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:767px)]:[gap:70px] [@media(max-width:767px)]:[margin-top:55px] min-[1300px]:grid-cols-[minmax(0,1fr)_calc(155*var(--footer-unit))] min-[1300px]:gap-[calc(115*var(--footer-unit))] min-[1300px]:mt-[calc(65*var(--footer-unit))]",
  "navigation": "tw-footer-navigation grid [grid-template-columns:1.1fr_repeat(5,_minmax(0,_1fr))] [gap:20px] [align-items:start] [@media(min-width:768px)_and_(max-width:1199px)]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [@media(min-width:768px)_and_(max-width:1199px)]:[gap:25px] [@media(max-width:767px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:767px)]:[gap:22px_44px] min-[1300px]:grid-cols-[1.25fr_repeat(5,minmax(0,1fr))] min-[1300px]:gap-[calc(20*var(--footer-unit))]",
  "navColumn": "tw-footer-navColumn min-w-0 [&_h2]:[margin:0_0_7px] [&_h2]:[color:#6cb7d7]! [&_h2]:[font-weight:600] [&_h2]:[font-variation-settings:'wght'_600,_'wdth'_125] [&_h2]:[font-size:var(--footer-label-type,_13px)]! [&_h2]:[line-height:1.12]! [&_ul]:flex [&_ul]:flex-col [&_ul]:[gap:4px] [&_ul]:m-0 [&_ul]:p-0 [&_ul]:list-none [&_li]:[font-size:var(--footer-small-type,_12px)]! [&_li]:[line-height:1.2]! [&_li]:[overflow-wrap:break-word] [@media(max-width:767px)]:[&_h2]:[font-size:var(--footer-label-type,_13px)]! [@media(max-width:767px)]:[&_li]:[font-size:var(--footer-small-type,_12px)]! min-[1300px]:[&_h2]:mb-[calc(7*var(--footer-unit))] min-[1300px]:[&_ul]:gap-[calc(4*var(--footer-unit))]",
  "industry": "tw-footer-industry [&_img]:[width:155px] [&_img]:h-auto [@media(min-width:768px)_and_(max-width:1199px)]:[&_img]:[width:145px] [@media(max-width:767px)]:[justify-self:center] [@media(max-width:767px)]:[&_img]:[width:145px] min-[1300px]:[&_img]:w-[calc(155*var(--footer-unit))]",
  "bottom": "tw-footer-bottom flex items-end justify-between [gap:35px] [margin-top:32px] [@media(min-width:768px)_and_(max-width:1199px)]:items-start [@media(max-width:767px)]:flex-col [@media(max-width:767px)]:items-center [@media(max-width:767px)]:[gap:20px] [@media(max-width:767px)]:[margin-top:70px] min-[1300px]:gap-[calc(35*var(--footer-unit))] min-[1300px]:mt-[calc(32*var(--footer-unit))]",
  "legal": "tw-footer-legal flex flex-wrap [gap:5px] [max-width:710px] [font-size:var(--footer-small-type,_12px)]! [line-height:1.4]! [&_>_span:first-child]:underline! [&_>_span:first-child]:[text-underline-offset:2px] [&_a]:underline! [&_a]:[text-underline-offset:2px] [@media(max-width:767px)]:[order:1] [@media(max-width:767px)]:flex-col [@media(max-width:767px)]:items-center [@media(max-width:767px)]:[gap:3px] [@media(max-width:767px)]:[width:280px] [@media(max-width:767px)]:max-w-full [@media(max-width:767px)]:text-center [@media(max-width:767px)]:[font-size:var(--footer-small-type,_12px)]! [@media(max-width:767px)]:[line-height:1.4]! min-[1300px]:max-w-[calc(710*var(--footer-unit))]",
  "legalEntry": "tw-footer-legalEntry inline-flex items-baseline [gap:5px] [@media(max-width:767px)]:block [@media(max-width:767px)]:[&_>_span]:hidden",
  "socialAndCopyright": "tw-footer-socialAndCopyright shrink-0 text-right [&_p]:m-0 [&_p]:[color:#4186b0]! [&_p]:[font-size:var(--footer-small-type,_12px)]! [&_p]:[line-height:1.2]! [@media(min-width:768px)_and_(max-width:1199px)]:[flex-shrink:1] [@media(min-width:768px)_and_(max-width:1199px)]:[max-width:240px] [@media(max-width:767px)]:[order:0] [@media(max-width:767px)]:w-full [@media(max-width:767px)]:text-center [@media(max-width:767px)]:[&_p]:[max-width:290px] [@media(max-width:767px)]:[&_p]:[margin-inline:auto] [@media(max-width:767px)]:[&_p]:[font-size:var(--footer-small-type,_12px)]! [@media(max-width:767px)]:[&_p]:[line-height:1.15]!",
  "social": "tw-footer-social flex justify-start [gap:5px] [margin-bottom:25px] [&_>_span]:grid [&_>_span]:place-items-center [&_>_span]:[width:26px] [&_>_span]:[height:26px] [&_>_span]:[border-radius:4px] [&_>_span]:[background:#9eb7d0] [&_>_span]:[color:#002a43]! [&_>_span]:[transition:background-color_250ms_ease] [&_>_span:hover]:[background:#fff] [&_svg]:[width:20px] [&_svg]:[height:20px] [@media(max-width:767px)]:justify-center [@media(max-width:767px)]:[margin-bottom:25px] [@media(prefers-reduced-motion:reduce)]:[&_>_span]:[transition:none] min-[1300px]:gap-[calc(5*var(--footer-unit))] min-[1300px]:mb-[calc(25*var(--footer-unit))] min-[1300px]:[&_>_span]:w-[calc(26*var(--footer-unit))] min-[1300px]:[&_>_span]:h-[calc(26*var(--footer-unit))] min-[1300px]:[&_>_span]:rounded-[calc(4*var(--footer-unit))] min-[1300px]:[&_svg]:w-[calc(20*var(--footer-unit))] min-[1300px]:[&_svg]:h-[calc(20*var(--footer-unit))]",
} as const;


const socialIcons = [
  { name: "Facebook", Icon: FaFacebookF },
  { name: "Instagram", Icon: FaInstagram },
  { name: "YouTube", Icon: FaYoutube },
  { name: "LinkedIn", Icon: FaLinkedinIn },
];
const corporateLinks = menuItems.find(item => item.label === "Corporate")!.children;
const legalLinks = ["Law on the Protection of Personal Data", "Cookie Notification"].map(label => corporateLinks.find(item => item.label === label)!);

const transitionBandCount = 5;
// The scene and footer sample consecutive regions of one continuous image.
// Reserve the original footer artwork height below the viewport-sized scene.
const footerArtworkRatio = 1984 / 2880;
const transitionBackground = 'url("/footer/footer-continuous.png")';
const tabletTransitionBackground = 'url("/footer/footer-tablet.png")';
const mobileTransitionBackground = 'url("/footer/footer-mobile.jpg")';
const unitProgress = (value: number) => Math.max(0, Math.min(1, value));
const smoothProgress = (value: number) => value * value * (3 - 2 * value);
// Reference x: 4% of the scene height, i.e. 20% of one of its five rows.
// Invert the growth curve so each successor starts at this height, not on a timer.
const transitionStartFraction = 0.2;
const transitionStartPhase = 0.5 - Math.sin(Math.asin(1 - 2 * transitionStartFraction) / 3);
const transitionGrowthSpan = 1 + (transitionBandCount - 1) * transitionStartPhase;
// Keep the first half over the stationary page, then bring in the footer
// while the five similarly sized bands close their remaining gaps.
const footerTravelProgress = (value: number) => smoothProgress(unitProgress((value - 0.54) / 0.46));

function FooterScrollTransition() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const bandsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const facesRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let disposeScene = () => {};

    function enableScene() {
      const footer = root!.nextElementSibling as HTMLElement;
      const page = root!.previousElementSibling as HTMLElement | null;
      // Short last sections (such as newsletter) do not fill the viewport.
      // Keep all in-flow page siblings behind them still, so native footer travel
      // cannot expose the body through the stripe gaps.
      const backdrops: { element: HTMLElement; translate: string; priority: string }[] = [];
      let pagePinned = false;

      function restorePage() {
        if (!pagePinned) return;
        backdrops.forEach(({ element, translate, priority }) => {
          if (translate) element.style.setProperty("translate", translate, priority);
          else element.style.removeProperty("translate");
        });
        pagePinned = false;
      }
      function refreshBackdrops() {
        const elements: HTMLElement[] = [];
        for (let sibling = root!.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
          if (!(sibling instanceof HTMLElement) || sibling.tagName === "HEADER" || ["STYLE", "SCRIPT", "LINK"].includes(sibling.tagName)) continue;
          if (["fixed", "absolute"].includes(getComputedStyle(sibling).position)) continue;
          elements.push(sibling);
        }
        if (elements.length === backdrops.length && elements.every((element, index) => element === backdrops[index].element)) return;
        restorePage();
        backdrops.splice(0, backdrops.length, ...elements.map(element => ({ element, translate: element.style.getPropertyValue("translate"), priority: element.style.getPropertyPriority("translate") })));
      }
      refreshBackdrops();
      let frame = 0;
      let resizeFrame = 0;
      let height = 0;
      let anchor = 0;
      let endPosition = 0;
      let inputDistance = 0;
      let target = 0;
      let progress = 0;
      let pendingScroll = 0;
      let previousFrameTime = 0;
      let progressVelocity = 0;
      let disposed = false;
      let phase: "before" | "opening" | "after" | "closing" = "before";
      let previousY = window.scrollY;
      let measured = false;
      let paintedProgress = -1;
      let paintedSlide = -1;
      let touchPosition: { x: number; y: number } | null = null;
      let controlledTouch = false;

      function writeScroll(y: number) {
        window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
        previousY = window.scrollY;
      }

      function setTarget(value: number) {
        const next = unitProgress(value);
        // Repeated input at an endpoint must never restart the closing/opening.
        if (Math.abs(next - target) < 0.000001) return;
        target = next;
        schedulePaint();
      }

      function begin(direction: 1 | -1) {
        stopSmoothScroll();
        phase = direction === 1 ? "opening" : "closing";
        pendingScroll = 0;
        target = progress = direction === 1 ? 0 : 1;
        progressVelocity = 0;
        writeScroll(anchor + (endPosition - anchor) * footerTravelProgress(progress));
        paint();
      }

      function paint(y = window.scrollY) {
        root!.dataset.phase = phase;
        root!.dataset.target = target.toFixed(3);
        // Keep the reveal timing; fold all five image rows evenly into the
        // remaining space above the approaching footer, instead of sliding away.
        const tablet = window.innerWidth >= 768 && window.innerWidth < 1200;
        const travelDistance = Math.max(0, endPosition - anchor);
        // A portrait tablet can be taller than the whole footer. Fold only as
        // far as the footer actually travels; otherwise a gap opens at its top.
        const foldDistance = tablet ? Math.min(height, travelDistance) : height;
        const slide = foldDistance * unitProgress((y - anchor) / Math.max(1, travelDistance));
        const restingTabletBackdrop = tablet && foldDistance < height && phase === "after" && progress === 1;
        const slideChanged = slide !== paintedSlide;
        // The first bands open before footer travel starts; visibility must
        // follow progress even while the folded scene height stays unchanged.
        root!.style.visibility = slide >= height || (phase === "before" && progress === 0) || (phase === "after" && progress === 1 && !restingTabletBackdrop) ? "hidden" : "visible";
        if (slideChanged) {
          const fold = height ? slide / height : 0;
          // Cancel native page travel behind the decorative scene. Only the
          // footer advances; restore the page once it is completely covered.
          if (page && slide > 0 && fold < 1 && !restingTabletBackdrop) {
            backdrops.forEach(({ element }) => element.style.setProperty("translate", `0 ${y - anchor}px`));
            pagePinned = true;
          } else restorePage();
          const angle = Math.acos(1 - fold) * 180 / Math.PI;
          const rowFold = slide / transitionBandCount;
          root!.style.setProperty("--footer-fold", String(fold));
          root!.style.setProperty("--footer-fold-bottom", `${height - slide}px`);
          rowsRef.current.forEach((row, index) => {
            if (!row) return;
            row.style.transform = `translate3d(0,${-index * rowFold}px,0)`;
            // Keep a screen-space overlap even as rotated faces approach 90°.
            // Their own 1px overlap shrinks with the cosine of the fold angle.
            row.style.clipPath = `inset(0 0 ${Math.max(0, rowFold - 2)}px 0)`;
            const top = facesRef.current[index * 2];
            const bottom = facesRef.current[index * 2 + 1];
            if (top) top.style.transform = `rotateX(${angle}deg)`;
            if (bottom) bottom.style.transform = `translate3d(0,${-rowFold}px,0) rotateX(${-angle}deg)`;
          });
          paintedSlide = slide;
        }
        if (restingTabletBackdrop) restorePage();
        if (progress === paintedProgress && !slideChanged) return;
        paintedProgress = progress;
        const opening = unitProgress((progress - 0.08) / 0.92);
        const remaining = 1 - (height ? slide / height : 0);
        const rowHeight = (height - slide) / transitionBandCount;
        const startHeight = rowHeight * transitionStartFraction;
        let precedingHeight = Infinity;
        // Numbering is bottom to top: 1 -> 2 -> 3 -> 4 -> 5. The next row
        // remains invisible until the preceding row reaches reference height x.
        for (let order = 0; order < transitionBandCount; order++) {
          const band = bandsRef.current[transitionBandCount - 1 - order];
          const growth = opening * transitionGrowthSpan - order * transitionStartPhase;
          const amount = precedingHeight >= startHeight ? smoothProgress(unitProgress(growth)) : 0;
          precedingHeight = amount * rowHeight;
          if (!band) continue;
          band.style.transform = `translate3d(0,${(1 - amount) * 100 * remaining}%,0)`;
          // Retain the opaque backing that prevents white seams at the folds.
          band.style.opacity = amount === 0 ? "0" : "1";
        }
        root!.dataset.progress = progress.toFixed(3);
      }

      function animate(time: number) {
        frame = 0;
        if (disposed) return;
        const holding = phase === "opening" || phase === "closing";
        const frameElapsed = previousFrameTime ? Math.min(64, time - previousFrameTime) : 16;
        previousFrameTime = time;
        if (progress !== target) {
          // Carry velocity across wheel inputs instead of instantly changing
          // speed. A critically damped response gives a short, controlled glide
          // without oscillation or a long inertial tail after the gesture.
          const seconds = frameElapsed / 1000;
          const responseTime = 0.26;
          const omega = 2 / responseTime;
          const decay = Math.exp(-omega * seconds);
          const difference = progress - target;
          const maxChange = responseTime / 2.4;
          const change = Math.max(-maxChange, Math.min(maxChange, difference));
          const temporary = (progressVelocity + omega * change) * seconds;
          progressVelocity = (progressVelocity - omega * temporary) * decay;
          const next = progress - change + (change + temporary) * decay;
          if ((target - progress > 0) === (next > target) ||
              (Math.abs(target - next) < 0.0001 && Math.abs(progressVelocity) < 0.001)) {
            progress = target;
            progressVelocity = 0;
          } else {
            progress = unitProgress(next);
          }
        }
        let y = window.scrollY;
        if (holding) {
          // One position curve in both directions: reversing never resets the
          // current image, hold point or fold geometry.
          y = Math.max(0, anchor + (endPosition - anchor) * footerTravelProgress(progress));
          if (Math.abs(window.scrollY - y) > 0.5) writeScroll(y);
          if (progress === target && target === 1) phase = "after";
          else if (progress === target && target === 0) phase = "before";
        }
        paint(y);
        if (progress === target && (phase === "before" || phase === "after") && pendingScroll) {
          const queued = pendingScroll;
          pendingScroll = 0;
          window.scrollTo({ top: Math.max(0, y + queued), behavior: "smooth" });
        }
        if (target !== progress) frame = requestAnimationFrame(animate);
      }

      function schedulePaint() {
        if (!frame && !disposed) {
          previousFrameTime = 0;
          frame = requestAnimationFrame(animate);
        }
      }

      function measure() {
        resizeFrame = 0;
        if (disposed) return;
        refreshBackdrops();
        const holding = phase === "opening" || phase === "closing";
        height = window.innerHeight;
        const footerRect = footer.getBoundingClientRect();
        const footerTop = footerRect.top + window.scrollY;
        anchor = footerTop - height;
        // A short footer cannot scroll all the way to the top of the viewport.
        // Use its reachable bottom-of-document position in both directions.
        endPosition = Math.max(anchor, Math.min(footerTop, footerRect.bottom + window.scrollY - height));
        // Input effort and visual speed are independent: fewer gestures, longer easing.
        inputDistance = height * 0.9;
        const mobile = window.innerWidth < 768;
        const tablet = window.innerWidth >= 768 && window.innerWidth < 1200;
        const artworkHeight = mobile ? height * 1700 / 280 : height + window.innerWidth * footerArtworkRatio;
        root!.dataset.device = mobile ? "mobile" : window.innerWidth < 1200 ? "tablet" : "desktop";
        root!.style.setProperty("--footer-transition-image", mobile ? mobileTransitionBackground : tablet ? tabletTransitionBackground : transitionBackground);
        root!.style.setProperty("--footer-artwork-height", `${artworkHeight}px`);
        root!.style.setProperty("--footer-scene-height", `${height}px`);
        root!.style.setProperty("--footer-half-band-height", `${height / transitionBandCount / 2}px`);
        root!.dataset.anchor = String(anchor);
        root!.dataset.endPosition = String(endPosition);
        root!.dataset.inputDistance = String(inputDistance);
        facesRef.current.forEach((face, index) => {
          if (!face) return;
          face.style.backgroundSize = `100% ${artworkHeight}px`;
          face.style.backgroundPosition = `0 ${-index * height / (transitionBandCount * 2) + (index % 2)}px`;
        });
        if (holding) {
          writeScroll(anchor + (endPosition - anchor) * footerTravelProgress(progress));
        } else if (!measured) {
          phase = window.scrollY > anchor + 2 ? "after" : "before";
          target = progress = phase === "after" ? 1 : 0;
        }
        measured = true;
        paintedProgress = -1;
        paintedSlide = -1;
        previousY = window.scrollY;
        schedulePaint();
      }

      function scheduleMeasure() {
        if (!resizeFrame && !disposed) resizeFrame = requestAnimationFrame(measure);
      }

      function onScroll() {
        const y = window.scrollY;
        // Programmatic animation frames only update the measured position.
        // They must never re-enter/reset the reverse animation at its boundary.
        if (phase === "before" && y > previousY && previousY <= anchor + 2 && y >= anchor + 2) {
          const overshoot = y - anchor;
          begin(1);
          setTarget(Math.max(0.04, overshoot / inputDistance));
        } else if (phase === "after" && y < previousY && previousY >= endPosition - 2 && y <= endPosition - 2) {
          const overshoot = endPosition - y;
          begin(-1);
          setTarget(1 - Math.max(0.04, overshoot / inputDistance));
        }
        previousY = window.scrollY;
        const slide = Math.round(height * unitProgress((previousY - anchor) / Math.max(1, endPosition - anchor)));
        if (slide !== paintedSlide || target !== progress || progress !== paintedProgress) schedulePaint();
      }

      function handleScrollInput(delta: number, event: WheelEvent | KeyboardEvent | TouchEvent) {
        const y = window.scrollY;
        let input = delta;
        if (phase === "before") {
          if (delta <= 0 || y + delta < anchor || y > endPosition) return;
          input = Math.max(0, y + delta - anchor);
          begin(1);
        } else if (phase === "after") {
          if (delta >= 0 || y + delta > endPosition || y < anchor - 2) return;
          input = Math.min(0, y + delta - endPosition);
          begin(-1);
        }
        event.preventDefault();
        if (Math.abs(input) < 0.001) return;
        phase = input > 0 ? "opening" : "closing";
        if (pendingScroll && Math.sign(pendingScroll) !== Math.sign(input)) pendingScroll = 0;
        const previousTarget = target;
        setTarget(target + input / inputDistance);
        const remainder = input - (target - previousTarget) * inputDistance;
        if ((target === 0 && remainder < 0) || (target === 1 && remainder > 0)) {
          pendingScroll = Math.max(-height * 0.75, Math.min(height * 0.75, pendingScroll + remainder));
        }
        schedulePaint();
      }

      function onWheel(event: WheelEvent) {
        const delta = pageWheelDelta(event);
        if (delta) handleScrollInput(delta, event);
      }

      function onTouchStart(event: TouchEvent) {
        const point = event.touches.length === 1 ? event.touches[0] : null;
        touchPosition = point ? { x: point.clientX, y: point.clientY } : null;
        controlledTouch = !!point && window.scrollY >= anchor - height && window.scrollY <= endPosition + height;
        if (controlledTouch) writeScroll(window.scrollY); // Cancel an older native smooth-scroll carry.
      }

      function onTouchMove(event: TouchEvent) {
        const point = event.touches.length === 1 ? event.touches[0] : null;
        const previous = touchPosition;
        if (!point || !previous) return;
        const delta = previous.y - point.clientY;
        const horizontal = Math.abs(previous.x - point.clientX);
        touchPosition = { x: point.clientX, y: point.clientY };
        if (event.defaultPrevented || horizontal > Math.abs(delta)) return;
        if (controlledTouch && event.cancelable) {
          // Own the gesture before the browser commits it to inertial scrolling.
          // Outside the scene, still follow the finger as normal page travel.
          event.preventDefault();
          const y = window.scrollY;
          if ((phase === "before" && (delta <= 0 || y + delta < anchor)) ||
              (phase === "after" && (delta >= 0 || y + delta > endPosition))) {
            writeScroll(y + delta);
            schedulePaint();
            return;
          }
        } else if (!event.cancelable) return;
        handleScrollInput(delta, event);
      }

      function onTouchEnd() { touchPosition = null; controlledTouch = false; }

      function onKeyDown(event: KeyboardEvent) {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        if ((event.target as HTMLElement).closest("input,textarea,select,button,a,[contenteditable='true']")) return;
        const direction = event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey)
          ? 1 : event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey) ? -1 : 0;
        if (direction) handleScrollInput(direction * (event.key.startsWith("Arrow") ? 48 : height * 0.8), event);
      }

      root!.dataset.active = "true";
      const observer = new ResizeObserver(scheduleMeasure);
      backdrops.forEach(({ element }) => observer.observe(element));
      observer.observe(footer);
      // History replaces its pin spacer when the responsive card count changes.
      observer.observe(document.body);
      window.addEventListener("wheel", onWheel, { passive: false, capture: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", scheduleMeasure, { passive: true });
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      document.fonts.ready.then(() => { if (!disposed) scheduleMeasure(); });
      measure();

      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        cancelAnimationFrame(resizeFrame);
        observer.disconnect();
        restorePage();
        window.removeEventListener("wheel", onWheel, true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", scheduleMeasure);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove, true);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchEnd);
        ["active", "progress", "anchor", "inputDistance", "device", "phase", "target", "endPosition"].forEach(key => delete root!.dataset[key]);
        ["transform", "visibility", "--footer-scene-height", "--footer-half-band-height", "--footer-fold", "--footer-fold-bottom", "--footer-artwork-height", "--footer-transition-image"].forEach(property => root!.style.removeProperty(property));
      };
    }

    function applyPreference() {
      disposeScene();
      disposeScene = () => {};
      const footer = root!.nextElementSibling;
      const footerStyle = footer ? getComputedStyle(footer) : null;
      if (motionPreference.matches && footerStyle?.display !== "none" && footerStyle?.visibility !== "hidden") {
        disposeScene = enableScene();
      }
    }

    applyPreference();
    motionPreference.addEventListener("change", applyPreference);
    return () => {
      motionPreference.removeEventListener("change", applyPreference);
      disposeScene();
    };
  }, [pathname]);

  return (
    <div ref={rootRef} data-footer-scroll-transition aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-30 isolate hidden h-[var(--footer-scene-height)] data-[active=true]:block motion-reduce:hidden!">
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: transitionBandCount }, (_, index) => (
          <div ref={node => { rowsRef.current[index] = node; }} key={index} className="absolute inset-x-0 overflow-hidden will-change-transform" style={{ top: `${index * 100 / transitionBandCount}%`, height: `calc(100% / ${transitionBandCount} + 1px)` }}>
            <div ref={node => { bandsRef.current[index] = node; }} data-footer-transition-band className="absolute inset-0 bg-[#001a2b] opacity-0 will-change-[transform,opacity]" style={{ transform: "translate3d(0,100%,0)" }}>
              {[0, 1].map(half => (
                <div ref={node => { facesRef.current[index * 2 + half] = node; }} key={half} data-footer-fold-face className="absolute inset-x-0 h-[calc(var(--footer-half-band-height)+1px)] will-change-transform [backface-visibility:hidden]" style={{ top: half === 0 ? 0 : "calc(var(--footer-half-band-height) - 1px)", transformOrigin: half === 0 ? "center top" : "center bottom", backgroundColor: "#001a2b", backgroundImage: "var(--footer-transition-image)", backgroundRepeat: "no-repeat" }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Sample the shared join itself, rather than covering it with a flat color. */}
      <div data-footer-transition-join className="absolute inset-x-0 top-[calc(var(--footer-fold-bottom)-2px)] h-1" style={{ backgroundImage: "var(--footer-transition-image)", backgroundSize: "100% var(--footer-artwork-height)", backgroundPosition: "0 calc(-1 * 100svh)", backgroundRepeat: "no-repeat" }} />
    </div>
  );
}

export default function Footer() {
  return (
    <>
    <FooterScrollTransition />
    <footer className={`${styles.footer} z-40`} aria-label="Sempa footer">
      <div className={styles.background} aria-hidden="true">
        <picture>
          <source media="(min-width: 1200px)" srcSet="/footer/footer-continuous.png" width={1065} height={1477} />
          <source media="(min-width: 768px)" srcSet="/footer/footer-tablet.png" width={733} height={2146} />
          <source media="(max-width: 767px)" srcSet="/footer/footer-mobile.jpg" width={393} height={1700} />
          <Image src="/footer/fds.webp" alt="" width={2880} height={1984} sizes="100vw" className={styles.backgroundImage} />
        </picture>
      </div>

      <div className={`${styles.container} mx-auto w-full max-w-[1200px]`}>
        <Image src="/footer/green-pump.svg" alt="Green Pump" width={595} height={842} className={styles.greenPump} sizes="(max-width: 767px) 92px, 135px" />

        <div className={styles.upper}>
          <div className={styles.contact}>
            <p className={styles.slogan}><span>Powering global industries with</span>{" "}<span>advanced fluid transfer</span>{" "}<span>technologies.</span></p>
            <Link href="/" className={styles.sempaHome} aria-label="Sempa home">
              <Image src="/footer/sempa-logo.png" alt="SEMPA" width={684} height={184} sizes="(max-width: 767px) 225px, 260px" className={styles.sempaLogo} />
            </Link>
            <address className={styles.address}>
              <p>Büyükkayacık Organize Sanayi Bölgesi<br />Mahallesi 22. Sokak NO:4 42250<br />Selçuklu, Konya / Türkiye</p>
              <a className={styles.email} href="mailto:info@sempapompa.com">info@sempapompa.com</a>
              <a className={styles.phone} href="tel:4446413">444 6 413</a>
            </address>
          </div>
          <Image src="/footer/im-pump-technology.png" alt="IM PUMP TECHNOLOGY" width={836} height={162} sizes="(max-width: 767px) 200px, 230px" className={styles.technology} />
        </div>

        <div className={styles.lower}>
          <nav aria-label="Footer navigation" className={styles.navigation}>
            {menuItems.map(item => (
              <div className={styles.navColumn} key={item.label}>
                <h2>{item.href ? <Link href={item.href}>{item.label}</Link> : item.label}</h2>
                {item.children.length > 0 && <ul>
                  {item.children.map(child => <li key={`${child.label}-${child.href}`}><Link href={child.href}>{child.label}</Link></li>)}
                </ul>}
              </div>
            ))}
          </nav>
          <div className={styles.industry}>
            <Image src="/footer/turkey-pump-industry.png" alt="Turkey Pump Industry" width={586} height={298} sizes="155px" />
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.legal} aria-label="Legal information">
            <span>Information Society Services</span>
            {legalLinks.map(link => <span key={link.href} className={styles.legalEntry}><span aria-hidden="true">·</span><Link href={link.href}>{link.label}</Link></span>)}
          </div>
          <div className={styles.socialAndCopyright}>
            <div className={styles.social} aria-label="Social media">
              {/* Header has placeholder URLs only; keep these icons unlinked. */}
              {socialIcons.map(({ name, Icon }) => <span key={name} role="img" aria-label={name}><Icon aria-hidden="true" /></span>)}
            </div>
            <p>© 2026 SEMPA. TÜM HAKLARI SAKLIDIR.</p>
          </div>
        </div>
      </div>
    </footer>
    <style>{`
      [data-footer-scroll-transition][data-progress="0.000"] [data-footer-transition-join] { visibility: hidden; }
      @media (max-width: 767px) {
        .tw-footer-footer { z-index: 40; }
        [data-footer-transition-join] { background-position: 0 0 !important; }
      }
      @media (min-width: 768px) {
        .tw-footer-backgroundImage {
          position: relative;
          top: -100svh;
          width: 100%;
          height: calc(100svh + 68.888889vw);
          max-width: none;
          object-fit: fill;
          mask-image: linear-gradient(to bottom, #000 0%, #000 92%, transparent 100%);
        }
      }
    `}</style>
    </>
  );
}
