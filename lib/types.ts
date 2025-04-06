export type StatusType = "Applied" | "Interview" | "Offer" | "Rejected" | "Ghosted"

export interface ApplicationType {
  id: string
  company: string
  position: string
  location: string
  type: string
  mode: string
  pay: string
  dateApplied: string
  status: string
  notes?: string
}

