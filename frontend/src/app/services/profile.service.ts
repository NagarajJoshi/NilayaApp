import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';
import { StudentProfile } from '../models/student-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // Directly references http://localhost:8080/api/profiles
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitProfile(profile: StudentProfile): Observable<StudentProfile> {
    return this.http.post<StudentProfile>(this.apiUrl, profile);
  }

  getAllProfiles(): Observable<StudentProfile[]> {
    return this.http.get<StudentProfile[]>(this.apiUrl);
  }
}
