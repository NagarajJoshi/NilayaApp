import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';
import { StudentProfile } from '../models/student-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.profilesUrl;

  constructor(private http: HttpClient) {}

  submitProfileWithFile(profile: StudentProfile, file: File): Observable<StudentProfile> {
    const formData = new FormData();
    formData.append('profile', new Blob([JSON.stringify(profile)], { type: 'application/json' }));
    formData.append('file', file);
    return this.http.post<StudentProfile>(this.apiUrl, formData);
  }

  // Resolves: Property 'getAllProfiles' does not exist on type 'ProfileService'
  getAllProfiles(): Observable<StudentProfile[]> {
    return this.http.get<StudentProfile[]>(this.apiUrl);
  }

  downloadFile(profileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${profileId}`, { responseType: 'blob' });
  }
}
