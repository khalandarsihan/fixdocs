import type React from "react"

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 bg-[rgb(242,242,242)] overflow-auto w-full">{children}</div>
}
