import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { DEFAULT_IMPORTS } from "../../shared/shared-imports"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [...DEFAULT_IMPORTS],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email = ""
  password = ""
  errorMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async onSubmit(): Promise<void> {
    if (this.email && this.password) {
      const success = await this.authService.login(this.email, this.password)
      if (success) {
        this.router.navigate(["/profile"])
      } else {
        this.errorMessage = "Invalid credentials"
      }
    }
  }
}
