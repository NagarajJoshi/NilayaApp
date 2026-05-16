import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { StudentProfile } from '../../models/student-profile.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  applications: StudentProfile[] = [];
  errorMessage = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getAllProfiles().subscribe({
      // Resolves: Parameter 'data' and 'err' implicitly have an 'any' type
      next: (data: StudentProfile[]) => {
        this.applications = data;
      },
      error: (err: unknown) => {
        this.errorMessage = 'Unauthorized access or database error.';
        console.error(err);
      }
    });
  }

  downloadTranscript(profileId: number, studentName: string): void {
    this.profileService.downloadFile(profileId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${studentName}_Transcript.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err: unknown) => {
        alert('Failed to download transcript file.');
        console.error(err);
      }
    });
  }
}
