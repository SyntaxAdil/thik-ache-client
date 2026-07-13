import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Tag,
  User,
  Star,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCard } from "../../../../components/shared/review-card";
import { HelpRequestCard } from "../../../../components/shared/help-request-card";

interface PosterProfile {
  name: string;
  avgRatingAsRequester: number;
  completedCount: number;
  avatarUrl?: string;
}

interface HelpRequestData {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  areaLabel: string;
  location: {
    coordinates: [number, number];
  };
  budget?: number;
  isPaid: boolean;
  preferredTime: string;
  status: "OPEN" | "CLOSED" | "IN_PROGRESS";
  imageUrl?: string;
  postedBy: PosterProfile;
}

interface UserReview {
  _id: string;
  reviewer: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  rating: number;
  comment: string;
  direction: "requester_to_helper" | "helper_to_requester";
}

interface RelatedRequestCard {
  _id: string;
  title: string;
  areaLabel: string;
  budget: number;
  isPaid: boolean;
  category: string;
  status: "OPEN" | "CLOSED" | "IN_PROGRESS";
  user: {
    name: string;
    avatarUrl?: string;
    timeAgo: string;
  };
}

interface ApiResponse {
  requestData: HelpRequestData;
  reviews: UserReview[];
  relatedRequests: RelatedRequestCard[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getRequestDetails(id: string): Promise<ApiResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/requests/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error();
    }
    return await res.json();
  } catch {
    return {
      requestData: {
        _id: id,
        title: "Fixing Leaky Tap in Dhanmondi 27",
        shortDescription:
          "Need a reliable handyman to fix a persistent leak in the main kitchen mixer tap. Standard tools required.",
        fullDescription:
          "The main faucet in our kitchen has started leaking from the handle area. It&apos;s a modern ceramic disc mixer tap. I&apos;ve already tried tightening the base, but it seems like a washer replacement or internal cartridge cleaning might be necessary.\n\nRequirements:\n• Bring your own wrench and specialized plumbing tools.\n• Basic plumbing knowledge for modern mixer taps.\n• Clean and tidy work etiquette.\n\nI will provide the replacement cartridge if identified as the issue, but generic washers would be appreciated if you have them in your kit.",
        category: "repair",
        areaLabel: "Dhanmondi, Dhaka",
        location: { coordinates: [90.3746, 23.7463] },
        isPaid: true,
        budget: 800,
        preferredTime: "2026-07-22T16:30:00.000Z",
        status: "IN_PROGRESS",
        imageUrl:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
        postedBy: {
          name: "Farhan T.",
          avgRatingAsRequester: 4.8,
          completedCount: 12,
        },
      },
      reviews: [],
      relatedRequests: [
        {
          _id: "rel1",
          title: "Water Filter Installation",
          areaLabel: "Dhanmondi, Dhaka",
          budget: 500,
          isPaid: true,
          category: "repair",
          status: "OPEN",
          user: {
            name: "Tahmid Khan",
            timeAgo: "2 hours ago",
          },
        },
        {
          _id: "rel2",
          title: "Kitchen Sink Pipe Clog Removal",
          areaLabel: "Dhanmondi, Dhaka",
          budget: 650,
          isPaid: true,
          category: "repair",
          status: "OPEN",
          user: {
            name: "Asif Rahman",
            timeAgo: "5 hours ago",
          },
        },
        {
          _id: "rel3",
          title: "Bathroom Fitting Maintenance",
          areaLabel: "Dhanmondi, Dhaka",
          budget: 1200,
          isPaid: true,
          category: "repair",
          status: "IN_PROGRESS",
          user: {
            name: "Rashedul Islam",
            timeAgo: "1 day ago",
          },
        },
      ],
    };
  }
}

export default async function RequestDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getRequestDetails(id);

  if (!data || !data.requestData) {
    notFound();
  }

  const { requestData, reviews, relatedRequests } = data;

  const statusColors: Record<string, string> = {
    OPEN: "bg-zinc-900 border-zinc-850 text-zinc-300",
    IN_PROGRESS: "bg-primary/10 border-primary/20 text-primary",
    CLOSED: "bg-emerald-950/30 border-emerald-900/50 text-emerald-400",
  };

  const statusLabels: Record<string, string> = {
    OPEN: "Open",
    IN_PROGRESS: "Matched",
    CLOSED: "Completed",
  };

  const [lng, lat] = requestData.location.coordinates;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.0025}%2C${lat - 0.0025}%2C${lng + 0.0025}%2C${lat + 0.0025}&layer=mapnik`;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <main className="min-h-screen bg-background text-foreground py-12 antialiased">
      <div className="container mx-auto space-y-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[requestData.status]}`}
            >
              {statusLabels[requestData.status]}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium rounded-full bg-secondary border border-border px-2.5 py-0.5 text-muted-foreground uppercase tracking-wider">
              <Tag className="h-3 w-3 text-primary" />
              {requestData.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {requestData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />{" "}
              {requestData.areaLabel}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />{" "}
              Posted Recently
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {requestData.imageUrl && (
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-border shadow-2xl bg-card">
                <Image
                  src={requestData.imageUrl}
                  alt={requestData.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <Tabs defaultValue="overview" className="w-full">
              <TabsList
                variant="line"
                className="w-full gap-2 bg-secondary/40 border border-border p-1.5 h-14 rounded-full"
              >
                <TabsTrigger
                  value="overview"
                  className="flex-1 rounded-full text-xs font-semibold tracking-wide h-full text-muted-foreground data-active:bg-primary data-active:text-primary-foreground data-active:font-bold data-active:shadow-lg data-active:shadow-primary/30"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specification"
                  className="flex-1 rounded-full text-xs font-semibold tracking-wide h-full text-muted-foreground data-active:bg-primary data-active:text-primary-foreground data-active:font-bold data-active:shadow-lg data-active:shadow-primary/30"
                >
                  Specifications
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="overview"
                className="mt-4 p-6 rounded-xl bg-card border border-border space-y-4 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Short Description
                  </h4>
                  <p className="text-sm text-zinc-300 font-medium leading-relaxed bg-black/30 p-4 rounded-lg border border-border italic">
                    &quot;{requestData.shortDescription}&quot;
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Full Description
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-line">
                    {requestData.fullDescription}
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="specification"
                className="mt-4 p-6 rounded-xl bg-card border border-border space-y-4 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-black/20 border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Compensation Mode
                    </p>
                    <p className="text-sm font-bold text-foreground mt-1">
                      {requestData.isPaid ? "Paid Task" : "Voluntary"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-black/20 border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Task Category
                    </p>
                    <p className="text-sm font-bold text-foreground mt-1 uppercase">
                      {requestData.category}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground tracking-tight">
                Reviews & Feedback
              </h2>
              {reviews && reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <ReviewCard
                      key={rev._id}
                      rating={rev.rating}
                      comment={rev.comment}
                      direction={rev.direction}
                      reviewer={rev.reviewer}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-secondary border border-border text-muted-foreground">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">
                      No feedbacks available
                    </p>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                      Be the first to perform tasks and populate execution
                      logs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full py-3.5 px-4 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message Helper
            </button>

            <div className="rounded-xl bg-card border border-border overflow-hidden shadow-xl">
              <div className="relative w-full aspect-[16/11] bg-[#0c0c10] overflow-hidden">
                <iframe
                  title="OpenStreetMap Location Frame View"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={mapEmbedUrl}
                  className="w-full h-full border-none pointer-events-none invert-[1] hue-rotate-180 saturate-[0.2] brightness-[0.9] contrast-[0.9]"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary ring-4 ring-primary/20" />
                  </span>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-border pointer-events-none" />
              </div>
              <div className="p-3.5 bg-card border-t border-border flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Near {requestData.areaLabel}
                </span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/70 border border-border text-2xs font-bold text-foreground uppercase tracking-wider transition-colors text-xs"
                >
                  <ExternalLink size={16} />
                  Open in Maps
                </a>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border space-y-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2.5">
                Execution Constraints
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Compensation
                </span>
                <div className="text-right">
                  <p className="text-base font-bold text-foreground">
                    ৳{requestData.isPaid ? requestData.budget : 0}
                  </p>
                  <p className="text-4xs text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
                    {requestData.isPaid ? "Verified Budget" : "Voluntary"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Target Schedule
                </span>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-200">
                    {new Date(requestData.preferredTime).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </p>
                  <p className="text-4xs text-muted-foreground font-medium mt-0.5">
                    {new Date(requestData.preferredTime).toLocaleTimeString(
                      "en-US",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </p>
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-2.5">
                <p className="text-4xs font-bold uppercase tracking-widest text-muted-foreground">
                  Posted By
                </p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden relative">
                      {requestData.postedBy?.avatarUrl ? (
                        <Image
                          src={requestData.postedBy.avatarUrl}
                          alt={requestData.postedBy.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-none">
                        {requestData.postedBy?.name}
                      </p>
                      <p className="text-4xs text-muted-foreground mt-1 font-medium">
                        {requestData.postedBy?.completedCount || 0} tasks
                        declared
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>
                      {requestData.postedBy?.avgRatingAsRequester?.toFixed(
                        1
                      ) || "0.0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedRequests && relatedRequests.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-border">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Related Requests Nearby
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedRequests.map((req) => (
                <HelpRequestCard
                  key={req._id}
                  _id={req._id}
                  title={req.title}
                  location={req.areaLabel}
                  amount={req.budget}
                  status={req.status}
                  user={req.user}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}