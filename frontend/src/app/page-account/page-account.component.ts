import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from '../auth/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, loginS } from '../auth/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Post } from '../post/post.model';
import { PageMainComponent } from '../page-main/page-main.component';
@Component({
  selector: 'app-page-account',
  templateUrl: './page-account.component.html',
  styleUrls: ['./page-account.component.scss'],

})
export class PageAccountComponent implements OnInit{
  @Input() head: TemplateRef<any>;
  @Output() userLoaded = new EventEmitter<User>();

  //@Input() mainPage : PageMainComponent;
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
    private router: Router,
    private authService: AuthService,
    private store: Store<State>
    ) {}

    getUserData(){
      this.userId = this.route.snapshot.queryParamMap.get('id');
      if(this.userId == null || this.userId==""){
        this.router.navigate(['/login']);
        //   this.userId = this.authService.getLoginToken();
      }
      this.http.get('http://localhost:3000/userById/'+this.userId).subscribe(
        (response: any) => {
          console.log("ACCOUNT PAGE ",response);
          this.user = response;
          this.userLoaded.emit(this.user!);
          //localStorage.setItem('token', response.access_token);
        }
      );
    }
  ngOnInit(): void {
   
    this.getUserData();
    this.router.events.subscribe((event: Event) => {
      /*
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }
      */

      if (event instanceof NavigationEnd) {
        console.log("ROUTER",event);
        // Hide loading indicator
        
        this.getUserData();
      }
      /*
      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
      */
    })
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
