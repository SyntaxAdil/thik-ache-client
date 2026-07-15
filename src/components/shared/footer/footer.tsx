"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, Link2, Mail, Share2 } from "lucide-react";
import Logo from "../logo/logo";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerData: FooterSection[] = [
  {
    title: "PLATFORM",
    links: [
      { label: "How It Works", href: "/trust?tab=how-it-works" },
      { label: "Privacy & Safety", href: "/trust?tab=privacy-safety" },
      { label: "Data Architecture", href: "/trust?tab=data-collection" },
    ],
  },
  {
    title: "NEIGHBORHOODS",
    links: [
      { label: "Dhanmondi", href: "/explore?area=Dhanmondi" },
      { label: "Mirpur", href: "/explore?area=Mirpur" },
      { label: "Banani", href: "/explore?area=Banani" },
      { label: "Uttara", href: "/explore?area=Uttara" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About Developer", href: "/trust?tab=about-author" },
      { label: "Terms of Service", href: "/trust?tab=terms-of-service" },
      { label: "Contact Support", href: "https://wa.me/8801319698855" },
    ],
  },
];

const MotionLink = motion.create(Link);

function handleNativeShare() {
  if (typeof navigator !== "undefined" && navigator.share) {
    navigator.share({
      title: "ThikAche",
      text: "Check out ThikAche — hyperlocal help-exchange for Dhaka.",
      url: "https://thikache.vercel.app",
    });
  }
}

function handleCopyLink() {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText("https://thikache.vercel.app");
  }
}

export default function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-zinc-400 border-t  border-sidebar-primary-foreground/30 px-6 py-16 md:px-12 lg:px-24 select-none">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-zinc-900">
        <motion.div
          className="lg:col-span-2 flex flex-col gap-6 max-w-sm"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <MotionLink
            href="/"
            className="flex items-center gap-2 group w-fit"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <Logo width={40} height={40}></Logo>
            <span className="text-2xl font-bold tracking-tight text-primary transition-colors duration-300 ">
              ThikAche
            </span>
          </MotionLink>

          <p className="text-sm leading-relaxed text-zinc-400 font-normal">
            Building a safer, more connected Dhaka through the power of
            community help-exchange.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <motion.button
              type="button"
              onClick={handleNativeShare}
              aria-label="Share ThikAche"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 }}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-950/50 cursor-pointer text-zinc-400 hover:text-indigo-400 hover:border-zinc-700 transition-colors duration-200"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>

            <motion.button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy link"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-950/50 cursor-pointer text-zinc-400 hover:text-indigo-400 hover:border-zinc-700 transition-colors duration-200"
            >
              <Link2 className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {footerData.map((section, sectionIdx) => (
          <motion.div
            key={section.title}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: sectionIdx * 0.05 }}
          >
            <h4 className="text-xs font-semibold tracking-wider text-zinc-200 uppercase">
              {section.title}
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              {section.links.map((link) => (
                <li key={link.label}>
                  <MotionLink
                    href={link.href}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                    className="inline-block cursor-pointer text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          © {currentYear} ThikAche Hyperlocal. Built for Dhaka.
        </motion.p>

        <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors duration-300">
          <span className="text-zinc-600">Crafted with care by</span>
          <a
            href="https://github.com/SyntaxAdil"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 font-semibold text-zinc-300 hover:text-indigo-400 transition-all duration-300"
          >
            <span className="relative">
              Abdur Rahman Adil
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
