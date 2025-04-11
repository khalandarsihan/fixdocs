"use client"

import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InvoiceDetailsProps {
  params: {
    id: string
  }
}

// Mock data for different invoices
const invoiceData = {
  "ACC-SINV-2025-00011": {
    status: "Paid",
    date: "11-02-2025",
    customer: "Shabeer Ahamed",
    paymentDueDate: "11-02-2025",
    linkedEstimate: "EST-SRV-000097",
    services: [
      {
        no: 1,
        service: "Apply for VISA",
        serviceFor: "Haleema Abu",
      },
      {
        no: 2,
        service: "Renew Passport",
        serviceFor: "Shabeer Ahamed",
      },
    ],
    items: [
      {
        no: 1,
        item: "Contract Renewal Application Fee",
        service: "Apply for VISA",
        serviceFor: "Haleema Abu",
        quantity: 1,
        amount: 300.0,
      },
      {
        no: 2,
        item: "Apply for Health Insurance",
        service: "Apply for VISA",
        serviceFor: "Haleema Abu",
        quantity: 1,
        amount: 450.0,
      },
      {
        no: 3,
        item: "Work Permit Fee with Training",
        service: "Apply for VISA",
        serviceFor: "Haleema Abu",
        quantity: 1,
        amount: 3650.0,
      },
      {
        no: 4,
        item: "Renew for Emirates ID",
        service: "Apply for VISA",
        serviceFor: "Haleema Abu",
        quantity: 1,
        amount: 380.0,
      },
      {
        no: 5,
        item: "Contract Renewal Application Fee",
        service: "Renew Passport",
        serviceFor: "Shabeer Ahamed",
        quantity: 1,
        amount: 300.0,
      },
      {
        no: 6,
        item: "Apply for Health Insurance",
        service: "Renew Passport",
        serviceFor: "Shabeer Ahamed",
        quantity: 1,
        amount: 450.0,
      },
      {
        no: 7,
        item: "Work Permit Fee with Training",
        service: "Renew Passport",
        serviceFor: "Shabeer Ahamed",
        quantity: 1,
        amount: 3650.0,
      },
      {
        no: 8,
        item: "Renew for Emirates ID",
        service: "Renew Passport",
        serviceFor: "Shabeer Ahamed",
        quantity: 1,
        amount: 380.0,
      },
    ],
    totalQuantity: 8,
    totalTaxes: 0.0,
    grandTotal: 9560.0,
    roundingAdjustment: 0.0,
    amountInWords: "AED Nine Thousand, Five Hundred And Sixty only",
    totalAdvance: 0.0,
    outstandingAmount: 9560.0,
  },
}

export default function InvoiceDetailsPage({ params }: InvoiceDetailsProps) {
  const invoiceInfo = invoiceData[params.id as keyof typeof invoiceData] || {
    status: "Unpaid",
    date: "11-02-2025",
    customer: "Default Customer",
    paymentDueDate: "11-02-2025",
    linkedEstimate: "EST-SRV-000001",
    services: [],
    items: [],
    totalQuantity: 0,
    totalTaxes: 0,
    grandTotal: 0,
    roundingAdjustment: 0,
    amountInWords: "",
    totalAdvance: 0,
    outstandingAmount: 0,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-600"
      case "Unpaid":
        return "bg-blue-50 text-blue-600"
      case "Overdue":
        return "bg-red-50 text-red-600"
      case "Partly Paid":
        return "bg-yellow-50 text-yellow-600"
      case "Cancelled":
        return "bg-red-50 text-red-600"
      default:
        return "bg-gray-50 text-gray-600"
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-green-700 hover:text-green-800">
            <Link href="/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold text-green-700 flex items-center gap-3">
            {params.id}
            <Badge variant="outline" className={getStatusColor(invoiceInfo.status)}>
              {invoiceInfo.status}
            </Badge>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/works" className="text-sm font-medium text-green-700 hover:text-green-800">
            Works (2)
          </Link>
          <Link href="/payments" className="text-sm font-medium text-green-700 hover:text-green-800">
            Payments (0)
          </Link>
          <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-1">
        <Card>
          <CardContent className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <h3 className="text-base font-semibold mb-4">Basic Information</h3>
              <div className="grid gap-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <div className="text-sm">{invoiceInfo.customer}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="text-sm">{invoiceInfo.date}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Due Date</label>
                  <div className="text-sm">{invoiceInfo.paymentDueDate}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Linked Service Estimate</label>
                  <div className="text-sm">
                    <Link href={`/estimates/${invoiceInfo.linkedEstimate}`} className="text-blue-600 hover:underline">
                      {invoiceInfo.linkedEstimate}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-4">Services</h3>
              <div className="border rounded-lg">
                <div className="grid grid-cols-[48px_1fr_1fr] gap-4 p-3 bg-muted/50">
                  <div className="text-sm font-medium">No.</div>
                  <div className="text-sm font-medium">Service</div>
                  <div className="text-sm font-medium">Service For</div>
                </div>
                {[
                  { no: 1, service: "Apply for VISA", serviceFor: "Haleema Abu" },
                  { no: 2, service: "Renew Passport", serviceFor: "Shabeer Ahamed" },
                ].map((service) => (
                  <div key={service.no} className="grid grid-cols-[48px_1fr_1fr] gap-4 p-3 border-t">
                    <div className="text-sm">{service.no}</div>
                    <div className="text-sm">{service.service}</div>
                    <div className="text-sm">{service.serviceFor}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <div className="grid grid-cols-[48px_1fr_1fr_1fr_100px_120px] gap-4 p-3 bg-muted/50">
                <div className="text-sm font-medium">No.</div>
                <div className="text-sm font-medium">Item</div>
                <div className="text-sm font-medium">Service</div>
                <div className="text-sm font-medium">Service For</div>
                <div className="text-sm font-medium text-right">Quantity</div>
                <div className="text-sm font-medium text-right">Amount</div>
              </div>
              {[
                {
                  no: 1,
                  item: "Contract Renewal Application Fee",
                  service: "Apply for VISA",
                  serviceFor: "Haleema Abu",
                  quantity: 1,
                  amount: 300.0,
                },
                {
                  no: 2,
                  item: "Apply for Health Insurance",
                  service: "Apply for VISA",
                  serviceFor: "Haleema Abu",
                  quantity: 1,
                  amount: 450.0,
                },
                {
                  no: 3,
                  item: "Work Permit Fee with Training",
                  service: "Apply for VISA",
                  serviceFor: "Haleema Abu",
                  quantity: 1,
                  amount: 3850.0,
                },
                {
                  no: 4,
                  item: "Renew for Emirates ID",
                  service: "Apply for VISA",
                  serviceFor: "Haleema Abu",
                  quantity: 1,
                  amount: 380.0,
                },
                {
                  no: 5,
                  item: "Contract Renewal Application Fee",
                  service: "Renew Passport",
                  serviceFor: "Shabeer Ahamed",
                  quantity: 1,
                  amount: 300.0,
                },
                {
                  no: 6,
                  item: "Apply for Health Insurance",
                  service: "Renew Passport",
                  serviceFor: "Shabeer Ahamed",
                  quantity: 1,
                  amount: 450.0,
                },
                {
                  no: 7,
                  item: "Work Permit Fee with Training",
                  service: "Renew Passport",
                  serviceFor: "Shabeer Ahamed",
                  quantity: 1,
                  amount: 3850.0,
                },
                {
                  no: 8,
                  item: "Renew for Emirates ID",
                  service: "Renew Passport",
                  serviceFor: "Shabeer Ahamed",
                  quantity: 1,
                  amount: 380.0,
                },
              ].map((item) => (
                <div key={item.no} className="grid grid-cols-[48px_1fr_1fr_1fr_100px_120px] gap-4 p-3 border-t">
                  <div className="text-sm">{item.no}</div>
                  <div className="text-sm">{item.item}</div>
                  <div className="text-sm">{item.service}</div>
                  <div className="text-sm">{item.serviceFor}</div>
                  <div className="text-sm text-right">{item.quantity}</div>
                  <div className="text-sm text-right">{item.amount.toFixed(2)} د.إ</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Advance</label>
                  <div className="text-sm">{invoiceInfo.totalAdvance.toFixed(2)} د.إ</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Outstanding Amount</label>
                  <div className="text-sm">{invoiceInfo.outstandingAmount.toFixed(2)} د.إ</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Taxes and Charges</label>
                  <div className="text-sm">{invoiceInfo.totalTaxes.toFixed(2)} د.إ</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Total Quantity</label>
                  <div className="text-sm">{invoiceInfo.totalQuantity}</div>
                </div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Total</label>
                  <div className="text-sm">{invoiceInfo.grandTotal.toFixed(2)} د.إ</div>
                </div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Rounding Adjustment</label>
                  <div className="text-sm">{invoiceInfo.roundingAdjustment.toFixed(2)} د.إ</div>
                </div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Grand Total</label>
                  <div className="text-sm font-medium">{invoiceInfo.grandTotal.toFixed(2)} د.إ</div>
                </div>
                <div className="pt-2 border-t">
                  <label className="text-sm font-medium text-muted-foreground">In Words</label>
                  <div className="text-sm">{invoiceInfo.amountInWords}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
