"use client"

import { useState } from "react"
import { Search, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface Estimate {
  id: string
  status: "Open" | "Approved" | "To Work" | "To Bill" | "Complete" | "Canceled"
  date: string
  estimationTo: "Business" | "Personnel"
  businessName: string
  amount: number
}

const estimates: Estimate[] = [
  {
    id: "EST-SRV-000027",
    status: "Complete",
    date: "09-02-2025",
    estimationTo: "Business",
    businessName: "WSM LTD",
    amount: 2500,
  },
  {
    id: "EST-SRV-000007",
    status: "To Bill",
    date: "01-02-2025",
    estimationTo: "Business",
    businessName: "RBuy Solutions",
    amount: 1800,
  },
  {
    id: "EST-SRV-000020",
    status: "Complete",
    date: "01-02-2025",
    estimationTo: "Business",
    businessName: "RBuy Solutions",
    amount: 3200,
  },
  {
    id: "EST-SRV-000025",
    status: "Approved",
    date: "03-02-2025",
    estimationTo: "Business",
    businessName: "RBuy Solutions",
    amount: 1500,
  },
  {
    id: "EST-SRV-000074",
    status: "Open",
    date: "11-02-2025",
    estimationTo: "Business",
    businessName: "RBuy Solutions",
    amount: 2200,
  },
  {
    id: "EST-SRV-000001",
    status: "Complete",
    date: "29-01-2025",
    estimationTo: "Business",
    businessName: "Matafi Express",
    amount: 1750,
  },
  {
    id: "EST-SRV-000045",
    status: "Complete",
    date: "09-02-2025",
    estimationTo: "Business",
    businessName: "Manaf Exports Ltd",
    amount: 3500,
  },
  {
    id: "EST-SRV-000094",
    status: "Open",
    date: "11-02-2025",
    estimationTo: "Business",
    businessName: "Manaf Exports Ltd",
    amount: 2800,
  },
  {
    id: "EST-SRV-000026",
    status: "Approved",
    date: "08-02-2025",
    estimationTo: "Business",
    businessName: "Hampton Solutions",
    amount: 1950,
  },
  {
    id: "EST-SRV-000108",
    status: "To Bill",
    date: "15-02-2025",
    estimationTo: "Business",
    businessName: "Hampton Solutions",
    amount: 2100,
  },
  {
    id: "EST-SRV-000002",
    status: "To Work",
    date: "29-01-2025",
    estimationTo: "Personnel",
    businessName: "",
    amount: 1200,
  },
  {
    id: "EST-SRV-000032",
    status: "Complete",
    date: "09-02-2025",
    estimationTo: "Personnel",
    businessName: "",
    amount: 950,
  },
  {
    id: "EST-SRV-000054",
    status: "To Bill",
    date: "09-02-2025",
    estimationTo: "Personnel",
    businessName: "",
    amount: 1650,
  },
  {
    id: "EST-SRV-000075",
    status: "To Bill",
    date: "11-02-2025",
    estimationTo: "Personnel",
    businessName: "",
    amount: 2250,
  },
  {
    id: "EST-SRV-000095",
    status: "Open",
    date: "11-02-2025",
    estimationTo: "Personnel",
    businessName: "",
    amount: 1850,
  },
  {
    id: "EST-SRV-000096",
    status: "Open",
    date: "11-02-2025",
    estimationTo: "Business",
    businessName: "",
    amount: 2400,
  },
  {
    id: "EST-SRV-000097",
    status: "Complete",
    date: "11-02-2025",
    estimationTo: "Personnel",
    businessName: "",
    amount: 1300,
  },
]

export default function EstimatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<Estimate["status"]>("Open")

  const filteredEstimates = estimates.filter(
    (estimate) =>
      estimate.status === activeTab &&
      (estimate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        estimate.businessName.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:max-w-[400px] relative">
                  <Input
                    placeholder="Search estimates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#0047AB] text-black w-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
                </div>
                <Button className="bg-[#0047AB] hover:bg-[#0056D4] whitespace-nowrap">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Estimate
                </Button>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as Estimate["status"])}
                className="w-full"
              >
                <TabsList className="bg-transparent w-full flex justify-start border-b">
                  <TabsTrigger
                    value="Open"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Open
                  </TabsTrigger>
                  <TabsTrigger
                    value="Approved"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Approved
                  </TabsTrigger>
                  <TabsTrigger
                    value="To Work"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    To Work
                  </TabsTrigger>
                  <TabsTrigger
                    value="To Bill"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    To Bill
                  </TabsTrigger>
                  <TabsTrigger
                    value="Complete"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Complete
                  </TabsTrigger>
                  <TabsTrigger
                    value="Canceled"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Canceled
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="border-b">
                <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1.5fr_1fr] gap-6 p-3 bg-[#0047AB] text-white">
                  <div className="font-medium">ID</div>
                  <div className="font-medium">Status</div>
                  <div className="font-medium">Date</div>
                  <div className="font-medium">Estimation To</div>
                  <div className="font-medium">Business Name</div>
                  <div className="font-medium text-right">Amount</div>
                </div>
              </div>
              <div>
                {filteredEstimates.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No estimates found. Try adjusting your search or changing the status filter.
                  </div>
                ) : (
                  filteredEstimates.map((estimate, index) => (
                    <div
                      key={estimate.id}
                      onClick={() => router.push(`/estimates/${estimate.id}`)}
                      className={cn(
                        "grid grid-cols-[1.2fr_1fr_1fr_1fr_1.5fr_1fr] gap-6 p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      )}
                    >
                      <div className="text-sm">{estimate.id}</div>
                      <div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "bg-blue-50 text-blue-600 hover:bg-blue-50",
                            estimate.status === "Complete" && "bg-green-50 text-green-600 hover:bg-green-50",
                            estimate.status === "Approved" && "bg-orange-50 text-orange-600 hover:bg-orange-50",
                            estimate.status === "To Bill" && "bg-purple-50 text-purple-600 hover:bg-purple-50",
                            estimate.status === "To Work" && "bg-yellow-50 text-yellow-600 hover:bg-yellow-50",
                            estimate.status === "Canceled" && "bg-red-50 text-red-600 hover:bg-red-50",
                          )}
                        >
                          {estimate.status}
                        </Badge>
                      </div>
                      <div className="text-sm">{estimate.date}</div>
                      <div className="text-sm">{estimate.estimationTo}</div>
                      <div className="text-sm">{estimate.businessName || "-"}</div>
                      <div className="text-sm text-right font-medium">{estimate.amount.toLocaleString()} DHS</div>
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
              <Link href="/terms" className="text-sm text-gray-500 hover:text-[#0047AB]">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#0047AB]">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-[#0047AB]">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
