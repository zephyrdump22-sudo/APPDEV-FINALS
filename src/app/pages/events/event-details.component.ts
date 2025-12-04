import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { EventService } from "../../services/event.service"
import { RsvpService } from "../../services/rsvp.service"
import { AuthService } from "../../services/auth.service"
import type { Event, User } from "../../models/event.model"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-event-details",
  templateUrl: "./event-details.component.html",
  styleUrls: ["./event-details.component.css"],
  imports: [...DEFAULT_IMPORTS],
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null
  currentUser: User | null = null
  rsvpStatus: "going" | "maybe" | "not-going" | null = null
  reminderEnabled: boolean = false

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private rsvpService: RsvpService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
    })

    this.route.params.subscribe((params: any) => {
      const eventId: string = params['id']
      this.eventService.getEventById(eventId).subscribe((event) => {
        this.event = event || null
        if (this.currentUser) {
          this.rsvpService.getRsvpStatus(this.currentUser.id, eventId).subscribe((status) => {
            this.rsvpStatus = status
          })
          this.rsvpService.isReminderEnabled(this.currentUser.id, eventId).subscribe((enabled) => {
            this.reminderEnabled = enabled
          })
        }
      })
    })
  }

  updateRsvpStatus(): void {
    if (this.currentUser && this.event) {
      this.rsvpService.getRsvpStatus(this.currentUser.id, this.event.id).subscribe((status) => {
        this.rsvpStatus = status
      })
      this.rsvpService.isReminderEnabled(this.currentUser.id, this.event.id).subscribe((enabled) => {
        this.reminderEnabled = enabled
      })
    }
  }

  rsvp(status: "going" | "maybe" | "not-going"): void {
    if (!this.currentUser) {
      alert("Please login to RSVP to events")
      return
    }
    if (this.event) {
      this.rsvpService.addRsvp(this.currentUser.id, this.event.id, status)
      this.updateRsvpStatus()
    }
  }

  toggleReminder(): void {
    if (!this.currentUser || !this.event) {
      alert("Please login to set reminders")
      return
    }
    this.rsvpService.toggleReminder(this.currentUser.id, this.event.id)
    this.updateRsvpStatus()
  }

  cancelRsvp(): void {
    if (this.currentUser && this.event) {
      this.rsvpService.removeRsvp(this.currentUser.id, this.event.id)
      this.updateRsvpStatus()
    }
  }
}
