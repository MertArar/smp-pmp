"use client";

import AlbumPreviewtsx_Image from "next/image";
import { useRef as useAlbumPreviewtsx_Ref } from "react";
import Image from "next/image";
import Link from "next/link";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import blogStyles from "@/components/ui/slidingCircleStyles";

const AlbumPreviewtsx_albumImage = "/news-detail/files5.png";

function AlbumPreviewtsx_AlbumPreview({ classNames: styles }: {
    classNames: Record<"album" | "albumText" | "albumPhoto" | "viewButton" | "orb" | "viewLabel" | "albumDialog" | "dialogHeader" | "dialogPhoto", string>;
}) {
    const dialog = useAlbumPreviewtsx_Ref<HTMLDialogElement>(null);
    return <>
    <aside className={styles.album} aria-label="2023 Sodex Photo Album">
      <div className={styles.albumText}>
        <h3>2023 Sodex Photo Album</h3>
        <p>We were at the ISK-SODEX 2023 Istanbul exhibition.</p>
        <span>Latest Update / <time dateTime="2024-04-01">1.04.2024</time></span>
      </div>
      <div className={styles.albumPhoto}>
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[68%] overflow-hidden rounded-r-[20px]">
          <AlbumPreviewtsx_Image src={AlbumPreviewtsx_albumImage} alt="" fill sizes="120px" className="object-cover"/>
        </div>
        <div className="absolute inset-y-0 left-0 z-10 w-[68%] overflow-hidden rounded-r-[20px] shadow-[4px_0_5px_-2px_#00162c80,10px_0_16px_-5px_#00162c66]">
          <AlbumPreviewtsx_Image src={AlbumPreviewtsx_albumImage} alt="Sempa exhibition stand at ISK-SODEX Istanbul" fill sizes="120px" className="object-cover"/>
        </div>
        <button type="button" className={styles.viewButton} onClick={() => dialog.current?.showModal()} aria-haspopup="dialog" aria-label="View 2023 Sodex exhibition photo">
          <span className={styles.orb} aria-hidden="true"/><span className={styles.viewLabel}>View</span>
        </button>
      </div>
    </aside>
    <dialog ref={dialog} className={styles.albumDialog} aria-labelledby="album-dialog-title" onClick={event => { if (event.target === event.currentTarget)
        dialog.current?.close(); }}>
      <div className={styles.dialogHeader}>
        <h2 id="album-dialog-title">2023 Sodex Photo Album</h2>
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close photo preview">×</button>
      </div>
      <div className={styles.dialogPhoto}>
        <AlbumPreviewtsx_Image src={AlbumPreviewtsx_albumImage} alt="Sempa exhibition stand at ISK-SODEX Istanbul" fill sizes="90vw" className="object-contain"/>
      </div>
    </dialog>
  </>;
}

// Tailwind classes stay next to the component; marker classes scope descendant variants.
const styles = {
    "page": "tw-detail-page [padding:70px_24px_110px] [color:#27272a]! [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,_'wdth'_125] [letter-spacing:-0.04em] [background:radial-gradient(ellipse_at_94%_14%,_#c9e4ff_0%,_transparent_49%),_radial-gradient(ellipse_at_8%_47%,_#f5faff_0%,_transparent_46%),_radial-gradient(ellipse_at_72%_80%,_#d5e9ff_0%,_transparent_55%),_linear-gradient(125deg,_#f5faff_0%,_#e6f3ff_42%,_#d5e9ff_100%)] [@media(min-width:768px)_and_(max-width:1199px)]:[padding-inline:40px] [@media(max-width:767px)]:[padding:60px_32px_65px]",
    "titleRow": "tw-detail-titleRow flex items-start justify-between [gap:35px] [&_h1]:[max-width:1030px] [&_h1]:m-0 [&_h1]:[font-size:clamp(28px,_2.78vw,_40px)]! [&_h1]:[line-height:1]! [&_h1]:[font-weight:410] [&_h1]:[color:#0d5792]! [&_time]:[padding-top:6px] [&_time]:whitespace-nowrap [&_time]:[font-size:15px]! [&_time]:[line-height:1.12]! [@media(min-width:768px)_and_(max-width:1199px)]:[gap:24px] [@media(max-width:767px)]:flex-col [@media(max-width:767px)]:[gap:18px] [@media(max-width:767px)]:[&_h1]:[font-size:clamp(27px,_7.5vw,_38px)]! [@media(max-width:767px)]:[&_time]:[order:-1] [@media(max-width:767px)]:[&_time]:[font-size:15px]! [@media(max-width:767px)]:[&_time]:p-0",
    "hero": "tw-detail-hero relative [margin-top:45px] [height:clamp(350px,_40vw,_575px)] [@media(max-width:767px)]:[margin:20px_-32px_0] [@media(max-width:767px)]:[height:clamp(365px,_112vw,_540px)]",
    "heroPhoto": "tw-detail-heroPhoto object-cover [object-position:center_45%] [filter:grayscale(1)] [mask-image:linear-gradient(to_bottom,_transparent_0%,_#000_7%,_#000_56%,_transparent_100%),_linear-gradient(to_right,_transparent_0%,_#000_7%,_#000_84%,_transparent_100%)] [mask-composite:intersect]!  [@media(max-width:767px)]:[object-position:44%_center]",
    "contentGrid": "tw-detail-contentGrid grid [grid-template-columns:minmax(0,_500fr)_minmax(0,_660fr)] [gap:40px] relative [margin-top:-180px] [align-items:start] [@media(min-width:768px)_and_(max-width:1199px)]:[grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)] [@media(min-width:768px)_and_(max-width:1199px)]:[gap:24px] [@media(min-width:768px)_and_(max-width:1199px)]:[margin-top:-110px] [@media(max-width:767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:767px)]:[margin-top:-15px] [@media(max-width:767px)]:[gap:52px]",
    "introduction": "tw-detail-introduction [padding-top:140px] [&_h2]:m-0 [&_h2]:[max-width:500px] [&_h2]:[font-size:clamp(34px,_3.48vw,_50px)]! [&_h2]:[line-height:1]! [&_h2]:[font-weight:410] [&_>_p]:[max-width:475px] [&_>_p]:[margin:30px_0_0] [&_>_p]:[color:#9eb7d0]! [&_>_p]:[font-size:15px]! [&_>_p]:[line-height:1.12]! [@media(min-width:768px)_and_(max-width:1199px)]:[padding-top:140px] [@media(min-width:768px)_and_(max-width:1199px)]:[&_h2]:[font-size:clamp(30px,_3.5vw,_42px)]! [@media(max-width:767px)]:[padding-top:0] [@media(max-width:767px)]:[&_h2]:[font-size:clamp(28px,_7.5vw,_38px)]! [@media(max-width:767px)]:[&_>_p]:[margin-top:24px] [@media(max-width:767px)]:[&_>_p]:[line-height:1.12]!",
    "rightColumn": "tw-detail-rightColumn min-w-0 relative [padding-top:62px] [@media(max-width:767px)]:p-0 [@media(max-width:767px)]:[margin-inline:-20px]",
    "blueCard": "tw-detail-blueCard [background:linear-gradient(180deg,_#005eff_0%,_#0048cc_55%,_#00338f_100%)] [border-radius:30px] [padding:92px_clamp(32px,_5vw,_72px)_65px] [color:#f7f7f7]! [font-size:15px]! [line-height:1.12]! [&_p]:[margin:0_0_30px] [&_ul]:[margin:0_0_34px] [&_ul]:[padding-left:18px] [&_li]:[padding-left:3px] [&_li]:[margin-bottom:24px] [&_strong]:[font-weight:410] [&_strong]:[font-variation-settings:'wght'_410,_'wdth'_125] [&_.tw-detail-engineeringIntro]:[color:#9eb7d0]! [&_.tw-detail-engineeringIntro]:[font-weight:540] [&_.tw-detail-engineeringIntro]:[font-variation-settings:'wght'_540,_'wdth'_125] [@media(min-width:768px)_and_(max-width:1199px)]:[padding:85px_28px_40px] [@media(max-width:767px)]:[padding:65px_26px_38px] [@media(max-width:767px)]:[font-size:15px]! [@media(max-width:767px)]:[line-height:1.12]!",
    "engineeringIntro": "tw-detail-engineeringIntro",
    "technologyLogo": "tw-detail-technologyLogo [margin-top:45px] [width:min(100%,_180px)] h-auto object-contain [@media(max-width:767px)]:[margin-top:120px] [@media(max-width:767px)]:[width:min(100%,_160px)]",
    "previewNote": "tw-detail-previewNote [opacity:0.7] [font-size:12px]!",
    "slogan": "tw-detail-slogan [font-size:clamp(30px,_2.78vw,_40px)]! [line-height:1]! [margin:14px_0_0_clamp(32px,_5vw,_72px)] [background:linear-gradient(90deg,_#0d5792,_#9eb7d0)] [background-clip:text]! [color:transparent]! [@media(min-width:768px)_and_(max-width:1199px)]:[margin-left:28px] [@media(min-width:768px)_and_(max-width:1199px)]:[font-size:clamp(26px,_3vw,_36px)]! [@media(max-width:767px)]:[margin:40px_20px_0] [@media(max-width:767px)]:[font-size:clamp(29px,_8vw,_40px)]!",
    "mobileSloganBreak": "tw-detail-mobileSloganBreak hidden [@media(max-width:767px)]:[display:initial]",
    "newsletter": "tw-detail-newsletter [margin-top:65px]  [@media(max-width:767px)]:[margin-top:45px]",
    "album": "tw-detail-album absolute [right:-20px] [top:0] [z-index:2] grid [grid-template-columns:minmax(0,_3fr)_minmax(0,_1fr)] [width:min(530px,_calc(100%_-_30px))] [min-height:110px] [border-radius:20px] [background:linear-gradient(130deg,_#fff,_#f0f4f8)] [box-shadow:0_14px_36px_#1742691a] overflow-hidden [@media(min-width:768px)_and_(max-width:1199px)]:[right:0] [@media(min-width:768px)_and_(max-width:1199px)]:w-full [@media(max-width:767px)]:hidden",
    "albumText": "tw-detail-albumText [padding:18px_22px] [&_h3]:[font-size:18px]! [&_h3]:[font-weight:410] [&_h3]:[line-height:1]! [&_h3]:[margin:0_0_10px] [&_h3]:[color:#0d5792]! [&_p]:[font-size:11px]! [&_p]:[line-height:1.12]! [&_p]:[margin:0_0_12px] [&_>_span]:[font-size:10px]! [&_>_span]:[color:#9eb7d0]! [@media(min-width:768px)_and_(max-width:1199px)]:[padding:16px] [@media(min-width:768px)_and_(max-width:1199px)]:[&_h3]:[font-size:16px]! [@media(max-width:767px)]:[padding:17px] [@media(max-width:767px)]:[&_h3]:[font-size:17px]!",
    "albumPhoto": "tw-detail-albumPhoto [min-height:110px] relative [container-type:inline-size]",
    "viewButton": "tw-detail-viewButton absolute z-20 [bottom:12px] [left:50%] [transform:translateX(-50%)] flex items-center [gap:9px] [width:calc(100%_-_12px)] [height:36px] [padding:4px_7px] [border:1px_solid_#ffffffb3] [border-radius:30px] [background:#ffffff70] [backdrop-filter:blur(8px)] [box-shadow:0_4px_14px_#00338f26] cursor-pointer [&:hover_.tw-detail-orb]:[transform:translateX(calc(100cqw_-_52px))] [&:focus-visible_.tw-detail-orb]:[transform:translateX(calc(100cqw_-_52px))] [&:hover_.tw-detail-viewLabel]:[transform:translateX(-27px)] [&:focus-visible_.tw-detail-viewLabel]:[transform:translateX(-27px)] [&:focus-visible]:[outline:2px_solid_#005eff] [&:focus-visible]:[outline-offset:4px]",
    "orb": "tw-detail-orb shrink-0 [width:26px] [height:26px] [border-radius:50%] [background:linear-gradient(160deg,_#005eff,_#001ea2)] [box-shadow:0_0_14px_#005eff90] [transition:transform_300ms_ease] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
    "viewLabel": "tw-detail-viewLabel [color:#27272a]! [font-size:12px]! [transition:transform_300ms_ease] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
    "relatedCard": "tw-detail-relatedCard [&:focus-visible]:[outline:2px_solid_#005eff] [&:focus-visible]:[outline-offset:4px] flex flex-col min-w-0 [min-height:498px] [padding:20px] [border-radius:30px] [background:#f7f7f7] [@media(prefers-reduced-motion:reduce)]:[transition:none]",
    "related": "tw-detail-related [margin-top:32px] [&_>_h2]:[font-size:15px]! [&_>_h2]:[line-height:1]! [&_>_h2]:[font-weight:410] [&_>_h2]:[letter-spacing:-0.04em] [&_>_h2]:[color:#005eff]! [&_>_h2]:[margin:0_0_45px] [@media(max-width:767px)]:[margin-top:38px]",
    "relatedGrid": "tw-detail-relatedGrid grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:20px] items-stretch [@media(min-width:768px)_and_(max-width:1199px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:767px)]:[grid-template-columns:minmax(0,_1fr)]",
    "relatedMedia": "tw-detail-relatedMedia relative shrink-0 w-full",
    "relatedPhoto": "tw-detail-relatedPhoto relative w-full [aspect-ratio:350_/_227] [border-radius:30px] overflow-hidden [&_img]:object-cover [&_img]:[filter:grayscale(1)]",
    "relatedLogo": "tw-detail-relatedLogo absolute [left:0] [bottom:-7px] [width:48px] h-auto",
    "relatedText": "tw-detail-relatedText flex flex-1 flex-col items-start min-w-0 [padding-top:25px] [&_h3]:m-0 [&_h3]:[font-size:15px]! [&_h3]:[line-height:1.12]! [&_h3]:[font-weight:540] [&_h3]:[font-variation-settings:'wght'_540,_'wdth'_125] [&_>_p]:[margin:25px_0_18px] [&_>_p]:[font-size:12px]! [&_>_p]:[font-weight:410] [&_>_p]:[line-height:1.12]!",
    "relatedMeta": "tw-detail-relatedMeta flex items-center [gap:10px] [margin-bottom:20px] [color:#9eb7d0]! [font-size:12px]! [line-height:1.12]!",
    "relatedSeparator": "tw-detail-relatedSeparator [width:1px] [height:12px] [background:#9eb7d0]",
    "relatedButton": "tw-detail-relatedButton [margin-top:auto] [backdrop-filter:blur(8px)] [&.tw-detail-relatedButton]:[--blog-orb-offset:86px] [&.tw-detail-relatedButton:is(:hover,_:focus-visible)]:[--blog-orb-offset:0px] [&_>_span:last-child]:[width:30px] [&_>_span:last-child]:[height:30px]",
    "albumDialog": "tw-detail-albumDialog [width:min(960px,_92vw)] [max-height:90svh] [padding:20px] [border:1px_solid_#fff] [border-radius:24px] [background:#f5faff] [color:#0d5792]! [&::backdrop]:[background:#00162c99] [&::backdrop]:[backdrop-filter:blur(8px)]",
    "dialogHeader": "tw-detail-dialogHeader flex justify-between items-center [gap:16px] [&_h2]:m-0 [&_h2]:[font-size:clamp(18px,_3vw,_24px)]! [&_h2]:[font-weight:410] [&_button]:[width:40px] [&_button]:[height:40px] [&_button]:[border:0] [&_button]:[border-radius:50%] [&_button]:cursor-pointer [&_button]:[background:#d5e9ff] [&_button]:[font-size:26px]!",
    "dialogPhoto": "tw-detail-dialogPhoto relative [height:min(65svh,_600px)] [margin-top:16px]",
    "desktopSloganBreak": "tw-detail-desktopSloganBreak [@media(max-width:767px)]:hidden",
} as const;

const relatedNews = Array.from({ length: 3 }, (_, index) => ({
    id: `ifat-preview-${index + 1}`,
    title: "We are Participating in IFAT Saudi Arabia (January 26–28, 2026)",
    description: "We are preparing to showcase the quality of Sempa Pompa at the IFAT Saudi Arabia exhibition, which will take place between January 26–28, 2026.",
    href: "/news-detail?article=ifat-saudi-arabia",
}));

const advantages = [
    ["Exceptional High Flow Capacity", "Designed to rapidly deliver massive volumes of water, the SCE Series meets the intense hydraulic demands required for severe fire suppression scenarios."],
    ["Optimized Low Hydraulic Losses", "Engineered with advanced fluid dynamics, the system minimizes internal friction, ensuring superior energy efficiency and sustained peak performance under extreme pressure."],
    ["Robust Diesel Engine Compatibility", "Specifically configured for seamless mechanical integration with diesel drivers, guaranteeing uninterrupted, reliable operation even during complete electrical grid failures."],
    ["Comprehensive NFPA 20-Compliant Infrastructure", "Equipped with advanced control mechanisms and rigorous testing frameworks that meet the world’s most trusted international fire safety regulations."],
] as const;

// Local preview articles keep related links usable until a news data source exists.
const articles = [
    {
        id: "ifat-saudi-arabia",
        title: "We are Participating in IFAT Saudi Arabia (January 26–28, 2026)",
        heading: "Sempa Pompa at IFAT Saudi Arabia",
        description: "We are preparing to showcase the quality of Sempa Pompa at the IFAT Saudi Arabia exhibition, which will take place between January 26–28, 2026.",
        image: "/news-detail/haber.webp",
    },
    {
        id: "fire-safety",
        title: "Our SCE Series Pumps Integrated into NFPA 20 Compliant Fire Pump Set in Brazil",
        heading: "Advancing Global Fire Safety: Sempa Pompa and LS Fire Collaborate on NFPA 20-Compliant Solutions",
        description: "We are thrilled to announce a significant milestone in our ongoing commitment to global life safety and critical infrastructure. Our esteemed partner, LS Fire, has successfully integrated Sempa Pompa's high-efficiency SCE Series double suction pumps into a state-of-the-art, diesel engine-driven fire pump set.",
        image: "/news-detail/haber.webp",
    },
    {
        id: "corrosion",
        title: "Corrosion-Resistant Pump Materials and Applications: A Comprehensive Guide",
        heading: "Choosing Pump Materials for Reliable Industrial Performance",
        description: "Corrosion can reduce the lifespan of equipment in industrial processes. Selecting pump materials starts with understanding the pumped fluid, operating temperature and maintenance requirements.",
        image: "/news-detail/news1.jpg",
    },
    {
        id: "engineering",
        title: "Engineering Reliable Pump Systems for Critical Infrastructure",
        heading: "From System Requirements to Long-Term Pump Reliability",
        description: "Reliable pumping begins with a clear understanding of the installation. Flow, pressure and service conditions guide equipment selection, while inspection and maintenance help sustain performance throughout its working life.",
        image: "/news-detail/haber.webp",
    },
] as const;

export default function NewsDetailPage({ article }: {
    article?: string;
}) {
    const selected = articles.find(item => item.id === article) ?? articles.find(item => item.id === "fire-safety")!;
    const featured = selected.id === "fire-safety";
    return (<main data-header-underlay className={`-mt-[var(--site-header-height,97px)] ${styles.page} font-sans`}>
      <div data-header-spacer aria-hidden="true" className="h-[var(--site-header-height,97px)] shrink-0" />
      <article className="mx-auto w-full max-w-[1200px]" aria-labelledby="news-title">
        <header className={styles.titleRow}>
          <h1 id="news-title">{selected.title}</h1>
          <time dateTime="2025-06-10">June 10, 2025</time>
        </header>

        <div className={styles.hero}>
          <Image src={selected.image} alt="Sempa industrial pump system" fill preload sizes="(min-width: 1440px) 1200px, (min-width: 768px) 90vw, 100vw" className={styles.heroPhoto}/>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.introduction}>
            <h2>{selected.heading}</h2>
            <p>{selected.description}</p>
          </div>
          <div className={styles.rightColumn}>
            <AlbumPreviewtsx_AlbumPreview classNames={{ album: styles.album, albumText: styles.albumText, albumPhoto: styles.albumPhoto, viewButton: styles.viewButton, orb: styles.orb, viewLabel: styles.viewLabel, albumDialog: styles.albumDialog, dialogHeader: styles.dialogHeader, dialogPhoto: styles.dialogPhoto }}/>
            <div className={styles.blueCard}>
              {featured ? <>
                <p>This robust system has been meticulously engineered to achieve full compliance with the rigorous NFPA 20 standards, ensuring uncompromising performance in emergency situations.</p>
                <p className={styles.engineeringIntro}>The integration of the SCE Series brings several critical engineering advantages to fire protection systems:</p>
                <ul>
                  {advantages.map(([label, text]) => <li key={label}><strong>{label}:</strong> {text}</li>)}
                </ul>
                <p>At Sempa Pompa, we recognize that emergency systems leave no room for error. We are immensely proud to contribute to global fire protection networks by providing engineering solutions that protect both lives and investments.</p>
              </> : <>
                <p>{selected.description}</p>
                <p>Review the installation’s operating conditions alongside the equipment documentation. A suitable system combines correctly selected pumps, compatible components and a maintenance plan suited to the application.</p>
                <p>Regular inspections and performance checks help identify changes in operating conditions and support reliable service.</p>
                <p className={styles.previewNote}>Engineering preview article</p>
              </>}
              <Image src="/news-detail/im-pump-technology.png" alt="IM PUMP TECHNOLOGY" width={441} height={84} className={styles.technologyLogo}/>
            </div>
            <p className={styles.slogan}>A força da água<br className={styles.mobileSloganBreak}/>{" "}é a<br className={styles.desktopSloganBreak}/>{" "}nossa força!</p>
          </div>
        </div>
      </article>

      <section className={`${styles.related} mx-auto w-full max-w-[1200px]`} aria-labelledby="related-title">
        <h2 id="related-title">RELATED NEWS</h2>
        <div className={styles.relatedGrid}>
          {relatedNews.map(item => (<article key={item.id} className={styles.relatedCard} aria-labelledby={`${item.id}-title`}>
              <div className={styles.relatedMedia}>
                <div className={styles.relatedPhoto}>
                  <Image src="/news-detail/haber.webp" alt="Sempa industrial pump system" fill sizes="(min-width: 1200px) 350px, (min-width: 768px) 42vw, calc(100vw - 84px)"/>
                </div>
                <Image src="/news-detail/sempa-icon.png" alt="Sempa" width={192} height={128} className={styles.relatedLogo} sizes="48px"/>
              </div>
              <div className={styles.relatedText}>
                <h3 id={`${item.id}-title`}>{item.title}</h3>
                <p>{item.description}</p>
                <div className={styles.relatedMeta}>
                  <span>Exhibition</span><span className={styles.relatedSeparator} aria-hidden="true"/>
                  <time dateTime="2025-06-10">10/06/2025</time>
                </div>
                <Link href={item.href} className={`${blogStyles.viewButton} ${styles.relatedButton}`} aria-label={`View news: ${item.title}`}>
                  <span className={blogStyles.buttonLabel}>View All</span>
                  <span className={blogStyles.buttonOrb} aria-hidden="true"/>
                </Link>
              </div>
            </article>))}
        </div>
      </section>
      <div className={`${styles.newsletter} mx-auto w-full max-w-[1200px]`}>
        <NewsletterSubscription />
      </div>
    </main>);
}
