"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface Alert {
  id: string
  document: string
  owner: string
  expiryDate: string
  status: "Open" | "Estimated" | "Deleted"
  type: "Business" | "Personnel"
  documentDetails: {
    type: string
    id: string
    expiresIn: number
    dateOfIssue: string
    dateOfExpiry: string
  }
  billTo?: string
  estimateId?: string
}

const alerts: Alert[] = [
  {
    id: "Alert-0000678",
    document: "Civil Defence Certificate",
    owner: "Hampton Solutions",
    expiryDate: "21-02-2025",
    status: "Open",
    type: "Business",
    documentDetails: {
      type: "Civil Defence Certificate",
      id: "CDC123456",
      expiresIn: 30,
      dateOfIssue: "21-02-2024",
      dateOfExpiry: "21-02-2025",
    },
  },
  {
    id: "Alert-0000681",
    document: "Civil Defence Certificate",
    owner: "Manaf Exports Ltd",
    expiryDate: "28-02-2025",
    status: "Estimated",
    type: "Business",
    documentDetails: {
      type: "Civil Defence Certificate",
      id: "CDC789012",
      expiresIn: 37,
      dateOfIssue: "28-02-2024",
      dateOfExpiry: "28-02-2025",
    },
    estimateId: "EST-SRV-000007",
  },
  {
    id: "Alert-0000685",
    document: "Civil Defence Certificate",
    owner: "WSM LTD",
    expiryDate: "28-02-2025",
    status: "Open",
    type: "Business",
    documentDetails: {
      type: "Civil Defence Certificate",
      id: "CDC345678",
      expiresIn: 37,
      dateOfIssue: "28-02-2024",
      dateOfExpiry: "28-02-2025",
    },
  },
  {
    id: "Alert-0000684",
    document: "Company Commercial License",
    owner: "WSM LTD",
    expiryDate: "11-04-2025",
    status: "Deleted",
    type: "Business",
    documentDetails: {
      type: "Company Commercial License",
      id: "CCL123456",
      expiresIn: 80,
      dateOfIssue: "11-04-2024",
      dateOfExpiry: "11-04-2025",
    },
  },
  {
    id: "Alert-0000664",
    document: "Driving License",
    owner: "RBuy Solutions",
    expiryDate: "27-03-2025",
    status: "Open",
    type: "Personnel",
    documentDetails: {
      type: "Driving License",
      id: "DL987654",
      expiresIn: 65,
      dateOfIssue: "27-03-2024",
      dateOfExpiry: "27-03-2025",
    },
  },
  {
    id: "Alert-0000651",
    document: "Emirates Card",
    owner: "RBuy Solutions",
    expiryDate: "12-03-2025",
    status: "Estimated",
    type: "Personnel",
    documentDetails: {
      type: "Emirates Card",
      id: "EC123456",
      expiresIn: 50,
      dateOfIssue: "12-03-2024",
      dateOfExpiry: "12-03-2025",
    },
  },
  {
    id: "Alert-0000655",
    document: "Emirates Card",
    owner: "Habeeb Umer",
    expiryDate: "21-03-2025",
    status: "Open",
    type: "Personnel",
    documentDetails: {
      type: "Emirates Card",
      id: "EC234567",
      expiresIn: 59,
      dateOfIssue: "21-03-2024",
      dateOfExpiry: "21-03-2025",
    },
  },
  {
    id: "Alert-0000659",
    document: "Emirates Card",
    owner: "Manaf Exports Ltd",
    expiryDate: "21-02-2025",
    status: "Deleted",
    type: "Personnel",
    documentDetails: {
      type: "Emirates Card",
      id: "EC345678",
      expiresIn: 31,
      dateOfIssue: "21-02-2024",
      dateOfExpiry: "21-02-2025",
    },
  },
]

export default function AlertsPage() {
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<Alert["status"]>("Open")

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAlerts(new Set())
    } else {
      setSelectedAlerts(new Set(filteredAlerts.map((alert) => alert.id)))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectAlert = (alertId: string) => {
    const newSelected = new Set(selectedAlerts)
    if (newSelected.has(alertId)) {
      newSelected.delete(alertId)
      setSelectAll(false)
    } else {
      newSelected.add(alertId)
      if (newSelected.size === filteredAlerts.length) {
        setSelectAll(true)
      }
    }
    setSelectedAlerts(newSelected)
  }

  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(new Set(value))
  }

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.status === activeTab &&
      (alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.owner.toLowerCase().includes(searchQuery.toLowerCase())),
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
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#0047AB] text-black w-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
                </div>
                <Button
                  className="bg-[#0047AB] hover:bg-[#0047AB]/90 text-white"
                  disabled={selectedAlerts.size === 0}
                  onClick={() => console.log("Creating estimate for:", Array.from(selectedAlerts))}
                >
                  Create Estimate
                </Button>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as Alert["status"])}
                className="w-full"
              >
                <TabsList className="bg-transparent w-full flex justify-start border-b text-white">
                  <TabsTrigger
                    value="Open"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Open
                  </TabsTrigger>
                  <TabsTrigger
                    value="Estimated"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Estimated
                  </TabsTrigger>
                  <TabsTrigger
                    value="Deleted"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Deleted
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="border-b">
                <div className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_0.8fr_0.8fr] gap-6 p-4 bg-[#0047AB] text-white">
                  <div className="flex items-center">
                    {activeTab === "Open" && (
                      <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} className="mr-2" />
                    )}
                    <span className="font-medium">ID</span>
                  </div>
                  <div className="font-medium">Document</div>
                  <div className="font-medium">Owner</div>
                  <div className="font-medium">Expiry date</div>
                  <div className="font-medium">Status</div>
                  <div className="font-medium">Type</div>
                </div>
              </div>
              <Accordion type="multiple" className="w-full" onValueChange={handleAccordionChange}>
                {filteredAlerts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No alerts found. Try adjusting your search or changing the status filter.
                  </div>
                ) : (
                  filteredAlerts.map((alert, index) => (
                    <AccordionItem
                      value={alert.id}
                      key={alert.id}
                      className={cn(
                        "border-b",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50",
                        expandedItems.has(alert.id) && "bg-blue-50",
                      )}
                    >
                      <AccordionTrigger className="hover:no-underline px-4 py-2">
                        <div className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_0.8fr_0.8fr] gap-6 w-full items-center">
                          <div className="flex items-center">
                            {activeTab === "Open" && (
                              <Checkbox
                                checked={selectedAlerts.has(alert.id)}
                                onCheckedChange={() => handleSelectAlert(alert.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="mr-2"
                              />
                            )}
                            <span className="text-sm truncate">{alert.id}</span>
                          </div>
                          <div className="text-sm truncate">{alert.document}</div>
                          <div className="text-sm truncate">{alert.owner}</div>
                          <div className="text-sm">{alert.expiryDate}</div>
                          <div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "bg-blue-50 text-blue-600 hover:bg-blue-50",
                                alert.status === "Estimated" && "bg-green-50 text-green-600 hover:bg-green-50",
                                alert.status === "Deleted" && "bg-red-50 text-red-600 hover:bg-red-50",
                              )}
                            >
                              {alert.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "size-2 rounded-full",
                                alert.type === "Business" ? "bg-slate-500" : "bg-purple-500",
                              )}
                            />
                            <span className="text-sm">{alert.type}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="py-2 px-3 bg-white rounded-lg shadow-sm">
                          <div className="space-y-2">
                            <div className="bg-gray-50/50 p-3 rounded-lg">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">
                                    Alert Type
                                  </label>
                                  <div className="text-sm">{alert.type}</div>
                                </div>
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">Status</label>
                                  <div className="text-sm">{alert.status}</div>
                                </div>
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">Bill To</label>
                                  <div className="text-sm">{alert.billTo || alert.owner}</div>
                                </div>
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">
                                    Document Belonging To
                                  </label>
                                  <div className="text-sm">{alert.owner}</div>
                                </div>
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">
                                    Document Type
                                  </label>
                                  <div className="text-sm">{alert.documentDetails.type}</div>
                                </div>
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">
                                    Document ID
                                  </label>
                                  <div className="text-sm">{alert.documentDetails.id}</div>
                                </div>
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">
                                    Issue Date
                                  </label>
                                  <div className="text-sm">{alert.documentDetails.dateOfIssue}</div>
                                </div>
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">
                                    Expiry Date
                                  </label>
                                  <div className="text-sm">{alert.documentDetails.dateOfExpiry}</div>
                                </div>
                                {activeTab === "Estimated" && (
                                  <div className="col-span-2">
                                    <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">
                                      Estimate
                                    </label>
                                    <div className="text-sm">
                                      <Link href="#" className="text-blue-600 hover:underline">
                                        {alert.estimateId}
                                      </Link>
                                    </div>
                                  </div>
                                )}
                                <div className="col-span-1">
                                  <label className="text-sm text-gray-500 font-semibold text-[#0047AB]">
                                    Expires In
                                  </label>
                                  <div className="text-sm">{alert.documentDetails.expiresIn} days</div>
                                </div>
                              </div>
                            </div>

                            {activeTab === "Open" && (
                              <div className="flex justify-end mt-1">
                                <Button size="sm" className="bg-[#0047AB] hover:bg-[#0047AB]/90 h-7 text-xs">
                                  Create Estimate
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                )}
              </Accordion>
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
