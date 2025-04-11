"use client"

import { useState } from "react"
import { Search, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Invoice {
  id: string
  billTo: string
  grandTotal: number
  status: "Unpaid" | "Overdue" | "Partly Paid" | "Paid" | "Cancelled"
  date: string
}

const initialInvoices: Invoice[] = [
  {
    id: "ACC-SINV-2025-00011",
    billTo: "Shabeer Ahamed",
    grandTotal: 9560.0,
    status: "Paid",
    date: "15-02-2025",
  },
  {
    id: "ACC-SINV-2025-00010",
    billTo: "Habeeb Umer",
    grandTotal: 19120.0,
    status: "Overdue",
    date: "11-02-2025",
  },
  {
    id: "ACC-SINV-2025-00009",
    billTo: "Habeeb Umer",
    grandTotal: 19120.0,
    status: "Overdue",
    date: "09-02-2025",
  },
  {
    id: "ACC-SINV-2025-00008",
    billTo: "Manaf Exports Ltd",
    grandTotal: 9560.0,
    status: "Overdue",
    date: "08-02-2025",
  },
  {
    id: "ACC-SINV-2025-00007",
    billTo: "Habeeb Umer",
    grandTotal: 14340.0,
    status: "Paid",
    date: "05-02-2025",
  },
  {
    id: "ACC-SINV-2025-00006",
    billTo: "WSM LTD",
    grandTotal: 4780.0,
    status: "Overdue",
    date: "03-02-2025",
  },
  {
    id: "ACC-SINV-2025-00005",
    billTo: "WSM LTD",
    grandTotal: 4780.0,
    status: "Cancelled",
    date: "03-02-2025",
  },
  {
    id: "ACC-SINV-2025-00004",
    billTo: "RBuy Solutions",
    grandTotal: 4780.0,
    status: "Partly Paid",
    date: "01-02-2025",
  },
  {
    id: "ACC-SINV-2025-00003",
    billTo: "RBuy Solutions",
    grandTotal: 9560.0,
    status: "Overdue",
    date: "01-02-2025",
  },
  {
    id: "ACC-SINV-2025-00002",
    billTo: "RBuy Solutions",
    grandTotal: 9560.0,
    status: "Overdue",
    date: "29-01-2025",
  },
  {
    id: "ACC-SINV-2025-00001",
    billTo: "Matafi Express",
    grandTotal: 4780.0,
    status: "Overdue",
    date: "29-01-2025",
  },
  // Additional invoices for other statuses
  {
    id: "ACC-SINV-2025-00012",
    billTo: "Hampton Solutions",
    grandTotal: 6450.0,
    status: "Unpaid",
    date: "16-02-2025",
  },
  {
    id: "ACC-SINV-2025-00013",
    billTo: "Yazdee Pro Exports",
    grandTotal: 8900.0,
    status: "Unpaid",
    date: "16-02-2025",
  },
  {
    id: "ACC-SINV-2025-00014",
    billTo: "SMS Trading",
    grandTotal: 3450.0,
    status: "Partly Paid",
    date: "15-02-2025",
  },
  {
    id: "ACC-SINV-2025-00015",
    billTo: "Unzila Trading",
    grandTotal: 12800.0,
    status: "Paid",
    date: "14-02-2025",
  },
]

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<Invoice["status"]>("Unpaid")
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const router = useRouter()

  const filteredInvoices = initialInvoices.filter(
    (invoice) =>
      invoice.status === activeTab &&
      (invoice.billTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(new Set(filteredInvoices.map((invoice) => invoice.id)))
    } else {
      setSelectedInvoices(new Set())
    }
    setSelectAll(checked)
  }

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    const newSelected = new Set(selectedInvoices)
    if (checked) {
      newSelected.add(invoiceId)
    } else {
      newSelected.delete(invoiceId)
    }
    setSelectedInvoices(newSelected)
    setSelectAll(newSelected.size === filteredInvoices.length && filteredInvoices.length > 0)
  }

  const getStatusColor = (status: Invoice["status"]) => {
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
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:max-w-[400px] relative">
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#0047AB] text-black w-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
                </div>
                <Button className="bg-[#0047AB] hover:bg-[#0056D4]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Invoice
                </Button>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as Invoice["status"])}
                className="w-full"
              >
                <TabsList className="bg-transparent w-full flex justify-start border-b">
                  <TabsTrigger
                    value="Unpaid"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Unpaid
                  </TabsTrigger>
                  <TabsTrigger
                    value="Overdue"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Overdue
                  </TabsTrigger>
                  <TabsTrigger
                    value="Partly Paid"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Partly Paid
                  </TabsTrigger>
                  <TabsTrigger
                    value="Paid"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Paid
                  </TabsTrigger>
                  <TabsTrigger
                    value="Cancelled"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="border-b">
                <div className="grid grid-cols-[48px_1.5fr_1.2fr_1fr_1fr] gap-6 p-3 bg-[#0047AB] text-white">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#0047AB]"
                    />
                  </div>
                  <div className="font-medium">Bill To</div>
                  <div className="font-medium">ID</div>
                  <div className="font-medium text-right">Grand Total</div>
                  <div className="font-medium">Status</div>
                </div>
              </div>
              <div>
                {filteredInvoices.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No invoices found. Try adjusting your search or changing the status filter.
                  </div>
                ) : (
                  filteredInvoices.map((invoice, index) => (
                    <div
                      key={invoice.id}
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                      className={cn(
                        "grid grid-cols-[48px_1.5fr_1.2fr_1fr_1fr] gap-6 p-3 border-b hover:bg-muted/50 transition-colors cursor-pointer",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      )}
                    >
                      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedInvoices.has(invoice.id)}
                          onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)}
                        />
                      </div>
                      <div className="text-sm">{invoice.billTo}</div>
                      <div className="text-sm">{invoice.id}</div>
                      <div className="text-sm text-right font-medium">{invoice.grandTotal.toFixed(2)} د.إ</div>
                      <div>
                        <Badge variant="outline" className={cn(getStatusColor(invoice.status))}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="bg-white border-t py-6 px-4 sm:px-6 md:px-8 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">© {new Date().getFullYear()} FixDocs. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-[#047758]">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#047758]">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-[#047758]">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
