import { Component, type OnInit } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { RsvpService } from "../../services/rsvp.service"
import { EventService } from "../../services/event.service"
import type { Event, RSVP, User } from "../../models/event.model"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  imports: [...DEFAULT_IMPORTS],
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null
  userRsvps: RSVP[] = []
  allEvents: Event[] = []
  rsvpEvents: Event[] = []

  constructor(
    private authService: AuthService,
    private rsvpService: RsvpService,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
      const requestedId = this.route.snapshot.paramMap.get("id")
      if (requestedId && user) {
        if (requestedId !== user.id && !user.isAdmin) {
          this.router.navigate(["/events"])
          return
        }
      }
      if (user) {
        this.loadUserRsvps()
      }
    })

    this.eventService.getEvents().subscribe((events) => {
      this.allEvents = events
      this.updateRsvpEvents()
    })
  }

  loadUserRsvps(): void {
    if (this.currentUser) {
      this.rsvpService.getUserRsvps(this.currentUser.id).subscribe((rsvps) => {
        this.userRsvps = rsvps
        this.updateRsvpEvents()
      })
    }
  }

  updateRsvpEvents(): void {
    this.rsvpEvents = this.userRsvps
      .map((rsvp) => this.allEvents.find((event) => event.id === rsvp.eventId))
      .filter((event) => event !== undefined) as Event[]
  }

  cancelRsvp(eventId: string): void {
    if (this.currentUser) {
      this.rsvpService.removeRsvp(this.currentUser.id, eventId)
      this.loadUserRsvps()
    }
  }

  getRsvpStatus(eventId: string): string {
    const rsvp = this.userRsvps.find((r) => r.eventId === eventId)
    if (!rsvp) return "Not Attending"
    switch (rsvp.status) {
      case "going":
        return "Going"
      case "maybe":
        return "Maybe"
      case "not-going":
        return "Not Going"
      default:
        return "Unknown"
    }
  }

  getRsvpBadgeClass(eventId: string): string {
    const rsvp = this.userRsvps.find((r) => r.eventId === eventId)
    return `badge badge-${rsvp?.status || "unknown"}`
  }
}
