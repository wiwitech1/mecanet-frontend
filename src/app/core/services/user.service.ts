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
    console.log('Guardando sesión en UserService:', session);
    this.sessionSubject.next(session);
    this.saveSessionToStorage(session);
    this.checkLocalStorage();
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

  // Método para obtener la información completa de la sesión
  getSessionInfo(): { username: string; name: string; roles: string[] } | null {
    const session = this.getSession();
    if (!session) {
      return null;
    }

    return {
      username: session.username,
      name: session.name,
      roles: session.roles
    };
  }

  // Método para verificar la información guardada en localStorage
  checkLocalStorage(): void {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      console.log('Información en localStorage:', {
        username: session.username,
        name: session.name,
        roles: session.roles,
        userId: session.userId,
        hasToken: !!session.token
      });
    } else {
      console.log('No hay sesión guardada en localStorage');
    }
  }

  private saveSessionToStorage(session: UserSession): void {
    console.log('Guardando en localStorage:', session);
    localStorage.setItem('userSession', JSON.stringify(session));

    // Verificar que se guardó correctamente
    const savedSession = localStorage.getItem('userSession');
    console.log('Sesión guardada en localStorage:', savedSession ? JSON.parse(savedSession) : 'No se guardó');
  }

  private getSessionFromStorage(): UserSession | null {
    const sessionData = localStorage.getItem('userSession');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  private clearSessionFromStorage(): void {
    localStorage.removeItem('userSession');
  }
}
