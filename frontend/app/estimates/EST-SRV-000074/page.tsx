"use client"

import { ArrowLeft, ArrowRight, MoreHorizontal, Pencil, Printer } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface EstimateDetailsProps {
  params: {
    id: string
  }
}

export default function EstimateDetailsPage({ params }: EstimateDetailsProps) {
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
            EST-SRV-000074
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              Open
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800">
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800">
              <Pencil className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Delete</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <div className="text-sm">11-02-2025</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estimation To</label>
                  <div className="text-sm">Personnel</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Personnel Name</label>
                  <div className="text-sm">Habeeb Umer</div>
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
                  <div className="text-sm">Apply for VISA</div>
                  <div className="text-sm">Hakeem</div>
                </div>
                <div className="grid grid-cols-[1fr_1fr] gap-4 p-3 border-t">
                  <div className="text-sm">Renew Health Insurance</div>
                  <div className="text-sm">Habeeb Umer</div>
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
                  serviceFor: "Hakeem",
                  quantity: 1,
                  rate: "300.00",
                  amount: "300.00",
                },
                {
                  no: 2,
                  item: "Apply for Health Insurance",
                  service: "Apply for VISA",
                  serviceFor: "Hakeem",
                  quantity: 1,
                  rate: "450.00",
                  amount: "450.00",
                },
                {
                  no: 3,
                  item: "Work Permit Fee with Training",
                  service: "Apply for VISA",
                  serviceFor: "Hakeem",
                  quantity: 1,
                  rate: "3,650.00",
                  amount: "3,650.00",
                },
                {
                  no: 4,
                  item: "Renew for Emirates ID",
                  service: "Apply for VISA",
                  serviceFor: "Hakeem",
                  quantity: 1,
                  rate: "380.00",
                  amount: "380.00",
                },
                {
                  no: 5,
                  item: "Contract Renewal Application Fee",
                  service: "Renew Health Insurance",
                  serviceFor: "Habeeb Umer",
                  quantity: 1,
                  rate: "300.00",
                  amount: "300.00",
                },
                {
                  no: 6,
                  item: "Apply for Health Insurance",
                  service: "Renew Health Insurance",
                  serviceFor: "Habeeb Umer",
                  quantity: 1,
                  rate: "450.00",
                  amount: "450.00",
                },
                {
                  no: 7,
                  item: "Work Permit Fee with Training",
                  service: "Renew Health Insurance",
                  serviceFor: "Habeeb Umer",
                  quantity: 1,
                  rate: "3,650.00",
                  amount: "3,650.00",
                },
                {
                  no: 8,
                  item: "Renew for Emirates ID",
                  service: "Renew Health Insurance",
                  serviceFor: "Habeeb Umer",
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
                  <div className="text-sm">8.00</div>
                </div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Total</label>
                  <div className="text-sm">9,560.00 د.إ</div>
                </div>
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Grand Total</label>
                  <div className="text-sm font-medium">9,560.00 د.إ</div>
                </div>
                <div className="pt-2 border-t">
                  <label className="text-sm font-medium text-muted-foreground">In Words</label>
                  <div className="text-sm">AED 9,560.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
