import { Component, type OnInit } from "@angular/core"
import { EventService } from "../../services/event.service"
import type { Event } from "../../models/event.model"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-events-list",
  standalone: true,
  imports: [...DEFAULT_IMPORTS],
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.css"],
})
export class EventsListComponent implements OnInit {
  events: Event[] = []
  filteredEvents: Event[] = []
  searchQuery = ""
  selectedCategory = ""
  categories = ["All", "Community", "Technology", "Markets", "Health", "Education"]

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    console.log("[EventsList] subscribing to events observable")
    this.eventService.getEvents().subscribe({
      next: (events) => {
        console.log("[EventsList] received events:", events.length, events.map(e => ({ id: e.id, title: e.title })))
        this.events = events.map((event, index) => ({
          ...event,
          imageUrl: this.getEventImage(event, index),
        }))
        this.applyFilters()
      },
      error: (err) => {
        console.error("[EventsList] getEvents error:", err)
      }
    })
  }

  getEventImage(event: Event, index: number): string {
    if (event.imageUrl && event.imageUrl.trim() !== "") {
      return event.imageUrl
    }
    const categoryKeywords: { [key: string]: string } = {
      Community: "community-gathering",
      Technology: "technology-conference",
      Markets: "marketplace",
      Health: "health-wellness",
      Education: "education-learning",
    }
    const keyword = categoryKeywords[event.category] || "event"
    const seed = (event.id?.charCodeAt(0) || 0) + index
    return `https://images.unsplash.com/photo-${1540575461063 + seed}?w=400&h=300&fit=crop&q=80&auto=format`
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      const matchesCategory =
        !this.selectedCategory || this.selectedCategory === "All" || event.category === this.selectedCategory
      return matchesSearch && matchesCategory
    })
  }

  onSearchChange(): void {
    this.applyFilters()
  }

  selectCategory(category: string): void {
    this.selectedCategory = category === "All" ? "" : category
    this.applyFilters()
  }
}
