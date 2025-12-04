import { Component, type OnInit } from "@angular/core"
import { EventService } from "../../services/event.service"
import { ActivatedRoute, Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import type { Event, User } from "../../models/event.model"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.css"],
  imports: [...DEFAULT_IMPORTS],
})
export class EditEventComponent implements OnInit {
  currentUser: User | null = null
  event: Event | null = null
  errorMessage = ""
  categories = ["Community", "Technology", "Markets", "Health", "Education", "Sports", "Arts"]

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
      if (!user?.isAdmin) {
        this.router.navigate(["/events"])
      }
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      const eventId: string = params["id"]
      this.eventService.getEventById(eventId).subscribe((event) => {
        if (event) {
          this.event = event
        }
      })
    })
  }

  updateEvent(): void {
    if (!this.validateForm()) {
      return
    }

    if (this.event) {
      this.eventService.updateEvent(this.event.id, this.event)
      this.router.navigate(["/admin"])
    }
  }

  validateForm(): boolean {
    if (
      !this.event ||
      !this.event.title ||
      !this.event.description ||
      !this.event.date ||
      !this.event.time ||
      !this.event.location
    ) {
      this.errorMessage = "Please fill in all required fields"
      return false
    }
    return true
  }
}
