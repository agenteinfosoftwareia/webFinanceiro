import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';

const USER_KEY = 'fn_user';

const MOCK_USER: LoginResponse = {
  token: 'mock-token-123',
  name: 'Flávio Nogueira',
  email: 'flavio@hyti.com.br',
  isAdmin: true
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  login(_req: LoginRequest): Observable<LoginResponse> {
    localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
    localStorage.setItem('fn_jwt', MOCK_USER.token);
    return of(MOCK_USER);
  }

  register(_req: RegisterRequest): Observable<LoginResponse> {
    return of({ ...MOCK_USER, token: '' });
  }

  googleLogin(_token: string): Observable<LoginResponse> {
    localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
    localStorage.setItem('fn_jwt', MOCK_USER.token);
    return of(MOCK_USER);
  }

  logout(): void {
    localStorage.removeItem('fn_jwt');
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem('fn_jwt');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): LoginResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isAdmin(): boolean {
    return this.getUser()?.isAdmin ?? false;
  }
}
