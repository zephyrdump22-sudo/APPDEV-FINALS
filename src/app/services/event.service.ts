import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import {
  Firestore,
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  where,
  onSnapshot,
} from "firebase/firestore"
import type { Event } from "../models/event.model"
import { getFirestore } from "firebase/firestore"

@Injectable({
  providedIn: "root",
})
export class EventService {
  private eventsSubject = new BehaviorSubject<Event[]>([])
  public events$ = this.eventsSubject.asObservable()
  private firestore = getFirestore()

  constructor() {
    this.loadEvents()
  }

  private loadEvents(): void {
    const eventsCollection = collection(this.firestore, "events")

    // listen realtime and log results; if onSnapshot errors (e.g. permissions) try a one-time getDocs
    onSnapshot(
      eventsCollection,
      (snapshot) => {
        const events: Event[] = []
        snapshot.forEach((docSnap) => {
          events.push({ ...docSnap.data(), id: docSnap.id } as Event)
        })
        console.log("[EventService] onSnapshot loaded events:", events.length)
        this.eventsSubject.next(events)
      },
      (error) => {
        console.error("[EventService] onSnapshot error:", error)
        // fallback: try one-time fetch to get more detailed error or data
        getDocs(eventsCollection)
          .then((snapshot) => {
            const events: Event[] = []
            snapshot.forEach((docSnap) => {
              events.push({ ...docSnap.data(), id: docSnap.id } as Event)
            })
            console.log("[EventService] getDocs fallback loaded events:", events.length)
            this.eventsSubject.next(events)
          })
          .catch((err) => {
            console.error("[EventService] getDocs fallback error:", err)
          })
      }
    )
  }

  getEvents(): Observable<Event[]> {
    return this.events$
  }

  getEventById(id: string): Observable<Event | undefined> {
    return new Observable((observer) => {
      const eventDoc = doc(this.firestore, "events", id)
      onSnapshot(
        eventDoc,
        (snapshot) => {
          if (snapshot.exists()) {
            observer.next({ ...snapshot.data(), id: snapshot.id } as Event)
          } else {
            observer.next(undefined)
          }
        },
        (error) => {
          console.error("[EventService] getEventById onSnapshot error:", error)
          observer.error(error)
        }
      )
    })
  }

  async addEvent(event: Omit<Event, "id">): Promise<void> {
    try {
      const eventsCollection = collection(this.firestore, "events")
      await addDoc(eventsCollection, {
        ...event,
        createdAt: new Date(),
      })
    } catch (error) {
      console.error("Error adding event:", error)
    }
  }

  async updateEvent(id: string, updatedEvent: Partial<Event>): Promise<void> {
    try {
      const eventDoc = doc(this.firestore, "events", id)
      await updateDoc(eventDoc, updatedEvent)
    } catch (error) {
      console.error("Error updating event:", error)
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const eventDoc = doc(this.firestore, "events", id)
      await deleteDoc(eventDoc)
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  getEventsByUserId(userId: string): Observable<Event[]> {
    return new Observable((observer) => {
      const q = query(collection(this.firestore, "events"), where("createdBy", "==", userId))
      onSnapshot(
        q,
        (snapshot) => {
          const events: Event[] = []
          snapshot.forEach((docSnap) => {
            events.push({ ...docSnap.data(), id: docSnap.id } as Event)
          })
          observer.next(events)
        },
        (error) => {
          console.error("[EventService] getEventsByUserId onSnapshot error:", error)
          observer.error(error)
        }
      )
    })
  }
}
