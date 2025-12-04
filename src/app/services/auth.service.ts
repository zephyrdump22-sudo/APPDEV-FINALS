import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth"
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  setDoc,
  doc,
  getDoc
} from "firebase/firestore"
import type { User } from "../models/event.model"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private auth = getAuth()
  private firestore = getFirestore()

  constructor() {
    this.initializeAuthState()
  }

  private initializeAuthState(): void {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(this.firestore, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          this.currentUserSubject.next(userDoc.data() as User)
        }
      } else {
        this.currentUserSubject.next(null)
      }
    })
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password)
      const userDoc = await getDoc(doc(this.firestore, "users", result.user.uid))
      if (userDoc.exists()) {
        this.currentUserSubject.next(userDoc.data() as User)
      }
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password)
      const newUser: User = {
        id: result.user.uid,
        name,
        email,
        isAdmin: false,
      }
      await setDoc(doc(this.firestore, "users", result.user.uid), newUser)
      this.currentUserSubject.next(newUser)
      return true
    } catch (error) {
      console.error("Register error:", error)
      return false
    }
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.currentUserSubject.next(null)
    })
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin || false
  }
}
