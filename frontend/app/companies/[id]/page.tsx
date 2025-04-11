"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  CalendarDays,
  FileText,
  Package2,
  Receipt,
  Users,
  Wrench,
  Edit,
  Save,
  ArrowLeft,
  LayoutDashboard,
  Car,
  Users2,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import LegalDocumentsPage from "@/app/legal-documents/page"
import StaffPage from "@/app/companies/[id]/staff/page"
import VehiclesPage from "@/app/vehicles/page"
import PartnersContactsPage from "@/app/partners-contacts/page"
import BankAccountsPage from "@/app/bank-accounts/page"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface MetricCardProps {
  title: string
  value: number
  icon: React.ReactNode
  onClick: () => void
}

interface CompanyDetails {
  companyLocation: string
  issuingAuthority: string
  companyEmirates: string
  businessActivities: string
  companyLegalType: string
  isActive: boolean
}

const navItems = [
  { id: "overview", title: "Overview" },
  { id: "legal-documents", title: "Legal Documents" },
  { id: "staff", title: "Staff" },
  { id: "vehicles", title: "Vehicles" },
  { id: "partners-contacts", title: "Partners & Contacts" },
  { id: "bank-accounts", title: "Bank Accounts & Credentials" },
]

function MetricCard({ title, value, icon, onClick }: MetricCardProps) {
  return (
    <div
      className="rounded-lg border bg-card p-2 space-y-1 cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <div className="flex items-center justify-between">
        {icon}
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  )
}

function ExpiryCard({ title, date }: { title: string; date: string }) {
  const expiryDate = new Date(date)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  let statusColor = "text-green-500"
  if (daysUntilExpiry <= 30) {
    statusColor = "text-red-500"
  } else if (daysUntilExpiry <= 90) {
    statusColor = "text-yellow-500"
  }

  return (
    <div className="rounded-lg border bg-card p-2 space-y-1">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className={`text-sm font-semibold ${statusColor}`}>
            {new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
        <CalendarDays className="h-3 w-3 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground">{daysUntilExpiry} days remaining</p>
    </div>
  )
}

export default function CompanyDashboardPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyLocation: "Dera",
    issuingAuthority: "Dubai DED",
    companyEmirates: "Dubai",
    businessActivities: "Digital Ad company",
    companyLegalType: "LLC",
    isActive: true,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStaff, setSelectedStaff] = useState<any>(null)

  const closeSlideBar = () => {
    setSelectedStaff(null)
  }

  const handleInputChange = (field: keyof CompanyDetails, value: string | boolean) => {
    setCompanyDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "legal-documents":
        return (
          <div className="my-1">
            <LegalDocumentsPage />
          </div>
        )
      case "staff":
        return <StaffPage params={params} />
      case "vehicles":
        return <VehiclesPage />
      case "partners-contacts":
        return <PartnersContactsPage />
      case "bank-accounts":
        return <BankAccountsPage />
      case "overview":
        return (
          <Card className="bg-white p-6 rounded-lg shadow-lg">
            <div className="space-y-6">
              <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base font-medium text-[#0047AB]">Summary</CardTitle>
                </CardHeader>
                <CardContent className="py-4 px-4 pb-6">
                  <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-8">
                    <MetricCard
                      title="STAFF"
                      value={9}
                      icon={<Users className="h-4 w-4 text-blue-500" />}
                      onClick={() => setActiveSection("staff")}
                    />
                    <MetricCard
                      title="VEHICLES"
                      value={23}
                      icon={<Package2 className="h-4 w-4 text-green-500" />}
                      onClick={() => setActiveSection("vehicles")}
                    />
                    <MetricCard
                      title="EXPIRING DOCS"
                      value={16}
                      icon={<FileText className="h-4 w-4 text-yellow-500" />}
                      onClick={() => setActiveSection("legal-documents")}
                    />
                    <MetricCard
                      title="ESTIMATES"
                      value={0}
                      icon={<Receipt className="h-4 w-4 text-purple-500" />}
                      onClick={() => console.log("Estimates clicked")}
                    />
                    <MetricCard
                      title="ALERTS"
                      value={9}
                      icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                      onClick={() => console.log("Alerts clicked")}
                    />
                    <MetricCard
                      title="WORKS"
                      value={3}
                      icon={<Wrench className="h-4 w-4 text-indigo-500" />}
                      onClick={() => console.log("Works clicked")}
                    />
                    <MetricCard
                      title="INVOICES"
                      value={2}
                      icon={<Receipt className="h-4 w-4 text-orange-500" />}
                      onClick={() => console.log("Invoices clicked")}
                    />
                    <MetricCard
                      title="PAYMENTS"
                      value={1}
                      icon={<Receipt className="h-4 w-4 text-teal-500" />}
                      onClick={() => console.log("Payments clicked")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="py-3 px-4 ">
                  <CardTitle className="text-base font-medium text-[#0047AB]">Important Dates</CardTitle>
                </CardHeader>
                <CardContent className="py-4 px-4 pb-6">
                  <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
                    <ExpiryCard title="License Expiry" date="2025-04-11" />
                    <ExpiryCard title="Matafi Expiry" date="2025-02-28" />
                    <ExpiryCard title="Labor Expiry" date="2025-02-28" />
                    <ExpiryCard title="Immigration Expiry" date="2025-03-21" />
                    <ExpiryCard title="E Channel Expiry" date="2025-02-28" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between border-b p-4 ">
                  <h3 className="text-lg font-medium text-[#0047AB]">Company Details</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    className="h-8 w-8"
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
                <CardContent className="py-4 px-4 pb-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="companyLocation" className="text-xs">
                        Company Location
                      </Label>
                      {isEditing ? (
                        <Input
                          id="companyLocation"
                          value={companyDetails.companyLocation}
                          onChange={(e) => handleInputChange("companyLocation", e.target.value)}
                          className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium mt-1">{companyDetails.companyLocation}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuingAuthority" className="text-xs">
                        Issuing Authority
                      </Label>
                      {isEditing ? (
                        <Input
                          id="issuingAuthority"
                          value={companyDetails.issuingAuthority}
                          onChange={(e) => handleInputChange("issuingAuthority", e.target.value)}
                          className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium mt-1">{companyDetails.issuingAuthority}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmirates" className="text-xs">
                        Company Emirates
                      </Label>
                      {isEditing ? (
                        <Input
                          id="companyEmirates"
                          value={companyDetails.companyEmirates}
                          onChange={(e) => handleInputChange("companyEmirates", e.target.value)}
                          className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium mt-1">{companyDetails.companyEmirates}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessActivities" className="text-xs">
                        Business Activities
                      </Label>
                      {isEditing ? (
                        <Input
                          id="businessActivities"
                          value={companyDetails.businessActivities}
                          onChange={(e) => handleInputChange("businessActivities", e.target.value)}
                          className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium mt-1">{companyDetails.businessActivities}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyLegalType" className="text-xs">
                        Company Legal Type
                      </Label>
                      {isEditing ? (
                        <Input
                          id="companyLegalType"
                          value={companyDetails.companyLegalType}
                          onChange={(e) => handleInputChange("companyLegalType", e.target.value)}
                          className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium mt-1">{companyDetails.companyLegalType}</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="active"
                        checked={companyDetails.isActive}
                        onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                        disabled={!isEditing}
                        className="border-green-500 text-green-500"
                      />
                      <Label htmlFor="active" className="text-xs">
                        Active
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Card>
        )
      default:
        return <div>Content for {activeSection} goes here</div>
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="flex h-14 items-center px-4 container">
          <div className="flex items-center gap-4">
            <Link href="/companies" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              <ArrowLeft className="mr-1 h-4 w-4" />
            </Link>
            <h3 className="text-lg font-medium text-[#0047AB]">Sahil Travels</h3>
          </div>
          <div className="hidden md:flex items-center ml-8 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "text-sm whitespace-nowrap font-medium transition-colors hover:text-primary px-4 py-2 flex items-center gap-2",
                  activeSection === item.id ? "text-[#0047AB] border-b-2 border-[#0047AB]" : "text-gray-600",
                )}
              >
                {item.id === "overview" && <LayoutDashboard className="h-4 w-4" />}
                {item.id === "legal-documents" && <FileText className="h-4 w-4" />}
                {item.id === "staff" && <Users className="h-4 w-4" />}
                {item.id === "vehicles" && <Car className="h-4 w-4" />}
                {item.id === "partners-contacts" && <Users2 className="h-4 w-4" />}
                {item.id === "bank-accounts" && <Building2 className="h-4 w-4" />}
                {item.title}
              </button>
            ))}
          </div>
          <div className="md:hidden flex-1 overflow-x-auto">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full border-0 bg-transparent text-sm font-medium focus:ring-0"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 h-full">{renderContent()}</div>
      </main>

      {/* Modify all Sheet components to include mt-14 class */}
      <Sheet open={!!selectedStaff} onOpenChange={closeSlideBar}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          {/* Sheet content remains the same */}
        </SheetContent>
      </Sheet>
    </div>
  )
}
