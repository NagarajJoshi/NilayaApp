import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.production';
import { StudentProfile } from '../models/student-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitProfileWithFile(profile: StudentProfile, file: File): Observable<StudentProfile> {
    const formData = new FormData();
    
    // Convert text metadata to a Blob representing a JSON object for Spring Boot's @RequestPart
    formData.append('profile', new Blob([JSON.stringify(profile)], { type: 'application/json' }));
    
    // Append the raw document file stream object
    formData.append('file', file);

    return this.http.post<StudentProfile>(this.apiUrl, formData);
  }
}
