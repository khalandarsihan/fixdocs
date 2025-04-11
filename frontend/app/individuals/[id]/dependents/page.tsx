"use client"

import { useState, useMemo } from "react"
import { UserPlus, Search, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Dependent {
  id: number
  name: string
  type: string
  details: {
    basic: {
      visaType: string
      email: string
      phone: string
    }
    passport: {
      id: string
      issueDate: string
      expiryDate: string
    }
    visa: {
      id: string
      issueDate: string
      expiryDate: string
    }
    emiratesId: {
      id: string
      issueDate: string
      expiryDate: string
    }
    healthInsurance: {
      id: string
      issueDate: string
      expiryDate: string
    }
  }
}

const initialDependents: Dependent[] = [
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
  {
    id: 2,
    name: "Jane Doe",
    type: "Spouse",
    details: {
      basic: {
        visaType: "Family VISA",
        email: "jane.doe@example.com",
        phone: "+971 50 234 5678",
      },
      passport: {
        id: "P234567",
        issueDate: "2022-05-20",
        expiryDate: "2027-05-20",
      },
      visa: {
        id: "V890123",
        issueDate: "2023-11-15",
        expiryDate: "2024-11-15",
      },
      emiratesId: {
        id: "E012345",
        issueDate: "2023-10-25",
        expiryDate: "2024-10-25",
      },
      healthInsurance: {
        id: "H678901",
        issueDate: "2023-09-30",
        expiryDate: "2024-09-30",
      },
    },
  },
  {
    id: 3,
    name: "Michael Doe",
    type: "Child",
    details: {
      basic: {
        visaType: "Family VISA",
        email: "michael.doe@example.com",
        phone: "+971 50 345 6789",
      },
      passport: {
        id: "P345678",
        issueDate: "2022-08-10",
        expiryDate: "2027-08-10",
      },
      visa: {
        id: "V901234",
        issueDate: "2023-10-05",
        expiryDate: "2024-10-05",
      },
      emiratesId: {
        id: "E123456",
        issueDate: "2023-09-15",
        expiryDate: "2024-09-15",
      },
      healthInsurance: {
        id: "H789012",
        issueDate: "2023-08-20",
        expiryDate: "2024-08-20",
      },
    },
  },
]

export default function DependentsPage({ params }: { params: { id: string } }) {
  const [dependents, setDependents] = useState<Dependent[]>(initialDependents)
  const [selectedDependent, setSelectedDependent] = useState<Dependent | null>(null)
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
    const newDependent: Dependent = {
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
    <Card className="w-full bg-white rounded-md shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Dependents Management</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
              <Input
                placeholder="Search dependents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#0047AB] text-black"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#0047AB] hover:bg-[#0047AB]/90">
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
        </div>

        <div className="w-full h-[calc(100vh-16rem)] overflow-hidden flex flex-col">
          <div className="flex-grow overflow-auto border rounded-md">
            <Table>
              <TableHeader className="bg-[#0047AB] text-white sticky top-0 z-10">
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
          </div>
        </div>
        <div className="mt-4 border-t pt-4 flex items-center justify-between px-1 text-sm text-muted-foreground">
          <div>
            Showing {filteredDependents.length} of {dependents.length} dependents
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-[#0047AB] hover:underline">
              Export
            </a>
            <a href="#" className="text-[#0047AB] hover:underline">
              Print
            </a>
            <a href="#" className="text-[#0047AB] hover:underline">
              Help
            </a>
          </div>
        </div>
      </CardContent>

      <Sheet open={!!selectedDependent} onOpenChange={closeSlideBar}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Dependent Details</SheetTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleUpdate}
                    disabled={!isDataModified}
                    className="h-8 bg-[#0047AB] text-white hover:bg-[#0047AB]/90 disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
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
                        <Label className="text-xs text-muted-foreground">Relationship</Label>
                        <div className="text-sm font-medium">{selectedDependent.type}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <div className="text-sm font-medium">{selectedDependent.details.basic.email}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Phone</Label>
                        <div className="text-sm font-medium">{selectedDependent.details.basic.phone}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Important Dates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Passport Expiry</Label>
                          <div className="text-sm font-medium">
                            {formatDate(selectedDependent.details.passport.expiryDate)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Visa Expiry</Label>
                          <div className="text-sm font-medium">
                            {formatDate(selectedDependent.details.visa.expiryDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <SheetFooter className="border-t p-4">
              <Link
                href={`/individuals/${params.id}/dependents/${selectedDependent?.id}`}
                className="flex items-center justify-center w-full text-[#0047AB] hover:text-[#0047AB]/90 font-medium"
              >
                View more details
              </Link>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  )
}
