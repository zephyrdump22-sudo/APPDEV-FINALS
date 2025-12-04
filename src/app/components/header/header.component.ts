import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import type { User } from "../../models/event.model"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null
  showUserMenu = false

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user
    })
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu
  }

  logout(): void {
    this.authService.logout()
    this.showUserMenu = false
  }
}
