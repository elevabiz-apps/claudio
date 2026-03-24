"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  BarChart3,
  CalendarDays,
  Users,
  Newspaper,
  LayoutDashboard,
  GalleryHorizontal,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Instagram Manager", href: "/instagram", icon: Camera },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Content Calendar", href: "/calendar", icon: CalendarDays },
  { title: "Competitor Tracker", href: "/competitors", icon: Users },
  { title: "News Consolidator", href: "/news", icon: Newspaper },
  { title: "Carousel Designer", href: "/carousel", icon: GalleryHorizontal },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">CLAUDIO</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
