"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import { TactileButton } from "../ecosystem/TactileButton";
import { landing } from "@/lib/copy";
import { EcosystemShowcase } from "../motion/EcosystemShowcase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CinematicHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(meshRef.current, { opacity: 0, scale: 0.94, duration: 1.2 })
        .from(
          copyRef.current?.children || [],
          { opacity: 0, y: 24, stagger: 0.07, duration: 0.7 },
          "-=0.85"
        );

      gsap.to(meshRef.current, {
        y: -60,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[min(100vh,920px)] flex flex-col justify-center px-lg pt-[72px] pb-section overflow-hidden border-b border-hairline/30"
    >
      <div
        ref={meshRef}
        className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[min(1200px,100vw)] h-[720px] mesh-gradient-hero pointer-events-none"
      />
      <div className="absolute top-[20%] right-0 w-[min(560px,55vw)] h-[560px] bg-intelligence opacity-[0.07] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[8%] w-[280px] h-[280px] bg-ai opacity-[0.06] blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-xl xl:gap-xxl items-center">
          <div ref={copyRef} className="text-center lg:text-left order-2 lg:order-1 max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-sm py-1.5 rounded-full bg-surface-2/90 border border-hairline mb-lg backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-ai" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                {landing.eyebrow}
              </span>
            </div>

            <h1 className="text-display text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-[-0.04em] leading-[1.06] mb-lg text-text-primary">
              {landing.headline}
            </h1>

            <p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-xl">
              {landing.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-sm mb-xl">
              <Link href="/sign-up">
                <TactileButton
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="min-w-[200px] shadow-[0_8px_32px_-8px_rgba(118,132,240,0.45)]"
                >
                  {landing.ctaPrimary}
                </TactileButton>
              </Link>
              <a href="#demo">
                <TactileButton variant="secondary" size="lg" className="min-w-[200px]">
                  {landing.ctaSecondary}
                </TactileButton>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-md text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
              {landing.pipeline.map((step, i) => (
                <React.Fragment key={step}>
                  <span className="hover:text-ai transition-colors duration-300">{step}</span>
                  {i < landing.pipeline.length - 1 && (
                    <span className="text-hairline opacity-60">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 w-full">
            <EcosystemShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
