"use client";

import { CoverflowCarousel } from "@/components/CoverflowCarousel";
import { LogoMarquee } from "@/components/LogoMarquee";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ChefHat } from "lucide-react";
import Link from "next/link";

const PORTRAITS = [
  { src: "/beef-pie.png", alt: "Beef pie" },
  { src: "/curry-puff.png", alt: "Curry puff" },
  { src: "/bakery2.png", alt: "Assorted pastries" },
  { src: "/bakery1.png", alt: "Freshly baked goods" },
  { src: "/egg-tart.png", alt: "Egg tart" },
];

export default function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-white">
      {/* NAVBAR */}
      <div className="flex justify-between px-2 py-1">
        <Link href="/" className="flex items-center gap-2">
          <ChefHat />
          Master Chang's Bakery
        </Link>
        <div className="flex gap-4 text-sm pt-1 justify-end items-center">
          <div className="relative pb-1 cursor-pointer group">
            About Us
            <span className="absolute left-0 bottom-0 h-0.5 w-full bg-current origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </div>
          <div className="relative cursor-pointer group pb-1">
            Contact Us
            <span className="absolute left-0 bottom-0 h-0.5 w-full bg-current origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </div>
            <Show when="signed-in">
              <Link href="/dashboard" className="relative cursor-pointer group pb-1">
                Dashboard
              <span className="absolute left-0 bottom-0 h-0.5 w-full bg-current origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </Show>
          <div className="flex items-center ">
               <Show when="signed-in">
              <UserButton/>
            </Show>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
            Master Chang&apos;s Bakery
          </h1>
          <p className="max-w-md text-base text-neutral-500">
            Baking authentic Malaysian pastries with love and care — Bringing
            the taste of home to Perth.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {/* Auth section using the new Show component */}
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700">
                  Sign In
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <LogoMarquee reducedMotion={reducedMotion} />
          <CoverflowCarousel
            portraits={PORTRAITS}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="flex itmes-center gap-2 text-white text-lg font-semibold mb-3">
                <ChefHat />
                Master Chang's Bakery
              </h3>
              <p className="text-sm text-gray-400">
                Family run business baking everyone's favourite Malaysian
                pastries to the local people of Perth.
              </p>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
                Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
                Follow
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Master Chang's Bakery. All rights
            reserved.
          </div>
        </div>
      </footer>
    </section>
  );
}
