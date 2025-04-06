import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApplicationType, StatusType } from "@/lib/types"

interface ApplicationStatsProps {
  applications: ApplicationType[]
}

export default function ApplicationStats({ applications }: ApplicationStatsProps) {
  // Calculate status counts
  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate response rate
  const totalApplications = applications.length
  const responsesReceived = applications.filter(
    (app) => app.status === "Interview" || app.status === "Offer" || app.status === "Rejected",
  ).length
  const responseRate = totalApplications > 0 ? Math.round((responsesReceived / totalApplications) * 100) : 0

  // Calculate success rate (offers received)
  const offersReceived = statusCounts["Offer"] || 0
  const successRate = totalApplications > 0 ? Math.round((offersReceived / totalApplications) * 100) : 0

  // Calculate interview conversion rate
  const interviewsReceived = statusCounts["Interview"] || 0
  const interviewToOfferRate = interviewsReceived > 0 ? Math.round((offersReceived / interviewsReceived) * 100) : 0

  // Calculate average applications per week
  const calculateApplicationsPerWeek = () => {
    if (applications.length === 0) return 0

    const dates = applications.map((app) => new Date(app.dateApplied).getTime())
    const oldestDate = Math.min(...dates)
    const newestDate = Math.max(...dates)

    const daysDifference = (newestDate - oldestDate) / (1000 * 60 * 60 * 24)
    const weeksDifference = daysDifference / 7 || 1 // Avoid division by zero

    return Math.round(applications.length / weeksDifference)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplications}</div>
          <p className="text-xs text-muted-foreground">{calculateApplicationsPerWeek()} applications per week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{responseRate}%</div>
          <p className="text-xs text-muted-foreground">
            {responsesReceived} responses from {totalApplications} applications
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">
            {offersReceived} offers from {totalApplications} applications
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interview Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{interviewToOfferRate}%</div>
          <p className="text-xs text-muted-foreground">
            {offersReceived} offers from {interviewsReceived} interviews
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Applied", "Interview", "Offer", "Rejected", "Ghosted"].map((status) => {
              const count = statusCounts[status] || 0
              const percentage = totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0

              return (
                <div key={status} className="flex items-center">
                  <div className="w-24 text-sm font-medium">{status}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${getStatusColor(status as StatusType)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium">
                    {count} <span className="text-muted-foreground">({percentage}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Application Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Customize your resume and cover letter for each application</li>
            <li>Follow up after 1-2 weeks if you haven't heard back</li>
            <li>Prepare for interviews by researching the company</li>
            <li>Track your application sources to identify which platforms yield better results</li>
            <li>Set weekly application goals to maintain momentum</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function getStatusColor(status: StatusType): string {
  switch (status) {
    case "Applied":
      return "bg-blue-500"
    case "Interview":
      return "bg-amber-500"
    case "Offer":
      return "bg-green-500"
    case "Rejected":
      return "bg-red-500"
    case "Ghosted":
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}

