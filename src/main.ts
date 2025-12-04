import { bootstrapApplication } from "@angular/platform-browser"
import { provideRouter } from "@angular/router"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideHttpClient } from "@angular/common/http"
import { initializeApp } from "firebase/app"
import { AppComponent } from "./app/app.component"
import { routes } from "./app/app.routes"
import { firebaseConfig } from "./environments/firebase.config"

// Initialize Firebase
initializeApp(firebaseConfig)

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimations(), provideHttpClient()],
}).catch((err) => console.error(err))
