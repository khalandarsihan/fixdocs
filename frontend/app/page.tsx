"use client"

import type React from "react"

import { useState } from "react"
import { Building2, Users, Bell, FileText, Wrench, FileSpreadsheet, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface MetricCardProps {
  title: string
  value: string
  description?: string
  icon: React.ReactNode
  onClick?: () => void
}

// Replace the MetricCard component with this improved implementation:
function MetricCard({ title, value, icon, onClick }: MetricCardProps) {
  // Determine a color based on the title
  const getCardColor = () => {
    switch (title) {
      case "Companies":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
      case "Individuals":
        return "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
      case "Vehicles":
        return "bg-cyan-50 border-cyan-200 hover:bg-cyan-100"
      case "EXPIRING DOCS":
      case "Alerts":
        return "bg-red-50 border-red-200 hover:bg-red-100"
      case "Estimates":
        return "bg-violet-50 border-violet-200 hover:bg-violet-100"
      case "Works":
        return "bg-sky-50 border-sky-200 hover:bg-sky-100"
      case "Invoices":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
      case "Payments":
        return "bg-teal-50 border-teal-200 hover:bg-teal-100"
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  // Get icon and text color based on title
  const getIconColor = () => {
    switch (title) {
      case "Companies":
        return "text-blue-600"
      case "Individuals":
        return "text-indigo-600"
      case "Vehicles":
        return "text-cyan-600"
      case "EXPIRING DOCS":
      case "Alerts":
        return "text-red-600"
      case "Estimates":
        return "text-violet-600"
      case "Works":
        return "text-sky-600"
      case "Invoices":
        return "text-blue-600"
      case "Payments":
        return "text-teal-600"
      default:
        return "text-gray-600"
    }
  }

  // Get title text color based on card type
  const getTitleColor = () => {
    switch (title) {
      case "Companies":
        return "text-blue-700"
      case "Individuals":
        return "text-indigo-700"
      case "Vehicles":
        return "text-cyan-700"
      case "EXPIRING DOCS":
      case "Alerts":
        return "text-red-700"
      case "Estimates":
        return "text-violet-700"
      case "Works":
        return "text-sky-700"
      case "Invoices":
        return "text-blue-700"
      case "Payments":
        return "text-teal-700"
      default:
        return "text-gray-700"
    }
  }

  // Get value text color based on card type
  const getValueColor = () => {
    switch (title) {
      case "Companies":
        return "text-blue-900"
      case "Individuals":
        return "text-indigo-900"
      case "Vehicles":
        return "text-cyan-900"
      case "EXPIRING DOCS":
      case "Alerts":
        return "text-red-900"
      case "Estimates":
        return "text-violet-900"
      case "Works":
        return "text-sky-900"
      case "Invoices":
        return "text-blue-900"
      case "Payments":
        return "text-teal-900"
      default:
        return "text-gray-900"
    }
  }

  return (
    <div
      className={`rounded-lg border ${getCardColor()} p-4 space-y-2 cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={onClick}
    >
      <p className={`text-sm font-semibold ${getTitleColor()}`}>{title}</p>
      <div className="flex items-center justify-between">
        <div className={`${getIconColor()}`}>{icon}</div>
        <div className={`text-2xl font-bold ${getValueColor()}`}>{value}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()

  const [data, setData] = useState({
    companies: "12",
    individuals: "45",
    alerts: "8",
    estimates: "23",
    works: "15",
  })

  const recentWorks = [
    {
      title: "Website Development",
      date: "2024-02-25",
      duration: "45 min",
    },
    {
      title: "Mobile App Design",
      date: "2024-02-24",
      duration: "60 min",
    },
    {
      title: "Database Migration",
      date: "2024-02-23",
      duration: "30 min",
    },
    {
      title: "Server Maintenance",
      date: "2024-02-22",
      duration: "50 min",
    },
  ]

  const importantAlerts = [
    {
      title: "License Expiry Alert",
      description: "Company license for 'ABC Corp' expires in 30 days",
    },
    {
      title: "Document Update Required",
      description: "Update required for immigration documents",
    },
  ]

  const chartData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    values: [80, 75, 85, 80, 75, 35, 45],
  }

  // Function to navigate to the "View all works" page
  const handleViewAllWorks = () => {
    router.push("/works")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full">
      {/* Update the icon sizes in the grid section: */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MetricCard
          title="Companies"
          value={data.companies}
          icon={<Building2 className="h-5 w-5" />}
          onClick={() => router.push("/companies")}
        />
        <MetricCard
          title="Individuals"
          value={data.individuals}
          icon={<Users className="h-5 w-5" />}
          onClick={() => router.push("/individuals")}
        />
        <MetricCard
          title="Alerts"
          value={data.alerts}
          icon={<Bell className="h-5 w-5" />}
          onClick={() => router.push("/alerts")}
        />
        <MetricCard
          title="Estimates"
          value={data.estimates}
          icon={<FileText className="h-5 w-5" />}
          onClick={() => router.push("/estimates")}
        />
        <MetricCard
          title="Works"
          value={data.works}
          icon={<Wrench className="h-5 w-5" />}
          onClick={() => router.push("/works")}
        />
        <MetricCard
          title="Invoices"
          value="16"
          icon={<FileSpreadsheet className="h-5 w-5" />}
          onClick={() => router.push("/invoices")}
        />
        <MetricCard
          title="Payments"
          value="20"
          icon={<CreditCard className="h-5 w-5" />}
          onClick={() => router.push("/payments")}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Work Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Weekly Work Progress</div>
                  <div className="h-[200px] w-full">
                    {chartData.labels.map((label, index) => (
                      <div key={label} className="flex items-center space-x-2 mb-2">
                        <div className="text-xs text-muted-foreground w-20">{label}</div>
                        <div className="flex-1 h-4 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${chartData.values[index]}%` }} />
                        </div>
                        <div className="text-xs text-muted-foreground w-10">{chartData.values[index]}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorks.map((work) => (
                <div
                  key={work.title}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                  onClick={() => router.push("/works")}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{work.title}</p>
                    <p className="text-sm text-muted-foreground">{work.date}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{work.duration}</div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={handleViewAllWorks}>
                View all works
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-7">
          <CardHeader>
            <CardTitle>Important Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {importantAlerts.map((alert) => (
                <div
                  key={alert.title}
                  className="flex items-start space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                  onClick={() => router.push("/alerts")}
                >
                  <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
