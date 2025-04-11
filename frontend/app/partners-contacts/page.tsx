"use client"

import type React from "react"

import { useState } from "react"
import { UserPlus, Edit, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface Partner {
  id: number
  name: string
  visaType: string
  passport: string
  visa: string
  workPermit: string
  emiratesCard: string
  healthInsurance: string
  iloe: string
  details: {
    basic: { visaType: string; email: string; phone: string }
    passport: { id: string; issueDate: string; expiryDate: string }
    visa: { id: string; issueDate: string; expiryDate: string }
    workPermit: { id: string; issueDate: string; expiryDate: string }
    emiratesId: { id: string; issueDate: string; expiryDate: string }
    healthInsurance: { id: string; issueDate: string; expiryDate: string }
    iloe: { id: string; issueDate: string; expiryDate: string }
  }
}

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  isPrimary: boolean
}

const initialPartners: Partner[] = [
  {
    id: 1,
    name: "Sahil Kareem",
    visaType: "Employment",
    passport: "10/12/2024",
    visa: "10/12/2024",
    workPermit: "10/12/2024",
    emiratesCard: "29/11/2024",
    healthInsurance: "14/10/2024",
    iloe: "19/12/2024",
    details: {
      basic: {
        visaType: "Employment",
        email: "sahil@example.com",
        phone: "+971 50 1234567",
      },
      passport: { id: "P123456", issueDate: "2019-12-11", expiryDate: "2024-12-10" },
      visa: { id: "V789012", issueDate: "2023-12-11", expiryDate: "2024-12-10" },
      workPermit: { id: "W345678", issueDate: "2023-12-11", expiryDate: "2024-12-10" },
      emiratesId: { id: "E901234", issueDate: "2023-11-30", expiryDate: "2024-11-29" },
      healthInsurance: { id: "H567890", issueDate: "2023-10-15", expiryDate: "2024-10-14" },
      iloe: { id: "I123456", issueDate: "2023-12-20", expiryDate: "2024-12-19" },
    },
  },
  {
    id: 2,
    name: "Sajeer Ahmed",
    visaType: "Employment",
    passport: "14/01/2025",
    visa: "19/11/2024",
    workPermit: "19/11/2024",
    emiratesCard: "24/10/2024",
    healthInsurance: "29/09/2024",
    iloe: "29/11/2024",
    details: {
      basic: {
        visaType: "Employment",
        email: "sajeer@example.com",
        phone: "+971 50 2345678",
      },
      passport: { id: "P234567", issueDate: "2020-01-15", expiryDate: "2025-01-14" },
      visa: { id: "V890123", issueDate: "2023-11-20", expiryDate: "2024-11-19" },
      workPermit: { id: "W456789", issueDate: "2023-11-20", expiryDate: "2024-11-19" },
      emiratesId: { id: "E012345", issueDate: "2023-10-25", expiryDate: "2024-10-24" },
      healthInsurance: { id: "H678901", issueDate: "2023-09-30", expiryDate: "2024-09-29" },
      iloe: { id: "I234567", issueDate: "2023-11-30", expiryDate: "2024-11-29" },
    },
  },
]

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "Azeef Hussain",
    email: "Azeef@sahiltravels.uk",
    phone: "9252979517",
    isPrimary: true,
  },
  {
    id: 2,
    name: "IjazHussain",
    email: "Ijaz@sahiltravels.uk",
    phone: "9252979518",
    isPrimary: false,
  },
]

export default function PartnersContactsPage() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [editingCards, setEditingCards] = useState<Set<string>>(new Set())
  const [isDataModified, setIsDataModified] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isContactDataModified, setIsContactDataModified] = useState(false)

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
    if (selectedPartner) {
      const updatedPartner = { ...selectedPartner }
      updatedPartner.details[cardType as keyof typeof updatedPartner.details][
        field as keyof (typeof updatedPartner.details)[typeof cardType]
      ] = value
      setSelectedPartner(updatedPartner)
      setIsDataModified(true)
    }
  }

  const handleUpdate = () => {
    if (selectedPartner) {
      setPartners(partners.map((p) => (p.id === selectedPartner.id ? selectedPartner : p)))
      setEditingCards(new Set())
      setIsDataModified(false)
      closeSlideBar()
    }
  }

  const closeSlideBar = () => {
    setSelectedPartner(null)
    setEditingCards(new Set())
    setIsDataModified(false)
    setSelectedRowId(null)
  }

  const addPartner = (formData: FormData) => {
    const newPartner: Partner = {
      id: partners.length + 1,
      name: formData.get("name") as string,
      visaType: "Employment",
      passport: formData.get("passportExpiry") as string,
      visa: formData.get("visaExpiry") as string,
      workPermit: formData.get("workPermitExpiry") as string,
      emiratesCard: formData.get("emiratesCardExpiry") as string,
      healthInsurance: formData.get("healthInsuranceExpiry") as string,
      iloe: formData.get("iloeExpiry") as string,
      details: {
        basic: {
          visaType: "Employment",
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
        },
        passport: {
          id: "P" + Math.random().toString().slice(2, 8),
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: formData.get("passportExpiry") as string,
        },
        visa: {
          id: "V" + Math.random().toString().slice(2, 8),
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: formData.get("visaExpiry") as string,
        },
        workPermit: {
          id: "W" + Math.random().toString().slice(2, 8),
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: formData.get("workPermitExpiry") as string,
        },
        emiratesId: {
          id: "E" + Math.random().toString().slice(2, 8),
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: formData.get("emiratesCardExpiry") as string,
        },
        healthInsurance: {
          id: "H" + Math.random().toString().slice(2, 8),
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: formData.get("healthInsuranceExpiry") as string,
        },
        iloe: {
          id: "I" + Math.random().toString().slice(2, 8),
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: formData.get("iloeExpiry") as string,
        },
      },
    }
    setPartners((prev) => [...prev, newPartner])
  }

  const handleContactUpdate = () => {
    if (selectedContact) {
      setContacts(contacts.map((contact) => (contact.id === selectedContact.id ? selectedContact : contact)))
      setIsContactDataModified(false)
      setSelectedContact(null)
    }
  }

  const handleAddContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newContact: Contact = {
      id: contacts.length + 1,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      isPrimary: formData.get("isPrimary") === "on",
    }
    setContacts([...contacts, newContact])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Partners</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#0047AB] hover:bg-[#0056D4]">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
            </DialogHeader>
            <form action={addPartner} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Partner Name</Label>
                  <Input
                    id="name"
                    name="name"
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
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="passportExpiry">Passport Expiry</Label>
                    <Input
                      id="passportExpiry"
                      name="passportExpiry"
                      type="date"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visaExpiry">Visa Expiry</Label>
                    <Input
                      id="visaExpiry"
                      name="visaExpiry"
                      type="date"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="workPermitExpiry">Work Permit Expiry</Label>
                    <Input
                      id="workPermitExpiry"
                      name="workPermitExpiry"
                      type="date"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emiratesCardExpiry">Emirates Card Expiry</Label>
                    <Input
                      id="emiratesCardExpiry"
                      name="emiratesCardExpiry"
                      type="date"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="healthInsuranceExpiry">Health Insurance Expiry</Label>
                    <Input
                      id="healthInsuranceExpiry"
                      name="healthInsuranceExpiry"
                      type="date"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iloeExpiry">ILOE Expiry</Label>
                    <Input
                      id="iloeExpiry"
                      name="iloeExpiry"
                      type="date"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Partner
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#0047AB] text-white">
              <TableRow>
                <TableHead className="text-white h-12">Name</TableHead>
                <TableHead className="text-white h-12">VISA Type</TableHead>
                <TableHead className="text-white h-12">Passport</TableHead>
                <TableHead className="text-white h-12">Visa</TableHead>
                <TableHead className="text-white h-12">Work Permit</TableHead>
                <TableHead className="text-white h-12">Emirates Card</TableHead>
                <TableHead className="text-white h-12">Health Insurance</TableHead>
                <TableHead className="text-white h-12">ILOE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner, index) => (
                <TableRow
                  key={partner.id}
                  onClick={() => {
                    setSelectedPartner(partner)
                    setSelectedRowId(partner.id)
                  }}
                  className={cn(
                    "cursor-pointer",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50",
                    selectedRowId === partner.id && "bg-blue-100 hover:bg-blue-200",
                  )}
                >
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.visaType}</TableCell>
                  <TableCell>{partner.passport}</TableCell>
                  <TableCell>{partner.visa}</TableCell>
                  <TableCell>{partner.workPermit}</TableCell>
                  <TableCell>{partner.emiratesCard}</TableCell>
                  <TableCell>{partner.healthInsurance}</TableCell>
                  <TableCell>{partner.iloe}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Contacts</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#0047AB] hover:bg-[#0056D4]">
              <Phone className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isPrimary" name="isPrimary" />
                <Label htmlFor="isPrimary">Is Primary</Label>
              </div>
              <Button type="submit" className="w-full">
                Add Contact
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="w-full shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#0047AB] text-white">
              <TableRow>
                <TableHead className="text-white h-12">Full Name</TableHead>
                <TableHead className="text-white h-12">Email</TableHead>
                <TableHead className="text-white h-12">Phone</TableHead>
                <TableHead className="text-white h-12">Is Primary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    "cursor-pointer",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50",
                    selectedContact?.id === contact.id && "bg-blue-100 hover:bg-blue-200",
                  )}
                >
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    <Checkbox checked={contact.isPrimary} disabled className="checkbox" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedPartner} onOpenChange={closeSlideBar}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">{selectedPartner?.name}</h2>
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
                {selectedPartner &&
                  [
                    {
                      title: "Personal details",
                      type: "basic",
                      data: selectedPartner.details.basic,
                      isBasic: true,
                    },
                    { title: "Passport", type: "passport", data: selectedPartner.details.passport },
                    { title: "Visa", type: "visa", data: selectedPartner.details.visa },
                    { title: "Work Permit", type: "workPermit", data: selectedPartner.details.workPermit },
                    { title: "Emirates ID", type: "emiratesId", data: selectedPartner.details.emiratesId },
                    {
                      title: "Health Insurance",
                      type: "healthInsurance",
                      data: selectedPartner.details.healthInsurance,
                    },
                    { title: "ILOE", type: "iloe", data: selectedPartner.details.iloe },
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
                                    {key.includes("Date")
                                      ? new Date(value).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })
                                      : value}
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
      <Sheet open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Contact Details</h2>
              <Button
                variant="outline"
                onClick={handleContactUpdate}
                disabled={!isContactDataModified}
                className="w-24 bg-[#0047AB] text-white hover:bg-[#0056D4] disabled:bg-gray-300 disabled:text-gray-500"
              >
                Update
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6 p-4 sm:p-6">
                {selectedContact && (
                  <Card className="w-full shadow-sm">
                    <div className="flex items-center justify-between border-b p-3 sm:p-4">
                      <h3 className="text-base font-medium">Contact Information</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsContactDataModified(true)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="py-3 px-3 sm:py-4 sm:px-4">
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(selectedContact).map(
                          ([key, value]) =>
                            key !== "id" && (
                              <div key={key}>
                                <Label className="text-xs text-muted-foreground">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Label>
                                {key === "isPrimary" ? (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Checkbox
                                      checked={value as boolean}
                                      onCheckedChange={(checked) => {
                                        setSelectedContact({ ...selectedContact, [key]: checked })
                                        setIsContactDataModified(true)
                                      }}
                                      className="checkbox"
                                    />
                                    <Label>Is Primary</Label>
                                  </div>
                                ) : (
                                  <Input
                                    value={value as string}
                                    onChange={(e) => {
                                      setSelectedContact({ ...selectedContact, [key]: e.target.value })
                                      setIsContactDataModified(true)
                                    }}
                                    className="mt-1 h-7 text-sm"
                                  />
                                )}
                              </div>
                            ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
