"use client"

import { useState, useMemo } from "react"
import { Edit, Car, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface Vehicle {
  id: number
  licensePlate: string
  mulkiyaNumber: string
  mulkiyaIssueDate: string
  mulkiyaExpiryDate: string
  insuranceNumber: string
  insuranceIssueDate: string
  insuranceExpiryDate: string
  details: {
    basic: {
      licensePlate: string
      mulkiyaNumber: string
    }
    mulkiya: {
      id: string
      issueDate: string
      expiryDate: string
    }
    insurance: {
      id: string
      issueDate: string
      expiryDate: string
    }
  }
}

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    licensePlate: "LPN2716348",
    mulkiyaNumber: "MLK9868969",
    mulkiyaIssueDate: "2024-02-01",
    mulkiyaExpiryDate: "2025-02-17",
    insuranceNumber: "INS123456",
    insuranceIssueDate: "2024-02-01",
    insuranceExpiryDate: "2025-01-17",
    details: {
      basic: {
        licensePlate: "LPN2716348",
        mulkiyaNumber: "MLK9868969",
      },
      mulkiya: {
        id: "MLK9868969",
        issueDate: "2024-02-01",
        expiryDate: "2025-02-17",
      },
      insurance: {
        id: "INS123456",
        issueDate: "2024-02-01",
        expiryDate: "2025-01-17",
      },
    },
  },
  {
    id: 2,
    licensePlate: "LNP8969696",
    mulkiyaNumber: "MLK9868970",
    mulkiyaIssueDate: "2023-02-25",
    mulkiyaExpiryDate: "2025-02-14",
    insuranceNumber: "INS789012",
    insuranceIssueDate: "2023-02-25",
    insuranceExpiryDate: "2025-01-14",
    details: {
      basic: {
        licensePlate: "LNP8969696",
        mulkiyaNumber: "MLK9868970",
      },
      mulkiya: {
        id: "MLK9868970",
        issueDate: "2023-02-25",
        expiryDate: "2025-02-14",
      },
      insurance: {
        id: "INS789012",
        issueDate: "2023-02-25",
        expiryDate: "2025-01-14",
      },
    },
  },
]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
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
    if (selectedVehicle) {
      const updatedVehicle = { ...selectedVehicle }
      updatedVehicle.details[cardType as keyof typeof updatedVehicle.details][
        field as keyof (typeof updatedVehicle.details)[typeof cardType]
      ] = value
      setSelectedVehicle(updatedVehicle)
      setIsDataModified(true)
    }
  }

  const handleUpdate = () => {
    if (selectedVehicle) {
      setVehicles(vehicles.map((v) => (v.id === selectedVehicle.id ? selectedVehicle : v)))
      setEditingCards(new Set())
      setIsDataModified(false)
      closeSlideBar()
    }
  }

  const closeSlideBar = () => {
    setSelectedVehicle(null)
    setEditingCards(new Set())
    setIsDataModified(false)
    setSelectedRowId(null)
  }

  const addVehicle = (formData: FormData) => {
    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      licensePlate: formData.get("licensePlate") as string,
      mulkiyaNumber: formData.get("mulkiyaNumber") as string,
      mulkiyaIssueDate: formData.get("mulkiyaIssueDate") as string,
      mulkiyaExpiryDate: formData.get("mulkiyaExpiryDate") as string,
      insuranceNumber: formData.get("insuranceNumber") as string,
      insuranceIssueDate: formData.get("insuranceIssueDate") as string,
      insuranceExpiryDate: formData.get("insuranceExpiryDate") as string,
      details: {
        basic: {
          licensePlate: formData.get("licensePlate") as string,
          mulkiyaNumber: formData.get("mulkiyaNumber") as string,
        },
        mulkiya: {
          id: formData.get("mulkiyaNumber") as string,
          issueDate: formData.get("mulkiyaIssueDate") as string,
          expiryDate: formData.get("mulkiyaExpiryDate") as string,
        },
        insurance: {
          id: formData.get("insuranceNumber") as string,
          issueDate: formData.get("insuranceIssueDate") as string,
          expiryDate: formData.get("insuranceExpiryDate") as string,
        },
      },
    }
    setVehicles((prev) => [...prev, newVehicle])
  }

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(
      (vehicle) =>
        vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.mulkiyaNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [vehicles, searchQuery])

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="relative max-w-sm">
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#0047AB] text-black"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#0047AB] hover:bg-[#0056D4]">
              <Car className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <form action={addVehicle} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                  <Label htmlFor="mulkiyaIssueDate">Mulkiya Issue Date</Label>
                  <Input
                    id="mulkiyaIssueDate"
                    name="mulkiyaIssueDate"
                    type="date"
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
                  <Label htmlFor="insuranceNumber">Insurance Number</Label>
                  <Input
                    id="insuranceNumber"
                    name="insuranceNumber"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceIssueDate">Insurance Issue Date</Label>
                  <Input
                    id="insuranceIssueDate"
                    name="insuranceIssueDate"
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
                    onClick={() => {
                      setSelectedVehicle(vehicle)
                      setSelectedRowId(vehicle.id)
                    }}
                    className={cn(
                      "cursor-pointer",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      selectedRowId === vehicle.id && "bg-blue-100 hover:bg-blue-200",
                    )}
                  >
                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.mulkiyaNumber}</TableCell>
                    <TableCell>{formatDate(vehicle.mulkiyaExpiryDate)}</TableCell>
                    <TableCell>{formatDate(vehicle.insuranceExpiryDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedVehicle} onOpenChange={closeSlideBar}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Vehicle Details</h2>
              <Button
                variant="outline"
                onClick={handleUpdate}
                disabled={!isDataModified}
                className="w-24 bg-[#0047AB] text-white hover:bg-[#0056D4] disabled:bg-gray-300 disabled:text-gray-500"
              >
                Update
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6 p-4 sm:p-6">
                {selectedVehicle &&
                  [
                    {
                      title: "Basic Information",
                      type: "basic",
                      data: selectedVehicle.details.basic,
                      isBasic: true,
                    },
                    { title: "Mulkiya", type: "mulkiya", data: selectedVehicle.details.mulkiya },
                    { title: "Insurance", type: "insurance", data: selectedVehicle.details.insurance },
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
                              <Label className="text-xs text-muted-foreground">License Plate</Label>
                              {editingCards.has(type) ? (
                                <Input
                                  value={data.licensePlate}
                                  onChange={(e) => handleInputChange(type, "licensePlate", e.target.value)}
                                  className="mt-1 h-7 text-sm"
                                />
                              ) : (
                                <div className="text-sm font-medium mt-1">{data.licensePlate}</div>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Mulkiya Number</Label>
                              {editingCards.has(type) ? (
                                <Input
                                  value={data.mulkiyaNumber}
                                  onChange={(e) => handleInputChange(type, "mulkiyaNumber", e.target.value)}
                                  className="mt-1 h-7 text-sm"
                                />
                              ) : (
                                <div className="text-sm font-medium mt-1">{data.mulkiyaNumber}</div>
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
            <div className="p-4 flex justify-end">
              <a href="#" className="text-sm text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                View more details
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
