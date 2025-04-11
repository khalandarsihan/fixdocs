"use client"

import { useState, useMemo } from "react"
import { Edit, CreditCard, Search, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BankAccount {
  id: number
  accountName: string
  accountNumber: string
  bankName: string
  iban: string
  swiftCode: string
  currency: string
  branch?: string
  openDate?: string
}

const initialBankAccounts: BankAccount[] = [
  {
    id: 1,
    accountName: "Sahil Travels - Main Account",
    accountNumber: "1234567890",
    bankName: "Emirates NBD",
    iban: "AE123456789012345678901",
    swiftCode: "EBILAEAD",
    currency: "AED",
    branch: "Dubai Main Branch",
    openDate: "2020-05-15",
  },
  {
    id: 2,
    accountName: "Sahil Travels - USD Account",
    accountNumber: "0987654321",
    bankName: "Emirates NBD",
    iban: "AE098765432109876543210",
    swiftCode: "EBILAEAD",
    currency: "USD",
    branch: "Dubai Main Branch",
    openDate: "2021-03-22",
  },
  {
    id: 3,
    accountName: "Sahil Travels - Operations",
    accountNumber: "5678901234",
    bankName: "Abu Dhabi Commercial Bank",
    iban: "AE567890123456789012345",
    swiftCode: "ADCBAEAA",
    currency: "AED",
    branch: "Abu Dhabi Main Branch",
    openDate: "2019-11-10",
  },
  {
    id: 4,
    accountName: "Sahil Travels - Payroll",
    accountNumber: "4321098765",
    bankName: "Dubai Islamic Bank",
    iban: "AE432109876543210987654",
    swiftCode: "DUIBAEAD",
    currency: "AED",
    branch: "Dubai Silicon Oasis Branch",
    openDate: "2022-01-05",
  },
]

export default function BankAccountsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts)
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
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
    if (selectedAccount) {
      setBankAccounts(bankAccounts.map((a) => (a.id === selectedAccount.id ? selectedAccount : a)))
      setIsEditing(false)
    }
  }

  const addBankAccount = (formData: FormData) => {
    const newAccount: BankAccount = {
      id: bankAccounts.length + 1,
      accountName: formData.get("accountName") as string,
      accountNumber: formData.get("accountNumber") as string,
      bankName: formData.get("bankName") as string,
      iban: formData.get("iban") as string,
      swiftCode: formData.get("swiftCode") as string,
      currency: formData.get("currency") as string,
      branch: formData.get("branch") as string,
      openDate: formData.get("openDate") as string,
    }
    setBankAccounts([...bankAccounts, newAccount])
  }

  const filteredAccounts = useMemo(() => {
    return bankAccounts.filter(
      (account) =>
        account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.bankName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [bankAccounts, searchQuery])

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Bank Accounts Management</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
              <Input
                placeholder="Search bank accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#0047AB] text-black"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#0047AB] hover:bg-[#0047AB]/90">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Bank Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Bank Account</DialogTitle>
                </DialogHeader>
                <form action={addBankAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      name="accountName"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        required
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Input
                        id="branch"
                        name="branch"
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input
                      id="iban"
                      name="iban"
                      required
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="swiftCode">SWIFT Code</Label>
                      <Input
                        id="swiftCode"
                        name="swiftCode"
                        required
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        name="currency"
                        required
                        className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openDate">Account Opening Date</Label>
                    <Input
                      id="openDate"
                      name="openDate"
                      type="date"
                      className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Add Bank Account
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
                  <TableHead className="text-white h-12">Account Name</TableHead>
                  <TableHead className="text-white h-12">Account Number</TableHead>
                  <TableHead className="text-white h-12">Bank Name</TableHead>
                  <TableHead className="text-white h-12">IBAN</TableHead>
                  <TableHead className="text-white h-12">Currency</TableHead>
                  <TableHead className="text-white h-12">Branch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account, index) => (
                  <TableRow
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className={cn(
                      "cursor-pointer",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50",
                      selectedAccount?.id === account.id && "bg-blue-100 hover:bg-blue-200",
                    )}
                  >
                    <TableCell className="font-medium">{account.accountName}</TableCell>
                    <TableCell>{account.accountNumber}</TableCell>
                    <TableCell>{account.bankName}</TableCell>
                    <TableCell>{account.iban}</TableCell>
                    <TableCell>{account.currency}</TableCell>
                    <TableCell>{account.branch || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 border-t pt-4 flex items-center justify-between px-1 text-sm text-muted-foreground">
          <div>
            Showing {filteredAccounts.length} of {bankAccounts.length} bank accounts
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

      <Sheet open={!!selectedAccount} onOpenChange={(open) => !open && setSelectedAccount(null)}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Bank Account Details</SheetTitle>
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
              {selectedAccount && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Account Name</Label>
                        <div className="text-sm font-medium">{selectedAccount.accountName}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Account Number</Label>
                        <div className="text-sm font-medium">{selectedAccount.accountNumber}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Bank Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Bank Name</Label>
                          <div className="text-sm font-medium">{selectedAccount.bankName}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Branch</Label>
                          <div className="text-sm font-medium">{selectedAccount.branch || "N/A"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Account Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">IBAN</Label>
                          <div className="text-sm font-medium">{selectedAccount.iban}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">SWIFT Code</Label>
                          <div className="text-sm font-medium">{selectedAccount.swiftCode}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Currency</Label>
                          <div className="text-sm font-medium">{selectedAccount.currency}</div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Opening Date</Label>
                          <div className="text-sm font-medium">
                            {selectedAccount.openDate ? formatDate(selectedAccount.openDate) : "N/A"}
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
                href={`/companies/bank-accounts/${selectedAccount?.id}`}
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
