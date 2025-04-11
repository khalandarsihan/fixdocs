"use client"

import { useState, useMemo } from "react"
import { Edit, Car, Search, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Vehicle {
  id: number
  licensePlate: string
  mulkiyaNumber: string
  mulkiyaExpiryDate: string
  insuranceExpiryDate: string
  vehicleType?: string
  make?: string
  model?: string
  year?: string
}

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    licensePlate: "ABC123",
    mulkiyaNumber: "MUL123456",
    mulkiyaExpiryDate: "2024-12-31",
    insuranceExpiryDate: "2024-12-31",
    vehicleType: "Sedan",
    make: "Toyota",
    model: "Camry",
    year: "2022",
  },
  {
    id: 2,
    licensePlate: "XYZ789",
    mulkiyaNumber: "MUL789012",
    mulkiyaExpiryDate: "2025-06-30",
    insuranceExpiryDate: "2025-06-30",
    vehicleType: "SUV",
    make: "Honda",
    model: "CR-V",
    year: "2021",
  },
  {
    id: 3,
    licensePlate: "DEF456",
    mulkiyaNumber: "MUL456789",
    mulkiyaExpiryDate: "2025-03-15",
    insuranceExpiryDate: "2025-03-15",
    vehicleType: "Hatchback",
    make: "Nissan",
    model: "Micra",
    year: "2023",
  },
]

export default function VehiclesPage({ params }: { params: { id: string } }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleSave = () => {
    if (selectedVehicle) {
      setVehicles(vehicles.map((v) => (v.id === selectedVehicle.id ? selectedVehicle : v)))
      setIsEditing(false)
    }
  }

  const addVehicle = (formData: FormData) => {
    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      licensePlate: formData.get("licensePlate") as string,
      mulkiyaNumber: formData.get("mulkiyaNumber") as string,
      mulkiyaExpiryDate: formData.get("mulkiyaExpiryDate") as string,
      insuranceExpiryDate: formData.get("insuranceExpiryDate") as string,
      vehicleType: formData.get("vehicleType") as string,
      make: formData.get("make") as string,
      model: formData.get("model") as string,
      year: formData.get("year") as string,
    }
    setVehicles([...vehicles, newVehicle])
  }

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(
      (vehicle) =>
        vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.mulkiyaNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [vehicles, searchQuery])

  return (
    <Card className="w-full bg-white rounded-md shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Vehicles Management</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#0047AB] text-black"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#0047AB] hover:bg-[#0047AB]/90">
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
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type</Label>
                      <Input
                        id="vehicleType"
                        name="vehicleType"
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        name="make"
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        name="model"
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        name="year"
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
        </div>

        <div className="w-full h-[calc(100vh-16rem)] overflow-hidden flex flex-col">
          <div className="flex-grow overflow-auto border rounded-md">
            <Table>
              <TableHeader className="bg-[#0047AB] text-white sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-white h-12">License Plate</TableHead>
                  <TableHead className="text-white h-12">Mulkiya Number</TableHead>
                  <TableHead className="text-white h-12">Mulkiya Expiry</TableHead>
                  <TableHead className="text-white h-12">Insurance Expiry</TableHead>
                  <TableHead className="text-white h-12">Type</TableHead>
                  <TableHead className="text-white h-12">Make/Model</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle, index) => (
                  <TableRow
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={cn(
                      "cursor-pointer",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      selectedVehicle?.id === vehicle.id && "bg-blue-100 hover:bg-blue-200",
                    )}
                  >
                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.mulkiyaNumber}</TableCell>
                    <TableCell>{formatDate(vehicle.mulkiyaExpiryDate)}</TableCell>
                    <TableCell>{formatDate(vehicle.insuranceExpiryDate)}</TableCell>
                    <TableCell>{vehicle.vehicleType || "N/A"}</TableCell>
                    <TableCell>{`${vehicle.make || "N/A"} ${vehicle.model || ""}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 border-t pt-4 flex items-center justify-between px-1 text-sm text-muted-foreground">
          <div>
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
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

      <Sheet open={!!selectedVehicle} onOpenChange={(open) => !open && setSelectedVehicle(null)}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Vehicle Details</SheetTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    className="h-8 bg-[#0047AB] text-white hover:bg-[#0047AB]/90"
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                    {isEditing ? "Save" : "Edit"}
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
                          <div className="text-sm font-medium">{formatDate(selectedVehicle.mulkiyaExpiryDate)}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Insurance Expiry</Label>
                          <div className="text-sm font-medium">{formatDate(selectedVehicle.insuranceExpiryDate)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Vehicle Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Vehicle Type</Label>
                          <div className="text-sm font-medium">{selectedVehicle.vehicleType || "N/A"}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Vehicle Make</Label>
                          <div className="text-sm font-medium">{selectedVehicle.make || "N/A"}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Model</Label>
                          <div className="text-sm font-medium">{selectedVehicle.model || "N/A"}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Year</Label>
                          <div className="text-sm font-medium">{selectedVehicle.year || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <SheetFooter className="border-t p-4">
              <Link
                href={`/individuals/${params.id}/vehicles/${selectedVehicle?.id}`}
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
