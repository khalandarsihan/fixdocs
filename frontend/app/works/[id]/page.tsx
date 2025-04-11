"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Paperclip, FileText, DollarSign, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

interface Action {
  id: number
  action: string
  taskType: string
  mode: string
  status: string
  paymentDetails?: string
  notes?: string
  isDone: boolean
  isExpanded?: boolean
}

export default function WorkPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [status, setStatus] = useState("Open")
  const [originalStatus, setOriginalStatus] = useState("Open")
  const [actions, setActions] = useState<Action[]>([
    {
      id: 1,
      action: "This is First Task",
      taskType: "Application Submission",
      mode: "Office",
      status: "Open",
      isDone: false,
      isExpanded: false,
    },
    {
      id: 2,
      action: "This is second Task",
      taskType: "Customer Invoicing",
      mode: "Office",
      status: "Open",
      isDone: false,
      isExpanded: false,
    },
    {
      id: 3,
      action: "This is third Task",
      taskType: "Fee Payment",
      mode: "Office",
      status: "Open",
      isDone: false,
      isExpanded: false,
    },
    {
      id: 4,
      action: "This is fourth Task",
      taskType: "Miscellaneous",
      mode: "Field",
      status: "Open",
      isDone: false,
      isExpanded: false,
    },
  ])

  // Add state for tracking changes
  const [isModified, setIsModified] = useState(false)

  // Update status based on checkbox selections
  useEffect(() => {
    const doneCount = actions.filter((action) => action.isDone).length

    if (doneCount === actions.length && doneCount > 0) {
      // All tasks are done
      setStatus("Complete")
    } else if (doneCount > 0) {
      // Some tasks are done
      setStatus("In Progress")
    } else {
      // No tasks are done
      setStatus("Open")
    }

    // Check if the status has changed from the original
    if (originalStatus !== status || doneCount > 0) {
      setIsModified(true)
    } else {
      setIsModified(false)
    }
  }, [actions, originalStatus, status])

  const handleStatusChange = (value: string) => {
    setStatus(value)
    if (value !== originalStatus) {
      setIsModified(true)
    } else if (!actions.some((action) => action.isDone)) {
      // If status is back to original and no actions are done, reset isModified
      setIsModified(false)
    }
  }

  const handleActionToggle = (actionId: number, isDone: boolean) => {
    setIsModified(true) // Set modified to true when toggle changes
    setActions(actions.map((action) => (action.id === actionId ? { ...action, isDone, isExpanded: isDone } : action)))
  }

  const toggleExpand = (actionId: number) => {
    setActions(
      actions.map((action) => (action.id === actionId ? { ...action, isExpanded: !action.isExpanded } : action)),
    )
  }

  // Update handleInputChange function
  const handleInputChange = (actionId: number, field: string, value: string) => {
    setIsModified(true)
    setActions((prevActions) =>
      prevActions.map((action) => (action.id === actionId ? { ...action, [field]: value } : action)),
    )
  }

  // Add handleSave function
  const handleSave = () => {
    setIsModified(false)
    setOriginalStatus(status)
  }

  const getStatusColor = (status: string) => {
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
    <div className="container mx-auto py-4 px-4">
      <div className="mb-4">
        <Link href="/works" className="inline-flex items-center text-[#047758] hover:text-[#047758]/80 font-medium">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Works
        </Link>
      </div>

      {/* Updating button and UI elements in the works page */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">Apply for Civil Defence Certificate</h1>
        </div>
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] bg-white text-gray-900 border-2 border-[#0047AB] font-medium">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            disabled={!isModified}
            onClick={handleSave}
            className="h-10 w-24 bg-[#0047AB] text-white hover:bg-[#0056D4] disabled:bg-[#0047AB]/50 disabled:text-white/80 disabled:cursor-not-allowed"
          >
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-base font-medium text-gray-900 mb-2">Work Details</h3>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <div>
                <Label className="text-gray-500 text-sm block mb-1">Created on</Label>
                <div className="text-gray-900 text-[15px] font-medium">15-02-2025</div>
              </div>

              <div>
                <Label className="text-gray-500 text-sm block mb-1">From estimate</Label>
                <Link
                  href="/estimates/EST-SRV-000108"
                  className="text-blue-600 hover:text-blue-800 hover:underline text-[15px] font-medium"
                >
                  EST-SRV-000108
                </Link>
              </div>

              <div>
                <Label className="text-gray-500 text-sm block mb-1">Status</Label>
                <Badge
                  variant="outline"
                  className={cn("rounded-md font-medium border-0 px-3 py-1", getStatusColor(status))}
                >
                  {status}
                </Badge>
              </div>

              <div>
                <Label className="text-gray-500 text-sm block mb-1">Business Name</Label>
                <Link
                  href="/companies/hampton-solutions"
                  className="text-blue-600 hover:text-blue-800 hover:underline text-[15px] font-medium"
                >
                  Hampton Solutions
                </Link>
              </div>

              <div>
                <Label className="text-gray-500 text-sm block mb-1">Service Name</Label>
                <div className="text-gray-900 text-[15px] font-medium">Apply for Civil Defence Certificate</div>
              </div>

              <div>
                <Label className="text-gray-500 text-sm block mb-1">Service for</Label>
                <div className="text-gray-900 text-[15px] font-medium">Hampton Solutions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-base font-medium text-gray-900 mb-2">Work Actions</h3>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              {/* Update the table header */}
              <TableHeader>
                <TableRow className="!hover:bg-[#0047AB] bg-[#0047AB] pointer-events-none">
                  <TableHead className="w-[50px] py-2.5 text-white font-bold text-base">No.</TableHead>
                  <TableHead className="py-2.5 text-white font-bold text-base">Action</TableHead>
                  <TableHead className="py-2.5 text-white font-bold text-base">Task Type</TableHead>
                  <TableHead className="py-2.5 text-white font-bold text-base">Mode</TableHead>
                  <TableHead className="py-2.5 text-white font-bold text-base text-center w-[100px]">Done</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action, index) => (
                  <>
                    <TableRow
                      key={action.id}
                      className={cn(
                        "cursor-pointer py-1",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                        action.isExpanded && "bg-gray-100",
                      )}
                      onClick={() => toggleExpand(action.id)}
                    >
                      <TableCell className="font-bold py-2">{action.id}</TableCell>
                      <TableCell className={cn("py-2 font-medium", action.isExpanded && "font-bold")}>
                        {action.action}
                      </TableCell>
                      <TableCell className={cn("py-2", action.isExpanded && "font-bold")}>{action.taskType}</TableCell>
                      <TableCell className={cn("py-2", action.isExpanded && "font-bold")}>{action.mode}</TableCell>
                      <TableCell className="py-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center">
                          <Checkbox
                            checked={action.isDone}
                            onCheckedChange={(checked) => handleActionToggle(action.id, checked as boolean)}
                            className="pointer-events-auto"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                    {action.isExpanded && (
                      <TableRow className="hover:bg-gray-100 bg-gray-100">
                        <TableCell colSpan={5} className="p-6 border border-gray-200 border-t-0">
                          <div className="relative">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label className="text-gray-700 text-sm">Payment Details</Label>
                                <div className="flex mt-1">
                                  <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                    <DollarSign className="h-3.5 w-3.5" />
                                  </span>
                                  <Input
                                    placeholder="Enter payment details"
                                    value={action.paymentDetails || ""}
                                    onChange={(e) => handleInputChange(action.id, "paymentDetails", e.target.value)}
                                    className="rounded-l-none h-10 text-sm bg-white text-gray-900 border-gray-200 focus:ring-0 focus:ring-offset-0 focus:border-gray-300"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-gray-700 text-sm">Notes</Label>
                                <div className="flex mt-1">
                                  <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                    <FileText className="h-3.5 w-3.5" />
                                  </span>
                                  <Input
                                    placeholder="Add notes here"
                                    value={action.notes || ""}
                                    onChange={(e) => handleInputChange(action.id, "notes", e.target.value)}
                                    className="rounded-l-none h-10 text-sm bg-white text-gray-900 border-gray-200 focus:ring-0 focus:ring-offset-0 focus:border-gray-300"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-gray-700 text-sm">Attachments</Label>
                                <Button
                                  variant="outline"
                                  size="default"
                                  className="w-full mt-1 h-10 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                >
                                  <Paperclip className="mr-2 h-3.5 w-3.5" />
                                  Attach Files
                                </Button>
                              </div>
                            </div>

                            <div className="flex justify-end mt-6 mb-1">
                              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-100">
                                <span className="text-sm font-medium text-gray-700">Mark as Done</span>
                                {/* Update the Switch component */}
                                <Switch
                                  checked={action.isDone}
                                  onCheckedChange={(checked) => handleActionToggle(action.id, checked)}
                                  className="data-[state=checked]:bg-[#0047AB]"
                                />
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
