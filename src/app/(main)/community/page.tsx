import React from "react"
import CommunityStats from "@/components/shared/community-stats"
import TablePagination from "@/components/shared/table-pagination"

interface MemberLog {
  id: string;
  name: string;
  role: string;
  location: string;
  completedTasks: number;
  rating: number;
  latestReview: {
    reviewer: string;
    comment: string;
  };
}

const mockCommunityData: MemberLog[] = [
  {
    id: "M-101",
    name: "Fahim Ahmed",
    role: "Tech Troubleshooting Specialist",
    location: "Mirpur 11, Dhaka",
    completedTasks: 47,
    rating: 4.95,
    latestReview: {
      reviewer: "Zayan K.",
      comment: "Quickly fixed my micro-router loop issue. Highly disciplined configuration work."
    }
  },
  {
    id: "M-102",
    name: "Tahmid Hasan",
    role: "Hardware Logistics & Assembly",
    location: "Mirpur 10, Dhaka",
    completedTasks: 32,
    rating: 4.88,
    latestReview: {
      reviewer: "Rashedul A.",
      comment: "Assisted in rapid structural arrangement. Prompt response time on map indicators."
    }
  },
  {
    id: "M-103",
    name: "Somaresh Chandra",
    role: "Academic Mentor & Tutor",
    location: "Pallabi, Dhaka",
    completedTasks: 58,
    rating: 5.00,
    latestReview: {
      reviewer: "Adil R.",
      comment: "Flawless architecture guidelines during complex operational structural analysis."
    }
  },
  {
    id: "M-104",
    name: "Asif Zaman",
    role: "Electrical Routing Expert",
    location: "Mirpur 2, Dhaka",
    completedTasks: 21,
    rating: 4.76,
    latestReview: {
      reviewer: "Imran H.",
      comment: "Restructured internal breadboard setups securely. Very neat line execution."
    }
  },
  {
    id: "M-105",
    name: "Niaz Morshed",
    role: "UI/UX Framework Consultant",
    location: "Sony Cinema Area, Dhaka",
    completedTasks: 19,
    rating: 4.90,
    latestReview: {
      reviewer: "Farhana P.",
      comment: "Helped adjust layout design variables safely inside Tailwind layers."
    }
  },
  {
    id: "M-106",
    name: "Tanvir Anjum",
    role: "Decoupled Server Auditor",
    location: "Mirpur 14, Dhaka",
    completedTasks: 14,
    rating: 4.82,
    latestReview: {
      reviewer: "Siam K.",
      comment: "Debugged signed JSON Web Token verification pipeline flawlessly."
    }
  }
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 py-16 tracking-tight">
      <div className="container mx-auto px-4 lg:px-0 space-y-12">
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-2xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Hyperlocal Network</span>
            <span className="text-2xs font-semibold text-zinc-600">Real-time Node Activity</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Community Ecosystem</h1>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Live tracking metrics of active verified operators and performance pipeline records.
            </p>
          </div>
          <hr className="border-zinc-900 w-16 border-t-2 pt-2" />
        </div>

        <section className="w-full">
          <CommunityStats />
        </section>

        <section className="space-y-4 w-full">
          <div>
            <h2 className="text-lg font-bold text-white">Active Operators Registry</h2>
            <p className="text-2xs text-zinc-500 font-medium">Historical audit tracking of verification logs and match status loops.</p>
          </div>
          {/* We only pass the data. No functions cross the network boundary. */}
          <TablePagination data={mockCommunityData} pageSize={4} />
        </section>

      </div>
    </main>
  )
}