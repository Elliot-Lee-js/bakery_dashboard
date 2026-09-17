// components/app-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChartNoAxesColumn, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const stores = [
  { name: "Thornlie", url: "/dashboard/analytics/Thornlie" },
  { name: "Morley", url: "/dashboard/analytics/Morley" },
  { name: "Victoria Park", url: "/dashboard/analytics/Victoria&Park" },
  { name: "Myaree", url: "/dashboard/analytics/Myaree" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="font-semibold tracking-wide text-lg">
        <Link href="/">
          <h1>Master Chang's Bakery</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/dashboard" className="flex gap-1">
              <ChartNoAxesColumn className="size-5" /> 
              <h2 className="text-lg font-semibold">
                Analytics
              </h2>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                {stores.map((store) => (
                  <SidebarMenuItem key={store.name}>
                    <Link
                      href={store.url}
                      className="flex ml-6 p-[0.15rem] items-center gap-1 hover:bg-blue-100 rounded-md px-1"
                    >
                      <Store className="size-3" />
                      <span>{store.name}</span>
                    </Link>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t" />
        Footer
      </SidebarFooter>
    </Sidebar>
  );
}
