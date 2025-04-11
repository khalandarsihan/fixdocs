"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { companyService, Company, CompanyInput } from "@/services/api";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch companies when component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Function to fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyService.getCompanies();
      console.log("Fetched companies:", data);
      setCompanies(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to load companies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCompany = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      
      // Format dates for the API
      const newCompany: CompanyInput = {
        name: formData.get("name") as string,
        licenseExpiry: formData.get("licenseExpiry") as string,
        matafiExpiry: formData.get("matafiExpiry") as string,
        laborExpiry: formData.get("laborExpiry") as string,
        immigrationExpiry: formData.get("immigrationExpiry") as string,
        eChannelExpiry: formData.get("eChannelExpiry") as string,
      };
      
      const result = await companyService.addCompany(newCompany);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        setOpen(false);
        // Refresh the company list
        fetchCompanies();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding company:", error);
      toast({
        title: "Error",
        description: "Failed to add company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:max-w-[520px]">
              <Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#0047AB] text-black"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#0047AB]" />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0047AB] hover:bg-[#0056D4] whitespace-nowrap">
                  <Building2 className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCompany} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="licenseExpiry">License Expiry</Label>
                      <Input id="licenseExpiry" name="licenseExpiry" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matafiExpiry">Matafi Expiry</Label>
                      <Input id="matafiExpiry" name="matafiExpiry" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="laborExpiry">Labor Expiry</Label>
                      <Input id="laborExpiry" name="laborExpiry" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="immigrationExpiry">Immigration Expiry</Label>
                      <Input id="immigrationExpiry" name="immigrationExpiry" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eChannelExpiry">E Channel Expiry</Label>
                      <Input id="eChannelExpiry" name="eChannelExpiry" type="date" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Company'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#0047AB]" />
            </div>
          ) : (
            <div
              className={`${filteredCompanies.length > 10 ? "max-h-[calc(100vh-20rem)]" : ""} overflow-y-auto rounded-md border`}
            >
              <Table>
                <TableHeader className="bg-[#0047AB] text-white sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-white h-12">Company Name</TableHead>
                    <TableHead className="text-white h-12">License Expiry</TableHead>
                    <TableHead className="text-white h-12">Matafi Expiry</TableHead>
                    <TableHead className="text-white h-12">Labor Expiry</TableHead>
                    <TableHead className="text-white h-12">Immigration Expiry</TableHead>
                    <TableHead className="text-white h-12">E Channel Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No companies found. Try adjusting your search or add a new company.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company, index) => (
                      <TableRow
                        key={company.id}
                        className={`cursor-pointer hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                        onClick={() => router.push(`/companies/${company.docName || company.id}`)}
                      >
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.licenseExpiry}</TableCell>
                        <TableCell>{company.matafiExpiry}</TableCell>
                        <TableCell>{company.laborExpiry}</TableCell>
                        <TableCell>{company.immigrationExpiry}</TableCell>
                        <TableCell>{company.eChannelExpiry}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}