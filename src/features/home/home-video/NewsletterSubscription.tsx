"use client";

import { useState } from "react";
import styles from "./NewsletterSubscription.module.css";

export default function NewsletterSubscription() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <section
      id="newsletter-subscription"
      className={`${styles.newsletter} relative mx-auto w-[calc(100%-40px)] max-w-[1600px] md:w-[83.333333%]`}
    >
      <div
        className="
          home-newsletter-row
          relative
          flex
          w-full
          items-center
          mb-64
        "
      >
        {/* NEWSLETTER TITLE */}
        <h2
          className="home-newsletter-title m-0 shrink-0"
          style={{
            width: "282.67px",
            height: "80px",
            fontFamily: "var(--font-sf-pro), sans-serif",
            fontSize: "40px",
            fontWeight: 410,
            fontStyle: "normal",
            fontStretch: "expanded",
            lineHeight: 1,
            letterSpacing: 0,
            color: "#0D5792",
          }}
        >
          Newsletter
          <br />
          Subscription
        </h2>

        {/* EMAIL AND SUBSCRIBE GROUP */}
        <div
          className="home-newsletter-fields flex shrink-0 items-center"
          style={{
            marginLeft: "40px",
            gap: "13.33px",
          }}
        >
          {/* EMAIL INPUT */}
          <div
            className="home-newsletter-email relative shrink-0 overflow-hidden"
            style={{
              width: "410.67px",
              height: "60px",
              borderRadius: "10.67px",
              backgroundColor: "rgba(255,255,255,0.20)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
            }}
          >
            <input
              type="email"
              name="email"
              autoComplete="email"
              aria-label="E-Mail"
              placeholder="E-Mail"
              className="
                h-full
                w-full
                border-0
                bg-transparent
                outline-none
                placeholder:text-[#0D5792]
              "
              style={{
                padding: "4px 33.33px",
                fontFamily: "var(--font-sf-pro), sans-serif",
                fontSize: "20px",
                fontWeight: 410,
                fontStyle: "normal",
                lineHeight: 1,
                letterSpacing: 0,
                color: "#0D5792",
              }}
            />
          </div>

          {/* SUBSCRIBE BUTTON */}
          <button
            type="button"
            className="
              flex
              shrink-0
              cursor-pointer
              items-center
              justify-center
              border-0
              outline-none
              transition-all
              duration-300
              ease-out
              hover:brightness-110
              hover:shadow-[0_8px_28px_rgba(0,94,255,0.25)]
              active:scale-[0.97]
              focus-visible:ring-2
              focus-visible:ring-[#0D5792]
              focus-visible:ring-offset-2
            "
            style={{
              width: "180px",
              height: "60px",
              borderRadius: "10.67px",
              padding: "4px 33.33px",
              backgroundColor: "#005EFF",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              fontFamily: "var(--font-sf-pro), sans-serif",
              fontSize: "20px",
              fontWeight: 410,
              fontStyle: "normal",
              lineHeight: 1,
              letterSpacing: 0,
              color: "#F7F7F7",
            }}
          >
            Subscribe
          </button>
        </div>

        {/* CONSENT CHECKBOX AND TEXT */}
        <div
          className="home-newsletter-consent flex min-w-0 items-center"
          style={{
            marginLeft: "40px",
            gap: "12px",
          }}
        >
          {/* CHECKBOX */}
          <label
            className="
              relative
              flex
              shrink-0
              cursor-pointer
              items-center
              justify-center
            "
            style={{
              width: "24px",
              height: "24px",
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(event) => setIsChecked(event.target.checked)}
              aria-label="Aydınlatma ve açık rıza onayı"
              className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
            />

            <span
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                rounded-[5px]
                border
                border-[#0D5792]/20
                bg-white/25
                transition-all
                duration-200
                peer-checked:border-[#005EFF]
                peer-checked:bg-[#005EFF]
                peer-focus-visible:ring-2
                peer-focus-visible:ring-[#005EFF]
              "
            >
              {isChecked && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12L10 17L19 7"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </label>

          {/* CONSENT TEXT */}
          <p
            className="home-newsletter-consent-text m-0"
            style={{
              width: "545.33px",
              maxWidth: "100%",
              fontFamily: "var(--font-sf-pro), sans-serif",
              fontSize: "16px",
              fontWeight: 410,
              fontStyle: "normal",
              fontStretch: "expanded",
              lineHeight: 1,
              letterSpacing: 0,
              color: "#000000",
            }}
          >
            <a
              href="#"
              className="
                underline-offset-2
                transition-colors
                duration-200
                hover:text-[#0D5792]
                hover:underline
              "
              onClick={(event) => event.preventDefault()}
            >
              Aydınlatma Metnini
            </a>{" "}
            okudum ve{" "}
            <a
              href="#"
              className="
                underline-offset-2
                transition-colors
                duration-200
                hover:text-[#0D5792]
                hover:underline
              "
              onClick={(event) => event.preventDefault()}
            >
              Açık Rıza Metni’ni
            </a>{" "}
            okudum, anladım ve e-posta aboneliği başvurusu yaparak açık rızamı
            verdiğimi beyan ederim.
          </p>
        </div>
      </div>

    </section>
  );
}
