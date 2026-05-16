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
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // Nested form groups partition data logically per wizard view step
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

  // Getters to quickly access nested form properties inside template checks
  get personalStep() { return this.profileForm.get('personal') as FormGroup; }
  get academicStep() { return this.profileForm.get('academic') as FormGroup; }

  nextStep(): void {
    if (this.currentStep === 1 && this.personalStep.valid) {
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Merge nested wizard groups flat to match backend DTO expects
    const applicationPayload: StudentProfile = {
      firstName: this.personalStep.value.firstName,
      lastName: this.personalStep.value.lastName,
      gpa: Number(this.academicStep.value.gpa),
      major: this.academicStep.value.major
    };

    this.profileService.submitProfile(applicationPayload).subscribe({
      next: (response) => {
        this.successMessage = 'Scholarship profile submitted successfully!';
        this.profileForm.reset();
        this.currentStep = 1;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to submit application. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
