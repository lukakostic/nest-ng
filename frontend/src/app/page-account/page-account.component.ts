import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from '../auth/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, loginS } from '../auth/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Post } from '../post/post.model';
@Component({
  selector: 'app-page-account',
  templateUrl: './page-account.component.html',
  styleUrls: ['./page-account.component.scss'],

})
export class PageAccountComponent implements OnInit{

  userId:string|null = null;
  user: User|null = null;
  editUser: User|null = null;
  editMode: boolean = false;
  posts: Post[] = [];
  posts$: Observable<any[]> = this.store.select(state=>{
    this.posts = ((state as any)['feed']).posts;
    return this.posts;
   } );

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: Store<State>
    ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('id');
    if(this.userId == null){
      return;
      //   this.userId = this.authService.getLoginToken();
    }
    this.http.get('http://localhost:3000/userById/'+this.userId).subscribe(
      (response: any) => {
        console.log("ACCOUNT PAGE ",response);
        this.user = response;
        //localStorage.setItem('token', response.access_token);
      }
    );
  }
userDate(){
  //turn user.timestamp (number) to date string
  if(this.user==null) return "";
  return new Date(parseInt(this.user?.timestamp as any)).toLocaleDateString();
}
  loginBypass(){
    this.store.dispatch(loginRequest({username:this.user?.username,password:"123",redirect:true}));
  }
  edit(){

  }
  getUrl(){
    alert(this.user!.id);
  }
  saveEdit(){

  }
  cancelEdit(){

  }
}
