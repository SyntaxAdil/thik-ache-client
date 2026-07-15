import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { headers } from "next/headers";
import {
  Calendar,
  MapPin,
  Tag,
  User,
  Star,
  MessageSquare,
  ExternalLink,
  Phone,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCard } from "../../../../components/shared/review-card";
import { HelpApproachButton } from "../../../../components/shared/help-approach-button";
import { HelpRequestCard } from "../../../../components/shared/help-request-card";
import { auth } from "@/lib/auth/auth";
import { helpRequestService } from "../../../../services/help-request.service";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await helpRequestService.getHelpRequestById(id);
    const data = response && typeof response === "object" && "data" in response 
      ? (response as { data: { title?: string; shortDescription?: string; imageUrl?: string } }).data 
      : response as { title?: string; shortDescription?: string; imageUrl?: string };

    const title = data?.title || "Request Details";
    const description = data?.shortDescription || "View details of a hyperlocal help request on ThikAche.";
    const image = data?.imageUrl || "/og-image.png";

    return {
      title: `${title} | ThikAche`,
      description: description,
      openGraph: {
        title: `${title} | ThikAche`,
        description: description,
        images: [{ url: image, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ThikAche`,
        description: description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: "Request Details | ThikAche",
      description: "View details of a hyperlocal help request on ThikAche.",
    };
  }
}

interface PosterProfile {
  _id: string;
  name: string;
  avgRating?: number;
  completedCount?: number;
  avatarUrl?: string;
  phoneNumber?: string;
}

interface HelpRequestLocation {
  type?: string;
  coordinates?: [number, number];
  areaLabel: string;
}

interface HelpRequestData {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  location: HelpRequestLocation;
  budget?: number;
  areaLabel?: string;
  isPaid: boolean;
  preferredTime?: string;
  createdAt?: string;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  imageUrl?: string;
  postedBy: PosterProfile | string;
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

interface RawReview {
  _id: string;
  request: string;
  reviewer: string | { name: string; avatarUrl?: string; role?: string };
  reviewee: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RelatedRequestCard {
  _id: string;
  title: string;
  areaLabel: string;
  budget: number;
  isPaid: boolean;
  category: string;
  status: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  user: {
    _id: string;
    name: string;
    avatarUrl?: string;
    timeAgo: string;
  };
}

interface RelatedBackendItem {
  _id: string;
  title?: string;
  location?: {
    coordinates?: [number, number];
  };
  areaLabel?: string;
  budget?: number;
  isPaid?: boolean;
  category?: string;
  status?: "open" | "matched" | "in_progress" | "completed" | "cancelled";
  postedBy?: {
    _id?: string;
    name?: string;
    avatarUrl?: string;
  };
  user?: {
    _id?: string;
    name?: string;
    avatarUrl?: string;
  };
  timeAgo?: string;
}

export default async function RequestDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const sessionHeaders = await headers();
  const session = await auth.api.getSession({ headers: sessionHeaders });
  const currentUserId = session?.user?.id ?? "";

  let requestData: HelpRequestData | null = null;
  let reviews: UserReview[] = [];
  let relatedRequests: RelatedRequestCard[] = [];

  try {
    const [detailsResponse, relatedResponse] = await Promise.all([
      helpRequestService.getHelpRequestById(id) as unknown as Promise<
        Record<string, unknown>
      >,
      helpRequestService.getRelatedHelpRequests(id) as unknown as Promise<
        RelatedBackendItem[]
      >,
    ]);

    if (detailsResponse) {
      if (
        "data" in detailsResponse &&
        detailsResponse.data &&
        typeof detailsResponse.data === "object"
      ) {
        const nestedData = detailsResponse.data as Record<string, unknown>;
        requestData = nestedData as unknown as HelpRequestData;

        const rawReviews = (nestedData.reviews as RawReview[]) || [];
        reviews = rawReviews.map((rev) => {
          const reviewerName =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.name || "Unknown User"
              : "Unknown User";

          const reviewerAvatar =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.avatarUrl
              : undefined;

          const reviewerRole =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.role || "User"
              : "User";

          return {
            _id: rev._id,
            reviewer: {
              name: reviewerName,
              role: reviewerRole,
              avatarUrl: reviewerAvatar,
            },
            rating: rev.rating,
            comment: rev.comment,
            direction: "helper_to_requester" as const,
          };
        });
      } else if (
        "requestData" in detailsResponse &&
        detailsResponse.requestData &&
        typeof detailsResponse.requestData === "object"
      ) {
        requestData = detailsResponse.requestData as unknown as HelpRequestData;
        const rawReviews = (detailsResponse.reviews as RawReview[]) || [];
        reviews = rawReviews.map((rev) => {
          const reviewerName =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.name || "Unknown User"
              : "Unknown User";

          const reviewerAvatar =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.avatarUrl
              : undefined;

          const reviewerRole =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.role || "User"
              : "User";

          return {
            _id: rev._id,
            reviewer: {
              name: reviewerName,
              role: reviewerRole,
              avatarUrl: reviewerAvatar,
            },
            rating: rev.rating,
            comment: rev.comment,
            direction: "helper_to_requester" as const,
          };
        });
      } else {
        requestData = detailsResponse as unknown as HelpRequestData;
        const rawReviews = (detailsResponse.reviews as RawReview[]) || [];
        reviews = rawReviews.map((rev) => {
          const reviewerName =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.name || "Unknown User"
              : "Unknown User";

          const reviewerAvatar =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.avatarUrl
              : undefined;

          const reviewerRole =
            typeof rev.reviewer === "object" && rev.reviewer !== null
              ? rev.reviewer.role || "User"
              : "User";

          return {
            _id: rev._id,
            reviewer: {
              name: reviewerName,
              role: reviewerRole,
              avatarUrl: reviewerAvatar,
            },
            rating: rev.rating,
            comment: rev.comment,
            direction: "helper_to_requester" as const,
          };
        });
      }
    }

    if (Array.isArray(relatedResponse)) {
      relatedRequests = relatedResponse.map((req) => ({
        _id: req._id,
        title: req.title || "",
        areaLabel: req.areaLabel || "Unknown Location",
        budget: req.budget || 0,
        isPaid: req.isPaid || false,
        category: req.category || "",
        status: req.status || "open",
        user: {
          _id: req.postedBy?._id || req.user?._id || "",
          name: req.postedBy?.name || req.user?.name || "Unknown",
          avatarUrl: req.postedBy?.avatarUrl || req.user?.avatarUrl,
          timeAgo: req.timeAgo || "Recently",
        },
      }));
    }
  } catch (error) {
    console.error("Error loading request details:", error);
    notFound();
  }

  if (!requestData) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    open: "bg-zinc-900 border-zinc-850 text-zinc-300",
    matched: "bg-primary/10 border-primary/20 text-primary",
    in_progress: "bg-primary/10 border-primary/20 text-primary",
    completed: "bg-emerald-950/30 border-emerald-900/50 text-emerald-400",
    cancelled: "bg-rose-950/30 border-rose-900/50 text-rose-400",
  };

  const statusLabels: Record<string, string> = {
    open: "Open",
    matched: "Matched",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const resolvedAreaLabel = requestData?.areaLabel || "Unknown Location";

  const coordinates = requestData.location?.coordinates || [90.3891, 23.8225];
  const [lng, lat] =
    coordinates && coordinates.length === 2 ? coordinates : [90.3891, 23.8225];

  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.0025}%2C${lat - 0.0025}%2C${lng + 0.0025}%2C${lat + 0.0025}&layer=mapnik`;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const hasPosterProfile =
    typeof requestData.postedBy === "object" && requestData.postedBy !== null;
  const posterProfile = hasPosterProfile
    ? (requestData.postedBy as PosterProfile)
    : null;
  const posterId = posterProfile
    ? posterProfile._id
    : (requestData.postedBy as string);

  return (
    <main className="min-h-screen bg-background text-foreground py-12 antialiased">
      <div className="container mx-auto space-y-8 px-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[requestData.status] || "bg-zinc-900 border-zinc-850 text-zinc-300"}`}
            >
              {statusLabels[requestData.status] || "Open"}
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
              {resolvedAreaLabel}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />{" "}
              {requestData.createdAt
                ? new Date(requestData.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recently"}
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
                      Be the first to perform tasks and populate execution logs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <HelpApproachButton
              requestId={requestData._id}
              posterId={posterId || ""}
              currentUserId={currentUserId}
              status={requestData.status}
            />

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
                <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Near {resolvedAreaLabel}
                </span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/70 border border-border text-xs font-bold text-foreground uppercase tracking-wider transition-colors"
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
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
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
                    {requestData.preferredTime
                      ? new Date(requestData.preferredTime).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )
                      : "Flexible"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                    {requestData.preferredTime
                      ? new Date(requestData.preferredTime).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" },
                        )
                      : ""}
                  </p>
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Posted By
                </p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden relative">
                      {posterProfile?.avatarUrl ? (
                        <Image
                          src={posterProfile.avatarUrl}
                          alt={posterProfile.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-none">
                        {posterProfile?.name || "Unknown Requester"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                        {posterProfile?.completedCount || 0} tasks declared
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{posterProfile?.avgRating?.toFixed(1) || "0.0"}</span>
                  </div>
                </div>

                {posterProfile?.phoneNumber && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs text-zinc-400">
                        Contact Requester
                      </span>
                    </div>
                    <a
                      href={`tel:${posterProfile.phoneNumber}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors"
                    >
                      {posterProfile.phoneNumber}
                    </a>
                  </div>
                )}
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
                  isPaid={req.isPaid}
                  status={req.status}
                  user={{
                    ...req.user,
                    _id: req.user._id,
                  }}
                  related={true}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}