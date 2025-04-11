"use client"

import type React from "react"

import { useState } from "react"
import { Edit, Building, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface BankAccount {
  id: number
  bankName: string
  accountNumber: string
  ibanCertificate: string
  details: {
    basic: {
      bankName: string
      accountNumber: string
      ibanCertificate: string
    }
    additional: {
      swiftCode: string
      branchName: string
      accountType: string
    }
  }
}

interface Credential {
  id: number
  url: string
  username: string
  password: string
  remarks?: string
}

const initialBankAccounts: BankAccount[] = [
  {
    id: 1,
    bankName: "ADCB",
    accountNumber: "1234567890",
    ibanCertificate: "AE0703312345",
    details: {
      basic: {
        bankName: "ADCB",
        accountNumber: "1234567890",
        ibanCertificate: "AE0703312345",
      },
      additional: {
        swiftCode: "ADCBAEAA",
        branchName: "Dubai Main Branch",
        accountType: "Current Account",
      },
    },
  },
  {
    id: 2,
    bankName: "Emirates NBD",
    accountNumber: "7890123456",
    ibanCertificate: "AE0703312232",
    details: {
      basic: {
        bankName: "Emirates NBD",
        accountNumber: "7890123456",
        ibanCertificate: "AE0703312232",
      },
      additional: {
        swiftCode: "EBILAEAD",
        branchName: "Jumeirah Branch",
        accountType: "Business Account",
      },
    },
  },
]

const initialCredentials: Credential[] = [
  {
    id: 1,
    url: "https://mohap.gov.ae/en/home",
    username: "Sahiltravelsdxb",
    password: "Admin123",
    remarks: "",
  },
]

export default function BankAccountsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts)
  const [credentials, setCredentials] = useState<Credential[]>(initialCredentials)
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [editingCards, setEditingCards] = useState<Set<string>>(new Set())
  const [isDataModified, setIsDataModified] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null)
  const [isCredentialDataModified, setIsCredentialDataModified] = useState(false)

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
    if (selectedAccount) {
      const updatedAccount = { ...selectedAccount }
      updatedAccount.details[cardType as keyof typeof updatedAccount.details][
        field as keyof (typeof updatedAccount.details)[typeof cardType]
      ] = value
      setSelectedAccount(updatedAccount)
      setIsDataModified(true)
    }
  }

  const handleUpdate = () => {
    if (selectedAccount) {
      setBankAccounts(bankAccounts.map((acc) => (acc.id === selectedAccount.id ? selectedAccount : acc)))
      setEditingCards(new Set())
      setIsDataModified(false)
      closeSlideBar()
    }
  }

  const closeSlideBar = () => {
    setSelectedAccount(null)
    setEditingCards(new Set())
    setIsDataModified(false)
    setSelectedRowId(null)
  }

  const addBankAccount = (formData: FormData) => {
    const newAccount: BankAccount = {
      id: bankAccounts.length + 1,
      bankName: formData.get("bankName") as string,
      accountNumber: formData.get("accountNumber") as string,
      ibanCertificate: formData.get("ibanCertificate") as string,
      details: {
        basic: {
          bankName: formData.get("bankName") as string,
          accountNumber: formData.get("accountNumber") as string,
          ibanCertificate: formData.get("ibanCertificate") as string,
        },
        additional: {
          swiftCode: formData.get("swiftCode") as string,
          branchName: formData.get("branchName") as string,
          accountType: formData.get("accountType") as string,
        },
      },
    }
    setBankAccounts((prev) => [...prev, newAccount])
  }

  const handleCredentialUpdate = () => {
    if (selectedCredential) {
      setCredentials(credentials.map((cred) => (cred.id === selectedCredential.id ? selectedCredential : cred)))
      setIsCredentialDataModified(false)
      setSelectedCredential(null)
    }
  }

  const handleAddCredentials = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newCredential: Credential = {
      id: credentials.length + 1,
      url: formData.get("url") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      remarks: (formData.get("remarks") as string) || "",
    }
    setCredentials([...credentials, newCredential])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Bank Accounts</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#0047AB] hover:bg-[#0056D4]">
              <Building className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bank Account</DialogTitle>
            </DialogHeader>
            <form action={addBankAccount} className="space-y-4">
              <div className="grid gap-4">
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
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ibanCertificate">IBAN Certificate</Label>
                  <Input
                    id="ibanCertificate"
                    name="ibanCertificate"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">Swift Code</Label>
                  <Input
                    id="swiftCode"
                    name="swiftCode"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input
                    id="branchName"
                    name="branchName"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Input
                    id="accountType"
                    name="accountType"
                    required
                    className="border-input/50 hover:border-input focus-visible:ring-ring/50"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Bank Account
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
                <TableHead className="text-white h-12">Bank Name</TableHead>
                <TableHead className="text-white h-12">Account Number</TableHead>
                <TableHead className="text-white h-12">IBAN Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankAccounts.map((account, index) => (
                <TableRow
                  key={account.id}
                  onClick={() => {
                    setSelectedAccount(account)
                    setSelectedRowId(account.id)
                  }}
                  className={cn(
                    "cursor-pointer",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50",
                    selectedRowId === account.id && "bg-blue-100 hover:bg-blue-200",
                  )}
                >
                  <TableCell className="font-medium">{account.bankName}</TableCell>
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell>{account.ibanCertificate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Credentials</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#0047AB] hover:bg-[#0056D4]">
              <Key className="h-4 w-4 mr-2" />
              Add Credentials
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Credentials</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCredentials} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input id="remarks" name="remarks" />
              </div>
              <Button type="submit" className="w-full">
                Add Credentials
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
                <TableHead className="text-white h-12">URL</TableHead>
                <TableHead className="text-white h-12">Username</TableHead>
                <TableHead className="text-white h-12">Password</TableHead>
                <TableHead className="text-white h-12">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credentials.map((credential, index) => (
                <TableRow
                  key={credential.id}
                  onClick={() => setSelectedCredential(credential)}
                  className={cn(
                    "cursor-pointer",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50",
                    selectedCredential?.id === credential.id && "bg-blue-100 hover:bg-blue-200",
                  )}
                >
                  <TableCell className="font-medium">{credential.url}</TableCell>
                  <TableCell>{credential.username}</TableCell>
                  <TableCell>{credential.password}</TableCell>
                  <TableCell>{credential.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedAccount} onOpenChange={closeSlideBar}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Bank Account Details</h2>
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
                {selectedAccount &&
                  [
                    {
                      title: "Basic Information",
                      type: "basic",
                      data: selectedAccount.details.basic,
                    },
                    {
                      title: "Additional Information",
                      type: "additional",
                      data: selectedAccount.details.additional,
                    },
                  ].map(({ title, type, data }) => (
                    <Card key={type} className="w-full shadow-sm">
                      <div className="flex items-center justify-between border-b p-3 sm:p-4">
                        <h3 className="text-base font-medium">{title}</h3>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit(type)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="py-3 px-3 sm:py-4 sm:px-4">
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(data).map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-xs text-muted-foreground">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
                                  .split(" ")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </Label>
                              {editingCards.has(type) ? (
                                <Input
                                  value={value}
                                  onChange={(e) => handleInputChange(type, key, e.target.value)}
                                  className="mt-1 h-7 text-sm"
                                />
                              ) : (
                                <div className="text-sm font-medium mt-1">{value}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={!!selectedCredential} onOpenChange={() => setSelectedCredential(null)}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white overflow-y-auto pt-14"
          side="right"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Credential Details</h2>
              <Button
                variant="outline"
                onClick={handleCredentialUpdate}
                disabled={!isCredentialDataModified}
                className="w-24 bg-[#0047AB] text-white hover:bg-[#0056D4] disabled:bg-gray-300 disabled:text-gray-500"
              >
                Update
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-6 p-4 sm:p-6">
                {selectedCredential && (
                  <Card className="w-full shadow-sm">
                    <div className="flex items-center justify-between border-b p-3 sm:p-4">
                      <h3 className="text-base font-medium">Credential Information</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCredentialDataModified(true)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="py-3 px-3 sm:py-4 sm:px-4">
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(selectedCredential).map(
                          ([key, value]) =>
                            key !== "id" && (
                              <div key={key}>
                                <Label className="text-xs text-muted-foreground">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Label>
                                <Input
                                  value={value}
                                  onChange={(e) => {
                                    setSelectedCredential({ ...selectedCredential, [key]: e.target.value })
                                    setIsCredentialDataModified(true)
                                  }}
                                  className="mt-1 h-7 text-sm"
                                  type={key === "password" ? "password" : "text"}
                                />
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
