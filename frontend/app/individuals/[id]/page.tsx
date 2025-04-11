"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Edit,
  Save,
  Users,
  Car,
  FileText,
  Receipt,
  AlertTriangle,
  Wrench,
  Wallet,
  Search,
  UserPlus,
  ArrowLeft,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"

interface IndividualDetails {
  fullName: string
  type: string
  residentStatus: "Visitor" | "Resident" | "Emirati"
  visaType: "Visitor VISA" | "Golden VISA" | "Green VISA" | "Employee VISA" | "Family VISA" | "House VISA"
  employer: string
  isCustomer: boolean
  emailAddress: string
  phoneNumber: string
  isActive: boolean
}

interface MetricCardProps {
  title: string
  value: number
  icon: React.ReactNode
  onClick: () => void
}

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
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className={`text-sm font-semibold ${statusColor}`}>
        {new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>
      <p className="text-xs text-muted-foreground">{daysUntilExpiry} days remaining</p>
    </div>
  )
}

const navItems = [
  { id: "overview", title: "Overview" },
  { id: "documents", title: "Documents" },
  { id: "dependents", title: "Dependents" },
  { id: "vehicles", title: "Vehicles" },
]

export default function IndividualDashboardPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedDependent, setSelectedDependent] = useState<any>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [individualDetails, setIndividualDetails] = useState<IndividualDetails>({
    fullName: "Ramshad Ali",
    type: "Business Staff",
    residentStatus: "Resident",
    visaType: "Employee VISA",
    employer: "Acme Inc.",
    isCustomer: false,
    emailAddress: "ramshad.ali@example.com",
    phoneNumber: "+971 50 123 4567",
    isActive: true,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleInputChange = (field: keyof IndividualDetails, value: string | boolean) => {
    setIndividualDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  // Documents Section
  const DocumentsSection = () => {
    const [editingCards, setEditingCards] = useState<Set<string>>(new Set())
    const [isDataModified, setIsDataModified] = useState(false)

    const documents = [
      {
        id: "passport",
        title: "Passport",
        fields: [
          { id: "passportNumber", label: "Passport Number", value: "P1234567" },
          { id: "dateOfIssue", label: "Date of Issue", value: "2020-01-01", type: "date" },
          { id: "dateOfExpiry", label: "Date of Expiry", value: "2030-01-01", type: "date" },
        ],
      },
      {
        id: "visa",
        title: "Visa",
        fields: [
          { id: "visaNumber", label: "Visa Number", value: "V9876543" },
          { id: "visaType", label: "Visa Type", value: "Employment" },
          { id: "dateOfIssue", label: "Date of Issue", value: "2023-01-01", type: "date" },
          { id: "dateOfExpiry", label: "Date of Expiry", value: "2025-01-01", type: "date" },
        ],
      },
      {
        id: "emiratesCard",
        title: "Emirates Card",
        fields: [
          { id: "emiratesId", label: "Emirates ID", value: "784-1234-1234567-1" },
          { id: "dateOfIssue", label: "Date of Issue", value: "2023-01-01", type: "date" },
          { id: "dateOfExpiry", label: "Date of Expiry", value: "2025-01-01", type: "date" },
        ],
      },
      {
        id: "workPermit",
        title: "Work Permit (Labor Card)",
        fields: [
          { id: "permitNumber", label: "Permit Number", value: "WP123456" },
          { id: "dateOfIssue", label: "Date of Issue", value: "2023-01-01", type: "date" },
          { id: "dateOfExpiry", label: "Date of Expiry", value: "2025-01-01", type: "date" },
        ],
      },
      {
        id: "healthInsurance",
        title: "Health Insurance",
        fields: [
          { id: "policyNumber", label: "Policy Number", value: "HI987654" },
          { id: "dateOfIssue", label: "Date of Issue", value: "2023-01-01", type: "date" },
          { id: "dateOfExpiry", label: "Date of Expiry", value: "2024-01-01", type: "date" },
        ],
      },
      {
        id: "iloe",
        title: "ILOE (Involuntary Loss Of Employment)",
        fields: [
          { id: "policyNumber", label: "Policy Number", value: "ILOE654321" },
          { id: "dateOfIssue", label: "Date of Issue", value: "2023-01-01", type: "date" },
          { id: "dateOfExpiry", label: "Date of Expiry", value: "2024-01-01", type: "date" },
        ],
      },
      {
        id: "drivingLicense",
        title: "Driving License",
        fields: [
          { id: "licenseNumber", label: "License Number", value: "DL246810" },
          { id: "dateOfIssue", label: "Date of Issue", value: "2020-01-01", type: "date" },
          { id: "dateOfExpiry", label: "Date of Expiry", value: "2030-01-01", type: "date" },
        ],
      },
    ]

    const toggleEdit = (cardType: string) => {
      const newEditingCards = new Set(editingCards)
      if (newEditingCards.has(cardType)) {
        newEditingCards.delete(cardType)
      } else {
        newEditingCards.add(cardType)
      }
      setEditingCards(newEditingCards)
    }

    const handleInputChange = (documentId: string, fieldId: string, value: string) => {
      // Implement the logic to update the document field
      setIsDataModified(true)
    }

    const handleUpdate = () => {
      setEditingCards(new Set())
      setIsDataModified(false)
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            onClick={handleUpdate}
            disabled={!isDataModified}
            className="w-24 bg-[#0047AB] text-white hover:bg-[#0047AB]/90 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Update
          </Button>
        </div>
        {documents.map((document) => (
          <Card key={document.id} className="w-full shadow-md">
            <div className="flex items-center justify-between border-b p-4 sm:p-6">
              <h3 className="text-lg font-medium">{document.title}</h3>
              <Button variant="ghost" size="icon" onClick={() => toggleEdit(document.id)} className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="py-4 px-4 sm:py-6 sm:px-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {document.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    {editingCards.has(document.id) ? (
                      <Input
                        id={field.id}
                        type={field.type || "text"}
                        value={field.value}
                        onChange={(e) => handleInputChange(document.id, field.id, e.target.value)}
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-9 text-sm"
                      />
                    ) : (
                      <div className="text-sm font-medium mt-1">{field.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="w-full shadow-md">
          <div className="flex items-center justify-between border-b p-4 sm:p-6">
            <h3 className="text-lg font-medium">Other Personnel Documents</h3>
          </div>
          <CardContent className="py-4 px-4 sm:py-6 sm:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No.</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Document ID</TableHead>
                  <TableHead>Date of Issue</TableHead>
                  <TableHead>Date of Expiry</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No Data
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dependents Section
  const DependentsSection = () => {
    const [dependents, setDependents] = useState([
      {
        id: 1,
        name: "John Doe",
        type: "Child",
        details: {
          basic: {
            visaType: "Family VISA",
            email: "john.doe@example.com",
            phone: "+971 50 123 4567",
          },
          passport: {
            id: "P123456",
            issueDate: "2023-01-15",
            expiryDate: "2028-01-15",
          },
          visa: {
            id: "V789012",
            issueDate: "2023-12-01",
            expiryDate: "2024-12-01",
          },
          emiratesId: {
            id: "E901234",
            issueDate: "2023-11-30",
            expiryDate: "2024-11-30",
          },
          healthInsurance: {
            id: "H567890",
            issueDate: "2023-10-15",
            expiryDate: "2024-10-15",
          },
        },
      },
      // Add more sample dependents as needed
    ])

    const [selectedDependent, setSelectedDependent] = useState<any>(null)
    const [editingCards, setEditingCards] = useState<Set<string>>(new Set())
    const [isDataModified, setIsDataModified] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    }

    const toggleEdit = (cardType: string) => {
      const newEditingCards = new Set(editingCards)
      if (newEditingCards.has(cardType)) {
        newEditingCards.delete(cardType)
      } else {
        newEditingCards.add(cardType)
      }
      setEditingCards(newEditingCards)
    }

    const handleInputChange = (cardType: string, field: string, value: string) => {
      if (selectedDependent) {
        const updatedDependent = { ...selectedDependent }
        updatedDependent.details[cardType as keyof typeof updatedDependent.details][
          field as keyof (typeof updatedDependent.details)[typeof cardType]
        ] = value
        setSelectedDependent(updatedDependent)
        setIsDataModified(true)
      }
    }

    const handleUpdate = () => {
      if (selectedDependent) {
        setDependents(dependents.map((d) => (d.id === selectedDependent.id ? selectedDependent : d)))
        setEditingCards(new Set())
        setIsDataModified(false)
        closeSlideBar()
      }
    }

    const closeSlideBar = () => {
      setSelectedDependent(null)
      setEditingCards(new Set())
      setIsDataModified(false)
      setSelectedRowId(null)
    }

    const addDependent = (formData: FormData) => {
      const newDependent = {
        id: dependents.length + 1,
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        details: {
          basic: {
            visaType: "Family VISA",
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
          },
          passport: {
            id: formData.get("passportId") as string,
            issueDate: formData.get("passportIssueDate") as string,
            expiryDate: formData.get("passportExpiryDate") as string,
          },
          visa: {
            id: formData.get("visaId") as string,
            issueDate: formData.get("visaIssueDate") as string,
            expiryDate: formData.get("visaExpiryDate") as string,
          },
          emiratesId: {
            id: formData.get("emiratesId") as string,
            issueDate: formData.get("emiratesIdIssueDate") as string,
            expiryDate: formData.get("emiratesIdExpiryDate") as string,
          },
          healthInsurance: {
            id: formData.get("healthInsuranceId") as string,
            issueDate: formData.get("healthInsuranceIssueDate") as string,
            expiryDate: formData.get("healthInsuranceExpiryDate") as string,
          },
        },
      }
      setDependents((prev) => [...prev, newDependent])
    }

    const filteredDependents = useMemo(() => {
      return dependents.filter((dependent) => dependent.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [dependents, searchQuery])

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-[520px]">
            <Input
              placeholder="Search dependents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#0047AB] text-black"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0047AB] hover:bg-[#0047AB]/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Dependent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Dependent</DialogTitle>
              </DialogHeader>
              <form action={addDependent} className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Relationship</Label>
                  <Input
                    id="type"
                    name="type"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>

                {/* Document Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportId">Passport Number</Label>
                    <Input
                      id="passportId"
                      name="passportId"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passportExpiryDate">Passport Expiry</Label>
                    <Input
                      id="passportExpiryDate"
                      name="passportExpiryDate"
                      type="date"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visaId">Visa Number</Label>
                    <Input
                      id="visaId"
                      name="visaId"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visaExpiryDate">Visa Expiry</Label>
                    <Input
                      id="visaExpiryDate"
                      name="visaExpiryDate"
                      type="date"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Add Dependent
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="w-full h-[calc(100vh-10rem)] shadow-md overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-grow overflow-auto">
            <Table>
              <TableHeader className="bg-[#0047AB] text-white">
                <TableRow>
                  <TableHead className="text-white h-12">Name</TableHead>
                  <TableHead className="text-white h-12">Relationship</TableHead>
                  <TableHead className="text-white h-12">Passport Expiry</TableHead>
                  <TableHead className="text-white h-12">Visa Expiry</TableHead>
                  <TableHead className="text-white h-12">Emirates ID Expiry</TableHead>
                  <TableHead className="text-white h-12">Health Insurance Expiry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDependents.map((dependent, index) => (
                  <TableRow
                    key={dependent.id}
                    onClick={() => {
                      setSelectedDependent(dependent)
                      setSelectedRowId(dependent.id)
                    }}
                    className={cn(
                      "cursor-pointer",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      selectedRowId === dependent.id && "bg-blue-100 hover:bg-blue-200",
                    )}
                  >
                    <TableCell className="font-medium">{dependent.name}</TableCell>
                    <TableCell>{dependent.type}</TableCell>
                    <TableCell>{formatDate(dependent.details.passport.expiryDate)}</TableCell>
                    <TableCell>{formatDate(dependent.details.visa.expiryDate)}</TableCell>
                    <TableCell>{formatDate(dependent.details.emiratesId.expiryDate)}</TableCell>
                    <TableCell>{formatDate(dependent.details.healthInsurance.expiryDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Sheet open={!!selectedDependent} onOpenChange={closeSlideBar}>
          <SheetContent
            className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
            side="right"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold">{selectedDependent?.name}</h2>
                <Button
                  variant="outline"
                  onClick={handleUpdate}
                  disabled={!isDataModified}
                  className="w-24 bg-[#0047AB] text-white hover:bg-[#0047AB]/90 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  Update
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-6 p-4 sm:p-6">
                  {selectedDependent &&
                    [
                      {
                        title: "Personal details",
                        type: "basic",
                        data: selectedDependent.details.basic,
                        isBasic: true,
                      },
                      { title: "Passport", type: "passport", data: selectedDependent.details.passport },
                      { title: "Visa", type: "visa", data: selectedDependent.details.visa },
                      { title: "Emirates ID", type: "emiratesId", data: selectedDependent.details.emiratesId },
                      {
                        title: "Health Insurance",
                        type: "healthInsurance",
                        data: selectedDependent.details.healthInsurance,
                      },
                    ].map(({ title, type, data, isBasic }) => (
                      <Card key={type} className="w-full shadow-sm">
                        <div className="flex items-center justify-between border-b p-3 sm:p-4">
                          <h3 className="text-base font-medium">{title}</h3>
                          <Button variant="ghost" size="icon" onClick={() => toggleEdit(type)} className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="py-3 px-3 sm:py-4 sm:px-4">
                          {isBasic ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-muted-foreground">Visa Type</Label>
                                {editingCards.has(type) ? (
                                  <Input
                                    value={data.visaType}
                                    onChange={(e) => handleInputChange(type, "visaType", e.target.value)}
                                    className="mt-1 h-7 text-sm"
                                  />
                                ) : (
                                  <div className="text-sm font-medium mt-1">{data.visaType}</div>
                                )}
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Phone</Label>
                                {editingCards.has(type) ? (
                                  <Input
                                    value={data.phone}
                                    onChange={(e) => handleInputChange(type, "phone", e.target.value)}
                                    className="mt-1 h-7 text-sm"
                                  />
                                ) : (
                                  <div className="text-sm font-medium mt-1">{data.phone}</div>
                                )}
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Email</Label>
                                {editingCards.has(type) ? (
                                  <Input
                                    value={data.email}
                                    onChange={(e) => handleInputChange(type, "email", e.target.value)}
                                    className="mt-1 h-7 text-sm"
                                  />
                                ) : (
                                  <div className="text-sm font-medium mt-1">{data.email}</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-4">
                              {Object.entries(data).map(([key, value]) => (
                                <div key={key}>
                                  <Label className="text-xs text-muted-foreground">
                                    {key === "id" ? "ID/Number" : key === "issueDate" ? "Issue Date" : "Expiry Date"}
                                  </Label>
                                  {editingCards.has(type) ? (
                                    <Input
                                      value={value}
                                      onChange={(e) => handleInputChange(type, key, e.target.value)}
                                      className="mt-1 h-7 text-sm"
                                      type={key.includes("Date") ? "date" : "text"}
                                    />
                                  ) : (
                                    <div className="text-sm font-medium mt-1">
                                      {key.includes("Date") ? formatDate(value) : value}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Vehicles Section
  const VehiclesSection = () => {
    const [vehicles, setVehicles] = useState([
      {
        id: 1,
        licensePlate: "ABC123",
        mulkiyaNumber: "MUL123456",
        mulkiyaExpiryDate: "2024-12-31",
        insuranceExpiryDate: "2024-12-31",
      },
      {
        id: 2,
        licensePlate: "XYZ789",
        mulkiyaNumber: "MUL789012",
        mulkiyaExpiryDate: "2025-06-30",
        insuranceExpiryDate: "2025-06-30",
      },
    ])
    const [searchQuery, setSearchQuery] = useState("")

    const filteredVehicles = useMemo(() => {
      return vehicles.filter(
        (vehicle) =>
          vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.mulkiyaNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }, [vehicles, searchQuery])

    const addVehicle = (formData: FormData) => {
      const newVehicle = {
        id: vehicles.length + 1,
        licensePlate: formData.get("licensePlate") as string,
        mulkiyaNumber: formData.get("mulkiyaNumber") as string,
        mulkiyaExpiryDate: formData.get("mulkiyaExpiryDate") as string,
        insuranceExpiryDate: formData.get("insuranceExpiryDate") as string,
      }
      setVehicles([...vehicles, newVehicle])
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-[520px]">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#0047AB] text-black"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0047AB] hover:bg-[#0047AB]/90">
                <Car className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
              </DialogHeader>
              <form action={addVehicle} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    name="licensePlate"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mulkiyaNumber">Mulkiya Number</Label>
                  <Input
                    id="mulkiyaNumber"
                    name="mulkiyaNumber"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mulkiyaExpiryDate">Mulkiya Expiry Date</Label>
                  <Input
                    id="mulkiyaExpiryDate"
                    name="mulkiyaExpiryDate"
                    type="date"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceExpiryDate">Insurance Expiry Date</Label>
                  <Input
                    id="insuranceExpiryDate"
                    name="insuranceExpiryDate"
                    type="date"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Vehicle
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="w-full h-[calc(100vh-10rem)] shadow-md overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-grow overflow-hidden">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-[#0047AB] text-white z-10">
                  <TableRow>
                    <TableHead className="text-white h-12">License Plate</TableHead>
                    <TableHead className="text-white h-12">Mulkiya Number</TableHead>
                    <TableHead className="text-white h-12">Mulkiya Expiry</TableHead>
                    <TableHead className="text-white h-12">Insurance Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle, index) => (
                    <TableRow
                      key={vehicle.id}
                      className={cn(
                        "cursor-pointer",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50",
                        selectedVehicle?.id === vehicle.id && "bg-blue-100 hover:bg-blue-200",
                      )}
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                      <TableCell>{vehicle.mulkiyaNumber}</TableCell>
                      <TableCell>{vehicle.mulkiyaExpiryDate}</TableCell>
                      <TableCell>{vehicle.insuranceExpiryDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  const renderOverview = () => {
    return (
      <div className="bg-white rounded-lg border shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#0047AB] mb-4">Individual Overview</h2>
        <div className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="py-3 px-4 bg-gray-50">
              <CardTitle className="text-base font-medium text-[#0047AB]">Summary</CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-4 pb-6">
              <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-8">
                <MetricCard
                  title="DEPENDENTS"
                  value={3}
                  icon={<Users className="h-4 w-4 text-blue-500" />}
                  onClick={() => setActiveSection("dependents")}
                />
                <MetricCard
                  title="VEHICLES"
                  value={1}
                  icon={<Car className="h-4 w-4 text-green-500" />}
                  onClick={() => setActiveSection("vehicles")}
                />
                <MetricCard
                  title="EXPIRING DOCS"
                  value={4}
                  icon={<FileText className="h-4 w-4 text-yellow-500" />}
                  onClick={() => setActiveSection("documents")}
                />
                <MetricCard
                  title="ESTIMATES"
                  value={1}
                  icon={<Receipt className="h-4 w-4 text-purple-500" />}
                  onClick={() => console.log("Estimates clicked")}
                />
                <MetricCard
                  title="ALERTS"
                  value={4}
                  icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                  onClick={() => console.log("Alerts clicked")}
                />
                <MetricCard
                  title="WORKS"
                  value={2}
                  icon={<Wrench className="h-4 w-4 text-indigo-500" />}
                  onClick={() => console.log("Works clicked")}
                />
                <MetricCard
                  title="INVOICES"
                  value={0}
                  icon={<Receipt className="h-4 w-4 text-orange-500" />}
                  onClick={() => console.log("Invoices clicked")}
                />
                <MetricCard
                  title="PAYMENTS"
                  value={0}
                  icon={<Wallet className="h-4 w-4 text-teal-500" />}
                  onClick={() => console.log("Payments clicked")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="py-3 px-4 bg-gray-50">
              <CardTitle className="text-base font-medium text-[#0047AB]">Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-4 pb-6">
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                <ExpiryCard title="Emirates ID Expiry" date="2025-03-21" />
                <ExpiryCard title="Passport Expiry" date="2025-04-11" />
                <ExpiryCard title="VISA Expiry" date="2025-04-11" />
                <ExpiryCard title="Labor Card Expiry" date="2025-02-28" />
                <ExpiryCard title="ILOE Expiry" date="2025-02-28" />
                <ExpiryCard title="Health Insurance Expiry" date="2025-01-15" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between border-b p-4 bg-gray-50">
              <h3 className="text-base font-medium text-[#0047AB]">Details</h3>
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
                  <Label htmlFor="fullName" className="text-xs">
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={individualDetails.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                    />
                  ) : (
                    <div className="text-sm font-medium mt-1">{individualDetails.fullName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs">
                    Type
                  </Label>
                  {isEditing ? (
                    <Input
                      id="type"
                      value={individualDetails.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                    />
                  ) : (
                    <div className="text-sm font-medium mt-1">{individualDetails.type}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residentStatus" className="text-xs">
                    Resident Status
                  </Label>
                  {isEditing ? (
                    <select
                      id="residentStatus"
                      value={individualDetails.residentStatus}
                      onChange={(e) =>
                        handleInputChange("residentStatus", e.target.value as IndividualDetails["residentStatus"])
                      }
                      className="w-full border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm rounded-md"
                    >
                      <option value="Visitor">Visitor</option>
                      <option value="Resident">Resident</option>
                      <option value="Emirati">Emirati</option>
                    </select>
                  ) : (
                    <div className="text-sm font-medium mt-1">{individualDetails.residentStatus}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visaType" className="text-xs">
                    Visa Type
                  </Label>
                  {isEditing ? (
                    <select
                      id="visaType"
                      value={individualDetails.visaType}
                      onChange={(e) => handleInputChange("visaType", e.target.value as IndividualDetails["visaType"])}
                      className="w-full border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm rounded-md"
                    >
                      <option value="Visitor VISA">Visitor VISA</option>
                      <option value="Golden VISA">Golden VISA</option>
                      <option value="Green VISA">Green VISA</option>
                      <option value="Employee VISA">Employee VISA</option>
                      <option value="Family VISA">Family VISA</option>
                      <option value="House VISA">House VISA</option>
                    </select>
                  ) : (
                    <div className="text-sm font-medium mt-1">{individualDetails.visaType}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employer" className="text-xs">
                    Employer
                  </Label>
                  {isEditing ? (
                    <Input
                      id="employer"
                      value={individualDetails.employer}
                      onChange={(e) => handleInputChange("employer", e.target.value)}
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                    />
                  ) : (
                    <div className="text-sm font-medium mt-1">{individualDetails.employer}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress" className="text-xs">
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="emailAddress"
                      value={individualDetails.emailAddress}
                      onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                    />
                  ) : (
                    <div className="text-sm font-medium mt-1">{individualDetails.emailAddress}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-xs">
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phoneNumber"
                      value={individualDetails.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-8 text-sm"
                    />
                  ) : (
                    <div className="text-sm font-medium mt-1">{individualDetails.phoneNumber}</div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCustomer"
                    checked={individualDetails.isCustomer}
                    onCheckedChange={(checked) => handleInputChange("isCustomer", checked as boolean)}
                    disabled={!isEditing}
                    className="border-green-500 text-green-500"
                  />
                  <Label htmlFor="isCustomer" className="text-xs">
                    Is Customer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={individualDetails.isActive}
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
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview()
      case "documents":
        return <DocumentsSection />
      case "dependents":
        return <DependentsSection />
      case "vehicles":
        return <VehiclesSection />
      default:
        return <div>Content for {activeSection} goes here</div>
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="flex h-14 items-center px-4 container">
          <div className="flex items-center gap-4">
            <Link
              href="/individuals"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
            </Link>
            <h3 className="text-lg font-medium text-[#0047AB]">{individualDetails.fullName}</h3>
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
                {item.id === "documents" && <FileText className="h-4 w-4" />}
                {item.id === "dependents" && <Users className="h-4 w-4" />}
                {item.id === "vehicles" && <Car className="h-4 w-4" />}
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

      <main className="flex-1 bg-[rgb(242,242,242)] overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="bg-white rounded-lg border shadow-md p-4 sm:p-6 h-full overflow-auto">{renderContent()}</div>
      </main>

      {/* Dependent Sheet - Updated to match the company slide bar structure */}
      <Sheet open={!!selectedDependent} onOpenChange={() => setSelectedDependent(null)}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Dependent Details</SheetTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-8">
                    {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </div>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedDependent && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Name</Label>
                        <div className="text-sm font-medium">{selectedDependent.name}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Resident Status</Label>
                        <div className="text-sm font-medium">{selectedDependent.residentStatus}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Relationship</Label>
                        <div className="text-sm font-medium">{selectedDependent.type}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Employer</Label>
                        <div className="text-sm font-medium">{selectedDependent.employer}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Email Address</Label>
                        <div className="text-sm font-medium">{selectedDependent.emailAddress}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Phone Number</Label>
                        <div className="text-sm font-medium">{selectedDependent.phoneNumber}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Important Dates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Passport Expiry</Label>
                          <div className="text-sm font-medium">{formatDate(selectedDependent.passportExpiry)}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Visa Expiry</Label>
                          <div className="text-sm font-medium">{formatDate(selectedDependent.visaExpiry)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Documents</Label>
                          <div className="text-sm font-medium">2</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Works</Label>
                          <div className="text-sm font-medium">0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <SheetFooter className="border-t p-4">
              <Link
                href={`/individuals/${selectedDependent?.id}`}
                className="flex items-center justify-center w-full text-[#0047AB] hover:text-[#0047AB]/90 font-medium"
              >
                View more details <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Vehicle Sheet - Updated to match company slide bar structure */}
      <Sheet open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Vehicle Details</SheetTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedVehicle && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">License Plate</Label>
                        <div className="text-sm font-medium">{selectedVehicle.licensePlate}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Mulkiya Number</Label>
                        <div className="text-sm font-medium">{selectedVehicle.mulkiyaNumber}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Important Dates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Mulkiya Expiry</Label>
                          <div className="text-sm font-medium">{selectedVehicle.mulkiyaExpiryDate}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Insurance Expiry</Label>
                          <div className="text-sm font-medium">{selectedVehicle.insuranceExpiryDate}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Vehicle Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Vehicle Type</Label>
                          <div className="text-sm font-medium">Sedan</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Vehicle Make</Label>
                          <div className="text-sm font-medium">Toyota</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Model</Label>
                          <div className="text-sm font-medium">Camry</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Year</Label>
                          <div className="text-sm font-medium">2022</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <SheetFooter className="border-t p-4">
              <Link
                href={`/vehicles/${selectedVehicle?.id}`}
                className="flex items-center justify-center w-full text-[#0047AB] hover:text-[#0047AB]/90 font-medium"
              >
                View more details <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
