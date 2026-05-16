import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { StudentProfile } from '../../models/student-profile.model';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {
  profileForm!: FormGroup;
  currentStep = 1;
  selectedFile: File | null = null;
  fileError = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      personal: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]]
      }),
      academic: this.fb.group({
        gpa: ['', [Validators.required, Validators.min(0.0), Validators.max(4.0)]],
        major: ['', [Validators.required]]
      })
    });
  }

  get personalStep() { return this.profileForm.get('personal') as FormGroup; }
  get academicStep() { return this.profileForm.get('academic') as FormGroup; }

  nextStep() { if (this.personalStep.valid) this.currentStep = 2; }
  prevStep() { this.currentStep = 1; }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = '';

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validation Check: File type restriction
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Only PDF or Word documents are allowed.';
        this.selectedFile = null;
        return;
      }

      // Validation Check: 5MB File size ceiling limitation
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'File size must be smaller than 5MB.';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.selectedFile) {
      if (!this.selectedFile) this.fileError = 'Please upload a transcript document.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: StudentProfile = {
      firstName: this.personalStep.value.firstName,
      lastName: this.personalStep.value.lastName,
      gpa: Number(this.academicStep.value.gpa),
      major: this.academicStep.value.major
    };

    this.profileService.submitProfileWithFile(payload, this.selectedFile).subscribe({
      next: (res) => {
        this.successMessage = 'Profile and transcript submitted successfully!';
        this.profileForm.reset();
        this.selectedFile = null;
        this.currentStep = 1;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = 'Upload submission failed. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
