"use client";
import { useEffect, useId, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";

/** The spring updates SVG/CSS directly. React only renders when the selected image changes. */
export default function HomeElasticGallery({ onVelocity }: { onVelocity: (speed: number) => void }) {
  const count = 7;
  const [selected, setSelected] = useState(3);
  const [width, setWidth] = useState(360);
  const step = width * .76 / 6;
  const edge = width * .12;
  const ropeId = `home-product-rope-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const track = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
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
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { reduced.current = preference.matches; };
    sync(); preference.addEventListener("change", sync);
    let last = 0;
    const paint = (time: number) => {
      const dt = last ? Math.min((time - last) / 16.667, 2) : 1;
      last = time;
      if (reduced.current) { current.current = target.current; velocity.current = 0; }
      else {
        velocity.current += (target.current - current.current) * 0.09 * dt;
        velocity.current *= Math.pow(0.66, dt);
        current.current += velocity.current * dt;
      }
      const x = edge + current.current * step;
      const pull = Math.min(7, Math.abs(velocity.current) * 25);
      line.current?.setAttribute("d", `M 0 26 H ${Math.max(0, x - 52)} C ${x - 26} 26 ${x - 27} ${10 - pull} ${x} ${10 - pull} C ${x + 27} ${10 - pull} ${x + 26} 26 ${Math.min(width, x + 52)} 26 H ${width}`);
      ball.current?.style.setProperty("left", `${x / width * 100}%`);
      ball.current?.style.setProperty("--ball-lean", `${Math.max(-9, Math.min(9, velocity.current * 22))}deg`);
      if (Math.abs(target.current - current.current) > 0.0005 || Math.abs(velocity.current) > 0.0005) frame.current = requestAnimationFrame(paint);
      else { frame.current = 0; last = 0; }
    };
    animate.current = () => { if (!frame.current) frame.current = requestAnimationFrame(paint); };
    animate.current();
    return () => { cancelAnimationFrame(frame.current); frame.current = 0; preference.removeEventListener("change", sync); };
  }, [step, edge, width]);

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
    setStop(Math.round((event.clientX - rect.left - edge) / step));
  }
  function end() { dragging.current = false; setStop(3); }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? 6 : event.key === "ArrowRight" ? selection.current + 1 : event.key === "ArrowLeft" ? selection.current - 1 : ["Escape", " ", "Enter"].includes(event.key) ? 3 : null;
    if (next !== null) { event.preventDefault(); setStop(next); }
  }
  function stopKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) end();
  }

  return <div data-home-product-gallery className="relative mx-auto w-full max-w-[360px]" aria-label="Pump card scroll speed">
    <div ref={track} data-elastic-track className="relative h-[100px] touch-pan-y select-none"
      onPointerDown={event => { if (event.pointerType === "mouse" && event.button !== 0) return; dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); move(event); }}
      onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
        {Array.from({ length: count }, (_, i) => <svg key={i} viewBox="0 0 14 100" preserveAspectRatio="none" style={{ position: "absolute", left: `${(edge + i * step) / width * 100}%`, transform: i === selected ? "translate(-50%,-18px)" : "translateX(-50%)", height: i === selected ? 18 : 12, opacity: i === selected ? 1 : 0.2 }} className="w-[3px] overflow-visible transition-[transform,height,opacity] duration-500 motion-reduce:transition-none"><path d="M7 0 Q21 50 7 100 Q-7 50 7 0Z" fill="#F7F7F7" /></svg>)}
      </div>
      <svg aria-hidden="true" viewBox={`0 0 ${width} 90`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs><linearGradient id={ropeId}><stop stopColor="#F7F7F7" stopOpacity=".08" /><stop offset=".3" stopColor="#F7F7F7" stopOpacity=".25" /><stop offset=".7" stopColor="#F7F7F7" stopOpacity=".25" /><stop offset="1" stopColor="#F7F7F7" stopOpacity=".08" /></linearGradient></defs>
        <path ref={line} d="M0 26H158C184 26 183 10 210 10C237 10 236 26 262 26H420" fill="none" stroke={`url(#${ropeId})`} strokeWidth="2.5" className="drop-shadow-[0_3px_4px_#27272a35]" />
      </svg>
      <button ref={ball} type="button" role="slider" aria-label="Scroll pump cards" aria-valuemin={-3} aria-valuemax={3} aria-valuenow={selected - 3} aria-valuetext={selected === 3 ? "Stopped" : `${selected < 3 ? "Left" : "Right"} speed ${Math.abs(selected - 3)}`} onKeyDown={keyboard} onKeyUp={stopKeyboard} onBlur={end}
        style={{ left: "50%", transform: "translateX(-50%) rotate(var(--ball-lean,0deg))" }}
        className="absolute top-[35px] grid size-[46px] cursor-grab touch-none place-items-center rounded-full border border-[#F7F7F7] bg-[#f7f7f740] shadow-[0_3px_19px_#f7f7f730,inset_0_1px_2px_#fff] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7F7F7]">
        <span aria-hidden="true" data-slider-glow className="pointer-events-none absolute -top-[48px] left-1/2 h-[46px] w-[116px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(247,247,247,0.65)_0%,rgba(247,247,247,0.24)_40%,transparent_75%)] blur-[12px]" />
        <span className="size-[30px] rounded-full bg-[#F7F7F7] shadow-[0_0_12px_#f7f7f750]" />
      </button>
    </div>
    <p className="sr-only" aria-live="polite">{selected === 3 ? "Card scrolling stopped" : `Scrolling ${selected < 3 ? "left" : "right"}, speed ${Math.abs(selected - 3)}`}</p>
  </div>;
}
