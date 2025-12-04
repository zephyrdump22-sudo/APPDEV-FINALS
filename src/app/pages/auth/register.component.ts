import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [...DEFAULT_IMPORTS],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  name = ""
  email = ""
  password = ""
  confirmPassword = ""
  errorMessage = ""
  successMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async onSubmit(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match"
      return
    }
    if (this.name && this.email && this.password) {
      const success = await this.authService.register(this.name, this.email, this.password)
      if (success) {
        this.successMessage = "Registration successful! Redirecting to login..."
        setTimeout(() => this.router.navigate(["/login"]), 2000)
      } else {
        this.errorMessage = "Email already exists"
      }
    }
  }
}
