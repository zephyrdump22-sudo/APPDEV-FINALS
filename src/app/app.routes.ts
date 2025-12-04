import { Routes } from "@angular/router"
import { EventsListComponent } from "./pages/events/events-list.component"
import { EventDetailsComponent } from "./pages/events/event-details.component"
import { LoginComponent } from "./pages/auth/login.component"
import { RegisterComponent } from "./pages/auth/register.component"
import { AdminDashboardComponent } from "./pages/admin/admin-dashboard.component"
import { AddEventComponent } from "./pages/admin/add-event.component"
import { EditEventComponent } from "./pages/admin/edit-event.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { ProfileComponent } from "./pages/profile/profile.component"

export const routes: Routes = [
  { path: "", redirectTo: "/events", pathMatch: "full" },
  { path: "events", component: EventsListComponent },
  { path: "events/:id", component: EventDetailsComponent },
  { path: "calendar", component: CalendarComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent },
  { path: "admin", component: AdminDashboardComponent },
  { path: "admin/events/new", component: AddEventComponent },
  { path: "admin/events/:id/edit", component: EditEventComponent },
  { path: "**", redirectTo: "/events" },
]
