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

interface Work {
  id: string
  serviceId: string
  serviceName: string
  status: "Open" | "In Progress" | "Complete"
  createDate: string
  estimateId: string
  personnelName: string
  businessName: string
  progress: number
}

const works: Work[] = [
  // Open Works
  {
    id: "WO-0000000022",
    serviceId: "SRV-001",
    serviceName: "Apply for Passport",
    status: "Open",
    createDate: "29-01-2025",
    estimateId: "EST-SRV-000108",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 0,
  },
  {
    id: "WO-0000000023",
    serviceId: "SRV-002",
    serviceName: "Renew Emirates ID",
    status: "Open",
    createDate: "01-02-2025",
    estimateId: "EST-SRV-000109",
    personnelName: "RBuy Solutions",
    businessName: "RBuy Solutions",
    progress: 0,
  },
  // In Progress Works
  {
    id: "WO-0000000024",
    serviceId: "SRV-003",
    serviceName: "Renew Driving Licence",
    status: "In Progress",
    createDate: "09-02-2025",
    estimateId: "EST-SRV-000054",
    personnelName: "Manaf Exports",
    businessName: "Manaf Exports Ltd",
    progress: 65,
  },
  {
    id: "WO-0000000025",
    serviceId: "SRV-004",
    serviceName: "Renew Mulkiya",
    status: "In Progress",
    createDate: "11-02-2025",
    estimateId: "EST-SRV-000075",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 45,
  },
  // Complete Works
  {
    id: "WO-0000000026",
    serviceId: "SRV-005",
    serviceName: "Apply for VISA",
    status: "Complete",
    createDate: "15-02-2025",
    estimateId: "EST-SRV-000097",
    personnelName: "Shabeer Ahamed",
    businessName: "WSM LTD",
    progress: 100,
  },
  {
    id: "WO-0000000027",
    serviceId: "SRV-006",
    serviceName: "Renew Health Insurance",
    status: "Complete",
    createDate: "09-02-2025",
    estimateId: "EST-SRV-000045",
    personnelName: "Manaf Exports",
    businessName: "Manaf Exports Ltd",
    progress: 100,
  },
  // Add more sample data for each status...
  // Additional Open Works
  {
    id: "WO-0000000028",
    serviceId: "SRV-007",
    serviceName: "Apply for Trade License",
    status: "Open",
    createDate: "12-02-2025",
    estimateId: "EST-SRV-000110",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 0,
  },
  // Additional In Progress Works
  {
    id: "WO-0000000029",
    serviceId: "SRV-008",
    serviceName: "Vehicle Registration",
    status: "In Progress",
    createDate: "14-02-2025",
    estimateId: "EST-SRV-000111",
    personnelName: "RBuy Solutions",
    businessName: "RBuy Solutions",
    progress: 75,
  },
  // Additional Complete Works
  {
    id: "WO-0000000030",
    serviceId: "SRV-009",
    serviceName: "Business Setup",
    status: "Complete",
    createDate: "16-02-2025",
    estimateId: "EST-SRV-000112",
    personnelName: "WSM LTD",
    businessName: "WSM LTD",
    progress: 100,
  },
  // Additional Open Works
  {
    id: "WO-0000000031",
    serviceId: "SRV-010",
    serviceName: "Apply for Business Visa",
    status: "Open",
    createDate: "18-02-2025",
    estimateId: "EST-SRV-000113",
    personnelName: "Matafi Express",
    businessName: "Matafi Express",
    progress: 0,
  },
  {
    id: "WO-0000000032",
    serviceId: "SRV-011",
    serviceName: "Renew Commercial License",
    status: "Open",
    createDate: "19-02-2025",
    estimateId: "EST-SRV-000114",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 0,
  },
  {
    id: "WO-0000000033",
    serviceId: "SRV-012",
    serviceName: "Apply for Work Permit",
    status: "Open",
    createDate: "20-02-2025",
    estimateId: "EST-SRV-000115",
    personnelName: "RBuy Solutions",
    businessName: "RBuy Solutions",
    progress: 0,
  },
  {
    id: "WO-0000000034",
    serviceId: "SRV-013",
    serviceName: "Renew Residence Visa",
    status: "Open",
    createDate: "21-02-2025",
    estimateId: "EST-SRV-000116",
    personnelName: "WSM LTD",
    businessName: "WSM LTD",
    progress: 0,
  },
  {
    id: "WO-0000000035",
    serviceId: "SRV-014",
    serviceName: "Apply for Import License",
    status: "Open",
    createDate: "22-02-2025",
    estimateId: "EST-SRV-000117",
    personnelName: "Manaf Exports Ltd",
    businessName: "Manaf Exports Ltd",
    progress: 0,
  },
  {
    id: "WO-0000000036",
    serviceId: "SRV-015",
    serviceName: "Renew Export License",
    status: "Open",
    createDate: "23-02-2025",
    estimateId: "EST-SRV-000118",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 0,
  },
  {
    id: "WO-0000000037",
    serviceId: "SRV-016",
    serviceName: "Apply for Trade Mark",
    status: "Open",
    createDate: "24-02-2025",
    estimateId: "EST-SRV-000119",
    personnelName: "RBuy Solutions",
    businessName: "RBuy Solutions",
    progress: 0,
  },
  {
    id: "WO-0000000038",
    serviceId: "SRV-017",
    serviceName: "Renew Business Registration",
    status: "Open",
    createDate: "25-02-2025",
    estimateId: "EST-SRV-000120",
    personnelName: "Matafi Express",
    businessName: "Matafi Express",
    progress: 0,
  },
  {
    id: "WO-0000000039",
    serviceId: "SRV-018",
    serviceName: "Apply for Tax Registration",
    status: "Open",
    createDate: "26-02-2025",
    estimateId: "EST-SRV-000121",
    personnelName: "WSM LTD",
    businessName: "WSM LTD",
    progress: 0,
  },
  {
    id: "WO-0000000040",
    serviceId: "SRV-019",
    serviceName: "Renew Company Registration",
    status: "Open",
    createDate: "27-02-2025",
    estimateId: "EST-SRV-000122",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 0,
  },

  // Additional In Progress Works
  {
    id: "WO-0000000041",
    serviceId: "SRV-020",
    serviceName: "Apply for Residence Visa",
    status: "In Progress",
    createDate: "18-02-2025",
    estimateId: "EST-SRV-000123",
    personnelName: "Manaf Exports Ltd",
    businessName: "Manaf Exports Ltd",
    progress: 30,
  },
  {
    id: "WO-0000000042",
    serviceId: "SRV-021",
    serviceName: "Renew Business License",
    status: "In Progress",
    createDate: "19-02-2025",
    estimateId: "EST-SRV-000124",
    personnelName: "RBuy Solutions",
    businessName: "RBuy Solutions",
    progress: 45,
  },
  {
    id: "WO-0000000043",
    serviceId: "SRV-022",
    serviceName: "Apply for Import Permit",
    status: "In Progress",
    createDate: "20-02-2025",
    estimateId: "EST-SRV-000125",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 60,
  },
  {
    id: "WO-0000000044",
    serviceId: "SRV-023",
    serviceName: "Renew Export Permit",
    status: "In Progress",
    createDate: "21-02-2025",
    estimateId: "EST-SRV-000126",
    personnelName: "WSM LTD",
    businessName: "WSM LTD",
    progress: 75,
  },
  {
    id: "WO-0000000045",
    serviceId: "SRV-024",
    serviceName: "Apply for Work Visa",
    status: "In Progress",
    createDate: "22-02-2025",
    estimateId: "EST-SRV-000127",
    personnelName: "Matafi Express",
    businessName: "Matafi Express",
    progress: 25,
  },
  {
    id: "WO-0000000046",
    serviceId: "SRV-025",
    serviceName: "Renew Trade License",
    status: "In Progress",
    createDate: "23-02-2025",
    estimateId: "EST-SRV-000128",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 50,
  },
  {
    id: "WO-0000000047",
    serviceId: "SRV-026",
    serviceName: "Apply for Business Registration",
    status: "In Progress",
    createDate: "24-02-2025",
    estimateId: "EST-SRV-000129",
    personnelName: "RBuy Solutions",
    businessName: "RBuy Solutions",
    progress: 65,
  },
  {
    id: "WO-0000000048",
    serviceId: "SRV-027",
    serviceName: "Renew Company License",
    status: "In Progress",
    createDate: "25-02-2025",
    estimateId: "EST-SRV-000130",
    personnelName: "Manaf Exports Ltd",
    businessName: "Manaf Exports Ltd",
    progress: 80,
  },
  {
    id: "WO-0000000049",
    serviceId: "SRV-028",
    serviceName: "Apply for Tax Certificate",
    status: "In Progress",
    createDate: "26-02-2025",
    estimateId: "EST-SRV-000131",
    personnelName: "WSM LTD",
    businessName: "WSM LTD",
    progress: 40,
  },
  {
    id: "WO-0000000050",
    serviceId: "SRV-029",
    serviceName: "Renew Business Permit",
    status: "In Progress",
    createDate: "27-02-2025",
    estimateId: "EST-SRV-000132",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 55,
  },

  // Additional Complete Works
  {
    id: "WO-0000000051",
    serviceId: "SRV-030",
    serviceName: "Apply for Commercial License",
    status: "Complete",
    createDate: "18-02-2025",
    estimateId: "EST-SRV-000133",
    personnelName: "Matafi Express",
    businessName: "Matafi Express",
    progress: 100,
  },
  {
    id: "WO-0000000052",
    serviceId: "SRV-031",
    serviceName: "Renew Import License",
    status: "Complete",
    createDate: "19-02-2025",
    estimateId: "EST-SRV-000134",
    personnelName: "RBuy Solutions",
    businessName: "RBuy Solutions",
    progress: 100,
  },
  {
    id: "WO-0000000053",
    serviceId: "SRV-032",
    serviceName: "Apply for Export License",
    status: "Complete",
    createDate: "20-02-2025",
    estimateId: "EST-SRV-000135",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 100,
  },
  {
    id: "WO-0000000054",
    serviceId: "SRV-033",
    serviceName: "Renew Work Permit",
    status: "Complete",
    createDate: "21-02-2025",
    estimateId: "EST-SRV-000136",
    personnelName: "WSM LTD",
    businessName: "WSM LTD",
    progress: 100,
  },
  {
    id: "WO-0000000055",
    serviceId: "SRV-034",
    serviceName: "Apply for Residence Permit",
    status: "Complete",
    createDate: "22-02-2025",
    estimateId: "EST-SRV-000137",
    personnelName: "Manaf Exports Ltd",
    businessName: "Manaf Exports Ltd",
    progress: 100,
  },
  {
    id: "WO-0000000056",
    serviceId: "SRV-035",
    serviceName: "Renew Business Registration",
    status: "Complete",
    createDate: "23-02-2025",
    estimateId: "EST-SRV-000138",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 100,
  },
  {
    id: "WO-0000000057",
    serviceId: "SRV-036",
    serviceName: "Apply for Company Registration",
    status: "Complete",
    createDate: "24-02-2025",
    estimateId: "EST-SRV-000139",
    personnelName: "RBuy Solutions",
    businessName: "RBuy Solutions",
    progress: 100,
  },
  {
    id: "WO-0000000058",
    serviceId: "SRV-037",
    serviceName: "Renew Tax Certificate",
    status: "Complete",
    createDate: "25-02-2025",
    estimateId: "EST-SRV-000140",
    personnelName: "Matafi Express",
    businessName: "Matafi Express",
    progress: 100,
  },
  {
    id: "WO-0000000059",
    serviceId: "SRV-038",
    serviceName: "Apply for Business Permit",
    status: "Complete",
    createDate: "26-02-2025",
    estimateId: "EST-SRV-000141",
    personnelName: "WSM LTD",
    businessName: "WSM LTD",
    progress: 100,
  },
  {
    id: "WO-0000000060",
    serviceId: "SRV-039",
    serviceName: "Renew Commercial Registration",
    status: "Complete",
    createDate: "27-02-2025",
    estimateId: "EST-SRV-000142",
    personnelName: "Hampton Solutions",
    businessName: "Hampton Solutions",
    progress: 100,
  },
]

export default function WorksPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<Work["status"]>("Open")

  const filteredWorks = works.filter(
    (work) =>
      work.status === activeTab &&
      (work.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.id.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getStatusColor = (status: Work["status"]) => {
    switch (status) {
      case "Open":
        return "bg-blue-50/50 text-blue-600"
      case "In Progress":
        return "bg-emerald-50/50 text-emerald-600"
      case "Complete":
        return "bg-green-50/50 text-green-600"
      default:
        return "bg-gray-50/50 text-gray-600"
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="w-full sm:max-w-[400px] relative">
                <Input
                  placeholder="Search works..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#0047AB] rounded-lg text-gray-900 focus-visible:ring-[#0047AB]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
              </div>
              <Button className="bg-[#0047AB] hover:bg-[#0056D4]">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Work
              </Button>
            </div>

            <div className="mb-6">
              <Tabs
                defaultValue="Open"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as Work["status"])}
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
                    value="In Progress"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger
                    value="Complete"
                    className="text-gray-500 data-[state=active]:text-[#0047AB] data-[state=active]:border-b-2 data-[state=active]:border-[#0047AB] rounded-none bg-transparent px-8"
                  >
                    Complete
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWorks.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gray-500">
                  No works found. Try adjusting your search or changing the status filter.
                </div>
              ) : (
                filteredWorks.map((work) => (
                  <Card
                    key={work.id}
                    className="p-3 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200 relative overflow-hidden border border-[#047758]/20"
                    onClick={() => router.push(`/works/${work.id}`)}
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">{work.serviceName}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">For: {work.businessName}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-md font-normal border-0 ml-2 text-xs whitespace-nowrap",
                            getStatusColor(work.status),
                          )}
                        >
                          {work.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Created on {work.createDate}</span>
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="truncate pr-2">{work.id}</span>
                          <span
                            className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/estimates/${work.estimateId}`)
                            }}
                          >
                            {work.estimateId}
                          </span>
                        </div>
                        {work.status === "Open" ? (
                          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#0047AB] rounded-full w-0" />
                          </div>
                        ) : (
                          work.status !== "Complete" && (
                            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#0047AB] rounded-full"
                                style={{ width: `${work.progress}%` }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
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
