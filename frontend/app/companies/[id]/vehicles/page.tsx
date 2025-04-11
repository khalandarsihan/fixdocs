"use client"

import { useState, useMemo } from "react"
import { Car, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

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
    licensePlate: "LPN2716348",
    mulkiyaNumber: "MLK9868969",
    mulkiyaExpiryDate: "2025-02-16",
    insuranceExpiryDate: "2025-01-16",
    vehicleType: "Sedan",
    make: "Toyota",
    model: "Camry",
    year: "2022",
  },
  {
    id: 2,
    licensePlate: "LNP8969696",
    mulkiyaNumber: "MLK9868970",
    mulkiyaExpiryDate: "2025-02-13",
    insuranceExpiryDate: "2025-01-13",
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
  {
    id: 4,
    licensePlate: "GHI789",
    mulkiyaNumber: "MUL234567",
    mulkiyaExpiryDate: "2025-08-20",
    insuranceExpiryDate: "2025-08-20",
    vehicleType: "Pickup",
    make: "Ford",
    model: "Ranger",
    year: "2022",
  },
  {
    id: 5,
    licensePlate: "JKL012",
    mulkiyaNumber: "MUL345678",
    mulkiyaExpiryDate: "2024-10-05",
    insuranceExpiryDate: "2024-10-05",
    vehicleType: "Van",
    make: "Mercedes",
    model: "Sprinter",
    year: "2021",
  },
]

export default function VehiclesPage() {
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
    <div className="p-6 bg-[#f2f2f2]">
      <div className="border text-card-foreground w-full bg-white rounded-md shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border border-gray-300 rounded-md"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#0047AB] hover:bg-[#0047AB]/90 text-white">
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
                  <Input id="licensePlate" name="licensePlate" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mulkiyaNumber">Mulkiya Number</Label>
                  <Input id="mulkiyaNumber" name="mulkiyaNumber" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mulkiyaExpiryDate">Mulkiya Expiry Date</Label>
                    <Input id="mulkiyaExpiryDate" name="mulkiyaExpiryDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceExpiryDate">Insurance Expiry Date</Label>
                    <Input id="insuranceExpiryDate" name="insuranceExpiryDate" type="date" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Input id="vehicleType" name="vehicleType" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" name="make" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" name="model" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" name="year" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#0047AB]">
                  Add Vehicle
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader className="bg-[#0047AB]">
              <TableRow>
                <TableHead className="text-white font-medium">License Plate</TableHead>
                <TableHead className="text-white font-medium">Mulkiya Number</TableHead>
                <TableHead className="text-white font-medium">Mulkiya Expiry</TableHead>
                <TableHead className="text-white font-medium">Insurance Expiry</TableHead>
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
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.mulkiyaNumber}</TableCell>
                  <TableCell>{formatDate(vehicle.mulkiyaExpiryDate)}</TableCell>
                  <TableCell>{formatDate(vehicle.insuranceExpiryDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={!!selectedVehicle} onOpenChange={(open) => !open && setSelectedVehicle(null)}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Vehicle Details</SheetTitle>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Mulkiya Expiry Date</Label>
                          <div className="text-sm font-medium">{formatDate(selectedVehicle.mulkiyaExpiryDate)}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Insurance Expiry Date</Label>
                          <div className="text-sm font-medium">{formatDate(selectedVehicle.insuranceExpiryDate)}</div>
                        </div>
                      </div>
                    </div>

                    {selectedVehicle.vehicleType && (
                      <div className="pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Vehicle Type</Label>
                            <div className="text-sm font-medium">{selectedVehicle.vehicleType}</div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Make</Label>
                            <div className="text-sm font-medium">{selectedVehicle.make}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedVehicle.model && (
                      <div className="pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Model</Label>
                            <div className="text-sm font-medium">{selectedVehicle.model}</div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Year</Label>
                            <div className="text-sm font-medium">{selectedVehicle.year}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setSelectedVehicle(null)} className="border-gray-300">
                      Close
                    </Button>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-[#0047AB] hover:bg-[#0047AB]/90 text-white"
                    >
                      Edit
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
