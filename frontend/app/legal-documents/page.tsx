"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DocumentSection {
  id: string
  title: string
  fields: { id: string; label: string; value: string; type?: string }[]
  isEditing: boolean
}

export default function LegalDocumentsPage() {
  const [sections, setSections] = useState<DocumentSection[]>([
    {
      id: "commercial-license",
      title: "Company Commercial License",
      isEditing: false,
      fields: [
        { id: "licenseNumber", label: "License Number", value: "LN86969690" },
        { id: "dateOfIssue", label: "Date of Issue", value: "2024-02-01", type: "date" },
        { id: "licenseExpiry", label: "License Expiry", value: "2025-04-11", type: "date" },
      ],
    },
    {
      id: "civil-defence",
      title: "Civil Defence Certificate (Matafi Certificate)",
      isEditing: false,
      fields: [
        { id: "certificateId", label: "Certificate ID", value: "CDC1212312" },
        { id: "matafiIssue", label: "Date of Issue", value: "2024-02-01", type: "date" },
        { id: "matafiExpiry", label: "Matafi Expiry", value: "2025-02-28", type: "date" },
      ],
    },
    {
      id: "labor-establishment",
      title: "Labor Establishment Card",
      isEditing: false,
      fields: [
        { id: "cardNumber", label: "Card Number", value: "LEC2142312" },
        { id: "laborIssue", label: "Date of Issue", value: "2024-02-01", type: "date" },
        { id: "laborExpiry", label: "Labor Expiry", value: "2025-02-28", type: "date" },
      ],
    },
    {
      id: "immigration-establishment",
      title: "Immigration Establishment Card",
      isEditing: false,
      fields: [
        { id: "immigrationNumber", label: "Card Number", value: "IEC857847884" },
        { id: "immigrationIssue", label: "Date of Issue", value: "2024-02-01", type: "date" },
        { id: "signatoryAuthority", label: "Signatory Authority", value: "" },
        { id: "immigrationExpiry", label: "Immigration Expiry", value: "2025-03-21", type: "date" },
      ],
    },
    {
      id: "e-channel",
      title: "E Channel",
      isEditing: false,
      fields: [
        { id: "username", label: "Username", value: "" },
        { id: "password", label: "Password", value: "", type: "password" },
        { id: "channelExpiry", label: "E Channel Expiry", value: "", type: "date" },
      ],
    },
  ])

  const [modifiedSections, setModifiedSections] = useState<Set<string>>(new Set())

  const toggleEdit = (sectionId: string) => {
    setSections(
      sections.map((section) => (section.id === sectionId ? { ...section, isEditing: !section.isEditing } : section)),
    )
  }

  const handleInputChange = (sectionId: string, fieldId: string, value: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field) => (field.id === fieldId ? { ...field, value } : field)),
            }
          : section,
      ),
    )
    setModifiedSections((prev) => new Set(prev.add(sectionId)))
  }

  const handleUpdate = () => {
    setSections(sections.map((section) => ({ ...section, isEditing: false })))
    setModifiedSections(new Set())
  }

  return (
    <div className="p-4">
      <Card className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={handleUpdate}
            disabled={modifiedSections.size === 0}
            className="w-24 bg-[#0047AB] text-white hover:bg-[#0056D4] disabled:bg-gray-300 disabled:text-gray-500"
          >
            Update
          </Button>
        </div>
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id} className="w-full border shadow-sm hover:shadow-md my-1">
              <div className="flex items-center justify-between border-b p-4 sm:p-6">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <Button variant="ghost" size="icon" onClick={() => toggleEdit(section.id)} className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="py-4 px-4 sm:py-6 sm:px-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="text-sm font-medium">
                        {field.label}
                      </Label>
                      {section.isEditing ? (
                        <Input
                          id={field.id}
                          type={field.type || "text"}
                          value={field.value}
                          onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
                          className="border-input/50 hover:border-input focus-visible:ring-ring/50 h-9 text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium mt-1">{field.value}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Other Legal Documents section */}
          <Card className="w-full border shadow-sm hover:shadow-md my-1">
            <div className="flex items-center justify-between border-b p-4 sm:p-6">
              <h3 className="text-lg font-medium">Other Legal Documents</h3>
            </div>
            <CardContent className="py-4 px-4 sm:py-6 sm:px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Document ID</TableHead>
                    <TableHead>Date of Issue</TableHead>
                    <TableHead>Date of Expiry</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No Data
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>
  )
}
