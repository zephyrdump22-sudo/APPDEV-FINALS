import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore"
import type { RSVP, Reminder } from "../models/event.model"
import { getFirestore } from "firebase/firestore"

@Injectable({
  providedIn: "root",
})
export class RsvpService {
  private rsvpsSubject = new BehaviorSubject<RSVP[]>([])
  private remindersSubject = new BehaviorSubject<Reminder[]>([])
  public rsvps$ = this.rsvpsSubject.asObservable()
  public reminders$ = this.remindersSubject.asObservable()
  private firestore = getFirestore()

  constructor() {
    this.loadRsvps()
    this.loadReminders()
  }

  private loadRsvps(): void {
    const rsvpsCollection = collection(this.firestore, "rsvps")
    onSnapshot(rsvpsCollection, (snapshot) => {
      const rsvps: RSVP[] = []
      snapshot.forEach((doc) => {
        rsvps.push({ ...doc.data(), id: doc.id } as RSVP)
      })
      this.rsvpsSubject.next(rsvps)
    })
  }

  private loadReminders(): void {
    const remindersCollection = collection(this.firestore, "reminders")
    onSnapshot(remindersCollection, (snapshot) => {
      const reminders: Reminder[] = []
      snapshot.forEach((doc) => {
        reminders.push({ ...doc.data(), id: doc.id } as Reminder)
      })
      this.remindersSubject.next(reminders)
    })
  }

  getRsvps(): Observable<RSVP[]> {
    return this.rsvps$
  }

  async addRsvp(userId: string, eventId: string, status: "going" | "maybe" | "not-going"): Promise<void> {
    try {
      const q = query(
        collection(this.firestore, "rsvps"),
        where("userId", "==", userId),
        where("eventId", "==", eventId)
      )
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id
        await updateDoc(doc(this.firestore, "rsvps", docId), { status })
      } else {
        const rsvpsCollection = collection(this.firestore, "rsvps")
        await addDoc(rsvpsCollection, {
          userId,
          eventId,
          status,
          registeredAt: new Date().toISOString().split("T")[0],
        })
      }
    } catch (error) {
      console.error("Error adding RSVP:", error)
    }
  }

  async updateRsvp(id: string, status: "going" | "maybe" | "not-going"): Promise<void> {
    try {
      const rsvpDoc = doc(this.firestore, "rsvps", id)
      await updateDoc(rsvpDoc, { status })
    } catch (error) {
      console.error("Error updating RSVP:", error)
    }
  }

  async removeRsvp(userId: string, eventId: string): Promise<void> {
    try {
      const q = query(
        collection(this.firestore, "rsvps"),
        where("userId", "==", userId),
        where("eventId", "==", eventId)
      )
      const snapshot = await getDocs(q)
      snapshot.forEach((doc) => {
        deleteDoc(doc.ref)
      })
    } catch (error) {
      console.error("Error removing RSVP:", error)
    }
  }

  getUserRsvps(userId: string): Observable<RSVP[]> {
    return new Observable((observer) => {
      const q = query(collection(this.firestore, "rsvps"), where("userId", "==", userId))
      onSnapshot(q, (snapshot) => {
        const rsvps: RSVP[] = []
        snapshot.forEach((doc) => {
          rsvps.push({ ...doc.data(), id: doc.id } as RSVP)
        })
        observer.next(rsvps)
      })
    })
  }

  getRsvpStatus(userId: string, eventId: string): Observable<"going" | "maybe" | "not-going" | null> {
    return new Observable((observer) => {
      const q = query(
        collection(this.firestore, "rsvps"),
        where("userId", "==", userId),
        where("eventId", "==", eventId)
      )
      onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          observer.next(snapshot.docs[0].data()["status"])
        } else {
          observer.next(null)
        }
      })
    })
  }

  async toggleReminder(userId: string, eventId: string): Promise<void> {
    try {
      const q = query(
        collection(this.firestore, "reminders"),
        where("userId", "==", userId),
        where("eventId", "==", eventId)
      )
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id
        const currentEnabled = snapshot.docs[0].data()["enabled"]
        await updateDoc(doc(this.firestore, "reminders", docId), { enabled: !currentEnabled })
      } else {
        const remindersCollection = collection(this.firestore, "reminders")
        await addDoc(remindersCollection, {
          userId,
          eventId,
          enabled: true,
        })
      }
    } catch (error) {
      console.error("Error toggling reminder:", error)
    }
  }

  isReminderEnabled(userId: string, eventId: string): Observable<boolean> {
    return new Observable((observer) => {
      const q = query(
        collection(this.firestore, "reminders"),
        where("userId", "==", userId),
        where("eventId", "==", eventId)
      )
      onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          observer.next(snapshot.docs[0].data()["enabled"])
        } else {
          observer.next(false)
        }
      })
    })
  }
}
