import { Component, type OnInit } from "@angular/core"
import { EventService } from "../../services/event.service"
import type { Event } from "../../models/event.model"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [...DEFAULT_IMPORTS],
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  allEvents: Event[] = []
  currentDate = new Date()
  selectedDate: Date | null = null
  eventsOnSelectedDate: Event[] = []

  daysInMonth: (number | null)[] = []
  monthYear = ""
  weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.allEvents = events
      this.generateCalendar()
    })
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()

    this.monthYear = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })

    const firstDay = new Date(year, month, 1).getDay()
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()

    this.daysInMonth = []

    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.push(null)
    }

    for (let i = 1; i <= daysInCurrentMonth; i++) {
      this.daysInMonth.push(i)
    }
  }

  private formatDateString(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  selectDate(day: number | null): void {
    if (day === null) return

    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()
    this.selectedDate = new Date(year, month, day)

    const dateString = this.formatDateString(this.selectedDate)
    this.eventsOnSelectedDate = this.allEvents.filter((event) => event.date === dateString)
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
    this.currentDate = new Date(this.currentDate)
    this.generateCalendar()
    this.selectedDate = null
    this.eventsOnSelectedDate = []
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    this.currentDate = new Date(this.currentDate)
    this.generateCalendar()
    this.selectedDate = null
    this.eventsOnSelectedDate = []
  }

  hasEventsOnDate(day: number | null): boolean {
    if (day === null) return false

    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()
    const date = new Date(year, month, day)
    const dateString = this.formatDateString(date)

    return this.allEvents.some((event) => event.date === dateString)
  }

  isToday(day: number | null): boolean {
    if (day === null) return false

    const today = new Date()
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    )
  }

  isSelected(day: number | null): boolean {
    if (day === null || !this.selectedDate) return false

    return (
      day === this.selectedDate.getDate() &&
      this.currentDate.getMonth() === this.selectedDate.getMonth() &&
      this.currentDate.getFullYear() === this.selectedDate.getFullYear()
    )
  }
}
