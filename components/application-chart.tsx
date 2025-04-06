"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ApplicationType } from "@/lib/types"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TimeScale,
  PointElement,
  LineElement,
} from "chart.js"
import { Pie, Line } from "react-chartjs-2"
import "chartjs-adapter-date-fns"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TimeScale,
  PointElement,
  LineElement,
)

interface ApplicationChartProps {
  applications: ApplicationType[]
}

export default function ApplicationChart({ applications }: ApplicationChartProps) {
  const [timeRange, setTimeRange] = useState<"30days" | "90days" | "all">("all")

  // Status distribution data
  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // Applied - Blue
          "rgba(255, 206, 86, 0.7)", // Interview - Yellow
          "rgba(75, 192, 192, 0.7)", // Offer - Green
          "rgba(255, 99, 132, 0.7)", // Rejected - Red
          "rgba(153, 102, 255, 0.7)", // Ghosted - Purple
        ],
        borderWidth: 1,
      },
    ],
  }

  // Job type distribution data
  const typeDistribution = applications.reduce(
    (acc, app) => {
      acc[app.type] = (acc[app.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeData = {
    labels: Object.keys(typeDistribution),
    datasets: [
      {
        data: Object.values(typeDistribution),
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Work mode distribution data
  const modeDistribution = applications.reduce(
    (acc, app) => {
      acc[app.mode] = (acc[app.mode] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const modeData = {
    labels: Object.keys(modeDistribution),
    datasets: [
      {
        data: Object.values(modeDistribution),
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 206, 86, 0.7)", "rgba(75, 192, 192, 0.7)"],
        borderWidth: 1,
      },
    ],
  }

  // Applications over time data
  const getApplicationsOverTimeData = () => {
    if (applications.length === 0) return { labels: [], datasets: [] }

    // Filter applications based on time range
    const now = new Date()
    let filteredApps = [...applications]

    if (timeRange === "30days") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(now.getDate() - 30)
      filteredApps = applications.filter((app) => new Date(app.dateApplied) >= thirtyDaysAgo)
    } else if (timeRange === "90days") {
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(now.getDate() - 90)
      filteredApps = applications.filter((app) => new Date(app.dateApplied) >= ninetyDaysAgo)
    }

    // Group applications by date
    const appsByDate = filteredApps.reduce(
      (acc, app) => {
        const date = app.dateApplied.split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Sort dates
    const sortedDates = Object.keys(appsByDate).sort()

    // Create cumulative data
    let cumulative = 0
    const cumulativeData = sortedDates.map((date) => {
      cumulative += appsByDate[date]
      return { x: date, y: cumulative }
    })

    return {
      datasets: [
        {
          label: "Applications Over Time",
          data: cumulativeData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
          fill: true,
        },
      ],
    }
  }

  const timelineOptions = {
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "day" as const,
          tooltipFormat: "MMM d, yyyy",
          displayFormats: {
            day: "MMM d",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Applications",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-64 w-64">
              <Pie data={statusData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Type</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-64 w-64">
              <Pie data={typeData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Work Mode</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-64 w-64">
              <Pie data={modeData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle>Applications Over Time</CardTitle>
            <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
              <TabsList>
                <TabsTrigger value="30days">30 Days</TabsTrigger>
                <TabsTrigger value="90days">90 Days</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line data={getApplicationsOverTimeData()} options={timelineOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

