"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, XCircle, Briefcase, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EstimateDetailsProps {
  params: {
    id: string
  }
}

// Mock data for different estimates
const estimateData = {
  "EST-SRV-000027": {
    status: "Complete",
    date: "09-02-2025",
    estimationTo: "Business",
    businessName: "WSM LTD",
  },
  "EST-SRV-000025": {
    status: "Approved",
    date: "03-02-2025",
    estimationTo: "Business",
    businessName: "RBuy Solutions",
  },
  "EST-SRV-000074": {
    status: "Open",
    date: "11-02-2025",
    estimationTo: "Business",
    businessName: "RBuy Solutions",
  },
  "EST-SRV-000002": {
    status: "To Work",
    date: "29-01-2025",
    estimationTo: "Personnel",
    businessName: "",
    personnelName: "Habeeb Umer",
  },
  "EST-SRV-000108": {
    status: "To Bill",
    date: "15-02-2025",
    estimationTo: "Business",
    businessName: "Hampton Solutions",
  },
}

export default function EstimateDetailsPage({ params }: EstimateDetailsProps) {
  const [estimateInfo, setEstimateInfo] = useState<any>(null)

  useEffect(() => {
    // Get estimate data based on ID
    const data = estimateData[params.id as keyof typeof estimateData] || {
      status: "Open",
      date: "11-02-2025",
      estimationTo: "Business",
      businessName: "Default Business",
    }
    setEstimateInfo(data)
  }, [params.id])

  if (!estimateInfo) return <div>Loading...</div>

  // Render action buttons based on status
  const renderActionButtons = (location = "footer") => {
    const isHeader = location === "header"
    const buttonSize = isHeader ? "sm" : "default"
    const buttonClass = isHeader ? "h-9 px-3" : ""

    switch (estimateInfo.status) {
      case "Open":
        return (
          <div className={`flex gap-3 ${!isHeader ? "mt-6" : ""}`}>
            <Button size={buttonSize} className={`bg-[#0047AB] hover:bg-[#0056D4] ${buttonClass}`}>
              <CheckCircle className={`${isHeader ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"}`} />
              Approve
            </Button>
            <Button
              size={buttonSize}
              variant="outline"
              className={`text-red-600 border-red-200 hover:bg-red-50 ${buttonClass}`}
            >
              <XCircle className={`${isHeader ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"}`} />
              Cancel
            </Button>
          </div>
        )
      case "Approved":
        return (
          <div className={`flex gap-3 ${!isHeader ? "mt-6" : ""}`}>
            <Button size="sm" className="bg-[#0047AB] hover:bg-[#0056D4] h-9 px-3">
              <Briefcase className="mr-1.5 h-3.5 w-3.5" />
              Add Works
            </Button>
            <Button size="sm" className="bg-[#0047AB] hover:bg-[#0056D4] h-9 px-3">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Create Invoice
            </Button>
          </div>
        )
      case "To Work":
        return (
          <div className={`flex gap-3 ${!isHeader ? "mt-6" : ""}`}>
            <Button size={buttonSize} className={`bg-[#047758] hover:bg-[#047758]/90 ${buttonClass}`}>
              <FileText className={`${isHeader ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"}`} />
              Create Invoice
            </Button>
          </div>
        )
      case "To Bill":
        return (
          <div className={`flex gap-3 ${!isHeader ? "mt-6" : ""}`}>
            <Button size={buttonSize} className={`bg-[#047758] hover:bg-[#047758]/90 ${buttonClass}`}>
              <Briefcase className={`${isHeader ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"}`} />
              Add Works
            </Button>
            <Button size={buttonSize} className={`bg-[#047758] hover:bg-[#047758]/90 ${buttonClass}`}>
              <FileText className={`${isHeader ? "mr-1.5 h-3.5 w-3.5" : "mr-2 h-4 w-4"}`} />
              Create Invoice
            </Button>
          </div>
        )
      case "Complete":
      default:
        return null
    }
  }

  // Get badge color based on status
  const getBadgeClass = () => {
    switch (estimateInfo.status) {
      case "Complete":
        return "bg-green-50 text-green-600"
      case "Approved":
        return "bg-orange-50 text-orange-600"
      case "To Bill":
        return "bg-purple-50 text-purple-600"
      case "To Work":
        return "bg-yellow-50 text-yellow-600"
      case "Canceled":
        return "bg-red-50 text-red-600"
      case "Open":
      default:
        return "bg-blue-50 text-blue-600"
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-green-700 hover:text-green-800">
            <Link href="/estimates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold text-green-700 flex items-center gap-3">
            {params.id}
            <Badge variant="outline" className={getBadgeClass()}>
              {estimateInfo.status}
            </Badge>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {!(estimateInfo.status === "Open" || estimateInfo.status === "Approved") && (
            <Link href="/works" className="text-sm font-medium text-green-700 hover:text-green-800">
              Works (2)
            </Link>
          )}

          {!(
            estimateInfo.status === "Open" ||
            estimateInfo.status === "Approved" ||
            estimateInfo.status === "To Work" ||
            estimateInfo.status === "To Bill"
          ) && (
            <Link href="/invoices" className="text-sm font-medium text-green-700 hover:text-green-800">
              Invoices (1)
            </Link>
          )}

          <Link href="/alerts" className="text-sm font-medium text-green-700 hover:text-green-800">
            Alert (1)
          </Link>
          {renderActionButtons("header")}
        </div>
      </div>

      <div className="grid gap-1">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Date:</span>
                <span className="text-sm ml-2">{estimateInfo.date}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Estimation To:</span>
                <span className="text-sm ml-2">{estimateInfo.estimationTo}</span>
              </div>
              {estimateInfo.estimationTo === "Business" ? (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Business Name:</span>
                  <span className="text-sm ml-2">{estimateInfo.businessName}</span>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Personnel Name:</span>
                  <span className="text-sm ml-2">{estimateInfo.personnelName || "Habeeb Umer"}</span>
                </div>
              )}
            </div>

            <div className="border rounded-lg mb-4">
              <div className="grid grid-cols-[1fr_1fr] gap-4 p-3 bg-muted/50">
                <div className="text-sm font-medium">Service</div>
                <div className="text-sm font-medium">Service For</div>
              </div>
              <div className="grid grid-cols-[1fr_1fr] gap-4 p-3 border-t">
                <div className="text-sm">Renew Labor Establishment Card</div>
                <div className="text-sm">
                  {estimateInfo.businessName || estimateInfo.personnelName || "Habeeb Umer"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_100px_120px_120px] gap-4 p-2 bg-muted/50">
                <div className="text-sm font-medium">No.</div>
                <div className="text-sm font-medium">Item</div>
                <div className="text-sm font-medium">Service</div>
                <div className="text-sm font-medium">Service For</div>
                <div className="text-sm font-medium text-right">Quantity</div>
                <div className="text-sm font-medium text-right">Rate *</div>
                <div className="text-sm font-medium text-right">Amount *</div>
              </div>
              {[
                {
                  no: 1,
                  item: "Contract Renewal Application Fee",
                  service: "Apply for VISA",
                  serviceFor: estimateInfo.businessName || estimateInfo.personnelName || "Hakeem",
                  quantity: 1,
                  rate: "300.00",
                  amount: "300.00",
                },
                {
                  no: 2,
                  item: "Apply for Health Insurance",
                  service: "Apply for VISA",
                  serviceFor: estimateInfo.businessName || estimateInfo.personnelName || "Hakeem",
                  quantity: 1,
                  rate: "450.00",
                  amount: "450.00",
                },
                {
                  no: 3,
                  item: "Work Permit Fee with Training",
                  service: "Apply for VISA",
                  serviceFor: estimateInfo.businessName || estimateInfo.personnelName || "Hakeem",
                  quantity: 1,
                  rate: "3,650.00",
                  amount: "3,650.00",
                },
                {
                  no: 4,
                  item: "Renew for Emirates ID",
                  service: "Apply for VISA",
                  serviceFor: estimateInfo.businessName || estimateInfo.personnelName || "Hakeem",
                  quantity: 1,
                  rate: "380.00",
                  amount: "380.00",
                },
              ].map((item) => (
                <div key={item.no} className="grid grid-cols-[80px_1fr_1fr_1fr_100px_120px_120px] gap-4 p-2 border-t">
                  <div className="text-sm">{item.no}</div>
                  <div className="text-sm">{item.item}</div>
                  <div className="text-sm">{item.service}</div>
                  <div className="text-sm">{item.serviceFor}</div>
                  <div className="text-sm text-right">{item.quantity}</div>
                  <div className="text-sm text-right">{item.rate} د.إ</div>
                  <div className="text-sm text-right">{item.amount} د.إ</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Due Days</label>
                  <div className="text-sm">30</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Taxes and Charges</label>
                  <div className="text-sm">0.00 د.إ</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Total Quantity</label>
                  <div className="text-sm">4</div>
                </div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Total</label>
                  <div className="text-sm">4,780.00 د.إ</div>
                </div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Grand Total</label>
                  <div className="text-sm font-medium">4,780.00 د.إ</div>
                </div>
                <div className="pt-2 border-t">
                  <label className="text-sm font-medium text-muted-foreground">In Words</label>
                  <div className="text-sm">AED 4,780.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
