import type React from "react"

export default function InvoicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-[rgb(242,242,242)] overflow-auto w-full">
      <div className="p-1 w-full">{children}</div>
    </div>
  )
}
