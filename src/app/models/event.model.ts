export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  imageUrl: string
  attendees: number
  createdBy: string
  isApproved: boolean
}

export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

export interface RSVP {
  id: string
  userId: string
  eventId: string
  status: "going" | "maybe" | "not-going"
  registeredAt: string
}

export interface Reminder {
  id: string
  userId: string
  eventId: string
  enabled: boolean
}
