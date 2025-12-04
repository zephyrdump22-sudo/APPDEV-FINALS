import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { EventsProvider } from "@/lib/events-context"
import { RSVPProvider } from "@/lib/rsvp-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Community Events - Local Event Management",
  description: "Discover and join local community events. RSVP, set reminders, and connect with your community.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <EventsProvider>
            <RSVPProvider>{children}</RSVPProvider>
          </EventsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
