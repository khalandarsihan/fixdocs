"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface Individual {
  id: number
  name: string
  type: "Business Staff" | "Dependent" | "Individual"
  passportExpiry: string
  visaExpiry: string
  visaType: "Visitor VISA" | "House VISA" | "Family VISA" | "Employee VISA" | "Green VISA" | "Golden VISA"
}

const initialIndividuals: Individual[] = [
  {
    id: 1,
    name: "Ramshad Ali",
    type: "Business Staff",
    passportExpiry: "",
    visaExpiry: "",
    visaType: "Employee VISA",
  },
  {
    id: 2,
    name: "Nizam Khazi",
    type: "Business Staff",
    passportExpiry: "17-10-2025",
    visaExpiry: "17-10-2025",
    visaType: "Employee VISA",
  },
  {
    id: 3,
    name: "Sajeer Ahmed",
    type: "Business Staff",
    passportExpiry: "17-10-2025",
    visaExpiry: "17-10-2025",
    visaType: "Employee VISA",
  },
  {
    id: 4,
    name: "Sahil Kareem",
    type: "Business Staff",
    passportExpiry: "17-10-2025",
    visaExpiry: "17-10-2025",
    visaType: "Employee VISA",
  },
  {
    id: 5,
    name: "Fatimah Zuhra",
    type: "Dependent",
    passportExpiry: "17-10-2027",
    visaExpiry: "17-10-2027",
    visaType: "Family VISA",
  },
  {
    id: 6,
    name: "Haris Aboobaker",
    type: "Business Staff",
    passportExpiry: "17-10-2025",
    visaExpiry: "17-10-2025",
    visaType: "Employee VISA",
  },
  {
    id: 7,
    name: "Kabeer Kunnummel",
    type: "Business Staff",
    passportExpiry: "01-02-2025",
    visaExpiry: "01-02-2025",
    visaType: "Employee VISA",
  },
  {
    id: 8,
    name: "Shahana Kabeer",
    type: "Dependent",
    passportExpiry: "23-02-2024",
    visaExpiry: "23-02-2024",
    visaType: "Family VISA",
  },
  {
    id: 9,
    name: "Shabeer Ahamed",
    type: "Individual",
    passportExpiry: "28-08-2025",
    visaExpiry: "28-08-2025",
    visaType: "Golden VISA",
  },
  {
    id: 10,
    name: "Haleema Abu",
    type: "Dependent",
    passportExpiry: "26-08-2024",
    visaExpiry: "26-08-2024",
    visaType: "Family VISA",
  },
  {
    id: 11,
    name: "Kasim Abdullah",
    type: "Business Staff",
    passportExpiry: "22-02-2025",
    visaExpiry: "22-02-2025",
    visaType: "Employee VISA",
  },
  {
    id: 12,
    name: "Hameed Bava",
    type: "Business Staff",
    passportExpiry: "28-02-2025",
    visaExpiry: "28-02-2025",
    visaType: "Employee VISA",
  },
  {
    id: 13,
    name: "Hashim Amla",
    type: "Business Staff",
    passportExpiry: "",
    visaExpiry: "",
    visaType: "Employee VISA",
  },
  {
    id: 14,
    name: "Muhammed Arif",
    type: "Business Staff",
    passportExpiry: "22-02-2025",
    visaExpiry: "22-02-2025",
    visaType: "Employee VISA",
  },
  {
    id: 15,
    name: "Naser Khan",
    type: "Business Staff",
    passportExpiry: "08-02-2025",
    visaExpiry: "08-02-2025",
    visaType: "Employee VISA",
  },
  {
    id: 16,
    name: "Hakeem",
    type: "Business Staff",
    passportExpiry: "14-02-2025",
    visaExpiry: "14-02-2025",
    visaType: "Employee VISA",
  },
  {
    id: 17,
    name: "Shafi Khader",
    type: "Business Staff",
    passportExpiry: "",
    visaExpiry: "",
    visaType: "Employee VISA",
  },
]

export default function IndividualsPage() {
  const [individuals, setIndividuals] = useState<Individual[]>(initialIndividuals)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredIndividuals = individuals.filter((individual) =>
    individual.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddIndividual = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newIndividual: Individual = {
      id: individuals.length + 1,
      name: formData.get("name") as string,
      type: formData.get("type") as Individual["type"],
      passportExpiry: formData.get("passportExpiry") as string,
      visaExpiry: formData.get("visaExpiry") as string,
      visaType: formData.get("visaType") as Individual["visaType"],
    }
    setIndividuals([...individuals, newIndividual])
  }

  const getTypeStyle = (type: Individual["type"]) => {
    switch (type) {
      case "Business Staff":
        return "text-blue-600"
      case "Dependent":
        return "text-purple-600"
      case "Individual":
        return "text-green-600"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:max-w-[520px]">
                <Input
                  placeholder="Search individuals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#0047AB] text-black"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#0047AB] hover:bg-[#0056D4] whitespace-nowrap">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Individual
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Individual</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddIndividual} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        name="type"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="Business Staff">Business Staff</option>
                        <option value="Dependent">Dependent</option>
                        <option value="Individual">Individual</option>
                      </select>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="passportExpiry">Passport Expiry</Label>
                        <Input id="passportExpiry" name="passportExpiry" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visaExpiry">Visa Expiry</Label>
                        <Input id="visaExpiry" name="visaExpiry" type="date" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visaType">Visa Type</Label>
                      <select
                        id="visaType"
                        name="visaType"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="Visitor VISA">Visitor VISA</option>
                        <option value="House VISA">House VISA</option>
                        <option value="Family VISA">Family VISA</option>
                        <option value="Employee VISA">Employee VISA</option>
                        <option value="Green VISA">Green VISA</option>
                        <option value="Golden VISA">Golden VISA</option>
                      </select>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Individual
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-[#0047AB] text-white sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-white h-12">Full Name</TableHead>
                    <TableHead className="text-white h-12">Type</TableHead>
                    <TableHead className="text-white h-12">Passport Expiry</TableHead>
                    <TableHead className="text-white h-12">VISA Expiry</TableHead>
                    <TableHead className="text-white h-12">Visa Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndividuals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No individuals found. Try adjusting your search or add a new individual.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredIndividuals.map((individual, index) => (
                      <TableRow
                        key={individual.id}
                        className={`cursor-pointer hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        onClick={() => router.push(`/individuals/${individual.id}`)}
                      >
                        <TableCell className="font-medium">{individual.name}</TableCell>
                        <TableCell className={getTypeStyle(individual.type)}>{individual.type}</TableCell>
                        <TableCell>{individual.passportExpiry || "—"}</TableCell>
                        <TableCell>{individual.visaExpiry || "—"}</TableCell>
                        <TableCell>{individual.visaType}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
