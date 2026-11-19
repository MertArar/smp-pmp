"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react";

/** Product-detail styling with the home strip's hold-to-scroll speed control. */
export default function HomeElasticGallery({
  onVelocity,
}: {
  onVelocity: (speed: number) => void;
}) {
  const count = 7;
  const [selected, setSelected] = useState(3);
  const ropeId = `home-product-rope-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const softLight = useRef<SVGPathElement>(null);
  const upperLightMask = useRef<SVGPathElement>(null);
  const ropeGradient = useRef<SVGLinearGradientElement>(null);
  const lightGradient = useRef<SVGLinearGradientElement>(null);
  const ball = useRef<HTMLButtonElement>(null);
  const target = useRef(3);
  const current = useRef(3);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const selection = useRef(3);
  const frame = useRef(0);
  const reduced = useRef(false);
  const animate = useRef<() => void>(() => {});

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduced.current = preference.matches;
    };
    sync();
    preference.addEventListener("change", sync);
    let last = 0;
    const paint = (time: number) => {
      const dt = last ? Math.min((time - last) / 16.667, 2) : 1;
      last = time;
      if (reduced.current) {
        current.current = target.current;
        velocity.current = 0;
      } else {
        velocity.current += (target.current - current.current) * 0.09 * dt;
        velocity.current *= Math.pow(0.66, dt);
        current.current += velocity.current * dt;
      }
      const x = 24 + current.current * 62;
      const pull = Math.min(2, Math.abs(velocity.current) * 10);
      const path = `M 0 26 H ${Math.max(0, x - 72)} C ${x - 38} 26 ${x - 40} ${13 - pull} ${x} ${13 - pull} C ${x + 40} ${13 - pull} ${x + 38} 26 ${Math.min(420, x + 72)} 26 H 420`;
      line.current?.setAttribute("d", path);
      softLight.current?.setAttribute("d", path);
      upperLightMask.current?.setAttribute("d", `${path} V -100 H 0 Z`);
      ropeGradient.current?.setAttribute("x1", `${x - 190}`);
      ropeGradient.current?.setAttribute("x2", `${x + 190}`);
      lightGradient.current?.setAttribute("x1", `${x - 100}`);
      lightGradient.current?.setAttribute("x2", `${x + 100}`);
      ball.current?.style.setProperty("left", `${(x / 420) * 100}%`);
      ball.current?.style.setProperty(
        "--ball-lean",
        `${Math.max(-9, Math.min(9, velocity.current * 22))}deg`,
      );
      if (
        Math.abs(target.current - current.current) > 0.0005 ||
        Math.abs(velocity.current) > 0.0005
      )
        frame.current = requestAnimationFrame(paint);
      else {
        frame.current = 0;
        last = 0;
      }
    };
    animate.current = () => {
      if (!frame.current) frame.current = requestAnimationFrame(paint);
    };
    animate.current();
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      preference.removeEventListener("change", sync);
    };
  }, []);

  function setStop(index: number) {
    const stop = Math.max(0, Math.min(6, index));
    target.current = stop;
    selection.current = stop;
    setSelected(stop);
    onVelocity(stop - 3);
    animate.current();
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !track.current) return;
    const rect = track.current.getBoundingClientRect();
    setStop(
      Math.round((((event.clientX - rect.left) / rect.width) * 420 - 24) / 62),
    );
  }
  function end() {
    dragging.current = false;
    setStop(3);
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 6
          : event.key === "ArrowRight"
            ? selection.current + 1
            : event.key === "ArrowLeft"
              ? selection.current - 1
              : ["Escape", " ", "Enter"].includes(event.key)
                ? 3
                : null;
    if (next !== null) {
      event.preventDefault();
      setStop(next);
    }
  }
  function stopKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) end();
  }

  return (
    <div
      data-home-product-gallery
      className="relative mx-auto w-full max-w-[480px] translate-y-4 px-3 md:translate-y-5 lg:translate-y-6 xl:translate-y-8"
      aria-label="Pump card scroll speed"
    >
      <div
        ref={track}
        data-elastic-track
        className="relative mx-auto h-[100px] w-[72%] touch-pan-y select-none"
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-[5.7%]"
        >
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              style={{
                transform:
                  i === selected ? "translateY(-18px)" : "translateY(0)",
                height: i === selected ? 18 : 12,
                opacity: i === selected ? 1 : 0.4,
              }}
              className="w-px bg-linear-to-b from-transparent via-[#e0e3e5] to-transparent transition-[transform,height,opacity] duration-500 motion-reduce:transition-none"
            />
          ))}
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 420 90"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient
              ref={ropeGradient}
              id={ropeId}
              gradientUnits="userSpaceOnUse"
              x1="20"
              x2="400"
              y1="0"
              y2="0"
            >
              <stop stopColor="#a3adb5" stopOpacity="0" />
              <stop offset=".25" stopColor="#a3adb5" stopOpacity=".35" />
              <stop offset=".4" stopColor="#6b9fbe" stopOpacity=".65" />
              <stop offset=".5" stopColor="#398abd" stopOpacity=".85" />
              <stop offset=".6" stopColor="#6b9fbe" stopOpacity=".65" />
              <stop offset=".75" stopColor="#a3adb5" stopOpacity=".35" />
              <stop offset="1" stopColor="#a3adb5" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              ref={lightGradient}
              id={`${ropeId}-light`}
              gradientUnits="userSpaceOnUse"
              x1="110"
              x2="310"
              y1="0"
              y2="0"
            >
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff" stopOpacity=".5" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter
              id={`${ropeId}-light-feather`}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <mask
              id={`${ropeId}-upper-light`}
              maskUnits="userSpaceOnUse"
              x="-30"
              y="-110"
              width="480"
              height="170"
            >
              <path
                ref={upperLightMask}
                d="M0 26H138C172 26 170 13 210 13C250 13 248 26 282 26H420V-100H0Z"
                transform="translate(0,-4)"
                fill="white"
                filter={`url(#${ropeId}-light-feather)`}
              />
            </mask>
          </defs>
          <g mask={`url(#${ropeId}-upper-light)`}>
            <path
              ref={softLight}
              d="M0 26H138C172 26 170 13 210 13C250 13 248 26 282 26H420"
              transform="translate(0,-10)"
              fill="none"
              stroke={`url(#${ropeId}-light)`}
              strokeWidth="32"
              strokeLinecap="round"
              opacity=".55"
              className="blur-[16px]"
            />
          </g>
          <path
            ref={line}
            d="M0 26H138C172 26 170 13 210 13C250 13 248 26 282 26H420"
            fill="none"
            stroke={`url(#${ropeId})`}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <button
          ref={ball}
          type="button"
          role="slider"
          aria-label="Scroll pump cards"
          aria-valuemin={-3}
          aria-valuemax={3}
          aria-valuenow={selected - 3}
          aria-valuetext={
            selected === 3
              ? "Stopped"
              : `${selected < 3 ? "Left" : "Right"} speed ${Math.abs(selected - 3)}`
          }
          onKeyDown={keyboard}
          onKeyUp={stopKeyboard}
          onBlur={end}
          style={{
            left: "50%",
            transform: "translateX(-50%) rotate(var(--ball-lean,0deg))",
          }}
          className="absolute top-[35px] grid size-[46px] cursor-grab touch-none place-items-center rounded-full border border-white/45 bg-white/15 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span
            aria-hidden="true"
            data-slider-glow
            className="pointer-events-none absolute bottom-[calc(100%+20px)] left-1/2 h-28 w-56 -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_80%,transparent)] md:w-64"
          >
            <span className="absolute inset-x-0 top-4 -bottom-5 rounded-full bg-[radial-gradient(ellipse_at_50%_85%,#ffffff50_0%,#ffffff1f_45%,transparent_75%)] blur-[18px]" />
          </span>
          <span className="relative size-[30px] rounded-full border border-white/80 bg-[#dedede]" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {selected === 3
          ? "Card scrolling stopped"
          : `Scrolling ${selected < 3 ? "left" : "right"}, speed ${Math.abs(selected - 3)}`}
      </p>
    </div>
  );
}
