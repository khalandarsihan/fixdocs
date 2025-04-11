import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CompanySidebar } from "@/components/company-sidebar"
import { TopNav } from "@/components/top-nav"

import "@/styles/globals.css"

export const metadata = {
  title: "Sahil Travels - Dashboard",
  description: "Company management dashboard for Sahil Travels",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="flex flex-col min-h-screen w-full">
              <TopNav />
              <div className="flex flex-1 w-full">
                <CompanySidebar />
                <main className="flex-1 bg-[rgb(242,242,242)] overflow-auto w-full">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}