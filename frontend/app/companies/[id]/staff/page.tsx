"use client"

import { useState, useMemo } from "react"
import { Edit, UserPlus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface StaffMember {
  id: number
  name: string
  email: string
  phone: string
  passportExpiry: string
  visaExpiry: string
  visaType: string
  workPermitExpiry: string
  emiratesCardExpiry: string
  healthInsuranceExpiry: string
  iloeExpiry: string
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

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0]
}

const generateRandomStaff = (id: number): StaffMember => {
  const passportExpiry = generateRandomDate(new Date(2024, 0, 1), new Date(2026, 11, 31))
  const visaExpiry = generateRandomDate(new Date(2024, 0, 1), new Date(2025, 11, 31))
  const workPermitExpiry = generateRandomDate(new Date(2024, 0, 1), new Date(2025, 11, 31))
  const emiratesCardExpiry = generateRandomDate(new Date(2024, 0, 1), new Date(2025, 11, 31))
  const healthInsuranceExpiry = generateRandomDate(new Date(2024, 0, 1), new Date(2025, 11, 31))
  const iloeExpiry = generateRandomDate(new Date(2024, 0, 1), new Date(2025, 11, 31))

  return {
    id,
    name: `Employee ${id}`,
    email: `employee${id}@example.com`,
    phone: `+971 50 ${Math.floor(1000000 + Math.random() * 9000000)}`,
    passportExpiry,
    visaExpiry,
    visaType: Math.random() > 0.5 ? "Employment" : "Visit",
    workPermitExpiry,
    emiratesCardExpiry,
    healthInsuranceExpiry,
    iloeExpiry,
    details: {
      basic: {
        visaType: Math.random() > 0.5 ? "Employment" : "Visit",
        email: `employee${id}@example.com`,
        phone: `+971 50 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      },
      passport: {
        id: `P${100000 + id}`,
        issueDate: generateRandomDate(new Date(2020, 0, 1), new Date(2023, 11, 31)),
        expiryDate: passportExpiry,
      },
      visa: {
        id: `V${200000 + id}`,
        issueDate: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
        expiryDate: visaExpiry,
      },
      workPermit: {
        id: `W${300000 + id}`,
        issueDate: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
        expiryDate: workPermitExpiry,
      },
      emiratesId: {
        id: `E${400000 + id}`,
        issueDate: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
        expiryDate: emiratesCardExpiry,
      },
      healthInsurance: {
        id: `H${500000 + id}`,
        issueDate: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
        expiryDate: healthInsuranceExpiry,
      },
      iloe: {
        id: `I${600000 + id}`,
        issueDate: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
        expiryDate: iloeExpiry,
      },
    },
  }
}

const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: "Sahil Kareem",
    email: "sahil@example.com",
    phone: "+971 50 1234567",
    passportExpiry: "2024-12-11",
    visaExpiry: "2024-12-11",
    visaType: "Employment",
    workPermitExpiry: "2024-12-11",
    emiratesCardExpiry: "2024-11-30",
    healthInsuranceExpiry: "2024-10-15",
    iloeExpiry: "2024-12-20",
    details: {
      basic: {
        visaType: "Employment",
        email: "sahil@example.com",
        phone: "+971 50 1234567",
      },
      passport: { id: "P123456", issueDate: "2019-12-11", expiryDate: "2024-12-11" },
      visa: { id: "V789012", issueDate: "2023-12-11", expiryDate: "2024-12-11" },
      workPermit: { id: "W345678", issueDate: "2023-12-11", expiryDate: "2024-12-11" },
      emiratesId: { id: "E901234", issueDate: "2023-11-30", expiryDate: "2024-11-30" },
      healthInsurance: { id: "H567890", issueDate: "2023-10-15", expiryDate: "2024-10-15" },
      iloe: { id: "I123456", issueDate: "2023-12-20", expiryDate: "2024-12-20" },
    },
  },
  {
    id: 2,
    name: "Sajeer Ahmed",
    email: "sajeer@example.com",
    phone: "+971 50 2345678",
    passportExpiry: "2025-01-15",
    visaExpiry: "2024-11-20",
    visaType: "Employment",
    workPermitExpiry: "2024-11-20",
    emiratesCardExpiry: "2024-10-25",
    healthInsuranceExpiry: "2024-09-30",
    iloeExpiry: "2024-11-30",
    details: {
      basic: {
        visaType: "Employment",
        email: "sajeer@example.com",
        phone: "+971 50 2345678",
      },
      passport: { id: "P234567", issueDate: "2020-01-15", expiryDate: "2025-01-15" },
      visa: { id: "V890123", issueDate: "2023-11-20", expiryDate: "2024-11-20" },
      workPermit: { id: "W456789", issueDate: "2023-11-20", expiryDate: "2024-11-20" },
      emiratesId: { id: "E012345", issueDate: "2023-10-25", expiryDate: "2024-10-25" },
      healthInsurance: { id: "H678901", issueDate: "2023-09-30", expiryDate: "2024-09-30" },
      iloe: { id: "I234567", issueDate: "2023-11-30", expiryDate: "2024-11-30" },
    },
  },
  {
    id: 3,
    name: "Nizam Khazi",
    email: "nizam@example.com",
    phone: "+971 50 3456789",
    passportExpiry: "2025-02-28",
    visaExpiry: "2024-10-15",
    visaType: "Employment",
    workPermitExpiry: "2024-10-15",
    emiratesCardExpiry: "2024-09-20",
    healthInsuranceExpiry: "2024-08-25",
    iloeExpiry: "2024-10-30",
    details: {
      basic: {
        visaType: "Employment",
        email: "nizam@example.com",
        phone: "+971 50 3456789",
      },
      passport: { id: "P345678", issueDate: "2020-02-28", expiryDate: "2025-02-28" },
      visa: { id: "V901234", issueDate: "2023-10-15", expiryDate: "2024-10-15" },
      workPermit: { id: "W567890", issueDate: "2023-10-15", expiryDate: "2024-10-15" },
      emiratesId: { id: "E123456", issueDate: "2023-09-20", expiryDate: "2024-09-20" },
      healthInsurance: { id: "H789012", issueDate: "2023-08-25", expiryDate: "2024-08-25" },
      iloe: { id: "I345678", issueDate: "2023-10-30", expiryDate: "2024-10-30" },
    },
  },
  {
    id: 4,
    name: "Haseeb Bava",
    email: "employee4@example.com",
    phone: "+971 50 4456789",
    passportExpiry: "2026-03-10",
    visaExpiry: "2025-04-05",
    visaType: "Visit",
    workPermitExpiry: "2025-04-05",
    emiratesCardExpiry: "2025-03-20",
    healthInsuranceExpiry: "2025-02-15",
    iloeExpiry: "2025-03-25",
    details: {
      basic: {
        visaType: "Visit",
        email: "employee4@example.com",
        phone: "+971 50 4456789",
      },
      passport: { id: "P100004", issueDate: "2021-03-10", expiryDate: "2026-03-10" },
      visa: { id: "V200004", issueDate: "2023-04-05", expiryDate: "2025-04-05" },
      workPermit: { id: "W300004", issueDate: "2023-04-05", expiryDate: "2025-04-05" },
      emiratesId: { id: "E400004", issueDate: "2023-03-20", expiryDate: "2025-03-20" },
      healthInsurance: { id: "H500004", issueDate: "2023-02-15", expiryDate: "2025-02-15" },
      iloe: { id: "I600004", issueDate: "2023-03-25", expiryDate: "2025-03-25" },
    },
  },
  {
    id: 5,
    name: "Hamid Ali",
    email: "employee5@example.com",
    phone: "+971 50 5556789",
    passportExpiry: "2025-11-22",
    visaExpiry: "2024-12-01",
    visaType: "Employment",
    workPermitExpiry: "2024-12-01",
    emiratesCardExpiry: "2024-11-15",
    healthInsuranceExpiry: "2024-10-20",
    iloeExpiry: "2024-11-25",
    details: {
      basic: {
        visaType: "Employment",
        email: "employee5@example.com",
        phone: "+971 50 5556789",
      },
      passport: { id: "P100005", issueDate: "2020-11-22", expiryDate: "2025-11-22" },
      visa: { id: "V200005", issueDate: "2023-12-01", expiryDate: "2024-12-01" },
      workPermit: { id: "W300005", issueDate: "2023-12-01", expiryDate: "2024-12-01" },
      emiratesId: { id: "E400005", issueDate: "2023-11-15", expiryDate: "2024-11-15" },
      healthInsurance: { id: "H500005", issueDate: "2023-10-20", expiryDate: "2024-10-20" },
      iloe: { id: "I600005", issueDate: "2023-11-25", expiryDate: "2024-11-25" },
    },
  },
  {
    id: 6,
    name: "Shakir Mukkath",
    email: "employee6@example.com",
    phone: "+971 50 6656789",
    passportExpiry: "2025-07-04",
    visaExpiry: "2025-01-10",
    visaType: "Visit",
    workPermitExpiry: "2025-01-10",
    emiratesCardExpiry: "2024-12-25",
    healthInsuranceExpiry: "2024-11-30",
    iloeExpiry: "2025-01-05",
    details: {
      basic: {
        visaType: "Visit",
        email: "employee6@example.com",
        phone: "+971 50 6656789",
      },
      passport: { id: "P100006", issueDate: "2020-07-04", expiryDate: "2025-07-04" },
      visa: { id: "V200006", issueDate: "2024-01-10", expiryDate: "2025-01-10" },
      workPermit: { id: "W300006", issueDate: "2024-01-10", expiryDate: "2025-01-10" },
      emiratesId: { id: "E400006", issueDate: "2023-12-25", expiryDate: "2024-12-25" },
      healthInsurance: { id: "H500006", issueDate: "2023-11-30", expiryDate: "2024-11-30" },
      iloe: { id: "I600006", issueDate: "2024-01-05", expiryDate: "2025-01-05" },
    },
  },
  {
    id: 7,
    name: "Hamdan Shakir",
    email: "employee7@example.com",
    phone: "+971 50 7756789",
    passportExpiry: "2026-08-15",
    visaExpiry: "2025-02-20",
    visaType: "Employment",
    workPermitExpiry: "2025-02-20",
    emiratesCardExpiry: "2025-02-05",
    healthInsuranceExpiry: "2025-01-10",
    iloeExpiry: "2025-02-15",
    details: {
      basic: {
        visaType: "Employment",
        email: "employee7@example.com",
        phone: "+971 50 7756789",
      },
      passport: { id: "P100007", issueDate: "2021-08-15", expiryDate: "2026-08-15" },
      visa: { id: "V200007", issueDate: "2024-02-20", expiryDate: "2025-02-20" },
      workPermit: { id: "W300007", issueDate: "2024-02-20", expiryDate: "2025-02-20" },
      emiratesId: { id: "E400007", issueDate: "2024-02-05", expiryDate: "2025-02-05" },
      healthInsurance: { id: "H500007", issueDate: "2024-01-10", expiryDate: "2025-01-10" },
      iloe: { id: "I600007", issueDate: "2024-02-15", expiryDate: "2025-02-15" },
    },
  },
  {
    id: 8,
    name: "Safvan Muhammed",
    email: "employee8@example.com",
    phone: "+971 50 8856789",
    passportExpiry: "2024-05-28",
    visaExpiry: "2024-01-01",
    visaType: "Visit",
    workPermitExpiry: "2024-01-01",
    emiratesCardExpiry: "2023-12-15",
    healthInsuranceExpiry: "2023-11-20",
    iloeExpiry: "2024-01-25",
    details: {
      basic: {
        visaType: "Visit",
        email: "employee8@example.com",
        phone: "+971 50 8856789",
      },
      passport: { id: "P100008", issueDate: "2019-05-28", expiryDate: "2024-05-28" },
      visa: { id: "V200008", issueDate: "2023-01-01", expiryDate: "2024-01-01" },
      workPermit: { id: "W300008", issueDate: "2023-01-01", expiryDate: "2024-01-01" },
      emiratesId: { id: "E400008", issueDate: "2022-12-15", expiryDate: "2023-12-15" },
      healthInsurance: { id: "H500008", issueDate: "2022-11-20", expiryDate: "2023-11-20" },
      iloe: { id: "I600008", issueDate: "2023-01-25", expiryDate: "2024-01-25" },
    },
  },
  {
    id: 9,
    name: "Navas Koppam",
    email: "employee9@example.com",
    phone: "+971 50 9956789",
    passportExpiry: "2026-04-10",
    visaExpiry: "2025-03-05",
    visaType: "Employment",
    workPermitExpiry: "2025-03-05",
    emiratesCardExpiry: "2025-02-20",
    healthInsuranceExpiry: "2025-01-25",
    iloeExpiry: "2025-03-01",
    details: {
      basic: {
        visaType: "Employment",
        email: "employee9@example.com",
        phone: "+971 50 9956789",
      },
      passport: { id: "P100009", issueDate: "2021-04-10", expiryDate: "2026-04-10" },
      visa: { id: "V200009", issueDate: "2024-03-05", expiryDate: "2025-03-05" },
      workPermit: { id: "W300009", issueDate: "2024-03-05", expiryDate: "2025-03-05" },
      emiratesId: { id: "E400009", issueDate: "2024-02-20", expiryDate: "2025-02-20" },
      healthInsurance: { id: "H500009", issueDate: "2024-01-25", expiryDate: "2025-01-25" },
      iloe: { id: "I600009", issueDate: "2024-03-01", expiryDate: "2025-03-01" },
    },
  },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
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
    if (selectedStaff) {
      const updatedStaff = { ...selectedStaff }
      updatedStaff.details[cardType as keyof typeof updatedStaff.details][
        field as keyof (typeof updatedStaff.details)[typeof cardType]
      ] = value
      setSelectedStaff(updatedStaff)
      setIsDataModified(true)
    }
  }

  const handleUpdate = () => {
    if (selectedStaff) {
      setStaff(staff.map((s) => (s.id === selectedStaff.id ? selectedStaff : s)))
      setEditingCards(new Set())
      setIsDataModified(false)
      closeSlideBar()
    }
  }

  const closeSlideBar = () => {
    setSelectedStaff(null)
    setEditingCards(new Set())
    setIsDataModified(false)
    setSelectedRowId(null)
  }

  const addStaffMember = (formData: FormData) => {
    const newStaff: StaffMember = {
      id: staff.length + 1,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      passportExpiry: formData.get("passportExpiry") as string,
      visaExpiry: formData.get("visaExpiry") as string,
      visaType: "Employment",
      workPermitExpiry: formData.get("workPermitExpiry") as string,
      emiratesCardExpiry: formData.get("emiratesCardExpiry") as string,
      healthInsuranceExpiry: formData.get("healthInsuranceExpiry") as string,
      iloeExpiry: formData.get("iloeExpiry") as string,
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
    setStaff((prev) => [...prev, newStaff])
  }

  const sortedStaff = useMemo(() => {
    return staff
  }, [staff])

  const filteredStaff = useMemo(() => {
    return sortedStaff.filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [sortedStaff, searchQuery])

  return (
    <Card className="w-full bg-white rounded-md shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#0047AB] text-black"
              />
            </div>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#0047AB] hover:bg-[#0047AB]/90">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                  </DialogHeader>
                  <form action={addStaffMember} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Staff Name</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Staff Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Staff Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
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
                    <Button type="submit" className="w-full">
                      Add Staff Member
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="w-full h-[calc(100vh-16rem)] overflow-hidden flex flex-col">
          <div className="flex-grow overflow-auto">
            <Table>
              <TableHeader className="bg-[#0047AB] text-white sticky top-0 z-10">
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
                {filteredStaff.map((member, index) => (
                  <TableRow
                    key={member.id}
                    onClick={() => {
                      setSelectedStaff(member)
                      setSelectedRowId(member.id)
                    }}
                    className={cn(
                      "cursor-pointer",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      selectedRowId === member.id && "bg-blue-100 hover:bg-blue-200",
                    )}
                  >
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.visaType}</TableCell>
                    <TableCell>{formatDate(member.passportExpiry)}</TableCell>
                    <TableCell>{formatDate(member.visaExpiry)}</TableCell>
                    <TableCell>{formatDate(member.workPermitExpiry)}</TableCell>
                    <TableCell>{formatDate(member.emiratesCardExpiry)}</TableCell>
                    <TableCell>{formatDate(member.healthInsuranceExpiry)}</TableCell>
                    <TableCell>{formatDate(member.iloeExpiry)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 border-t pt-4 flex items-center justify-between px-1 text-sm text-muted-foreground">
          <div>
            Showing {filteredStaff.length} of {staff.length} staff members
          </div>
        </div>
      </CardContent>

      <Sheet open={!!selectedStaff} onOpenChange={closeSlideBar}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">{selectedStaff?.name}</h2>
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
                {selectedStaff &&
                  [
                    {
                      title: "Personal details",
                      type: "basic",
                      data: selectedStaff.details.basic,
                      isBasic: true,
                    },
                    { title: "Passport", type: "passport", data: selectedStaff.details.passport },
                    { title: "Visa", type: "visa", data: selectedStaff.details.visa },
                    { title: "Work Permit", type: "workPermit", data: selectedStaff.details.workPermit },
                    { title: "Emirates ID", type: "emiratesId", data: selectedStaff.details.emiratesId },
                    { title: "Health Insurance", type: "healthInsurance", data: selectedStaff.details.healthInsurance },
                    { title: "ILOE", type: "iloe", data: selectedStaff.details.iloe },
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
            <div className="p-4 flex justify-end">
              <a href="#" className="text-sm text-[#0047AB] hover:underline" onClick={(e) => e.preventDefault()}>
                View more details
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  )
}
