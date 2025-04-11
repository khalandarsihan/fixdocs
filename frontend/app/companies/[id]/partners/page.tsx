"use client"

import { useState, useMemo } from "react"
import { Edit, UserPlus, Search, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Partner {
  id: number
  name: string
  type: string
  email: string
  phone: string
  company?: string
  position?: string
  contactSince?: string
}

const initialPartners: Partner[] = [
  {
    id: 1,
    name: "Ahmed Al Mansouri",
    type: "Partner",
    email: "ahmed@example.com",
    phone: "+971 50 123 4567",
    company: "Al Mansouri Trading LLC",
    position: "CEO",
    contactSince: "2020-05-15",
  },
  {
    id: 2,
    name: "Fatima Al Hashemi",
    type: "Contact",
    email: "fatima@example.com",
    phone: "+971 50 234 5678",
    company: "Hashemi Enterprises",
    position: "Marketing Director",
    contactSince: "2021-03-22",
  },
  {
    id: 3,
    name: "Mohammed Al Zaabi",
    type: "Partner",
    email: "mohammed@example.com",
    phone: "+971 50 345 6789",
    company: "Zaabi Group",
    position: "Managing Director",
    contactSince: "2019-11-10",
  },
  {
    id: 4,
    name: "Layla Al Qasimi",
    type: "Contact",
    email: "layla@example.com",
    phone: "+971 50 456 7890",
    company: "Qasimi Consultants",
    position: "Senior Consultant",
    contactSince: "2022-01-05",
  },
  {
    id: 5,
    name: "Khalid Al Suwaidi",
    type: "Partner",
    email: "khalid@example.com",
    phone: "+971 50 567 8901",
    company: "Suwaidi Investments",
    position: "Investment Manager",
    contactSince: "2020-08-30",
  },
]

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
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
    if (selectedPartner) {
      setPartners(partners.map((p) => (p.id === selectedPartner.id ? selectedPartner : p)))
      setIsEditing(false)
    }
  }

  const addPartner = (formData: FormData) => {
    const newPartner: Partner = {
      id: partners.length + 1,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      contactSince: formData.get("contactSince") as string,
    }
    setPartners([...partners, newPartner])
  }

  const filteredPartners = useMemo(() => {
    return partners.filter(
      (partner) =>
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [partners, searchQuery])

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Partners & Contacts Management</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
              <Input
                placeholder="Search partners & contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#0047AB] text-black"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#0047AB] hover:bg-[#0047AB]/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Partner/Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Partner/Contact</DialogTitle>
                </DialogHeader>
                <form action={addPartner} className="space-y-4">
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
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      name="type"
                      required
                      placeholder="Partner or Contact"
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        required
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactSince">Contact Since</Label>
                      <Input
                        id="contactSince"
                        name="contactSince"
                        type="date"
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Partner/Contact
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="w-full h-[calc(100vh-16rem)] overflow-hidden flex flex-col">
          <div className="flex-grow overflow-auto">
            <Table>
              <TableHeader className="bg-[#0047AB] text-white sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-white h-12">Name</TableHead>
                  <TableHead className="text-white h-12">Type</TableHead>
                  <TableHead className="text-white h-12">Email</TableHead>
                  <TableHead className="text-white h-12">Phone</TableHead>
                  <TableHead className="text-white h-12">Company</TableHead>
                  <TableHead className="text-white h-12">Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner, index) => (
                  <TableRow
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className={cn(
                      "cursor-pointer",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      selectedPartner?.id === partner.id && "bg-blue-100 hover:bg-blue-200",
                    )}
                  >
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.type}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>{partner.phone}</TableCell>
                    <TableCell>{partner.company || "N/A"}</TableCell>
                    <TableCell>{partner.position || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 border-t pt-4 flex items-center justify-between px-1 text-sm text-muted-foreground">
            <div>
              Showing {filteredPartners.length} of {partners.length} partners & contacts
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
        </div>
      </CardContent>

      <Sheet open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Partner/Contact Details</SheetTitle>
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
              {selectedPartner && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Name</Label>
                        <div className="text-sm font-medium">{selectedPartner.name}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Type</Label>
                        <div className="text-sm font-medium">{selectedPartner.type}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <div className="text-sm font-medium">{selectedPartner.email}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Phone</Label>
                          <div className="text-sm font-medium">{selectedPartner.phone}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Company Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Company</Label>
                          <div className="text-sm font-medium">{selectedPartner.company || "N/A"}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Position</Label>
                          <div className="text-sm font-medium">{selectedPartner.position || "N/A"}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Contact Since</Label>
                          <div className="text-sm font-medium">
                            {selectedPartner.contactSince ? formatDate(selectedPartner.contactSince) : "N/A"}
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
                href={`/companies/partners/${selectedPartner?.id}`}
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
