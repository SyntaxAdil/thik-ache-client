import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Database,
  Eye,
  Share2,
  Lock,
  FileText,
  Scale,
  CheckCircle2,
  MessageSquare,
  Globe,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import FaGithub from "../../../components/ui/FaGithub";
import FaLinkedin from "../../../components/ui/FaLinkedin";

interface PageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function TrustPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "introduction";

  const tabs = [
    { id: "introduction", label: "Introduction" },
    { id: "how-it-works", label: "How It Works" },
    { id: "data-collection", label: "Data Architecture" },
    { id: "usage-purpose", label: "Usage & Purpose" },
    { id: "security-protocols", label: "Security & Trust" },
    { id: "terms-of-service", label: "Terms of Service" },
    { id: "about-author", label: "About the Author" },
  ];

  return (
    <main className="min-h-screen bg-black text-zinc-100 py-16 tracking-tight">
      <div className="container mx-auto px-0  lg:px-0 ">
        <div className="flex flex-col md:flex-row gap-12 items-start w-full">
          <div className="w-full md:w-64 shrink-0 space-y-6  border-zinc-900">
            <div>
              <p className="text-2xs font-bold uppercase tracking-widest text-indigo-500">
                Platform Center
              </p>
              <h1 className="text-3xl font-black text-white mt-1">
                Trust & Rules
              </h1>
            </div>

            <nav className="flex flex-col space-y-1 items-start w-full bg">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/trust?tab=${tab.id}`}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-zinc-900 text-zinc-200"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950/50"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-3">
              <div className="flex items-center gap-2 text-emerald-500">
                <MessageSquare className="h-4 w-4" />
                <p className="text-xs font-bold">Live Support</p>
              </div>
              <p className="text-2xs text-zinc-500 leading-relaxed">
                Have questions about how matches work? Message directly via
                WhatsApp.
              </p>
              <a
                href="https://wa.me/8801319698855"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full justify-center items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 text-emerald-400 hover:text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all shadow-sm"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Connect on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-2xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Active
              </span>
              <span className="text-2xs font-semibold text-zinc-600">
                v1.0.0 (Community Framework)
              </span>
            </div>

            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">
                Ecosystem Transparency
              </h2>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                Platform Architecture & Guidelines
              </p>
            </div>

            <hr className="border-zinc-900 w-16 border-t-2" />

            <div className="w-full pt-4 min-h-[400px]">
              {activeTab === "introduction" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <ShieldCheck className="h-5 w-5 text-indigo-500" />
                    <h3>1. Introduction</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Welcome to <strong>ThikAche</strong>. This platform serves
                    as a closed-loop, community-driven hyperlocal exchange
                    network designed to connect neighbors who need everyday
                    tasks completed with capable individuals nearby willing to
                    assist.
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    By accessing our application layers, web infrastructure, or
                    match pipelines, you actively agree to respect community
                    bounds and foster transparent neighborhood collaborations.
                  </p>
                </div>
              )}

              {activeTab === "how-it-works" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                    <h3>2. Core Operational Loop</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    ThikAche completely bypasses the complexity of traditional
                    third-party agencies. The workflow relies entirely on
                    absolute community validation:
                  </p>
                  <div className="space-y-4 pt-2">
                    <div className="flex gap-4 items-start p-4 bg-zinc-950 rounded-xl border border-zinc-900">
                      <span className="h-6 w-6 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                        1
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">
                          Post a Request
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
                          Requesters detail everyday tasks (e.g., tech
                          troubleshooting, moving furniture, tutoring) alongside
                          specific localization notes and budgets.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-zinc-950 rounded-xl border border-zinc-900">
                      <span className="h-6 w-6 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                        2
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">
                          Hyperlocal Matching
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
                          Nearby helpers receive targeted system updates based
                          on coordinates. Once a helper accepts, the request
                          moves to an active state.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-4 bg-zinc-950 rounded-xl border border-zinc-900">
                      <span className="h-6 w-6 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                        3
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-200">
                          Completion & Peer Review
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">
                          Once the physical task finishes, the requester flags
                          completion. Both parties rate each other, dynamically
                          updating respective community trust profiles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "data-collection" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <Database className="h-5 w-5 text-indigo-500" />
                    <h3>3. Data Architecture</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We value minimal data footprint strategy. To keep operations
                    secure yet streamlined, our systems catalog the following
                    metrics:
                  </p>
                  <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside bg-zinc-950 p-5 rounded-2xl border border-zinc-900">
                    <li>
                      <strong className="text-zinc-200">
                        Account Essentials:
                      </strong>{" "}
                      Account names, email configurations, and profile pictures
                      provided through authentication nodes.
                    </li>
                    <li>
                      <strong className="text-zinc-200">
                        Geospatial Inputs:
                      </strong>{" "}
                      Real-time map indices via custom Leaflet components to
                      locate and route tasks inside local neighborhoods
                      accurately.
                    </li>
                    <li>
                      <strong className="text-zinc-200">
                        Task Log History:
                      </strong>{" "}
                      Historical tracking of task inputs, matching success
                      parameters, and reciprocal reviews.
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === "usage-purpose" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <Eye className="h-5 w-5 text-indigo-500" />
                    <h3>4. Usage & Purpose</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Collected architectural metrics directly support primary
                    platform requirements. Data is strictly processed to:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900">
                      <h4 className="text-xs font-bold text-zinc-200">
                        Ecosystem Routing
                      </h4>
                      <p className="text-2xs text-zinc-500 mt-1 leading-relaxed">
                        Mapping telemetry handles complex geospatial indexing to
                        alert nearest eligible users instantly.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900">
                      <h4 className="text-xs font-bold text-zinc-200">
                        Reputation Integrity
                      </h4>
                      <p className="text-2xs text-zinc-500 mt-1 leading-relaxed">
                        Reciprocal user ratings dynamically compound to separate
                        helpful entities from malicious actors transparently.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security-protocols" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <Lock className="h-5 w-5 text-indigo-500" />
                    <h3>5. Security & Trust</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    ThikAche utilizes a robust decoupled service architecture.
                    Authentication sessions are managed safely through
                    Next.js-focused structures using signed cryptographic JSON
                    Web Tokens (JWT) verified at the API boundary layers.
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Because this platform relies heavily on local mutual trust
                    rather than invasive document collection, users are
                    encouraged to monitor peer review scores before finalizing
                    execution terms.
                  </p>
                </div>
              )}

              {activeTab === "terms-of-service" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    <h3>6. Terms of Service</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    By signing up or deploying entries, you guarantee that all
                    posted descriptors represent valid requirements. Exploiting
                    platform infrastructure to transmit unrelated promotional
                    logs, or orchestrating bad-faith cancellations, will cause
                    immediate termination from the match network.
                  </p>
                </div>
              )}

              {activeTab === "about-author" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xl font-bold text-white">
                    <Scale className="h-5 w-5 text-indigo-500" />
                    <h3>7. About the Author</h3>
                  </div>

                  <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-zinc-800 shrink-0 bg-zinc-900">
                        <Image
                          src="https://abdur-rahman-dev.vercel.app/_next/image?url=%2Fabdur-rahman-about.png&w=2048&q=75"
                          alt="Abdur Rahman Adil"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          Abdur Rahman Adil
                        </h4>
                        <p className="text-xs text-indigo-400 font-medium">
                          Full-Stack Web Developer & Platform Architect
                        </p>
                        <p className="text-2xs text-zinc-500 mt-1">
                          Specializing in high-performance decoupled systems.
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Adil is a specialized software engineer focusing on
                      advanced React, Next.js, and high-performance decoupled
                      backend environments. He engineered ThikAche to solve the
                      micro-task optimization problem within tight community
                      networks.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-2xs font-mono text-zinc-500 border-t border-zinc-900/60">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-zinc-600" />
                        <span>Dhaka, Bangladesh (UTC +06:00)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-zinc-600" />
                        <a
                          href="mailto:abdurrahmanadil005@gmail.com"
                          className="hover:text-zinc-300 transition-colors"
                        >
                          abdurrahmanadil005@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
  <a 
    href="https://github.com/SyntaxAdil" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-100 hover:text-white transition-all w-10 h-10 shadow-sm"
  >
    <FaGithub className="h-4 w-4 text-zinc-200" />
  </a>
  <a 
    href="https://linkedin.com/in/devloper-abdur-rahman" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-100 hover:text-white transition-all w-10 h-10 shadow-sm"
  >
    <FaLinkedin className="h-4 w-4 text-zinc-200" />
  </a>
  <a 
    href="https://abdur-rahman-dev.vercel.app/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-2xs font-semibold text-zinc-200 hover:text-white transition-all h-10 shadow-sm"
  >
    <Globe className="h-3.5 w-3.5 text-zinc-200" />
    <span>Portfolio Website</span>
  </a>
</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
