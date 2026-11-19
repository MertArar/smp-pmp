"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LuArrowLeft, LuArrowRight, LuShieldCheck } from "react-icons/lu";
import LoadMoreButton from "@/components/ui/LoadMoreButton";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
import { gsap } from "gsap";
import useScrollReveal from "@/components/ui/useScrollReveal";

function useQualityOrbitTitle() {
  const ref = useRepeatingTitle(3300);
  useEffect(() => {
    const title = ref.current;
    if (!title) return;
    const letters = Array.from(
      title.querySelectorAll<HTMLElement>(".quality-orbit-letter"),
    );
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: gsap.core.Tween | undefined;
    const reset = () => {
      animation?.kill();
      gsap.set(letters, { clearProps: "transform,opacity" });
    };
    const play = () => {
      reset();
      if (motion.matches || !title.hasAttribute("data-title-revealing")) return;
      const bounds = title.getBoundingClientRect();
      const center = { x: bounds.width * 0.5, y: bounds.height * 0.5 };
      const radius = Math.min(
        bounds.width * 0.29,
        Math.max(42, bounds.height * 0.36),
      );
      const orbitScale = bounds.width < 350 ? 0.55 : 0.35;
      const geometry = letters.map((letter) => {
        const rect = letter.getBoundingClientRect();
        return {
          x: rect.left - bounds.left + rect.width / 2,
          y: rect.top - bounds.top + rect.height / 2,
        };
      });
      const setters = letters.map((letter) => ({
        x: gsap.quickSetter(letter, "x", "px"),
        y: gsap.quickSetter(letter, "y", "px"),
        rotation: gsap.quickSetter(letter, "rotation", "deg"),
        scaleX: gsap.quickSetter(letter, "scaleX"),
        scaleY: gsap.quickSetter(letter, "scaleY"),
        opacity: gsap.quickSetter(letter, "opacity"),
      }));
      const clock = { time: 0 };
      const draw = () =>
        setters.forEach((set, index) => {
          const launch = 1.05 + index * 0.037;
          const progress = Math.max(
            0,
            Math.min(1, (clock.time - launch) / 0.8),
          );
          const orbitTime = Math.min(clock.time, launch);
          const angle =
            (index / letters.length) * Math.PI * 2 -
            Math.PI / 2 +
            (orbitTime / 1.05) * Math.PI * 2;
          const start = {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
          };
          const target = geometry[index];
          // Leave the circle along its tangent, then arc into the original text slot.
          const control = {
            x: start.x - Math.sin(angle) * radius * 0.65,
            y: start.y + Math.cos(angle) * radius * 0.65,
          };
          const t = 1 - Math.pow(1 - progress, 3),
            inverse = 1 - t;
          const x =
            inverse * inverse * start.x +
            2 * inverse * t * control.x +
            t * t * target.x;
          const y =
            inverse * inverse * start.y +
            2 * inverse * t * control.y +
            t * t * target.y;
          set.x(x - target.x);
          set.y(y - target.y);
          set.rotation(Math.sin(angle) * 18 * inverse);
          set.scaleX(orbitScale + (1 - orbitScale) * t);
          set.scaleY(orbitScale + (1 - orbitScale) * t);
          set.opacity(Math.min(1, clock.time / 0.18));
        });
      draw();
      animation = gsap.to(clock, {
        time: 3.1,
        duration: 3.1,
        ease: "none",
        onUpdate: draw,
        onComplete: () =>
          gsap.set(letters, { clearProps: "transform,opacity" }),
      });
    };
    const observer = new MutationObserver(play);
    observer.observe(title, {
      attributes: true,
      attributeFilter: ["data-title-revealing"],
    });
    let size = `${title.offsetWidth}:${title.offsetHeight}`;
    const resize = new ResizeObserver(() => {
      const next = `${title.offsetWidth}:${title.offsetHeight}`;
      if (next !== size) {
        size = next;
        play();
      }
    });
    resize.observe(title);
    motion.addEventListener("change", reset);
    play();
    return () => {
      observer.disconnect();
      resize.disconnect();
      motion.removeEventListener("change", reset);
      reset();
    };
  }, [ref]);
  return ref;
}

// Surface centers measured in the original 4168 × 2443 artwork.
const isoAnchors = [
  { left: "56.04%", top: "61.37%" },
  { left: "67.01%", top: "49.76%" },
  { left: "77.64%", top: "38.51%" },
];
const qualityCards = [
  {
    value: "%100",
    title: "Hydraulic Test Coverage",
    description:
      "Every manufactured pump is verified in our ISO 9906 closed-loop test facility.",
  },
  {
    value: "14+",
    title: "Global Type Approvals & Systems",
    description:
      "TÜV NORD, TÜRKAK, TSE, CE, ErP, NFPA 20, EAC, SASO certified.",
  },
  {
    value: "EN 10204",
    title: "3.1 / 3.2 Material Traceability",
    description:
      "Full chemical and mechanical traceability from melt heat to finished pump.",
  },
  {
    value: "Class 1 & 2",
    title: "ISO 9906 Grade 1 & 2 Testing",
    description:
      "TÜV NORD, TÜRKAK, TSE, CE, ErP, NFPA 20, EAC, SASO certified.",
  },
];
type QualityStage = {
  id: number;
  number: string;
  title: string;
  titleLines?: string[];
  image: string;
  description: string;
  equipment: string;
  checks: string[];
  standards: string[];
  caption: string;
};
const exampleQualityStage: QualityStage = {
  id: 1,
  number: "01",
  title: "Spectrometric & Metallurgical Ingot Analysis",
  titleLines: ["Spectrometric &", "Metallurgical Ingot", "Analysis"],
  // Pre-encoded copy of the supplied PNG avoids repeated processing of the 38MB source.
  image: "/quality/Kalite kontrol-01.webp",
  description:
    "In-house chemical composition and microstructure verification before casting",
  equipment:
    "Optical Emission Spectrometer & Metallurgical Microstructure Analyzer",
  checks: [
    "Calibrated Metrology & SCADA Logging",
    "Lifetime Digital Traceability & Archiving",
  ],
  standards: [
    "ASTM A890 / A995",
    "EN 1561 / EN 1563",
    "DIN 17007 / All Standards",
  ],
  caption:
    "Before induction melting, optical emission spectrometers verify the exact alloy composition of ductile iron, bronze, duplex stainless, and alloy steels in compliance with EN and ASTM standards.",
};
// 02 and 03 deliberately repeat the first stage for the slider preview.
const qualityStages: (QualityStage | null)[] = [
  ...[1, 2, 3].map((id) => ({
    ...exampleQualityStage,
    id,
    number: String(id).padStart(2, "0"),
  })),
  null,
  null,
];
const certificateIcons = {
  iso: "/quality/ISO.png",
  ce: "/quality/Group%20(4).png",
  erp: "/quality/ErP%202009%20125%20EC%201.png",
  tse: "/quality/Group%20(6).png",
  nfpa: "/quality/NFPA_logo%201.png",
  eac: "/quality/EAC_b-on-w%201.png",
};
const certificates = [
  {
    title: "ISO 9001:2015",
    description: "Quality Management System Certificate",
    icon: certificateIcons.iso,
  },
  {
    title: "ISO 14001:2015",
    description: "Environmental Management System Certificate",
    icon: certificateIcons.iso,
  },
  {
    title: "ISO 45001:2018",
    description: "Occupational Health & Safety Management System",
    icon: certificateIcons.iso,
  },
  {
    title: "ISO 50001:2018",
    description: "Energy Management System Certificate",
    icon: certificateIcons.iso,
  },
  {
    title: "ISO 14064-1:2018",
    description: "Corporate GHG (Carbon Footprint) Verification Statement",
    icon: certificateIcons.iso,
  },
  {
    title: "CE 2006/42/AT",
    description: "EU Machinery Directive 2006/42/EC Declaration of Conformity",
    icon: certificateIcons.ce,
  },
  {
    title: "ErP 2009/125/EC",
    description: "Ecodesign Directive & MEI Minimum Efficiency Index",
    icon: certificateIcons.erp,
  },
  {
    title: "TSE & TSEK",
    description: "Turkish Standards Institute (TSE) Product Conformity",
    icon: certificateIcons.tse,
  },
  {
    title: "NFPA 20 & UL/FM",
    description: "Fire Protection Systems & NFPA 20 Standards Compliance",
    icon: certificateIcons.nfpa,
  },
  {
    title: "EAC & GOST-R",
    description: "Eurasian Customs Union (EAC) & GOST-R Conformity",
    icon: certificateIcons.eac,
  },
];
const qualityPolicyImage = "/quality/policy.webp";
const exampleQualityPolicy = {
  id: "quality-management",
  title: "Quality Management System",
  image: qualityPolicyImage,
  imageAlt: "Silver and blue first-place quality medal with two ribbons",
  progress: 21,
  statements: [
    "To be a reliable and sought-after company in all processes, adopting an approach that fully meets customer needs and expectations,",
    "To closely follow and implement technological developments in order to reduce costs and increase market share and profitability,",
    "To continuously improve the quality management system within the framework of quality systems by emphasizing teamwork, enabling all employees to become more competent individuals who can utilize their abilities at the highest level,",
    "To establish awareness of quality, environment, and occupational health and safety among all employees,",
    "To maintain strong cooperation based on commercial relationships with customers and suppliers,",
    "To produce the most appropriate, most accurate, and most economical solutions in the fastest way possible and to prevent potential nonconformities,",
    "To complete every order undertaken in a timely manner, using the highest level of technical methods and in accordance with the required quality standards,",
    "To comply with nuclear safety requirements and ensure that other priorities do not compromise nuclear safety,",
    "To be an exemplary organization that commits to fulfilling all applicable requirements with respect for the society and the environment in which we operate, has adopted this as its QUALITY POLICY.",
  ],
  signatoryRole: "Chairman of the Board",
  signatory: "Seyit Mehmet Ferahkaya",
};
// The sample policies share identical copy and imagery until real alternatives arrive.
const qualityPolicies = [1, 2, 3].map((number) => ({
  ...exampleQualityPolicy,
  id: `quality-management-${number}`,
}));
function CertificatesSection() {
  const [visibleCount, setVisibleCount] = useState(10);
  const [feedback, setFeedback] = useState("");
  const certificateTrack = useRef<HTMLDivElement>(null);
  const [certificatePage, setCertificatePage] = useState(0);
  const visibleCertificates = certificates.slice(0, visibleCount);
  const certificatePageCount = Math.ceil(visibleCertificates.length / 2);
  const scrollCertificates = (page: number) => {
    const track = certificateTrack.current;
    const orderedCards = track
      ? Array.from(track.children)
          .map((child) => child as HTMLElement)
          .sort((a, b) => a.offsetLeft - b.offsetLeft)
      : [];
    const card = orderedCards[page * 2];
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - orderedCards[0].offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const loadMore = () => {
    if (visibleCount < certificates.length) {
      setVisibleCount(Math.min(visibleCount + 10, certificates.length));
      setFeedback("");
    } else {
      setFeedback("All certificates are displayed.");
    }
  };
  return (
    <section
      className="quality-certificates"
      aria-labelledby="quality-certificates-title"
    >
      <div className="quality-certificates-heading [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:center] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:25px] [.quality-page_&]:[margin-bottom:calc(70_*_var(--compliance-unit))] [.quality-page_&_h2]:[margin-top:0] [.quality-page_&_h2]:[margin-right:0] [.quality-page_&_h2]:[margin-bottom:0] [.quality-page_&_h2]:[margin-left:0] [.quality-page_&_h2]:[color:#0d5792]! [.quality-page_&_h2]:[font-size:calc(25_*_var(--compliance-unit))]! [.quality-page_&_h2]:[font-weight:540]! [.quality-page_&_h2]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.quality-page_&_h2]:[line-height:1.12]! [.quality-page_&_h2]:[letter-spacing:0] [.quality-page_&_>_p]:[flex-shrink:0] [.quality-page_&_>_p]:[margin-top:0] [.quality-page_&_>_p]:[margin-right:0] [.quality-page_&_>_p]:[margin-bottom:0] [.quality-page_&_>_p]:[margin-left:0] [.quality-page_&_>_p]:[color:#0d5792]! [.quality-page_&_>_p]:[font-size:calc(12_*_var(--compliance-unit))]! [.quality-page_&_>_p]:[text-align:right] max-md:[.quality-page_&]:[flex-direction:column] max-md:[.quality-page_&]:[align-items:center] max-md:[.quality-page_&]:[gap:16px] max-md:[.quality-page_&_h2]:[font-size:21px]! max-md:[.quality-page_&]:[margin-bottom:36px] max-md:[.quality-page_&]:[text-align:center] max-md:[.quality-page_&_>_p]:[font-size:10px]! max-md:[.quality-page_&_>_p]:[text-align:center]">
        <h2 id="quality-certificates-title">
          Accredited Certificates &amp; Compliance Portfolio
        </h2>
        <p>Showing {visibleCertificates.length} Certificates</p>
      </div>
      <div
        className="quality-certificate-grid [.quality-page_&]:[display:grid]! [.quality-page_&]:[grid-template-columns:repeat(5,_minmax(0,_1fr))] [.quality-page_&]:[gap:calc(15_*_var(--compliance-unit))] max-xl:[.quality-page_&]:[grid-template-columns:repeat(3,minmax(0,1fr))] max-md:[.quality-page_&]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-md:[.quality-page_&]:[gap:12px] max-sm:[.quality-page_&]:[grid-template-columns:1fr] max-md:[.quality-page_&]:[position:relative] max-md:[.quality-page_&]:[display:flex]! max-md:[.quality-page_&]:[overflow-x:auto] max-md:[.quality-page_&]:[scroll-snap-type:x_mandatory] max-md:[.quality-page_&]:[scrollbar-width:none] max-md:[.quality-page_&]:[padding-top:4px] max-md:[.quality-page_&]:[padding-right:0] max-md:[.quality-page_&]:[padding-bottom:12px] max-md:[.quality-page_&]:[padding-left:0] max-md:[.quality-page_&::-webkit-scrollbar]:[display:none]!"
        ref={certificateTrack}
        onScroll={() => {
          const track = certificateTrack.current;
          if (!track || !track.children[1]) return;
          const stride =
            (track.children[0] as HTMLElement).getBoundingClientRect().width +
            parseFloat(getComputedStyle(track).columnGap);
          setCertificatePage(
            Math.min(
              certificatePageCount - 1,
              Math.round(track.scrollLeft / (stride * 2)),
            ),
          );
        }}
      >
        {visibleCertificates.map((certificate, index) => (
          <article
            className="quality-certificate [.quality-page_&]:[min-width:0] [.quality-page_&]:[min-height:calc(149_*_var(--compliance-unit))] [.quality-page_&]:[padding-top:calc(23_*_var(--compliance-unit))] [.quality-page_&]:[padding-right:calc(25_*_var(--compliance-unit))] [.quality-page_&]:[padding-bottom:calc(23_*_var(--compliance-unit))] [.quality-page_&]:[padding-left:calc(25_*_var(--compliance-unit))] [.quality-page_&]:[border:1px_solid_#9eb7d0] [.quality-page_&]:[border-radius:calc(15_*_var(--compliance-unit))] [.quality-page_&]:[background:#ffffff4d] [.quality-page_&]:[backdrop-filter:blur(30px)] [.quality-page_&]:[transition:transform_300ms_ease,_background-color_300ms_ease,_border-color_300ms_ease,_box-shadow_300ms_ease] [.quality-page_&_h3]:[margin-top:0] [.quality-page_&_h3]:[margin-right:0] [.quality-page_&_h3]:[margin-bottom:0] [.quality-page_&_h3]:[margin-left:0] [.quality-page_&_h3]:[color:#0d5792]! [.quality-page_&_h3]:[font-size:calc(15_*_var(--compliance-unit))]! [.quality-page_&_h3]:[font-weight:410]! [.quality-page_&_h3]:[line-height:1]! [.quality-page_&_h3]:[white-space:pre-line] [.quality-page_&_img]:[flex-shrink:0] [.quality-page_&_img]:[width:calc(30_*_var(--compliance-unit))] [.quality-page_&_img]:[height:calc(30_*_var(--compliance-unit))] [.quality-page_&_img]:[object-fit:contain] [.quality-page_&_>_p]:[margin-top:calc(20_*_var(--compliance-unit))] [.quality-page_&_>_p]:[margin-right:0] [.quality-page_&_>_p]:[margin-bottom:0] [.quality-page_&_>_p]:[margin-left:0] [.quality-page_&_>_p]:[color:#27272a]! [.quality-page_&_>_p]:[font-size:calc(12_*_var(--compliance-unit))]! [.quality-page_&_>_p]:[line-height:1]! [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[background:#ffffff80] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[border-color:#4687b8] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[transform:translateY(-4px)] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[box-shadow:0_8px_24px_#005eff1a] max-md:[.quality-page_&]:[padding-top:20px] max-md:[.quality-page_&]:[padding-right:18px] max-md:[.quality-page_&]:[padding-bottom:20px] max-md:[.quality-page_&]:[padding-left:18px] max-md:[.quality-page_&]:[min-height:145px] max-md:[.quality-page_&_h3]:[flex:1_1_85px]      motion-reduce:[.quality-page_&]:[transition:none] max-md:[.quality-page_&]:[order:var(--mobile-certificate-order)] max-md:[.quality-page_&]:[flex:0_0_66%] max-md:[.quality-page_&]:[scroll-snap-align:start] max-md:[.quality-page_&_h3]:[font-size:13px]! max-md:[.quality-page_&_>_p]:[font-size:11px]! max-md:[.quality-page_&_img]:[width:27px] max-md:[.quality-page_&_img]:[height:27px]"
            key={certificate.title}
            style={
              {
                "--mobile-certificate-order":
                  index < 10 ? (index % 5) * 2 + Math.floor(index / 5) : index,
              } as CSSProperties
            }
          >
            <div className="quality-certificate-top [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:start] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:8px] max-md:[.quality-page_&]:[flex-wrap:wrap]">
              <h3>{certificate.title.replace(/^(ISO|CE|ErP) /, "$1\n")}</h3>
              <Image
                src={certificate.icon}
                alt={`${certificate.title} certification mark`}
                width={30}
                height={30}
                sizes="30px"
              />
            </div>
            <p>{certificate.description}</p>
          </article>
        ))}
      </div>
      <nav
        className="quality-certificate-pagination [.quality-page_&]:[display:none]! max-md:[.quality-page_&]:[display:flex]! max-md:[.quality-page_&]:[justify-content:center] max-md:[.quality-page_&]:[gap:2px] max-md:[.quality-page_&]:[margin-top:10px] max-md:[.quality-page_&_button]:[width:26px] max-md:[.quality-page_&_button]:[height:28px] max-md:[.quality-page_&_button]:[border:0] max-md:[.quality-page_&_button]:[padding-top:10px] max-md:[.quality-page_&_button]:[padding-right:4px] max-md:[.quality-page_&_button]:[padding-bottom:10px] max-md:[.quality-page_&_button]:[padding-left:4px] max-md:[.quality-page_&_button]:[background:transparent] max-md:[.quality-page_&_button]:[cursor:pointer] max-md:[.quality-page_&_span]:[display:block]! max-md:[.quality-page_&_span]:[height:4px] max-md:[.quality-page_&_span]:[border-radius:3px] max-md:[.quality-page_&_span]:[background:#d5dfe7] max-md:[.quality-page_&_button[aria-current='page']_span]:[background:#9eb7d0]"
        aria-label="Certificate pages"
      >
        {Array.from({ length: certificatePageCount }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show certificate page ${index + 1}`}
            aria-current={certificatePage === index ? "page" : undefined}
            onClick={() => scrollCertificates(index)}
          >
            <span />
          </button>
        ))}
      </nav>
      <div className="quality-certificate-actions [.quality-page_&]:[position:relative] [.quality-page_&]:[display:flex]! [.quality-page_&]:[justify-content:center] [.quality-page_&]:[margin-top:calc(70_*_var(--compliance-unit))] max-md:[.quality-page_&]:[margin-top:28px]">
        <LoadMoreButton onClick={loadMore} />
        <p
          className="quality-certificate-status [.quality-page_&]:[position:absolute] [.quality-page_&]:[top:calc(100%_+_12px)] [.quality-page_&]:[left:0] [.quality-page_&]:[right:0] [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#0d5792]! [.quality-page_&]:[font-size:12px]! [.quality-page_&]:[text-align:center]"
          role="status"
        >
          {feedback}
        </p>
      </div>
    </section>
  );
}
function QualityPolicySection() {
  const [activePolicy, setActivePolicy] = useState(0);
  const [direction, setDirection] = useState(1);
  const policy = qualityPolicies[activePolicy];
  const changePolicy = (index: number) => {
    if (!qualityPolicies[index]) return;
    setDirection(index > activePolicy ? 1 : -1);
    setActivePolicy(index);
  };
  return (
    <section
      className="quality-policy [.quality-page_&]:[margin-top:calc(100_*_var(--compliance-unit))] max-md:[.quality-page_&]:[margin-top:70px]"
      aria-label="Quality policies"
      aria-roledescription="carousel"
    >
      <div
        className="quality-policy-slide [.quality-page_&]:[display:grid]! [.quality-page_&]:[grid-template-columns:minmax(0,_372fr)_minmax(0,_750fr)] [.quality-page_&]:[align-items:start] [.quality-page_&]:[gap:calc(68_*_var(--compliance-unit))] [.quality-page_&]:[min-height:calc(450_*_var(--compliance-unit))] [.quality-page_&]:animate-migrated-166b85d89 max-xl:[.quality-page_&]:[grid-template-columns:minmax(0,1fr)_minmax(0,2fr)] max-xl:[.quality-page_&]:[gap:35px] max-md:[.quality-page_&]:[grid-template-columns:1fr] max-md:[.quality-page_&]:[gap:36px] motion-reduce:[.quality-page_&]:[animation:none] md:max-lg:[.quality-page_&]:[grid-template-columns:minmax(0,_1fr)] md:max-lg:[.quality-page_&]:[gap:36px]"
        key={policy.id}
        style={{ "--policy-direction": direction } as CSSProperties}
        role="group"
        aria-label={`Quality policy ${activePolicy + 1} of ${qualityPolicies.length}`}
      >
        <div className="quality-policy-image [.quality-page_&]:[position:relative] [.quality-page_&]:[width:100%] [.quality-page_&]:[height:calc(424_*_var(--compliance-unit))] [.quality-page_&]:[margin-top:calc(35_*_var(--compliance-unit))] [.quality-page_&]:[filter:drop-shadow(0_12px_12px_#0d579212)] [.quality-page_&_img]:[object-fit:contain] max-md:[.quality-page_&]:[width:min(420px,_calc(100%_+_40px))] max-md:[.quality-page_&]:[max-width:none] max-md:[.quality-page_&]:[height:auto] max-md:[.quality-page_&]:[margin-top:0] max-md:[.quality-page_&]:[margin-right:auto] max-md:[.quality-page_&]:[margin-bottom:0] max-md:[.quality-page_&]:[margin-left:50%] max-md:[.quality-page_&]:[aspect-ratio:1920_/_2192] max-md:[.quality-page_&]:[transform:translateX(-50%)] md:max-lg:[.quality-page_&]:[width:310px] md:max-lg:[.quality-page_&]:[max-width:100%] md:max-lg:[.quality-page_&]:[height:354px] md:max-lg:[.quality-page_&]:[margin-top:0] md:max-lg:[.quality-page_&]:[margin-right:auto] md:max-lg:[.quality-page_&]:[margin-bottom:0] md:max-lg:[.quality-page_&]:[margin-left:auto]">
          <Image
            src={policy.image}
            alt={policy.imageAlt}
            fill
            unoptimized
            sizes="(max-width: 1023px) 310px, 26vw"
          />
        </div>
        <div className="quality-policy-content [.quality-page_&]:[min-width:0] max-md:[.quality-page_&_>_div[aria-live]]:[width:90%] max-md:[.quality-page_&_>_div[aria-live]]:[max-width:330px] max-md:[.quality-page_&_>_div[aria-live]]:[margin-left:auto] max-md:[.quality-page_&_>_div[aria-live]]:[margin-right:auto] md:max-lg:[.quality-page_&]:[width:100%] md:max-lg:[.quality-page_&]:[max-width:680px] md:max-lg:[.quality-page_&]:[margin-left:auto] md:max-lg:[.quality-page_&]:[margin-right:auto]">
          <div className="quality-policy-heading [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:center] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:20px] [.quality-page_&_h2]:[margin-top:0] [.quality-page_&_h2]:[margin-right:0] [.quality-page_&_h2]:[margin-bottom:0] [.quality-page_&_h2]:[margin-left:0] [.quality-page_&_h2]:[color:#0d5792]! [.quality-page_&_h2]:[font-weight:410]! [.quality-page_&_h2]:[font-size:calc(20_*_var(--compliance-unit))]! [.quality-page_&_h2]:[line-height:1.12]!   max-md:[.quality-page_&]:[flex-direction:column] max-md:[.quality-page_&]:[align-items:center] max-md:[.quality-page_&]:[text-align:center] max-md:[.quality-page_&]:[gap:18px] max-md:[.quality-page_&_h2]:[font-size:19px]! md:max-lg:[.quality-page_&]:[justify-content:center] md:max-lg:[.quality-page_&]:[flex-direction:column] md:max-lg:[.quality-page_&]:[text-align:center] md:max-lg:[.quality-page_&]:[gap:18px]">
            <h2>{policy.title}</h2>
            <div className="quality-policy-arrows [.quality-page_&]:[display:flex]! [.quality-page_&]:[flex-shrink:0] [.quality-page_&]:[gap:20px] [.quality-page_&_button]:[display:grid]! [.quality-page_&_button]:[place-items:center] [.quality-page_&_button]:[width:24px] [.quality-page_&_button]:[height:28px] [.quality-page_&_button]:[padding-top:0] [.quality-page_&_button]:[padding-right:0] [.quality-page_&_button]:[padding-bottom:0] [.quality-page_&_button]:[padding-left:0] [.quality-page_&_button]:[border:0] [.quality-page_&_button]:[background:transparent] [.quality-page_&_button]:[color:#9eb7d0]! [.quality-page_&_button]:[cursor:pointer] [.quality-page_&_button]:[transition:color_250ms_ease] [.quality-page_&_svg]:[width:22px] [.quality-page_&_svg]:[height:22px] [.quality-page_&_button:disabled]:[opacity:.5] [.quality-page_&_button:disabled]:[cursor:not-allowed] [.quality-page_&_button:not(:disabled):hover]:[color:#0d5792]! max-md:[.quality-page_&]:[gap:24px] max-md:[.quality-page_&_button]:[width:36px] max-md:[.quality-page_&_button]:[height:36px] max-md:[.quality-page_&_svg]:[width:32px] max-md:[.quality-page_&_svg]:[height:32px]">
              <button
                type="button"
                aria-label="Previous quality policy"
                disabled={activePolicy === 0}
                onClick={() => changePolicy(activePolicy - 1)}
              >
                <LuArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next quality policy"
                disabled={activePolicy === qualityPolicies.length - 1}
                onClick={() => changePolicy(activePolicy + 1)}
              >
                <LuArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            className="quality-policy-progress [.quality-page_&]:[height:3px] [.quality-page_&]:[margin-top:calc(20_*_var(--compliance-unit))] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:calc(20_*_var(--compliance-unit))] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[overflow:hidden] [.quality-page_&]:[border-radius:2px] [.quality-page_&]:[background:#9eb7d0] [.quality-page_&_span]:[display:block]! [.quality-page_&_span]:[height:100%] [.quality-page_&_span]:[background:#0d5792] [.quality-page_&_span]:[transition:width_450ms_ease] motion-reduce:[.quality-page_&_span]:[transition:none] max-md:[.quality-page_&]:[margin-top:26px] max-md:[.quality-page_&]:[margin-right:0] max-md:[.quality-page_&]:[margin-bottom:36px] max-md:[.quality-page_&]:[margin-left:0]"
            role="progressbar"
            aria-label="Quality policy position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              qualityPolicies.length === 1
                ? policy.progress
                : ((activePolicy + 1) / qualityPolicies.length) * 100
            }
          >
            <span
              style={{
                width: `${qualityPolicies.length === 1 ? policy.progress : ((activePolicy + 1) / qualityPolicies.length) * 100}%`,
              }}
            />
          </div>
          <div aria-live="polite" aria-atomic="true">
            <ul className="quality-policy-statements [.quality-page_&]:[display:grid]! [.quality-page_&]:[gap:calc(2_*_var(--compliance-unit))] [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[padding-top:0] [.quality-page_&]:[padding-right:0] [.quality-page_&]:[padding-bottom:0] [.quality-page_&]:[padding-left:17px] [.quality-page_&]:[color:#000]! [.quality-page_&]:[font-size:calc(15_*_var(--compliance-unit))]! [.quality-page_&]:[line-height:1]! [.quality-page_&]:[list-style:disc] max-md:[.quality-page_&]:[line-height:1.05]! max-md:[.quality-page_&]:[gap:2px] max-md:[.quality-page_&]:[font-size:14px]! md:max-lg:[.quality-page_&]:[line-height:1.2]! md:max-lg:[.quality-page_&]:[gap:10px]">
              {policy.statements.map((statement) => (
                <li key={statement}>{statement}</li>
              ))}
            </ul>
            <div className="quality-policy-signature [.quality-page_&]:[margin-top:20px] [.quality-page_&]:[color:#000]! [.quality-page_&_p]:[margin-top:0] [.quality-page_&_p]:[margin-right:0] [.quality-page_&_p]:[margin-bottom:0] [.quality-page_&_p]:[margin-left:0] [.quality-page_&_p]:[font-size:calc(9_*_var(--compliance-unit))]! [.quality-page_&_p]:[line-height:1.12]! [.quality-page_&_p_+_p]:[margin-top:6px] [.quality-page_&_p_+_p]:[font-size:calc(15_*_var(--compliance-unit))]! [.quality-page_&_p_+_p]:[font-weight:540]! [.quality-page_&_p_+_p]:[font-variation-settings:'wght'_540,_'wdth'_125]! max-md:[.quality-page_&_p_+_p]:[font-size:13px]!">
              <p>{policy.signatoryRole}</p>
              <p>{policy.signatory}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// Standard Tailwind breakpoints keep the complete hero fitted to the viewport.
const qualityResponsive = [
  "lg:[&_.quality-hero]:[--quality-unit:min(0.0694444444vw,_0.1176470588svh,_1.777778px)]!",
  "lg:[&_.quality-hero]:[min-height:100svh]!",
  "lg:[&_.quality-hero]:[padding-top:calc(650_*_var(--quality-unit))]!",
  "lg:[&_.quality-hero]:[padding-bottom:calc(15_*_var(--quality-unit))]!",
  "lg:[&_.quality-scene]:[--quality-scene-unit:var(--quality-unit)]!",
  "lg:[&_.quality-scene]:[mask-image:linear-gradient(90deg,_transparent,_#000_6%,_#000_94%,_transparent)]!",
  "lg:[&_.quality-scene]:[width:calc(1440_*_var(--quality-unit))]!",
  "lg:[&_.quality-scene]:[left:50%]!",
  "lg:[&_.quality-scene]:[transform:translateX(-50%)]!",
  "lg:[&_.quality-introduction]:[top:max(calc(var(--quality-header-offset)_+_18px),_calc(190_*_var(--quality-unit)))]!",
  "lg:[&_.quality-introduction]:[left:calc((100%_-_1200_*_var(--quality-unit))_/_2)]!",
  "lg:[&_.quality-introduction]:[max-width:calc(560_*_var(--quality-unit))]!",
  "lg:[&_.quality-introduction_h1]:[font-size:calc(80_*_var(--quality-unit))]!",
].join(" ");

export default function QualityPage() {
  const orbitTitle = useQualityOrbitTitle();
  const pageRef = useScrollReveal(
    ".quality-introduction, .quality-scene, .quality-card, .quality-inspection-heading, .quality-inspection-slider, .quality-certificates-heading, .quality-certificate, .quality-certificate-actions, .quality-policy, .quality-newsletter",
  );
  const [stageIndex, setStageIndex] = useState(0);
  const [stagePickerOpen, setStagePickerOpen] = useState(false);
  const [stageDirection, setStageDirection] = useState(1);
  const stage = qualityStages[stageIndex]!;
  const previousStage = qualityStages.findLastIndex(
    (item, index) => item !== null && index < stageIndex,
  );
  const nextStage = qualityStages.findIndex(
    (item, index) => item !== null && index > stageIndex,
  );
  const selectStage = (index: number) => {
    if (!qualityStages[index]) return;
    setStageDirection(index >= stageIndex ? 1 : -1);
    setStageIndex(index);
    setStagePickerOpen(false);
  };
  useEffect(() => {
    const page = pageRef.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!page || !header) return;
    const updateHeaderOffset = () => {
      const inFlow = !["absolute", "fixed"].includes(
        getComputedStyle(header).position,
      );
      page.style.setProperty(
        "--quality-header-offset",
        inFlow ? `${header.getBoundingClientRect().height}px` : "0px",
      );
    };
    updateHeaderOffset();
    const observer = new ResizeObserver(updateHeaderOffset);
    observer.observe(header);
    return () => observer.disconnect();
  }, [pageRef]);
  return (
    <main
      ref={pageRef}
      className={`${qualityResponsive} quality-page font-sans [html:has(&)]:[overflow-x:clip] [body:has(&)]:[overflow-x:clip] [--quality-unit:clamp(0.833333px,_0.0694444444vw,_1.777778px)] [--quality-header-offset:97px] [width:100%] [min-height:100svh] [margin-top:calc(-1_*_var(--quality-header-offset))] [background:#f7fbff] [letter-spacing:-0.04em] max-xl:[--quality-unit:1px] max-md:[background:linear-gradient(180deg,_#f7fbff,_transparent_580px),_linear-gradient(110deg,_#e2f1ff,_#c8e4ff_65%,_#e5f3ff)] [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,_'wdth'_125]! [font-optical-sizing:auto]`}
    >
      <section
        className="quality-hero [.quality-page_&]:[position:relative] [.quality-page_&]:[isolation:isolate] [.quality-page_&]:[width:100%] [.quality-page_&]:[min-height:calc(850_*_var(--quality-unit))] [.quality-page_&]:[overflow:hidden] [.quality-page_&]:[padding-top:calc(650_*_var(--quality-unit))] [.quality-page_&]:[padding-right:24px] [.quality-page_&]:[padding-bottom:calc(15_*_var(--quality-unit))] [.quality-page_&]:[padding-left:24px] max-xl:[.quality-page_&]:[min-height:850px] max-xl:[.quality-page_&]:[padding-top:630px] max-xl:[.quality-page_&]:[padding-bottom:48px] max-lg:[.quality-page_&]:[padding-top:570px] max-md:[.quality-page_&]:[min-height:0] max-md:[.quality-page_&]:[padding-top:600px] max-md:[.quality-page_&]:[padding-right:20px] max-md:[.quality-page_&]:[padding-bottom:0] max-md:[.quality-page_&]:[padding-left:20px] max-md:[.quality-page_&]:[background:transparent]"
        aria-labelledby="quality-title"
      >
        <div className="quality-scene [.quality-page_&]:[--quality-scene-unit:0.0694444444vw] [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:0] [.quality-page_&]:[top:0] [.quality-page_&]:[left:0] [.quality-page_&]:[width:100%] [.quality-page_&]:[aspect-ratio:4168_/_2443] max-md:[.quality-page_&]:[--quality-scene-unit:min(0.125vw,_0.5px)] max-md:[.quality-page_&]:[top:180px] max-md:[.quality-page_&]:[left:50%] max-md:[.quality-page_&]:[width:min(180%,_720px)] max-md:[.quality-page_&]:[transform:translateX(-67.2222%)]">
          <Image
            src="/quality/kalite-yonetimi.webp"
            alt="Three ascending white certification pillars with blue glass surfaces"
            fill
            unoptimized
            sizes="(max-width: 767px) 180vw, 100vw"
            preload
            className="quality-artwork [.quality-page_&]:[object-fit:contain] [.quality-page_&]:[object-position:center_top] [.quality-page_&]:[pointer-events:none] max-xl:[.quality-page_&]:[mask-image:linear-gradient(180deg,_#000_0%,_#000_62%,_#000000e6_72%,_#00000080_85%,_transparent_100%)] max-md:[.quality-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_15%,_#000_64%,_#000000e6_74%,_#00000080_86%,_transparent_100%)]"
          />
          {isoAnchors.map((anchor, index) => (
            <div
              className="quality-iso-marker [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:1] [.quality-page_&]:[display:flex]! [.quality-page_&]:[flex-direction:column] [.quality-page_&]:[align-items:center] [.quality-page_&]:[width:5.56%] [.quality-page_&]:[transform:translate(-50%,_-100%)] [.quality-page_&]:[pointer-events:none] [.quality-page_&_>_img]:[width:100%] [.quality-page_&_>_img]:[height:auto]"
              style={anchor}
              key={index}
              aria-hidden="true"
            >
              <Image
                src="/quality/ISO.png"
                alt=""
                width={210}
                height={208}
                sizes="(max-width: 767px) 45px, 6vw"
              />
              <span className="quality-iso-connector [.quality-page_&]:[position:relative] [.quality-page_&]:[width:1px] [.quality-page_&]:[height:calc(105_*_var(--quality-scene-unit))] [.quality-page_&]:[background:#005eff] [.quality-page_&_>_span]:[position:absolute] [.quality-page_&_>_span]:[left:50%] [.quality-page_&_>_span]:[bottom:calc(-3_*_var(--quality-scene-unit))] [.quality-page_&_>_span]:[width:calc(6_*_var(--quality-scene-unit))] [.quality-page_&_>_span]:[height:calc(6_*_var(--quality-scene-unit))] [.quality-page_&_>_span]:[border:1px_solid_#005eff] [.quality-page_&_>_span]:[border-radius:50%] [.quality-page_&_>_span]:[background:#72b4ff] [.quality-page_&_>_span]:[transform:translateX(-50%)]">
                <span />
              </span>
            </div>
          ))}
          <div className="quality-certification-badge [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:2] [.quality-page_&]:[top:70.8%] [.quality-page_&]:[left:75.4%] [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:center] [.quality-page_&]:[gap:calc(8_*_var(--quality-scene-unit))] [.quality-page_&]:[width:calc(225_*_var(--quality-scene-unit))] [.quality-page_&]:[min-height:calc(47_*_var(--quality-scene-unit))] [.quality-page_&]:[padding-top:calc(6_*_var(--quality-scene-unit))] [.quality-page_&]:[padding-right:calc(10_*_var(--quality-scene-unit))] [.quality-page_&]:[padding-bottom:calc(6_*_var(--quality-scene-unit))] [.quality-page_&]:[padding-left:calc(10_*_var(--quality-scene-unit))] [.quality-page_&]:[border:0.25px_solid_#fff] [.quality-page_&]:[border-radius:calc(8_*_var(--quality-scene-unit))] [.quality-page_&]:[background:#ffffff26] [.quality-page_&]:[backdrop-filter:blur(12px)] [.quality-page_&]:[color:#4687b8]! [.quality-page_&]:[font-size:calc(12_*_var(--quality-scene-unit))]! [.quality-page_&]:[line-height:1.12]! [.quality-page_&_img]:[flex-shrink:0] [.quality-page_&_img]:[width:calc(34_*_var(--quality-scene-unit))] [.quality-page_&_img]:[height:auto] max-md:[.quality-page_&]:[left:50%] max-md:[.quality-page_&]:[top:84%] max-md:[.quality-page_&]:[width:270px] max-md:[.quality-page_&]:[min-height:56px] max-md:[.quality-page_&]:[gap:10px] max-md:[.quality-page_&]:[padding-top:8px] max-md:[.quality-page_&]:[padding-right:12px] max-md:[.quality-page_&]:[padding-bottom:8px] max-md:[.quality-page_&]:[padding-left:12px] max-md:[.quality-page_&]:[border-radius:10px] max-md:[.quality-page_&]:[font-size:12px]! max-md:[.quality-page_&_img]:[width:36px] max-md:[.quality-page_&]:[line-height:1.12]! max-md:[.quality-page_&]:[background:#ffffff40] max-sm:[.quality-page_&]:[width:235px] max-sm:[.quality-page_&]:[font-size:11px]!">
            <Image
              src="/quality/Frame%202398.png"
              alt=""
              width={160}
              height={157}
              sizes="34px"
            />
            <span>
              TÜV NORD • TÜRKAK
              <br className="quality-badge-break [.quality-page_&]:[display:none]! max-md:[.quality-page_&]:[display:block]!" />{" "}
              • TSE • CE
            </span>
          </div>
        </div>

        <div className="quality-introduction [.quality-page_&_h1_>_span]:[display:block]! [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:2] [.quality-page_&]:[top:calc(190_*_var(--quality-unit))] [.quality-page_&]:[left:calc(120_*_var(--quality-unit))] [.quality-page_&]:[max-width:calc(560_*_var(--quality-unit))] [.quality-page_&_h1]:[margin-top:0] [.quality-page_&_h1]:[margin-right:0] [.quality-page_&_h1]:[margin-bottom:0] [.quality-page_&_h1]:[margin-left:0] [.quality-page_&_h1]:[color:#005eff]! [.quality-page_&_h1]:[font-size:calc(80_*_var(--quality-unit))]! [.quality-page_&_h1]:[font-weight:410]! [.quality-page_&_h1]:[line-height:1]! [.quality-page_&_h1]:[letter-spacing:-0.04em] [.quality-page_&_>_p]:[width:calc(440_*_var(--quality-unit))] [.quality-page_&_>_p]:[max-width:100%] [.quality-page_&_>_p]:[margin-top:calc(30_*_var(--quality-unit))] [.quality-page_&_>_p]:[margin-right:0] [.quality-page_&_>_p]:[margin-bottom:0] [.quality-page_&_>_p]:[margin-left:0] [.quality-page_&_>_p]:[color:#9eb7d0]! [.quality-page_&_>_p]:[font-size:calc(15_*_var(--quality-unit))]! [.quality-page_&_>_p]:[line-height:1]! max-xl:[.quality-page_&]:[top:170px] max-xl:[.quality-page_&]:[left:7%] max-xl:[.quality-page_&]:[max-width:47%] max-xl:[.quality-page_&_h1]:[font-size:clamp(44px,_5.5vw,_66px)]! max-xl:[.quality-page_&_>_p]:[width:360px] max-xl:[.quality-page_&_>_p]:[font-size:14px]! max-xl:[.quality-page_&_>_p]:[line-height:1.2]! max-md:[.quality-page_&]:[top:130px] max-md:[.quality-page_&]:[left:24px] max-md:[.quality-page_&]:[max-width:calc(100%_-_48px)] max-md:[.quality-page_&_h1]:[font-size:clamp(24px,_6.7vw,_36px)]! max-md:[.quality-page_&_>_p]:[width:340px] max-md:[.quality-page_&_>_p]:[margin-top:22px] max-md:[.quality-page_&_>_p]:[font-size:14px]! max-md:[.quality-page_&_h1]:[line-height:1]! max-md:[.quality-page_&_h1_>_span:nth-child(-n+2)]:[display:inline]! max-md:[.quality-page_&_h1_>_span:first-child::after]:[content:'_'] max-md:[.quality-page_&_>_p]:[display:none]!">
          <h1
            ref={orbitTitle}
            id="quality-title"
            aria-label="Quality Management Certifications"
          >
            {["Quality", "Management", "Certifications"].map((word) => (
              <span key={word} aria-hidden="true">
                {Array.from(word, (letter, index) => (
                  <span
                    key={index}
                    className="quality-orbit-letter relative inline-block"
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p>
            Quality standards verified and audited by international independent
            certification bodies from design to dispatch.
          </p>
        </div>

        <div
          className="quality-bottom-atmosphere [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:1] [.quality-page_&]:[top:auto] [.quality-page_&]:[right:0] [.quality-page_&]:[bottom:0] [.quality-page_&]:[left:0] [.quality-page_&]:[height:calc(250_*_var(--quality-unit))] [.quality-page_&]:[background:radial-gradient(ellipse_at_35%_24%,_#4a8dd82e,_transparent_68%),_linear-gradient(180deg,_#d6e7f300_0%,_#c6d9ed40_42%,_#f7fbff_100%)] [.quality-page_&]:[mask-image:linear-gradient(180deg,_transparent,_#000_30%)] [.quality-page_&]:[pointer-events:none] max-lg:[.quality-page_&]:[height:480px] max-md:[.quality-page_&]:[height:calc(100%_-_500px)] max-md:[.quality-page_&]:[background:radial-gradient(ellipse_at_35%_10%,_#78ade51a,_transparent_65%)]"
          aria-hidden="true"
        />
        <div
          className="quality-cards [.quality-page_&]:[position:relative] [.quality-page_&]:[z-index:3] [.quality-page_&]:[display:grid]! [.quality-page_&]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] [.quality-page_&]:[gap:calc(17_*_var(--quality-unit))] [.quality-page_&]:[width:100%] [.quality-page_&]:[max-width:calc(1200_*_var(--quality-unit))] [.quality-page_&]:[margin-left:auto] [.quality-page_&]:[margin-right:auto] max-lg:[.quality-page_&]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-lg:[.quality-page_&]:[max-width:800px] max-lg:[.quality-page_&]:[gap:18px] max-md:[.quality-page_&]:[grid-template-columns:1fr] max-md:[.quality-page_&]:[gap:12px] max-md:[.quality-page_&]:[max-width:330px]"
          aria-label="Quality standards and certifications"
        >
          {qualityCards.map((card, index) => (
            <article
              className="quality-card [container-type:inline-size] [.quality-page_&]:[position:relative] [.quality-page_&]:[isolation:isolate] [.quality-page_&]:[min-width:0] [.quality-page_&]:[min-height:calc(185_*_var(--quality-unit))] [.quality-page_&]:[overflow:hidden] [.quality-page_&]:[padding-top:calc(18_*_var(--quality-unit))] [.quality-page_&]:[padding-right:calc(25_*_var(--quality-unit))] [.quality-page_&]:[padding-bottom:calc(18_*_var(--quality-unit))] [.quality-page_&]:[padding-left:calc(25_*_var(--quality-unit))] [.quality-page_&]:[border:0.5px_solid_#f7f7f7] [.quality-page_&]:[border-radius:calc(30_*_var(--quality-unit))] [.quality-page_&]:[background:#ffffff26] [.quality-page_&]:[backdrop-filter:blur(14px)] [.quality-page_&]:[box-shadow:inset_0_1px_15px_#ffffff26,_0_8px_24px_#4274a30a] [.quality-page_&]:[transition:box-shadow_450ms_cubic-bezier(0.22,_1,_0.36,_1),_border-color_450ms_cubic-bezier(0.22,_1,_0.36,_1)] [.quality-page_&::before]:[content:''] [.quality-page_&::before]:[position:absolute] [.quality-page_&::before]:[z-index:-1] [.quality-page_&::before]:[top:0] [.quality-page_&::before]:[right:0] [.quality-page_&::before]:[bottom:0] [.quality-page_&::before]:[left:0] [.quality-page_&::before]:[border-radius:inherit] [.quality-page_&::before]:[background:linear-gradient(180deg,_#ffffff2e_0%,_#a3c8fa73_45%,_#4084ffe6_100%)] [.quality-page_&::before]:[opacity:0] [.quality-page_&::before]:[transition:opacity_450ms_cubic-bezier(0.22,_1,_0.36,_1)] [.quality-page_&_h2]:[margin-top:0] [.quality-page_&_h2]:[margin-right:0] [.quality-page_&_h2]:[margin-bottom:calc(12_*_var(--quality-unit))] [.quality-page_&_h2]:[margin-left:0] [.quality-page_&_h2]:[color:#4687b8]! [.quality-page_&_h2]:[font-size:calc(20_*_var(--quality-unit))]! [.quality-page_&_h2]:[font-weight:410]! [.quality-page_&_h2]:[line-height:1]! [.quality-page_&_h2]:[letter-spacing:-0.04em] [.quality-page_&[data-highlighted='true']::before]:[opacity:1] [.quality-page_&[data-highlighted='true']]:[border-color:#ffffffcc] [.quality-page_&[data-highlighted='true']]:[box-shadow:inset_0_1px_15px_#ffffff26,_0_10px_30px_#005eff26] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover::before]:[opacity:1] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[border-color:#ffffffcc] [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_&:hover]:[box-shadow:inset_0_1px_15px_#ffffff26,_0_10px_30px_#005eff26] max-md:[.quality-page_&]:[min-height:155px] max-md:[.quality-page_&]:[padding-top:20px] max-md:[.quality-page_&]:[padding-right:22px] max-md:[.quality-page_&]:[padding-bottom:20px] max-md:[.quality-page_&]:[padding-left:22px] max-md:[.quality-page_&_h2]:[font-size:17px]! max-md:[.quality-page_&]:[background:#ffffff33] max-md:[.quality-page_&]:[box-shadow:inset_0_0_28px_#ffffff40,_0_10px_25px_#0d579212] max-md:[.quality-page_&:nth-child(1)]:[order:4] max-md:[.quality-page_&_h2]:[margin-bottom:10px] max-md:[.quality-page_&[data-highlighted='true']_h2]:[color:#f7f7f7]! motion-reduce:[.quality-page_&]:[transition:none] motion-reduce:[.quality-page_&::before]:[transition:none]"
              key={card.value}
              aria-labelledby={`quality-card-${index}-title`}
            >
              <p className="quality-card-value [font-size:min(30px,18cqw)]! md:[font-size:min(calc(36_*_var(--quality-unit)),18cqw)]! [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:calc(10_*_var(--quality-unit))] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#0d5792]! [.quality-page_&]:[font-size:calc(36_*_var(--quality-unit))]! [.quality-page_&]:[line-height:1]! [.quality-page_&]:[white-space:nowrap] max-md:[.quality-page_&]:[font-size:30px]! max-md:[.quality-page_&]:[margin-bottom:7px]">
                {card.value}
              </p>
              <h2 id={`quality-card-${index}-title`}>{card.title}</h2>
              <p className="quality-card-description [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#9eb7d0]! [.quality-page_&]:[font-size:calc(12_*_var(--quality-unit))]! [.quality-page_&]:[line-height:1.12]! [.quality-page_&]:[transition:color_450ms_cubic-bezier(0.22,_1,_0.36,_1)] [.quality-page_.quality-card[data-highlighted='true']_&]:[color:#f7fbff]! [@media(hover:_hover)_and_(pointer:_fine)]:[.quality-page_.quality-card:hover_&]:[color:#f7fbff]! max-md:[.quality-page_&]:[font-size:12px]! max-md:[.quality-page_&]:[line-height:1.12]! max-md:[.quality-page_&]:[color:#9eb7d0]! max-md:[.quality-page_.quality-card[data-highlighted='true']_&]:[color:#f7f7f7]! motion-reduce:[.quality-page_&]:[transition:none]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="quality-inspection [.quality-page_&]:[position:relative] [.quality-page_&]:[padding-top:85px] [.quality-page_&]:[padding-right:24px] [.quality-page_&]:[padding-bottom:100px] [.quality-page_&]:[padding-left:24px] [.quality-page_&]:[background:linear-gradient(180deg,_#f7fbff,_transparent_100px),_radial-gradient(ellipse_at_85%_45%,_#c4e2ffb3,_#e1f1ff73_45%,_transparent_80%),_linear-gradient(110deg,_#fff,_#f4faff_45%,_#d7ebff)] [.quality-page_&_button:focus-visible]:[outline:2px_solid_#005eff] [.quality-page_&_button:focus-visible]:[outline-offset:4px] max-md:[.quality-page_&]:[padding-top:65px] max-md:[.quality-page_&]:[padding-right:20px] max-md:[.quality-page_&]:[padding-bottom:65px] max-md:[.quality-page_&]:[padding-left:20px] max-md:[.quality-page_&]:[background:transparent]"
        aria-labelledby="quality-inspection-title"
      >
        <div className="quality-inspection-container [.quality-page_&]:[width:100%] [.quality-page_&]:[max-width:1200px] [.quality-page_&]:[margin-left:auto] [.quality-page_&]:[margin-right:auto]">
          <div className="quality-inspection-heading [.quality-page_&]:[display:grid]! [.quality-page_&]:[grid-template-columns:minmax(0,_607px)_minmax(0,_349px)] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:40px] [.quality-page_&]:[margin-bottom:55px] [.quality-page_&_h2]:[margin-top:0] [.quality-page_&_h2]:[margin-right:0] [.quality-page_&_h2]:[margin-bottom:0] [.quality-page_&_h2]:[margin-left:0] [.quality-page_&_h2]:[font-size:50px]! [.quality-page_&_h2]:[font-weight:410]! [.quality-page_&_h2]:[line-height:1]! [.quality-page_&_h2]:[color:#0d5792]! [.quality-page_&_h2]:[letter-spacing:-0.04em] max-xl:[.quality-page_&]:[grid-template-columns:1.5fr_1fr] max-xl:[.quality-page_&]:[gap:32px] max-xl:[.quality-page_&_h2]:[font-size:40px]! max-md:[.quality-page_&]:[grid-template-columns:1fr] max-md:[.quality-page_&]:[gap:30px] max-md:[.quality-page_&]:[margin-bottom:32px] max-md:[.quality-page_&_h2]:[font-size:clamp(25px,_6.7vw,_36px)]!">
            <h2 id="quality-inspection-title">
              5-Stage Zero-Defect
              <br />
              Quality Inspection &amp;
              <br />
              Verification Journey
            </h2>
            <div className="quality-inspection-intro [.quality-page_&]:[padding-top:6px] [.quality-page_&_>_p]:[margin-top:38px] [.quality-page_&_>_p]:[margin-right:0] [.quality-page_&_>_p]:[margin-bottom:0] [.quality-page_&_>_p]:[margin-left:0] [.quality-page_&_>_p]:[color:#000]! [.quality-page_&_>_p]:[font-size:15px]! [.quality-page_&_>_p]:[line-height:1]! max-md:[.quality-page_&_>_p]:[max-width:349px] max-md:[.quality-page_&_>_p]:[margin-top:24px] max-md:[.quality-page_&_>_p]:[line-height:1.2]! max-md:[.quality-page_&_>_p]:[font-size:13px]!">
              <div
                className="quality-stage-picker [.quality-page_&]:[position:relative] [.quality-page_&]:[z-index:5] [.quality-page_&_>_button]:[width:151px] [.quality-page_&_>_button]:[min-height:24px] [.quality-page_&_>_button]:[padding-top:4px] [.quality-page_&_>_button]:[padding-right:6px] [.quality-page_&_>_button]:[padding-bottom:4px] [.quality-page_&_>_button]:[padding-left:6px] [.quality-page_&_>_button]:[border:0] [.quality-page_&_>_button]:[border-radius:8px] [.quality-page_&_>_button]:[background:#0d5792] [.quality-page_&_>_button]:[color:#fff]! [.quality-page_&_>_button]:[font-style:inherit] [.quality-page_&_>_button]:[font-variant:inherit] [.quality-page_&_>_button]:[font-weight:inherit]! [.quality-page_&_>_button]:[font-stretch:inherit]! [.quality-page_&_>_button]:[font-size:10px]! [.quality-page_&_>_button]:[line-height:inherit]! [.quality-page_&_>_button]:[font-family:inherit]! [.quality-page_&_>_button]:[font-feature-settings:inherit] [.quality-page_&_>_button]:[font-variation-settings:inherit]! [.quality-page_&_>_button]:[cursor:pointer]"
                onKeyDown={(event) => {
                  if (event.key === "Escape") setStagePickerOpen(false);
                }}
              >
                <button
                  type="button"
                  aria-expanded={stagePickerOpen}
                  aria-controls="quality-stage-options"
                  onClick={() => setStagePickerOpen(!stagePickerOpen)}
                >
                  Select a Stage to Explore
                </button>
                {stagePickerOpen && (
                  <div
                    id="quality-stage-options"
                    className="quality-stage-options [.quality-page_&]:[position:absolute] [.quality-page_&]:[top:calc(100%_+_8px)] [.quality-page_&]:[right:0] [.quality-page_&]:[left:0] [.quality-page_&]:[min-width:260px] [.quality-page_&]:[padding-top:8px] [.quality-page_&]:[padding-right:8px] [.quality-page_&]:[padding-bottom:8px] [.quality-page_&]:[padding-left:8px] [.quality-page_&]:[border:1px_solid_#c4def2] [.quality-page_&]:[border-radius:12px] [.quality-page_&]:[background:#f7fbff] [.quality-page_&]:[box-shadow:0_8px_30px_#0d579226] [.quality-page_&_button]:[display:block]! [.quality-page_&_button]:[width:100%] [.quality-page_&_button]:[padding-top:10px] [.quality-page_&_button]:[padding-right:10px] [.quality-page_&_button]:[padding-bottom:10px] [.quality-page_&_button]:[padding-left:10px] [.quality-page_&_button]:[border:0] [.quality-page_&_button]:[border-radius:7px] [.quality-page_&_button]:[text-align:left] [.quality-page_&_button]:[color:#0d5792]! [.quality-page_&_button]:[background:transparent] [.quality-page_&_button]:[font-style:inherit] [.quality-page_&_button]:[font-variant:inherit] [.quality-page_&_button]:[font-weight:inherit]! [.quality-page_&_button]:[font-stretch:inherit]! [.quality-page_&_button]:[font-size:12px]! [.quality-page_&_button]:[line-height:inherit]! [.quality-page_&_button]:[font-family:inherit]! [.quality-page_&_button]:[font-feature-settings:inherit] [.quality-page_&_button]:[font-variation-settings:inherit]! [.quality-page_&_button]:[cursor:pointer] [.quality-page_&_button[aria-pressed='true']]:[background:#d7ebff] [.quality-page_&_button:disabled]:[color:#73879a]! [.quality-page_&_button:disabled]:[cursor:not-allowed]"
                    aria-label="Inspection stages"
                  >
                    {qualityStages.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        disabled={!item}
                        aria-pressed={index === stageIndex}
                        onClick={() => selectStage(index)}
                      >
                        {String(index + 1).padStart(2, "0")} —{" "}
                        {item?.title ?? "Not available yet"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p>
                Rigorous tolerances and digital verification from ingot
                spectrometry to dynamic balancing and final test certificates.
              </p>
            </div>
          </div>

          <div
            className="quality-inspection-slider [.quality-page_&]:[position:relative] [.quality-page_&]:[height:520px] [.quality-page_&]:[overflow:hidden] [.quality-page_&]:[border-radius:30px] [.quality-page_&]:[background:#222] max-md:[.quality-page_&]:[height:auto] max-md:[.quality-page_&]:[min-height:760px] max-md:[.quality-page_&]:[border-radius:22px] max-md:[.quality-page_&]:[background:#141a20]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Quality inspection stages"
          >
            <div className="quality-stage-visual [.quality-page_&]:[position:absolute] [.quality-page_&]:[top:0] [.quality-page_&]:[right:0] [.quality-page_&]:[bottom:0] [.quality-page_&]:[left:0] max-md:[.quality-page_&]:[bottom:0] max-md:[.quality-page_&]:[height:auto] max-md:[.quality-page_&]:[top:0] max-md:[.quality-page_&]:[right:0] max-md:[.quality-page_&]:[left:0]">
              <Image
                src={stage.image}
                alt="Quality control technician analysing a sample through a laboratory microscope"
                fill
                unoptimized
                loading="lazy"
                sizes="(max-width: 767px) 100vw, (max-width: 1248px) 95vw, 1200px"
                className="quality-stage-photo [.quality-page_&]:[object-fit:cover] [.quality-page_&]:[object-position:center_25%] max-md:[.quality-page_&]:[object-position:62%_center]"
              />
            </div>
            <div
              className="quality-stage-slide [.quality-page_&]:[position:relative] [.quality-page_&]:[height:100%] [.quality-page_&]:animate-migrated-481f99f5f max-md:[.quality-page_&]:[min-height:760px] max-md:[.quality-page_&]:[padding-top:0] motion-reduce:[.quality-page_&]:[animation:none] max-md:[.quality-page_&]:[padding-bottom:25px]"
              key={stage.id}
              style={{ "--stage-direction": stageDirection } as CSSProperties}
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                className="quality-stage-shade [.quality-page_&]:[position:absolute] [.quality-page_&]:[top:0] [.quality-page_&]:[right:0] [.quality-page_&]:[bottom:0] [.quality-page_&]:[left:0] [.quality-page_&]:[background:linear-gradient(90deg,_#222222fc_0%,_#222222f5_24%,_#222222b8_47%,_#2222222e_75%,_#0a131e1a_100%),_linear-gradient(0deg,_#0a131e80,_transparent_30%)] max-md:[.quality-page_&]:[background:linear-gradient(90deg,_#222222fa,_#222222d9_28%,_#22222288_60%,_#0a131e26),_linear-gradient(0deg,_#0a131ecc,_transparent_30%)]"
                aria-hidden="true"
              />
              <div className="quality-stage-content [.quality-page_&_h3_>_span]:[display:block]! [.quality-page_&]:[position:relative] [.quality-page_&]:[z-index:1] [.quality-page_&]:[width:445px] [.quality-page_&]:[max-width:100%] [.quality-page_&]:[padding-top:30px] [.quality-page_&]:[padding-right:35px] [.quality-page_&]:[padding-bottom:0] [.quality-page_&]:[padding-left:35px] [.quality-page_&_h3]:[max-width:370px] [.quality-page_&_h3]:[margin-top:14px] [.quality-page_&_h3]:[margin-right:0] [.quality-page_&_h3]:[margin-bottom:30px] [.quality-page_&_h3]:[margin-left:0] [.quality-page_&_h3]:[color:#9eb7d0]! [.quality-page_&_h3]:[font-size:25px]! [.quality-page_&_h3]:[font-weight:540]! [.quality-page_&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125]! [.quality-page_&_h3]:[line-height:1.12]! [.quality-page_&_h3]:[letter-spacing:0] max-md:[.quality-page_&]:[width:100%] max-md:[.quality-page_&]:[padding-top:26px] max-md:[.quality-page_&]:[padding-right:22px] max-md:[.quality-page_&]:[padding-bottom:0] max-md:[.quality-page_&]:[padding-left:22px] max-md:[.quality-page_&_h3]:[font-size:20px]! max-md:[.quality-page_&_h3]:[margin-bottom:28px] max-md:[.quality-page_&_h3]:[line-height:1.12]! max-md:[.quality-page_&_h3]:[margin-top:22px] max-md:[.quality-page_&_h3]:[margin-right:0] max-md:[.quality-page_&_h3]:[margin-left:0]">
                <span className="quality-stage-number [.quality-page_&]:[color:#9eb7d0]! [.quality-page_&]:[font-size:12px]! [.quality-page_&]:[line-height:1]!">
                  {stage.number}
                </span>
                <h3>
                  {stage.titleLines
                    ? stage.titleLines.map((line) => (
                        <span key={line}>{line}</span>
                      ))
                    : stage.title}
                </h3>
                <p className="quality-stage-description [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#f7f7f7]! [.quality-page_&]:[font-size:15px]! [.quality-page_&]:[line-height:1]! max-md:[.quality-page_&]:[line-height:1.2]! max-md:[.quality-page_&]:[font-size:13px]! max-md:[.quality-page_&]:[max-width:270px]">
                  {stage.description}
                </p>
                <div className="quality-stage-equipment [.quality-page_&]:[margin-top:30px] [.quality-page_&_p]:[margin-top:0] [.quality-page_&_p]:[margin-right:0] [.quality-page_&_p]:[margin-bottom:0] [.quality-page_&_p]:[margin-left:0] [.quality-page_&_p]:[color:#9eb7d0]! [.quality-page_&_p]:[font-size:15px]! [.quality-page_&_p]:[line-height:1.12]! [.quality-page_&_ul]:[display:grid]! [.quality-page_&_ul]:[gap:10px] [.quality-page_&_ul]:[padding-top:0] [.quality-page_&_ul]:[padding-right:0] [.quality-page_&_ul]:[padding-bottom:0] [.quality-page_&_ul]:[padding-left:0] [.quality-page_&_ul]:[margin-top:18px] [.quality-page_&_ul]:[margin-right:0] [.quality-page_&_ul]:[margin-bottom:0] [.quality-page_&_ul]:[margin-left:0] [.quality-page_&_ul]:[list-style:none] [.quality-page_&_li]:[display:flex]! [.quality-page_&_li]:[align-items:center] [.quality-page_&_li]:[gap:10px] [.quality-page_&_li]:[color:#f7f7f7]! [.quality-page_&_li]:[font-size:11px]! [.quality-page_&_li]:[line-height:1.12]! [.quality-page_&_svg]:[flex-shrink:0] [.quality-page_&_svg]:[color:#00ff26]! max-md:[.quality-page_&]:[margin-top:36px] max-md:[.quality-page_&_p]:[font-size:12px]! max-md:[.quality-page_&_li]:[font-size:9px]! max-md:[.quality-page_&_li]:[gap:8px]">
                  <p className="quality-stage-equipment-label [.quality-page_.quality-stage-equipment_&]:[margin-bottom:12px] [.quality-page_.quality-stage-equipment_&]:[color:#00ff26]! [.quality-page_.quality-stage-equipment_&]:[font-size:10px]! max-md:[.quality-page_.quality-stage-equipment_&]:[font-size:8px]!">
                    TESTING METROLOGY &amp; EQUIPMENT
                  </p>
                  <p>{stage.equipment}</p>
                  <ul>
                    {stage.checks.map((check) => (
                      <li key={check}>
                        <LuShieldCheck size={24} aria-hidden="true" />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="quality-stage-footer [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:1] [.quality-page_&]:[left:35px] [.quality-page_&]:[right:35px] [.quality-page_&]:[bottom:30px] [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:end] [.quality-page_&]:[justify-content:space-between] [.quality-page_&]:[gap:30px] max-xl:[.quality-page_&]:[align-items:start] max-md:[.quality-page_&]:[position:relative] max-md:[.quality-page_&]:[top:auto] max-md:[.quality-page_&]:[right:auto] max-md:[.quality-page_&]:[bottom:auto] max-md:[.quality-page_&]:[left:auto] max-md:[.quality-page_&]:[padding-top:120px] max-md:[.quality-page_&]:[padding-right:22px] max-md:[.quality-page_&]:[padding-bottom:35px] max-md:[.quality-page_&]:[padding-left:22px] max-md:[.quality-page_&]:[flex-direction:column] max-md:[.quality-page_&]:[gap:30px]">
                <div className="quality-stage-standards [.quality-page_&]:[display:flex]! [.quality-page_&]:[align-items:center] [.quality-page_&]:[gap:14px] [.quality-page_&]:[min-width:0] [.quality-page_&_>_span]:[color:#9eb7d0]! [.quality-page_&_>_span]:[font-size:9px]! [.quality-page_&_>_span]:[white-space:nowrap] [.quality-page_&_ul]:[display:flex]! [.quality-page_&_ul]:[flex-wrap:wrap] [.quality-page_&_ul]:[gap:10px] [.quality-page_&_ul]:[margin-top:0] [.quality-page_&_ul]:[margin-right:0] [.quality-page_&_ul]:[margin-bottom:0] [.quality-page_&_ul]:[margin-left:0] [.quality-page_&_ul]:[padding-top:0] [.quality-page_&_ul]:[padding-right:0] [.quality-page_&_ul]:[padding-bottom:0] [.quality-page_&_ul]:[padding-left:0] [.quality-page_&_ul]:[list-style:none] [.quality-page_&_li]:[padding-top:7px] [.quality-page_&_li]:[padding-right:12px] [.quality-page_&_li]:[padding-bottom:7px] [.quality-page_&_li]:[padding-left:12px] [.quality-page_&_li]:[border:1px_solid_#9eb7d0] [.quality-page_&_li]:[border-radius:9px] [.quality-page_&_li]:[color:#9eb7d0]! [.quality-page_&_li]:[font-size:10px]! [.quality-page_&_li]:[line-height:1.12]! max-xl:[.quality-page_&]:[flex-direction:column] max-xl:[.quality-page_&]:[align-items:start] max-xl:[.quality-page_&]:[gap:10px] max-md:[.quality-page_&]:[gap:24px] max-md:[.quality-page_&_li]:[font-size:9px]! max-md:[.quality-page_&_li]:[padding-top:7px] max-md:[.quality-page_&_li]:[padding-right:10px] max-md:[.quality-page_&_li]:[padding-bottom:7px] max-md:[.quality-page_&_li]:[padding-left:10px]">
                  <span>APPLIED STANDARTS</span>
                  <ul>
                    {stage.standards.map((standard) => (
                      <li key={standard}>{standard}</li>
                    ))}
                  </ul>
                </div>
                <p className="quality-stage-caption [.quality-page_&]:[flex:0_1_330px] [.quality-page_&]:[margin-top:0] [.quality-page_&]:[margin-right:0] [.quality-page_&]:[margin-bottom:0] [.quality-page_&]:[margin-left:0] [.quality-page_&]:[color:#f7f7f7]! [.quality-page_&]:[font-size:11px]! [.quality-page_&]:[line-height:1.12]! max-xl:[.quality-page_&]:[flex-basis:260px] max-md:[.quality-page_&]:[flex-basis:auto] max-md:[.quality-page_&]:[max-width:369px] max-md:[.quality-page_&]:[font-size:10px]! max-md:[.quality-page_&]:[line-height:1.12]!">
                  {stage.caption}
                </p>
              </div>
            </div>
            <div className="quality-stage-arrows [.quality-page_&]:[position:absolute] [.quality-page_&]:[z-index:2] [.quality-page_&]:[top:30px] [.quality-page_&]:[right:35px] [.quality-page_&]:[display:flex]! [.quality-page_&]:[gap:20px] [.quality-page_&_button]:[display:grid]! [.quality-page_&_button]:[place-items:center] [.quality-page_&_button]:[padding-top:0] [.quality-page_&_button]:[padding-right:0] [.quality-page_&_button]:[padding-bottom:0] [.quality-page_&_button]:[padding-left:0] [.quality-page_&_button]:[width:24px] [.quality-page_&_button]:[height:24px] [.quality-page_&_button]:[border:0] [.quality-page_&_button]:[background:transparent] [.quality-page_&_button]:[color:#9eb7d0]! [.quality-page_&_button]:[cursor:pointer] [.quality-page_&_button]:[transition:color_250ms_ease,_transform_250ms_ease] [.quality-page_&_svg]:[width:24px] [.quality-page_&_svg]:[height:24px] [.quality-page_&_svg]:[stroke-width:3px] [.quality-page_&_button:disabled]:[opacity:0.45] [.quality-page_&_button:disabled]:[cursor:not-allowed] [.quality-page_&_button:not(:disabled):hover]:[color:#fff]! [.quality-page_&_button:not(:disabled):hover]:[transform:scale(1.1)] max-md:[.quality-page_&]:[top:420px] max-md:[.quality-page_&]:[right:auto] max-md:[.quality-page_&]:[left:22px] max-md:[.quality-page_&]:[gap:20px] max-md:[.quality-page_&_button]:[width:34px] max-md:[.quality-page_&_button]:[height:34px] max-md:[.quality-page_&_svg]:[width:30px] max-md:[.quality-page_&_svg]:[height:30px] max-md:[.quality-page_&_svg]:[stroke-width:2px]">
              <button
                type="button"
                aria-label="Previous inspection stage"
                disabled={previousStage < 0}
                onClick={() => selectStage(previousStage)}
              >
                <LuArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next inspection stage"
                disabled={nextStage < 0}
                onClick={() => selectStage(nextStage)}
              >
                <LuArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="quality-compliance-surface [.quality-page_&]:[--compliance-unit:clamp(0.833333px,_0.0694444444vw,_1.5px)] [.quality-page_&]:[position:relative] [.quality-page_&]:[isolation:isolate] [.quality-page_&]:[padding-top:0] [.quality-page_&]:[padding-right:24px] [.quality-page_&]:[padding-bottom:calc(100_*_var(--compliance-unit))] [.quality-page_&]:[padding-left:24px] [.quality-page_&]:[background:linear-gradient(110deg,_#fff,_#f4faff_45%,_#d7ebff)] [.quality-page_&::before]:[content:''] [.quality-page_&::before]:[position:absolute] [.quality-page_&::before]:[z-index:0] [.quality-page_&::before]:[top:-100px] [.quality-page_&::before]:[left:0] [.quality-page_&::before]:[right:0] [.quality-page_&::before]:[height:100px] [.quality-page_&::before]:[background:linear-gradient(110deg,_#fff,_#f4faff_45%,_#d7ebff)] [.quality-page_&::before]:[mask-image:linear-gradient(180deg,_transparent,_#000)] [.quality-page_&::before]:[pointer-events:none] [.quality-page_&::after]:[content:''] [.quality-page_&::after]:[position:absolute] [.quality-page_&::after]:[z-index:-1] [.quality-page_&::after]:[top:0] [.quality-page_&::after]:[right:0] [.quality-page_&::after]:[bottom:0] [.quality-page_&::after]:[left:0] [.quality-page_&::after]:[background:radial-gradient(ellipse_at_62%_60%,_#b9dcff80,_transparent_72%),_linear-gradient(180deg,_transparent,_#dceeff80_50%,_#d8ecffcc)] [.quality-page_&::after]:[mask-image:linear-gradient(180deg,_transparent,_#000_160px)] [.quality-page_&::after]:[pointer-events:none] max-xl:[.quality-page_&]:[--compliance-unit:1px] max-md:[.quality-page_&]:[padding-top:0] max-md:[.quality-page_&]:[padding-right:20px] max-md:[.quality-page_&]:[padding-bottom:65px] max-md:[.quality-page_&]:[padding-left:20px] max-md:[.quality-page_&]:[background:transparent] max-md:[.quality-page_&::before]:[display:none]! max-md:[.quality-page_&::after]:[display:none]!">
        <div className="quality-compliance-container [.quality-page_&]:[max-width:calc(1200_*_var(--compliance-unit))] [.quality-page_&]:[width:100%] [.quality-page_&]:[margin-left:auto] [.quality-page_&]:[margin-right:auto]">
          <CertificatesSection />
          <QualityPolicySection />
          <div className="quality-newsletter [.quality-page_&]:[margin-top:calc(80_*_var(--compliance-unit))] [.quality-page_&_.newsletter-section]:[--mail-unit:var(--compliance-unit)] [.quality-page_&_.newsletter-section]:[margin-top:0]">
            <NewsletterSubscription scaled />
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* One continuous surface prevents seams between independently painted sections. */
        .quality-page.quality-page {
          background: linear-gradient(
            110deg,
            #ffffff,
            #f4faff 45%,
            #d7ebff
          ) !important;
        }
        .quality-page .quality-inspection,
        .quality-page .quality-compliance-surface {
          background: transparent !important;
        }
        .quality-page .quality-compliance-surface::before,
        .quality-page .quality-compliance-surface::after {
          background: none !important;
        }
        .quality-page .quality-artwork {
          mask-image: linear-gradient(
            180deg,
            #000 0%,
            #000 48%,
            #000e 60%,
            #0008 76%,
            #0002 90%,
            transparent 100%
          );
        }
        .quality-page .quality-bottom-atmosphere {
          background: radial-gradient(
            ellipse at 35% 24%,
            #4a8dd81a,
            transparent 72%
          ) !important;
        }
      `}</style>
    </main>
  );
}

// Tailwind presets retain marker classes used by animation and carousel selectors.
