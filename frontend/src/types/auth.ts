export interface PatientProfile {
    patient_id: number;
    name: string;
    phone: string;
    bpjs_number: string | null;
    birth_place: string | null;
    birth_date: string | null;
    gender: string | null;
  }
  
  export type UserRole = 'patient' | 'doctor' | 'nurse' | 'admin';
  
  export interface AuthUser {
    user_id: number;
    email: string;
    role: UserRole;
    status: string;
    profile: PatientProfile;
  }
  
  export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
  }
  
  export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    // phone: string;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface LoginResponseData {
    token: string;
    token_type: string;
    user: AuthUser;
  }
  
  export interface ApiSuccessResponse<T> {
    message: string;
    data: T;
  }
  
  export interface ApiValidationError {
    message: string;
    errors: Record<string, string[]>;
  }