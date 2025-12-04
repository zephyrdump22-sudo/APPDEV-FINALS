import { Component, type OnInit } from "@angular/core"
import { EventService } from "../../services/event.service"
import { AuthService } from "../../services/auth.service"
import type { Event, User } from "../../models/event.model"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [...DEFAULT_IMPORTS],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  events: Event[] = []
  userEvents: Event[] = []
  deleteConfirmId: string | null = null
  currentUser: User | null = null
  totalEvents = 0
  totalAttendees = 0

  constructor(
    private eventService: EventService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
      if (user && !user.isAdmin) {
        // Non-admin users shouldn't see this page in production
      }
      this.loadEventsForCurrentUser()
    })

    this.eventService.getEvents().subscribe((allEvents) => {
      this.totalEvents = allEvents.length
      this.totalAttendees = allEvents.reduce((sum, e) => sum + e.attendees, 0)
    })
  }

  private loadEventsForCurrentUser(): void {
    this.eventService.getEvents().subscribe((allEvents) => {
      this.events = allEvents
      if (this.currentUser?.isAdmin) {
        // admins see all events
        this.userEvents = allEvents
      } else if (this.currentUser) {
        // non-admins see only their own events
        this.userEvents = allEvents.filter((e) => e.createdBy === this.currentUser!.id)
      } else {
        this.userEvents = []
      }
    })
  }

  deleteEvent(eventId: string): void {
    this.eventService.deleteEvent(eventId)
    this.deleteConfirmId = null
  }

  cancelDelete(): void {
    this.deleteConfirmId = null
  }
}
