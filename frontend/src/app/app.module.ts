import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module'; // Added
import { AppComponent } from './app.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component'; // Added
import { AuthPortalComponent } from './components/auth-portal/auth-portal.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor'; // Added

@NgModule({
  declarations: [
    AppComponent,
    AuthPortalComponent,
    ProfileFormComponent,
    AdminDashboardComponent // Registered
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule // Registered
  ],
  providers: [
    // Registers the security token inspector for all outgoing HTTP calls
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
