
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserRegData } from '../page-login/register/register.component';
import { Observable, map } from 'rxjs';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import { AuthEffects,State, loginRequest, loginS } from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient,
    private store: Store<State>,
    ) {}

  login(username: string, password: string) {
    return this.http.post(this.apiUrl + '/login', { username, password }).pipe(
      tap((response: any) => {
        console.log("LOGIN RESPONSE",response);
        //localStorage.setItem('token', response.access_token);
      })
    );
  }
  register(user:UserRegData) {
    return this.http.post(this.apiUrl + '/register', user).pipe(
      tap((response: any) => {
        console.log("REGISTER RESPONSE",response);
        //localStorage.setItem('token', response.access_token);
      })
    );
  }

  getLoginToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.store.dispatch(loginS({token:null,user:null}));
  }



  //@Get("users")
  getUsers(){//: Observable<User[]> {
    return this.http.get(this.apiUrl + '/users');
  }
  //continue resto
  getUserById(id: string){// : Observable<User> {
    return this.http.post(this.apiUrl + '/userById',id);
  }
  loginAll(obj:{ username?:string, password?:string, token?:string }){
    if(obj.token){
      console.log("Logging in by token ",obj.token);
      return this.loginByToken(obj.token);
    }else if(obj.username && obj.password){
      console.log("Logging in by user and pass ",obj.username,obj.password);
      return this.login2(obj);
    }
    throw new Error("Invalid loginAll");
  }
  loginByToken(token: string){// Observable<User>|null {
    return this.http.post(this.apiUrl + '/loginByToken',{token});
  } 
  login2(userPw : Partial<User>){// Observable<{user:User,token:string}>|null {
    return this.http.post(this.apiUrl + '/login',userPw);
  }
  register2(user: Partial<User>){// Observable<{user:User,token:string}|null> {
    return this.http.post(this.apiUrl + '/register',user);
  }
  
  loggedIn(user:User,token:string){
    console.log("AuthService loggedIn ",token,user);
    localStorage.setItem('token', token);
  }
}
