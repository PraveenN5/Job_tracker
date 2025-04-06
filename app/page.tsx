"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Download, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ApplicationForm from "@/components/application-form"
import StatusBadge from "@/components/status-badge"
import type { ApplicationType, StatusType } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import ApplicationStats from "@/components/application-stats"
import ApplicationChart from "@/components/application-chart"

export default function Home() {
  const [applications, setApplications] = useState<ApplicationType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingApplication, setEditingApplication] = useState<ApplicationType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const savedApplications = localStorage.getItem("applications")
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }
  }, [])

  const saveApplications = (apps: ApplicationType[]) => {
    localStorage.setItem("applications", JSON.stringify(apps))
    setApplications(apps)
  }

  const addApplication = (application: ApplicationType) => {
    const newApplications = [...applications, application]
    saveApplications(newApplications)
  }

  const updateApplication = (updatedApplication: ApplicationType) => {
    const newApplications = applications.map((app) => (app.id === updatedApplication.id ? updatedApplication : app))
    saveApplications(newApplications)
    setEditingApplication(null)
    setIsEditDialogOpen(false)
  }

  const deleteApplication = (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      const newApplications = applications.filter((app) => app.id !== id)
      saveApplications(newApplications)
    }
  }

  const handleEdit = (application: ApplicationType) => {
    setEditingApplication(application)
    setIsEditDialogOpen(true)
  }

  const downloadCSV = () => {
    const headers = ["Company", "Position", "Location", "Type", "Mode", "Pay", "Date Applied", "Status"]
    const rows = applications.map((app) => [
      app.company,
      app.position,
      app.location,
      app.type,
      app.mode,
      app.pay,
      app.dateApplied,
      app.status,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "job-applications.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredApplications = applications
    .filter(
      (app) =>
        (statusFilter === "all" || app.status === statusFilter) &&
        (searchTerm === "" ||
          app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.location.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-center mb-8">Job Application Tracker</h1>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="list">Applications</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Ghosted">Ghosted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Application
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Application</DialogTitle>
                  </DialogHeader>
                  <ApplicationForm onSubmit={addApplication} />
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={downloadCSV} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Mode</TableHead>
                      <TableHead className="hidden lg:table-cell">Pay</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No applications found. Add your first job application!
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.company}</TableCell>
                          <TableCell>{app.position}</TableCell>
                          <TableCell className="hidden md:table-cell">{app.location}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{app.type}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{app.mode}</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{app.pay}</TableCell>
                          <TableCell>{formatDate(app.dateApplied)}</TableCell>
                          <TableCell>
                            <StatusBadge status={app.status as StatusType} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(app)}>
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteApplication(app.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <ApplicationStats applications={applications} />
        </TabsContent>

        <TabsContent value="charts">
          <ApplicationChart applications={applications} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          {editingApplication && (
            <ApplicationForm onSubmit={updateApplication} initialData={editingApplication} isEditing={true} />
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

