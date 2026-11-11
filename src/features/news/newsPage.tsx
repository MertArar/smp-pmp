"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowDownRight } from "react-icons/fi";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import blogStyles from "@/components/ui/slidingCircleStyles";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";
// Tailwind classes stay next to the component; marker classes scope descendant variants.
const styles = {
  "page": "tw-news-page [min-height:calc(100svh_-_100px)] [padding:85px_24px_140px] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,_'wdth'_125] [letter-spacing:-0.04em] [background:radial-gradient(ellipse_at_86%_48%,_#d5e9ff_0%,_transparent_66%),_radial-gradient(ellipse_at_5%_18%,_#f5faff_0%,_transparent_56%),_linear-gradient(115deg,_#e6f3ff,_#d5e9ff)] [@media(min-width:768px)_and_(max-width:1199px)]:[padding-inline:40px] [@media(max-width:767px)]:[padding:60px_12px_80px]",
  "title": "tw-news-title [margin:0_0_90px] [color:#9eb7d0]! text-center [font-size:clamp(34px,_3.48vw,_50px)]! [font-weight:410] [line-height:1]! [@media(max-width:767px)]:[font-size:clamp(28px,_7.5vw,_34px)]! [@media(max-width:767px)]:[margin-bottom:80px]",
  "sectionHeader": "tw-news-sectionHeader flex items-center justify-between [gap:32px] [margin-bottom:35px] [&_h2]:m-0 [&_h2]:[color:#0d5792]! [&_h2]:[font-size:25px]! [&_h2]:[font-weight:540] [&_h2]:[font-variation-settings:'wght'_540,_'wdth'_125] [&_h2]:[line-height:1.12]! [&_p]:m-0 [&_p]:[color:#9eb7d0]! [&_p]:[font-size:15px]! [&_p]:[line-height:1]! [@media(min-width:768px)_and_(max-width:1199px)]:items-start [@media(min-width:768px)_and_(max-width:1199px)]:[&_p]:[max-width:390px] [@media(min-width:768px)_and_(max-width:1199px)]:[&_p]:[line-height:1.12]! [@media(max-width:767px)]:flex-col [@media(max-width:767px)]:items-center [@media(max-width:767px)]:[gap:18px] [@media(max-width:767px)]:[&_h2]:[font-size:clamp(22px,_5.9vw,_26px)]! [@media(max-width:767px)]:[&_p]:[line-height:1.12]! [@media(max-width:767px)]:[&_p]:[font-size:13px]! [@media(max-width:767px)]:text-center [@media(max-width:767px)]:[margin-bottom:20px] [@media(max-width:767px)]:[&_p]:[max-width:320px]",
  "newsGrid": "tw-news-newsGrid grid [grid-template-columns:minmax(0,_650fr)_minmax(0,_344fr)_minmax(157px,_167fr)] [align-items:start] [gap:20px] [@media(min-width:768px)_and_(max-width:1199px)]:[grid-template-columns:minmax(0,_1fr)_190px] [@media(max-width:767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:767px)]:[gap:15px]",
  "featuredColumn": "tw-news-featuredColumn min-w-0 [@media(min-width:768px)_and_(max-width:1199px)]:[grid-column:1_/_-1] [@media(max-width:767px)]:[grid-row:2]",
  "featured": "tw-news-featured flex [gap:28px] [padding:20px] [min-height:280px] [border-radius:30px] [background:#f7f7f7] [transition:background-color_400ms_ease] [&:is(:hover,_:focus-within)]:[background-color:#005eff] [&:is(:hover,_:focus-within)_.tw-news-photo]:[filter:grayscale(0)] [&:is(:hover,_:focus-within)_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)] [&:is(:hover,_:focus-within)_.tw-news-logo]:[filter:brightness(0)_invert(1)] [&:is(:hover,_:focus-within)_h3]:[color:#fff]! [&:is(:hover,_:focus-within)_.tw-news-metadata]:[color:#e6f3ff]! [&:is(:hover,_:focus-within)_.tw-news-viewButton]:[color:#fff]! [&:is(:hover,_:focus-within)_.tw-news-viewButton]:[border-color:#e6f3ffb3] [@media(max-width:767px)]:flex-col [@media(max-width:767px)]:[gap:0] [@media(max-width:767px)]:[&:is(:hover,_:focus-within)_.tw-news-logo]:[transform:rotate(0deg)] [@media(prefers-reduced-motion:reduce)]:[transition:none] [@media(max-width:767px)]:[padding:18px] [@media(max-width:767px)]:[border-radius:16px] [@media(max-width:767px)]:[&:is(:hover,_:focus-within)_.tw-news-featuredMedia_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)]",
  "featuredMedia": "tw-news-featuredMedia relative [flex:0_0_55%] min-w-0 [height:240px] [@media(min-width:768px)_and_(max-width:1199px)]:[flex-basis:55%] [@media(max-width:767px)]:[flex-basis:auto] [@media(max-width:767px)]:w-full [@media(max-width:767px)]:h-auto [@media(max-width:767px)]:[aspect-ratio:350_/_240] [@media(max-width:767px)]:[&_.tw-news-logo]:[top:50%] [@media(max-width:767px)]:[&_.tw-news-logo]:[bottom:auto] [@media(max-width:767px)]:[&_.tw-news-logo]:[right:-8px] [@media(max-width:767px)]:[&_.tw-news-logo]:[transform:translateY(-50%)_rotate(-90deg)]",
  "photoFrame": "tw-news-photoFrame relative w-full h-full overflow-hidden [border-radius:30px] [@media(max-width:767px)]:[border-radius:16px]",
  "photo": "tw-news-photo object-cover [filter:grayscale(1)] [transition:filter_400ms_ease] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
  "logo": "tw-news-logo absolute [z-index:1] [right:-20px] [top:50%] [width:48px] h-auto [transform:translateY(-50%)_rotate(-25deg)] [transition:transform_400ms_ease,_filter_400ms_ease] [@media(max-width:767px)]:[top:auto] [@media(max-width:767px)]:[bottom:-10px] [@media(max-width:767px)]:[right:15px] [@media(max-width:767px)]:[transform:rotate(-25deg)] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
  "featuredText": "tw-news-featuredText min-w-0 flex flex-1 items-start flex-col [padding-top:25px] [&_h3]:m-0 [&_h3]:[color:#27272a]! [&_h3]:[font-size:15px]! [&_h3]:[font-weight:410] [&_h3]:[line-height:1]! [&_h3]:[transition:color_400ms_ease] [@media(max-width:767px)]:[padding-top:28px] [@media(max-width:767px)]:[&_h3]:[line-height:1.12]! [@media(prefers-reduced-motion:reduce)]:[&_h3]:[transition:none]",
  "metadata": "tw-news-metadata flex items-center flex-wrap [gap:8px] [margin-top:auto] [margin-bottom:18px] [color:#9eb7d0]! [font-size:12px]! [line-height:1.12]! [transition:color_400ms_ease] [@media(max-width:767px)]:[margin-top:25px] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
  "separator": "tw-news-separator [width:1px] [height:12px] [background:currentColor]",
  "viewButton": "tw-news-viewButton [transition:color_400ms_ease,_border-color_400ms_ease,_--blog-orb-offset_350ms_ease-in-out] [&_>_span:last-child]:[width:30px] [&_>_span:last-child]:[height:30px] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
  "previewActive": "tw-news-previewActive [background-color:#005eff] [&_.tw-news-photo]:[filter:grayscale(0)] [&_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)] [&_.tw-news-logo]:[filter:brightness(0)_invert(1)] [&_h3]:[color:#fff]! [&_.tw-news-metadata]:[color:#e6f3ff]! [&_.tw-news-viewButton]:[color:#fff]! [&_.tw-news-viewButton]:[border-color:#e6f3ffb3] [@media(max-width:767px)]:[&_.tw-news-logo]:[transform:rotate(0deg)] [@media(max-width:767px)]:[&_.tw-news-featuredMedia_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)]",
  "touchPreview": "tw-news-touchPreview hidden [&:focus-visible]:[outline:2px_solid_#005eff] [&:focus-visible]:[outline-offset:4px] [@media(hover:none)]:block [@media(hover:none)]:absolute [@media(hover:none)]:[bottom:12px] [@media(hover:none)]:[left:12px] [@media(hover:none)]:[padding:8px_12px] [@media(hover:none)]:[border:1px_solid_#ffffffa0] [@media(hover:none)]:[border-radius:16px] [@media(hover:none)]:[background:#f5faffd9] [@media(hover:none)]:[color:#0d5792]! [@media(hover:none)]:[font-size:11px]! [@media(hover:none)]:cursor-pointer [@media(hover:none)]:[backdrop-filter:blur(8px)]",
  "latestList": "tw-news-latestList flex flex-col [gap:20px] min-w-0 [@media(max-width:767px)]:[gap:10px] [@media(max-width:767px)]:[grid-row:3]",
  "smallCard": "tw-news-smallCard flex items-center [gap:12px] [min-height:73px] min-w-0 [padding:13px] [border-radius:15px] [background:#fff] [transition:box-shadow_250ms_ease] [&:hover]:[box-shadow:0_6px_20px_#005eff12] [&:hover_.tw-news-arrow]:[box-shadow:0_0_15px_#005eff60] [&:focus-visible]:[outline:2px_solid_#005eff] [&:focus-visible]:[outline-offset:4px] [@media(prefers-reduced-motion:reduce)]:[transition:none] [@media(max-width:767px)]:[border-radius:12px] [@media(max-width:767px)]:[min-height:73px]",
  "arrow": "tw-news-arrow flex items-center justify-center [flex:0_0_24px] [height:24px] [border-radius:50%] [background:#27272a] [color:#fff]! [font-family:Arial,_sans-serif] [font-size:20px]! [box-shadow:0_0_16px_#005eff66] [transition:box-shadow_250ms_ease] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
  "smallContent": "tw-news-smallContent min-w-0 flex-1 [&_h3]:overflow-hidden [&_h3]:text-ellipsis [&_h3]:whitespace-nowrap [&_h3]:[margin:0_0_10px] [&_h3]:[color:#27272a]! [&_h3]:[font-size:12px]! [&_h3]:[font-weight:410] [&_h3]:[line-height:1.12]!",
  "smallMeta": "tw-news-smallMeta flex justify-between [gap:8px] [color:#9eb7d0]! [font-size:9px]! [line-height:1]!",
  "filters": "tw-news-filters flex flex-col [gap:12px] m-0 [padding:26px_21px] [border:0] [border-radius:15px] [background:#f7f7f7] [@media(max-width:767px)]:grid [@media(max-width:767px)]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [@media(max-width:767px)]:[padding:24px_20px] [@media(max-width:767px)]:[gap:14px_8px] [@media(max-width:767px)]:[grid-row:1]",
  "filter": "tw-news-filter flex items-center [gap:9px] [color:#9eb7d0]! [font-size:15px]! [line-height:1]! cursor-pointer [&_input]:[appearance:none] [&_input]:relative [&_input]:[flex:0_0_19px] [&_input]:[width:19px] [&_input]:[height:19px] [&_input]:m-0 [&_input]:[border-radius:4px] [&_input]:[background:#9eb7d040] [&_input]:cursor-pointer [&_input]:[transition:background-color_250ms_ease] [&_input:checked]:[background:#005eff] [&_input:checked::after]:[content:''] [&_input:checked::after]:absolute [&_input:checked::after]:[left:6px] [&_input:checked::after]:[top:3px] [&_input:checked::after]:[width:6px] [&_input:checked::after]:[height:10px] [&_input:checked::after]:[border:solid_#fff] [&_input:checked::after]:[border-width:0_2px_2px_0] [&_input:checked::after]:[transform:rotate(45deg)] [&_input:checked_+_span]:[color:#0d5792]! [&_input:focus-visible]:[outline:2px_solid_#005eff] [&_input:focus-visible]:[outline-offset:4px] [@media(prefers-reduced-motion:reduce)]:[&_input]:[transition:none] [@media(max-width:767px)]:[gap:6px] [@media(max-width:767px)]:[font-size:11px]! [@media(max-width:767px)]:[&_input]:[flex-basis:17px] [@media(max-width:767px)]:[&_input]:[width:17px] [@media(max-width:767px)]:[&_input]:[height:17px]",
  "empty": "tw-news-empty [padding:35px] [border-radius:30px] [background:#f7f7f7] [color:#0d5792]! [font-size:15px]!",
  "collection": "tw-news-collection [margin-top:85px] [@media(max-width:767px)]:[margin-top:55px]",
  "collectionHeader": "tw-news-collectionHeader flex items-center justify-between [gap:24px] [margin-bottom:35px] [&_h2]:flex [&_h2]:items-baseline [&_h2]:[gap:15px] [&_h2]:m-0 [&_h2]:[color:#0d5792]! [&_h2]:[font-size:25px]! [&_h2]:[line-height:1]! [&_h2]:[font-weight:540] [&_h2]:[font-variation-settings:'wght'_540,_'wdth'_125] [&_h2_>_span]:[color:#9eb7d0]! [&_h2_>_span]:[font-size:13px]! [&_h2_>_span]:[font-weight:410] [@media(max-width:767px)]:flex-col [@media(max-width:767px)]:items-center [@media(max-width:767px)]:[gap:20px] [@media(max-width:767px)]:[margin-bottom:25px] [@media(max-width:767px)]:[&_h2]:flex-col [@media(max-width:767px)]:[&_h2]:items-center [@media(max-width:767px)]:[&_h2]:[gap:8px] [@media(max-width:767px)]:[&_h2]:[font-size:25px]! [@media(max-width:767px)]:[&_h2_>_span]:[font-size:11px]!",
  "filterCapsule": "tw-news-filterCapsule flex max-w-full [padding:5px] [gap:4px] [border-radius:30px] [background:#f7f7f7] overflow-x-auto [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:[gap:7px] [&_button]:shrink-0 [&_button]:[padding:11px_18px] [&_button]:[border:0] [&_button]:[border-radius:24px] [&_button]:[background:transparent] [&_button]:[color:#27272a]! [&_button]:[font-size:12px]! [&_button]:[line-height:1]! [&_button]:cursor-pointer [&_button]:[transition:color_250ms_ease,_background-color_250ms_ease] [&_.tw-news-activeFilter]:[background:#005eff] [&_.tw-news-activeFilter]:[color:#fff]! [&_button:focus-visible]:[outline:2px_solid_#0d5792] [&_button:focus-visible]:[outline-offset:-2px] [@media(min-width:768px)_and_(max-width:1199px)]:[&_button]:[padding-inline:12px] [@media(max-width:767px)]:w-full [@media(max-width:767px)]:[&_button]:[flex:1_0_auto] [@media(max-width:767px)]:[&_button]:[padding:9px_7px] [@media(max-width:767px)]:[&_button]:[gap:5px] [@media(max-width:767px)]:[&_button]:[font-size:10px]! [@media(prefers-reduced-motion:reduce)]:[&_button]:[transition:none]",
  "activeFilter": "tw-news-activeFilter",
  "statusIcon": "tw-news-statusIcon [font-size:15px]! [line-height:1]! [@media(max-width:767px)]:[font-size:13px]!",
  "collectionGrid": "tw-news-collectionGrid grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:20px] items-stretch [@media(min-width:768px)_and_(max-width:1199px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:767px)]:[gap:12px]",
  "collectionCard": "tw-news-collectionCard flex-col [gap:0]! [min-height:498px] [&_.tw-news-collectionMedia]:[flex-basis:auto] [&_.tw-news-collectionMedia]:w-full [&_.tw-news-collectionMedia]:h-auto [&_.tw-news-collectionMedia]:[aspect-ratio:350_/_227] [&_.tw-news-photoFrame]:[border-radius:25px] [&_.tw-news-logo]:[left:0] [&_.tw-news-logo]:[right:auto] [&_.tw-news-logo]:[top:auto] [&_.tw-news-logo]:[bottom:-7px] [&_.tw-news-logo]:[transform:rotate(-18deg)] [&_.tw-news-logo]:[transform-origin:center] [&:is(:hover,_:focus-within)_.tw-news-logo]:[transform:rotate(0deg)] [&.tw-news-previewActive_.tw-news-logo]:[transform:rotate(0deg)] [&_.tw-news-collectionText]:[padding-top:25px] [&:is(:hover,_:focus-within)_.tw-news-collectionDescription]:[color:#fff]! [&.tw-news-previewActive_.tw-news-collectionDescription]:[color:#fff]! [&_.tw-news-metadata]:[margin-top:0] [&_.tw-news-metadata]:[margin-bottom:20px] [@media(max-width:767px)]:min-h-0 [@media(max-width:767px)]:[&_.tw-news-photoFrame]:[border-radius:16px] [@media(max-width:767px)]:[&_.tw-news-collectionMedia_.tw-news-logo]:[left:auto] [@media(max-width:767px)]:[&_.tw-news-collectionMedia_.tw-news-logo]:[right:-8px] [@media(max-width:767px)]:[&_.tw-news-collectionMedia_.tw-news-logo]:[top:50%] [@media(max-width:767px)]:[&_.tw-news-collectionMedia_.tw-news-logo]:[bottom:auto] [@media(max-width:767px)]:[&_.tw-news-collectionMedia_.tw-news-logo]:[transform:translateY(-50%)_rotate(-90deg)] [@media(max-width:767px)]:[&:is(:hover,_:focus-within)_.tw-news-collectionMedia_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)] [@media(max-width:767px)]:[&.tw-news-previewActive_.tw-news-collectionMedia_.tw-news-logo]:[transform:translateY(-50%)_rotate(0deg)] [@media(max-width:767px)]:[&_.tw-news-collectionText]:[padding-top:25px] [@media(max-width:767px)]:[&_.tw-news-metadata]:[margin-bottom:20px]",
  "collectionMedia": "tw-news-collectionMedia",
  "collectionText": "tw-news-collectionText [&_h3]:[font-weight:540] [&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125] [&.tw-news-collectionText_h3]:[line-height:1.12]! [&_>_.tw-news-viewButton]:[margin-top:auto]",
  "collectionDescription": "tw-news-collectionDescription [margin:25px_0_18px] [color:#27272a]! [font-size:12px]! [line-height:1.12]! [transition:color_400ms_ease] [@media(max-width:767px)]:[margin-top:20px] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
  "expandButton": "tw-news-expandButton [margin:35px_auto_0] [&.tw-news-expandButton]:[width:170px] [&.tw-news-expandButton]:[--blog-orb-offset:126px] [&.tw-news-expandButton:is(:hover,_:focus-visible)]:[--blog-orb-offset:0px] [&_>_span:first-child]:[padding-left:calc(53px_-_var(--blog-orb-offset)_*_0.293650794)] [@media(max-width:767px)]:[margin-top:25px]",
  "newsletter": "tw-news-newsletter [margin-top:90px]  [@media(max-width:767px)]:[margin-top:60px]",
  "mobileLabel": "tw-news-mobileLabel hidden [@media(max-width:767px)]:inline",
  "enteringCard": "tw-news-enteringCard animate-news-card-reveal [@media(prefers-reduced-motion:reduce)]:[animation:none]",
  "desktopLabel": "tw-news-desktopLabel [@media(max-width:767px)]:hidden",
} as const;


const categories = ["Exhibition", "Company", "Event", "Product", "Press", "Awards", "Career"] as const;
type Category = (typeof categories)[number];
type NewsItem = { id: string; title: string; category: Category; date: string; dateLabel: string; image: string; href: string };

// Replace this local image with the original colour photo when it is available.
const news: NewsItem[] = [
  { id: "brazil", title: "Our SCE Series Pumps Have Been Converted into an NFPA 20-Compliant Fire Pump Set in Brazil", category: "Exhibition", date: "2025-06-10", dateLabel: "10/06/2025", image: "/news/haber.webp", href: "/news-detail" },
  { id: "syria", title: "We Participated in SYRIA BUILDEX 2025", category: "Exhibition", date: "2025-06-10", dateLabel: "10/06/2025", image: "/news/haber.webp", href: "/news-detail" },
  { id: "russia", title: "New Project Delivery | Russia – Baltic...", category: "Company", date: "2025-05-28", dateLabel: "28/05/2025", image: "/news/haber.webp", href: "/news-detail" },
  { id: "siee", title: "We proudly took part in the SIEE-Pol...", category: "Exhibition", date: "2025-05-23", dateLabel: "23/05/2025", image: "/news/haber.webp", href: "/news-detail" },
];

type SectionId = "exhibition" | "company" | "event";
type CollectionItem = NewsItem & { description: string; status: string };
const collectionSections = [
  { id: "exhibition", title: "Exhibition", filters: ["Scheduled", "In Progress", "Completed"] },
  { id: "company", title: "Company", filters: ["Announcements", "Corporate", "Investments"] },
  { id: "event", title: "Event", filters: [] },
] as const;

// Twelve previews per filter let every capsule exercise the six-card expansion.
const collectionNews: CollectionItem[] = collectionSections.flatMap(section =>
  (section.filters.length ? [...section.filters] : ["Event"]).flatMap(status =>
    Array.from({ length: 12 }, (_, index) => ({
      id: `${section.id}-${status.toLowerCase().replaceAll(" ", "-")}-${index + 1}`,
      category: section.title,
      status,
      title: "We are Participating in IFAT Saudi Arabia (January 26–28, 2026)",
      description: "We are preparing to showcase the quality of Sempa Pompa at the IFAT Saudi Arabia exhibition, which will take place between January 26–28, 2026.",
      date: "2025-06-10",
      dateLabel: "10/06/2025",
      image: "/news/haber.webp",
      href: "/news-detail?article=ifat-saudi-arabia",
    })),
  ),
);

function CollectionCard({ item, entering }: { item: CollectionItem; entering: boolean }) {
  const [touchPreview, setTouchPreview] = useState(false);
  return (
    <article data-news-id={item.id} className={`${styles.featured} ${styles.collectionCard} ${entering ? styles.enteringCard : ""} ${touchPreview ? styles.previewActive : ""}`} aria-labelledby={`${item.id}-title`}>
      <div className={`${styles.featuredMedia} ${styles.collectionMedia}`}>
        <div className={styles.photoFrame}>
          <Image src={item.image} alt="Sempa industrial pump system" fill sizes="(min-width: 1200px) 350px, (min-width: 768px) 42vw, calc(100vw - 84px)" className={styles.photo} />
        </div>
        <Image src="/news/sempa-icon.png" alt="Sempa" width={192} height={128} sizes="48px" className={styles.logo} />
        <button type="button" className={styles.touchPreview} aria-pressed={touchPreview} onClick={() => setTouchPreview(value => !value)} aria-label="Haber kartının renkli görünümünü göster">{touchPreview ? "Normal görünüm" : "Renkli görünüm"}</button>
      </div>
      <div className={`${styles.featuredText} ${styles.collectionText}`}>
        <h3 id={`${item.id}-title`}>{item.title}</h3>
        <p className={styles.collectionDescription}>{item.description}</p>
        <div className={styles.metadata}><span>{item.category}</span><span className={styles.separator} aria-hidden="true" /><time dateTime={item.date}>{item.dateLabel}</time></div>
        <Link href={item.href} className={`${blogStyles.viewButton} ${styles.viewButton}`} aria-label={`View news: ${item.title}`}>
          <span className={blogStyles.buttonLabel}>View All</span><span className={blogStyles.buttonOrb} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function NewsCollection({ section, filter, expanded, onFilter, onExpand }: {
  section: (typeof collectionSections)[number]; filter?: string; expanded: boolean;
  onFilter: (value: string) => void; onExpand: () => void;
}) {
  const items = collectionNews.filter(item => item.category === section.title && (!filter || item.status === filter));
  const visible = expanded ? items : items.slice(0, 6);
  return (
    <section className={styles.collection} aria-labelledby={`${section.id}-heading`}>
      <header className={styles.collectionHeader}>
        <h2 id={`${section.id}-heading`}>{section.title}<span aria-label={`${items.length} haber`}>{items.length}</span></h2>
        {section.filters.length > 0 && <div className={styles.filterCapsule} role="group" aria-label={`${section.title} filtreleri`}>
          {section.filters.map(option => <button key={option} type="button" className={filter === option ? styles.activeFilter : ""} aria-pressed={filter === option} aria-controls={`${section.id}-cards`} onClick={() => onFilter(option)}>
            <span className={styles.statusIcon} aria-hidden="true">{option === "Scheduled" ? "◷" : option === "In Progress" ? "↗" : option === "Completed" ? "✓" : option === "Announcements" ? "↗" : option === "Corporate" ? "◇" : "+"}</span>{option}
          </button>)}
        </div>}
      </header>
      <div id={`${section.id}-cards`} className={styles.collectionGrid}>
        {visible.map((item, index) => <CollectionCard key={item.id} item={item} entering={expanded && index >= 6} />)}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{section.title}: {visible.length} / {items.length} haber görüntüleniyor.</p>
      {items.length > 6 && <button type="button" className={`${blogStyles.viewButton} ${styles.viewButton} ${styles.expandButton}`} aria-expanded={expanded} aria-controls={`${section.id}-cards`} onClick={onExpand}>
        <span className={blogStyles.buttonLabel}>{expanded ? "Show Less" : <><span className={styles.desktopLabel}>View All</span><span className={styles.mobileLabel}>Load More</span></>}</span><span className={blogStyles.buttonOrb} aria-hidden="true" />
      </button>}
    </section>
  );
}

function FeaturedNews({ item }: { item: NewsItem }) {
  const [touchPreview, setTouchPreview] = useState(false);
  return (
    <article className={`${styles.featured} ${touchPreview ? styles.previewActive : ""}`} aria-labelledby="featured-news-title">
      <div className={styles.featuredMedia}>
        <div className={styles.photoFrame}>
          <Image src={item.image} alt="Sempa industrial pump system" fill preload sizes="(min-width: 1200px) 330px, (min-width: 768px) 50vw, calc(100vw - 84px)" className={styles.photo} />
        </div>
        <Image src="/news/sempa-icon.png" alt="Sempa" width={192} height={128} sizes="48px" className={styles.logo} />
        <button type="button" className={styles.touchPreview} onClick={() => setTouchPreview(value => !value)} aria-pressed={touchPreview} aria-label="Haber kartının renkli görünümünü göster">
          {touchPreview ? "Normal görünüm" : "Renkli görünüm"}
        </button>
      </div>
      <div className={styles.featuredText}>
        <h3 id="featured-news-title">{item.title}</h3>
        <div className={styles.metadata}>
          <span>{item.category}</span><span className={styles.separator} aria-hidden="true" />
          <time dateTime={item.date}>{item.dateLabel}</time>
        </div>
        <Link href={item.href} className={`${blogStyles.viewButton} ${styles.viewButton}`} aria-label={`View news: ${item.title}`}>
          <span className={blogStyles.buttonLabel}>View All</span>
          <span className={blogStyles.buttonOrb} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function NewsPage() {
  const titleRef = useRepeatingTitle();
  const [selected, setSelected] = useState<Category[]>([]);
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(null);
  const [sectionFilters, setSectionFilters] = useState({ exhibition: "Scheduled", company: "Announcements" });
  const filtered = news.filter(item => selected.length === 0 || selected.includes(item.category));
  const featured = filtered[0];
  const latest = filtered.slice(1);
  function toggleCategory(category: Category) {
    setSelected(previous => previous.includes(category) ? previous.filter(item => item !== category) : [...previous, category]);
  }
  return (
    <main data-header-underlay className={`-mt-[var(--site-header-height,97px)] ${styles.page} font-sans`}>
      <div data-header-spacer aria-hidden="true" className="h-[var(--site-header-height,97px)] shrink-0" />
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 ref={titleRef} className={styles.title}>
          <span className="news-color-reveal">İşte dünden bugüne</span><br />
          <span className="news-color-reveal news-color-reveal-last">Sempa’nın köklü yolculuğu</span>
        </h1>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .tw-news-title[data-title-revealing] .news-color-reveal {
              background-image: linear-gradient(90deg, #9eb7d0 0%, #9eb7d0 42%, rgba(158,183,208,.18) 58%, rgba(158,183,208,.18) 100%);
              background-size: 250% 100%;
              background-repeat: no-repeat;
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation-name: news-title-color-flow;
              animation-duration: 8000ms;
              animation-timing-function: cubic-bezier(.25,.1,.25,1);
              animation-fill-mode: both;
              animation-iteration-count: infinite;
            }
            .tw-news-title[data-title-revealing] .news-color-reveal-last {
              animation-name: news-title-color-flow-last;
            }
          }
          @keyframes news-title-color-flow {
            0%, 88%, 100% { background-position: 100% 0; }
            28%, 65% { background-position: 0% 0; }
          }
          @keyframes news-title-color-flow-last {
            0%, 11%, 76%, 100% { background-position: 100% 0; }
            39%, 53% { background-position: 0% 0; }
          }
        `}</style>
        <section aria-labelledby="latest-news-title">
          <header className={styles.sectionHeader}>
            <h2 id="latest-news-title">Son Yüklenen Haberler</h2>
            <p>Küresel fuarlar, yeni lansmanlar, sektörel seminerler...<br />Üretimin ötesine geçiyor, sektöre yön veriyoruz.</p>
          </header>
          <div className={styles.newsGrid}>
            <div className={styles.featuredColumn}>
              {featured ? <FeaturedNews key={featured.id} item={featured} /> : <p className={styles.empty}>Seçtiğiniz kategorilerde henüz haber bulunmuyor.</p>}
            </div>
            <div className={styles.latestList} aria-label="Diğer güncel haberler">
              {latest.map(item => (
                <Link key={item.id} href={item.href} className={styles.smallCard}>
                  <span className={styles.arrow} aria-hidden="true"><FiArrowDownRight size={20} strokeWidth={3} /></span>
                  <div className={styles.smallContent}>
                    <h3 title={item.title}>{item.title}</h3>
                    <div className={styles.smallMeta}><span>{item.category}</span><time dateTime={item.date}>{item.dateLabel}</time></div>
                  </div>
                </Link>
              ))}
            </div>
            <fieldset className={styles.filters}>
              <legend className="sr-only">Haber kategorilerini filtrele</legend>
              {categories.map(category => (
                <label key={category} className={styles.filter}>
                  <input type="checkbox" checked={selected.includes(category)} onChange={() => toggleCategory(category)} aria-controls="news-filter-status" />
                  <span>{category}</span>
                </label>
              ))}
            </fieldset>
          </div>
          <p id="news-filter-status" className="sr-only" role="status" aria-live="polite">{filtered.length} haber görüntüleniyor.</p>
        </section>
        {collectionSections.map(section => (
          <NewsCollection key={section.id} section={section}
            filter={section.id === "event" ? undefined : sectionFilters[section.id]}
            expanded={expandedSection === section.id}
            onExpand={() => setExpandedSection(previous => previous === section.id ? null : section.id)}
            onFilter={value => {
              if (section.id === "event") return;
              setSectionFilters(previous => ({ ...previous, [section.id]: value }));
              setExpandedSection(previous => previous === section.id ? null : previous);
            }} />
        ))}
        <div className={styles.newsletter}><NewsletterSubscription /></div>
      </div>
    </main>
  );
}
