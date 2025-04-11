"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { Building2, Users, Bell, FileText, Wrench, FileSpreadsheet, CreditCard, LayoutDashboard } from "lucide-react"

export function CompanySidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const routes = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
      variant: "default",
    },
    {
      title: "Companies",
      icon: <Building2 className="h-5 w-5" />,
      href: "/companies",
      variant: "ghost",
    },
    {
      title: "Individuals",
      icon: <Users className="h-5 w-5" />,
      href: "/individuals",
      variant: "ghost",
    },
    {
      title: "Alerts",
      icon: <Bell className="h-5 w-5" />,
      href: "/alerts",
      variant: "ghost",
    },
    {
      title: "Estimates",
      icon: <FileText className="h-5 w-5" />,
      href: "/estimates",
      variant: "ghost",
    },
    {
      title: "Works",
      icon: <Wrench className="h-5 w-5" />,
      href: "/works",
      variant: "ghost",
    },
    {
      title: "Invoices",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      href: "/invoices",
      variant: "ghost",
    },
    {
      title: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/payments",
      variant: "ghost",
    },
  ]

  return (
    <div
      data-collapsed={collapsed}
      className="relative group border-r bg-white pt-0 h-full flex flex-col w-[168px]" // Changed from w-[240px] to w-[168px]
      data-sidebar="root"
    >
      <div
        className="flex min-h-0 flex-col gap-2 overflow-auto flex-1 overflow-y-auto pt-2 mt-12"
        data-sidebar="content"
      >
        <nav className="grid gap-1 px-2">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-[#0047AB]", // Changed text color to blue
                pathname === route.href ? "bg-[#0047AB] text-white hover:text-white" : "hover:bg-gray-100",
              )}
            >
              {route.icon}
              <span className="text-sm font-medium">{route.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
