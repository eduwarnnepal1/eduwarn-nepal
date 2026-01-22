"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Users, FileText, Settings, BarChart } from "lucide-react"
import { useLanguage } from "@/context/language-context"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const routes = [
    {
      label: t({ en: "Dashboard", ne: "ड्यासबोर्ड" }),
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: t({ en: "Manage Courses", ne: "पाठ्यक्रमहरू व्यवस्थापन" }),
      icon: BookOpen,
      href: "/admin/courses",
      active: pathname.startsWith("/admin/courses"),
    },
    {
      label: t({ en: "Manage Users", ne: "प्रयोगकर्ताहरू व्यवस्थापन" }),
      icon: Users,
      href: "/admin/users",
      active: pathname.startsWith("/admin/users"),
    },
    {
      label: t({ en: "Resources", ne: "स्रोतहरू" }),
      icon: FileText,
      href: "/admin/resources",
      active: pathname.startsWith("/admin/resources"),
    },
    {
      label: t({ en: "Analytics", ne: "विश्लेषण" }),
      icon: BarChart,
      href: "/admin/analytics",
      active: pathname === "/admin/analytics",
    },
    {
      label: t({ en: "Settings", ne: "सेटिङहरू" }),
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <aside className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {t({ en: "Admin Panel", ne: "व्यवस्थापक प्यानल" })}
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                className={cn("w-full justify-start", route.active && "bg-muted font-medium")}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

import { Button } from "@/components/ui/button"
