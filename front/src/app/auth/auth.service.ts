import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  
  private userSubject = new BehaviorSubject<any | null>(null);
  public user$ = this.userSubject.asObservable();

  private authStatusChecked = new BehaviorSubject<boolean>(false);
  public isAuthStatusChecked$ = this.authStatusChecked.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.userSubject.next(response.user))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.router.navigate(['/']);
      })
    );
  }
  
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/api/users/me`).pipe(
      map(user => {
        if (user && user.id) {
          this.userSubject.next(user);
          return true;
        }
        return false;
      }),
      catchError(() => {
        this.userSubject.next(null);
        return of(false);
      }),
      finalize(() => this.authStatusChecked.next(true))
    );
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  getUserRole(): string | null {
    return this.userSubject.value?.role || null;
  }
}
