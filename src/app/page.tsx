import { Header } from "@/components/header"
import { EventsList } from "@/components/events-list"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Discover Local Events
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Connect with your community through local events. Find gatherings, workshops, and activities happening near
            you.
          </p>
        </section>

        {/* Events Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          </div>
          <EventsList />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 Community Events. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
