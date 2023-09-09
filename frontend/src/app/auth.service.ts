
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserRegData } from './page-login/register/register.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(this.apiUrl + '/login', { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }
  register(user:UserRegData) {
    return this.http.post(this.apiUrl + '/register', user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
