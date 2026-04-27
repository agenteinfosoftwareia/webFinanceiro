export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  token: string;
}

export interface LoginResponse {
  token: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
