
import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { Observable, map } from 'rxjs';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import * as UserActions from './user.actions';
import { AuthEffects } from './user.effects';
import { State } from './user.reducer';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient,
    private store: Store<State>,
    ) {}

  reqPost(path:string,obj:any){
    let token = this.getLoginToken() ?? "";
    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
   });
    return this.http.post(this.apiUrl + path,Object.assign(obj,{token}),{headers:reqHeader});
  }
  reqGet(path:string){
    let token = this.getLoginToken() ?? "";
    var reqHeader = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(this.apiUrl + path,{headers:reqHeader});
  }
  

  /*
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
  }*/

  private getLoginToken() {
    return localStorage.getItem('token');
  }
  hasLoginToken() {
    return this.getLoginToken() != null;
  }

  logout() {
    localStorage.removeItem('token');
    this.store.dispatch(UserActions.loginS({token:null,user:null}));
  }



  //@Get("users")
  getUsers(){//: Observable<User[]> {
    return this.http.get(this.apiUrl + '/users');
  }
  //continue resto
  getUserById(id: string){// : Observable<User> {
    return this.reqPost('/userById',{id:id});
  }
  /*
  private loginAll(obj:{ username?:string, password?:string, token?:string }){
    if(obj.token){
      console.log("Logging in by token ",obj.token);
      return this.loginByToken();
    }else if(obj.username && obj.password){
      console.log("Logging in by user and pass ",obj.username,obj.password);
      return this.login2(obj);
    }
    throw new Error("Invalid loginAll");
  }
  */
  loginByToken(){// Observable<User>|null {
    return this.reqPost('/loginByToken',{});
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

  getAuthState() : State|null{
    let state : any = null;
    this.store.pipe(take(1)).subscribe((s:any) => state = s['auth']);
    return state;
  }
  getLoggedUser(){
    return this.getAuthState()?.loggedInUser;
  }

  ////////////// following

  follow(user:string){
    return this.reqPost('/follow',{user});
  }
  unfollow(user:string){
    return this.reqPost('/unfollow',{user});
  }

  allFollowing(id:string){
    return this.reqPost('/allFollowing',{id});
  }
  allFollowers(id:string){
    return this.reqPost('/allFollowers',{id});
  }
  userAndFollowing(user:string){
    return this.reqPost('/userAndFollowing',{user});
  }
  allFollowingMe(){
    return this.reqPost('/allFollowingMe',{});
  }

  /////////////// profile
  editMyDescription(desc:string){
    return this.reqPost('/editMyDescription',{desc});
  }
}
