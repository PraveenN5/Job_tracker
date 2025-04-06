import { Badge } from "@/components/ui/badge"
import type { StatusType } from "@/lib/types"

interface StatusBadgeProps {
  status: StatusType
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Interview":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "Offer":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Ghosted":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return ""
    }
  }

  return (
    <Badge className={`${getStatusStyles()} font-medium`} variant="outline">
      {status}
    </Badge>
  )
}

