import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { EventService } from "../../services/event.service"
import { AuthService } from "../../services/auth.service"
import type { User } from "../../models/event.model"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.css"],
  imports: [...DEFAULT_IMPORTS],
})
export class AddEventComponent {
  currentUser: User | null = null
  errorMessage = ""
  categories = ["Community", "Technology", "Markets", "Health", "Education", "Sports", "Arts"]

  event = {
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Community",
    imageUrl: "/placeholder.svg?key=5l3mq",
    attendees: 0,
  }

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
      if (!user?.isAdmin) {
        this.router.navigate(["/events"])
      }
    })
  }

  async createEvent(): Promise<void> {
    if (!this.validateForm()) {
      return
    }

    if (this.currentUser) {
      console.log("Creating event with user:", this.currentUser)
      console.log("Event data:", {
        title: this.event.title,
        description: this.event.description,
        date: this.event.date,
        time: this.event.time,
        location: this.event.location,
        category: this.event.category,
        imageUrl: this.event.imageUrl,
        attendees: this.event.attendees,
        createdBy: this.currentUser.id,
        isApproved: true,
      })
      
      await this.eventService.addEvent({
        title: this.event.title,
        description: this.event.description,
        date: this.event.date,
        time: this.event.time,
        location: this.event.location,
        category: this.event.category,
        imageUrl: this.event.imageUrl,
        attendees: this.event.attendees,
        createdBy: this.currentUser.id,
        isApproved: true,
      })

      console.log("Event created successfully")
      this.router.navigate(["/admin"])
    } else {
      console.log("No current user")
    }
  }

  validateForm(): boolean {
    if (!this.event.title || !this.event.description || !this.event.date || !this.event.time || !this.event.location) {
      this.errorMessage = "Please fill in all required fields"
      return false
    }
    return true
  }
}
