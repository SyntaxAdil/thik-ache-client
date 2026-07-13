import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

// Base UI এর Props এর সাথে Link এর Props মার্জ করা হয়েছে টাইপ সেফটির জন্য
type PaginationLinkProps = {
  isActive?: boolean
  href: string
} & Omit<ButtonPrimitive.Props, "size" | "render"> & 
  Omit<React.ComponentProps<typeof Link>, "size">

function PaginationLink({ className, isActive, href, ...props }: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size="icon" // ডিফল্ট গোল্লা ৩ w-9 / size-10 রাখার জন্য
      className={cn(
        "h-9 w-9 rounded-full text-sm font-medium transition-all select-none",
        isActive 
          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300" 
          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
        className
      )}
      // Base UI তে asChild এর বদলে render প্রপ ব্যবহার করতে হয়
      render={<Link href={href} aria-current={isActive ? "page" : undefined} {...props} />}
    />
  )
}

function PaginationPrevious({ className, href, text = "Previous", ...props }: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-auto h-9 px-3.5 gap-1.5 rounded-xl border border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950", 
        className
      )}
      render={<Link href={href} aria-label="Go to previous page" {...props} />}
    >
      <ChevronLeftIcon className="h-4 w-4 shrink-0" />
      <span className="hidden sm:inline text-xs font-semibold">{text}</span>
    </Button>
  )
}

function PaginationNext({ className, href, text = "Next", ...props }: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-auto h-9 px-3.5 gap-1.5 rounded-xl border border-zinc-900 text-zinc-400 hover:text-zinc-200 bg-zinc-950 hover:bg-zinc-900/50", 
        className
      )}
      render={<Link href={href} aria-label="Go to next page" {...props} />}
    >
      <span className="hidden sm:inline text-xs font-semibold">{text}</span>
      <ChevronRightIcon className="h-4 w-4 shrink-0" />
    </Button>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn("flex h-9 w-9 items-center justify-center text-zinc-600", className)} {...props}>
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}