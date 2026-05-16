import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Fixes formGroup error
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component'; // Fixes missing reference error
import { ProfileFormComponent } from './components/profile-form/profile-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, // Validates HTML form templates
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
