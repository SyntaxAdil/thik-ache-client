import React from "react"
import { Users2, Award, CheckCircle2, ShieldAlert } from "lucide-react"

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  glowClass: string;
}

const StatCard = ({ title, value, description, icon: Icon, colorClass, glowClass }: StatCardProps) => (
  <div className="relative group p-6 rounded-2xl bg-zinc-950 border border-zinc-900 overflow-hidden transition-all duration-300 hover:border-zinc-800">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full filter blur-2xl opacity-10 transition-opacity group-hover:opacity-20 ${glowClass}`} />
    
    <div className="flex items-center justify-between w-full">
      <div className="space-y-1">
        <p className="text-2xs font-bold uppercase tracking-wider text-zinc-500">{title}</p>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-zinc-900/50 border border-zinc-850 ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="text-2xs text-zinc-500 leading-relaxed mt-4 font-medium">{description}</p>
  </div>
)

export default function CommunityStats() {
  const statistics = [
    {
      title: "Total Members",
      value: "150+",
      description: "Total number of developers registered on the platform.",
      icon: Users2,
      colorClass: "text-indigo-400",
      glowClass: "bg-indigo-500",
    },
    {
      title: "Completed Projects",
      value: "45",
      description: "Total projects successfully completed and reviewed.",
      icon: CheckCircle2,
      colorClass: "text-emerald-400",
      glowClass: "bg-emerald-500",
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "Overall peer rating calculated from all member reviews.",
      icon: Award,
      colorClass: "text-amber-400",
      glowClass: "bg-amber-500",
    },
    {
      title: "Active Tasks",
      value: "12",
      description: "Current ongoing projects and tasks in development.",
      icon: ShieldAlert,
      colorClass: "text-rose-400",
      glowClass: "bg-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statistics.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  )
}