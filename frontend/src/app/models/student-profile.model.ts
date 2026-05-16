export interface StudentProfile {
  id?: number;
  firstName: string;
  lastName: string;
  gpa: number;
  major: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  username: string;
}
