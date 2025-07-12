import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/users/me/profile';
  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(this.apiUrl, profileData);
  }
}