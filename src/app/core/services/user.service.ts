import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserSession } from '../model/session.model';
import { UserEntity } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private sessionSubject = new BehaviorSubject<UserSession | null>(this.getSessionFromStorage());
  session$ = this.sessionSubject.asObservable();

  private userSubject = new BehaviorSubject<UserEntity | null>(null);
  user$ = this.userSubject.asObservable();

  setSession(session: UserSession): void {
    this.sessionSubject.next(session);
    this.saveSessionToStorage(session);
  }

  clearSession(): void {
    this.sessionSubject.next(null);
    this.clearSessionFromStorage();
  }

  getSession(): UserSession | null {
    return this.sessionSubject.value;
  }

  setUser(user: UserEntity): void {
    this.userSubject.next(user);
  }

  getUser(): UserEntity | null {
    return this.userSubject.value;
  }

  private saveSessionToStorage(session: UserSession): void {
    localStorage.setItem('userSession', JSON.stringify(session));
  }

  private getSessionFromStorage(): UserSession | null {
    const sessionData = localStorage.getItem('userSession');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  private clearSessionFromStorage(): void {
    localStorage.removeItem('userSession');
  }
}
