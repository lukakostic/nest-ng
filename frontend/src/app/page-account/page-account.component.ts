
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from '../user/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects } from '../user/user.effects';
import { State } from '../user/user.reducer';
import * as UserActions from '../user/user.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Post } from '../post/post.model';
import { PageMainComponent } from '../page-main/page-main.component';
import { Following } from '../user/following.model';
import * as PostActions from '../post/post.actions';
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
  isFollowing:boolean = false;
  following:Following|null = null;
  
  editUser: User = new User("","","",-1);
  editMode: boolean = false;
  
  followerUsers: User[] | null = null;
  followingUsers: User[] | null = null;

  //posts: Post[] = [];

  posts$: Observable<Post[]> = this.store.select(state=> ((state as any)['feed']).posts[this.userId!] );

  loggedIn: boolean = false;
  loggedInAccount : User|null = null;
  loggedInUser$: Observable<User|null> = this.store.select(state=> {
    this.loggedInAccount = ((state as any)['auth']).loggedInUser;
    this.loggedIn= !!(this.loggedInAccount);
    return this.loggedInAccount;
  });


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: UserService,
    private store: Store<State>
  ) {}

  followUser(){
    this.isFollowing=true;

    this.authService.follow(this.userId!).subscribe((response: any) => {
        this.following = response;
        if(this.following!=null){
          this.isFollowing = true;
        }else this.isFollowing = false;
        this.getUserData();
    });
  }
  unfollowUser(){
    this.isFollowing=false;
    this.authService.unfollow(this.userId!).subscribe((response: any) => {
        if(response!=null) this.following = null;
        if(response==true) this.isFollowing = false;
        this.getUserData();
      }
    );
  }

  getUserData(){
    this.userId = this.route.snapshot.queryParamMap.get('id');
    if(this.userId == null || this.userId==""){
      this.router.navigate(['/login']);
      //   this.userId = this.authService.getLoginToken();
    }
    
      console.log("loading user id ",this.userId);
    this.store.dispatch(PostActions.loadPosts({id:this.userId}));

    this.authService.allFollowing(this.userId!).subscribe((response: any) => {
      this.followingUsers = response;
    });
    this.authService.allFollowers(this.userId!).subscribe((response: any) => {
      this.followerUsers = response;
    });
    
    this.authService.userAndFollowing(this.userId!).subscribe((response: any) => {
        console.log("ACCOUNT PAGE ",response);
        this.user = response.user;
        this.following = response.following;
        if(this.following!=null){
          this.isFollowing = true;
        }else this.isFollowing = false;
        this.userLoaded.emit(this.user!);
        //localStorage.setItem('token', response.access_token);
      }
    );
  }

  ngOnInit(): void {
   
    this.getUserData();
    this.router.events.subscribe((event: Event) => {
      /*
      if (event instanceof NavigationStart)
      */

      if (event instanceof NavigationEnd) {
        console.log("ROUTER",event);
        // Hide loading indicator
        
        this.getUserData();
      }
      /*
      if (event instanceof NavigationError)
      */
    })
  }
  userDate(){
    //turn user.timestamp (number) to date string
    if(this.user==null) return "";
    return new Date(parseInt(this.user?.timestamp as any)).toLocaleDateString();
  }
  loginBypass(){
    console.log("login bypass")
    this.store.dispatch(UserActions.loginRequest({username:this.user!.username,password:"123",redirect:true}));
  }
  edit(){
    this.editUser = {...this.user} as any;
    this.editMode = true;
  }
  getUrl(){
    alert(this.user!.id);
  }
  delete(){
    if(confirm("Are you sure you want to delete your account? This action cannot be undone.") == false) return;
    this.authService.deleteProfile().subscribe((response: any) => {
        //this.user = response;
        this.authService.logout();
        this.router.navigate(['/']);
    });
  }
  saveEdit(){
    this.authService.editMyDescription(this.editUser?.description).subscribe((response: any) => {
        this.user = response;
    });
    this.editMode = false;
  }
  cancelEdit(){
    this.editMode = false;
  }
}
