import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse } from './auth-response.interface';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:action?key=AIzaSyB_lHzVMi6GQSiMp8zr48Te7ZjGfapvECg';
  userSubject = new BehaviorSubject<User | null>(null);
  token = null;
  private tokenExpirationTimeoutId: number | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string): Observable<AuthResponse> {
    return this.post('signUp', email, password);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.post('signInWithPassword', email, password).pipe(
      tap(this.handleAuthentication.bind(this))
    );
  }

  autoLogin() {
    const user: {
      email: string;
      id: string;
      _token: string;
      _tokenExpiresAt: string;
    } = JSON.parse(localStorage.getItem('user')!);
    if (!user) return;

    const tokenExpiresAt = new Date(user._tokenExpiresAt);
    const loadedUser = new User(
      user.email,
      user.id,
      user._token,
      tokenExpiresAt
    );
    if (loadedUser.token) {
      const expirationDuration =
        tokenExpiresAt.getTime() - new Date().getTime();
      this.loginDuring(loadedUser, expirationDuration);
    }
  }

  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('user');
    this.tokenExpirationTimeoutId &&
      clearTimeout(this.tokenExpirationTimeoutId);
    this.tokenExpirationTimeoutId = undefined;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimeoutId = setTimeout(
      this.logout.bind(this),
      expirationDuration
    );
  }

  private post(endpoint: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        this.baseUrl.replace('action', endpoint),
        this.getAuthenticationBody(email, password)
      )
      .pipe(catchError(this.handleError));
  }

  private handleAuthentication(response: AuthResponse) {
    const now = Date.now();
    const expiresInMilliseconds = +response.expiresIn * 1000;
    const expiresAt = new Date(now + expiresInMilliseconds);
    const user = new User(
      response.email,
      response.localId,
      response.idToken,
      expiresAt
    );
    this.loginDuring(user, expiresInMilliseconds);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private loginDuring(user: User, expiresInMilliseconds: number) {
    this.userSubject.next(user);
    this.autoLogout(expiresInMilliseconds);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);
    let errorMessage = 'Unknown error occurred';
    switch (errorResponse?.error?.error?.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email is already taken';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email is not found';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Incorrect email or password';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }

  private getAuthenticationBody(email: string, password: string) {
    return {
      email,
      password,
      returnSecureToken: true,
    };
  }
}
