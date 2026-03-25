import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  BarChart3,
  CalendarDays,
  Users,
  Newspaper,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

const sections = [
  {
    title: "Instagram Manager",
    description: "Manage posts, stories, and engagement",
    href: "/instagram",
    icon: Camera,
  },
  {
    title: "Analytics",
    description: "Track performance metrics and insights",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Content Calendar",
    description: "Plan and schedule your content",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Competitor Tracker",
    description: "Monitor competitor activity and trends",
    href: "/competitors",
    icon: Users,
  },
  {
    title: "News Consolidator",
    description: "Aggregate and curate industry news",
    href: "/news",
    icon: Newspaper,
  },
  {
    title: "Carousel Designer",
    description: "Design multi-slide Instagram carousels with AI",
    href: "/carousel",
    icon: LayoutDashboard,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome to CLAUDIO. Select a section to get started."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="transition-colors hover:bg-accent/50 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <section.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
