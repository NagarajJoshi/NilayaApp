import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-portal',
  templateUrl: './auth-portal.component.html',
  styleUrls: ['./auth-portal.component.css']
})
export class AuthPortalComponent {
  authForm: FormGroup;
  isLoginMode = true;
  message = '';
  isError = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_STUDENT']
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
    this.authForm.reset({ role: 'ROLE_STUDENT' });
  }

  onSubmit(): void {
    if (this.authForm.invalid) return;

    this.message = '';
    this.isError = false;

    // Diagnostic Check: Inspect this in your browser console (F12) 
    console.log('Sending Registration Payload:', this.authForm.value);

    if (this.isLoginMode) {
      this.authService.login(this.authForm.value).subscribe({
        next: (res) => {
          if (res.role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/apply']);
          }
        },
        error: () => { this.message = 'Invalid user credentials.'; this.isError = true; }
      });
    } else {
      this.authService.register(this.authForm.value).subscribe({
        next: () => { 
          this.message = 'Registration complete! Please login now.'; 
          this.isLoginMode = true; 
        },
        error: (err) => { 
          // Displays the clear message payload returned from Spring Boot
          this.message = err.error?.message || 'Registration failed.'; 
          this.isError = true; 
        }
      });
    }
  }
}
