"use client"

import { ArrowLeft, Briefcase, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EstimateApprovedPage() {
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
            EST-SRV-000025
            <Badge variant="outline" className="bg-orange-50 text-orange-600">
              Approved
            </Badge>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/works" className="text-sm font-medium text-green-700 hover:text-green-800">
            Works (2)
          </Link>
          <Link href="/invoices" className="text-sm font-medium text-green-700 hover:text-green-800">
            Invoices (1)
          </Link>
          <Link href="/alerts" className="text-sm font-medium text-green-700 hover:text-green-800">
            Alert (1)
          </Link>
          <div className="flex gap-3">
            <Button size="sm" className="bg-[#047758] hover:bg-[#047758]/90 h-9 px-3">
              <Briefcase className="mr-1.5 h-3.5 w-3.5" />
              Add Works
            </Button>
            <Button size="sm" className="bg-[#047758] hover:bg-[#047758]/90 h-9 px-3">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Create Invoice
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-1">
        <Card>
          <CardContent className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <h3 className="text-base font-semibold mb-4">Basic Information</h3>
              <div className="grid gap-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="text-sm">03-02-2025</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estimation To</label>
                  <div className="text-sm">Business</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <div className="text-sm">RBuy Solutions</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-4">Services</h3>
              <div className="border rounded-lg">
                <div className="grid grid-cols-[1fr_1fr] gap-4 p-3 bg-muted/50">
                  <div className="text-sm font-medium">Service</div>
                  <div className="text-sm font-medium">Service For</div>
                </div>
                <div className="grid grid-cols-[1fr_1fr] gap-4 p-3 border-t">
                  <div className="text-sm">Renew Labor Establishment Card</div>
                  <div className="text-sm">RBuy Solutions</div>
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
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_100px_120px_120px] gap-4 p-3 bg-muted/50">
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
                  serviceFor: "RBuy Solutions",
                  quantity: 1,
                  rate: "300.00",
                  amount: "300.00",
                },
                {
                  no: 2,
                  item: "Apply for Health Insurance",
                  service: "Apply for VISA",
                  serviceFor: "RBuy Solutions",
                  quantity: 1,
                  rate: "450.00",
                  amount: "450.00",
                },
                {
                  no: 3,
                  item: "Work Permit Fee with Training",
                  service: "Apply for VISA",
                  serviceFor: "RBuy Solutions",
                  quantity: 1,
                  rate: "3,650.00",
                  amount: "3,650.00",
                },
                {
                  no: 4,
                  item: "Renew for Emirates ID",
                  service: "Apply for VISA",
                  serviceFor: "RBuy Solutions",
                  quantity: 1,
                  rate: "380.00",
                  amount: "380.00",
                },
              ].map((item) => (
                <div key={item.no} className="grid grid-cols-[80px_1fr_1fr_1fr_100px_120px_120px] gap-4 p-3 border-t">
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
          <Card>
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

          <Card>
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
