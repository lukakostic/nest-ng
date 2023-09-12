import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { User } from '../auth/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, loginS } from '../auth/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-page-main',
  templateUrl: './page-main.component.html',
  styleUrls: ['./page-main.component.scss']
})
export class PageMainComponent implements OnInit {
  mode = 0;  // 0 = feed, 1 = my posts, 2 = all posts, 3 = viewing profile
  loggedIn: boolean = false;
  loggedInAccount : User|null = null;
  
  loadedProfile : User|null = null;

  @ViewChild('matMenuTrigger') profileMenu: MatMenuTrigger;

  loggedInUser$: Observable<User|null> = this.store.select(state=> {
    this.loggedInAccount = ((state as any)['auth']).loggedInUser;
    let li = !!(this.loggedInAccount);
    if(li && this.loggedIn==false) this.mode=0;
    this.loggedIn=li;
    if(this.loggedIn==false && this.mode!=3) this.mode=2;
    console.log("MAIN PAGE, loggedInAccount:",this.loggedInAccount);
    return this.loggedInAccount;
  });

  constructor(
    private authService: AuthService,
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute) {
      let state: any = null;
      this.store.pipe(take(1)).subscribe((s:any) => state = s);
      if(state.auth.loggedInUser){
        this.loggedInAccount = state.auth.loggedInUser;
        this.loggedIn = true;
      }else{
        this.loggedIn = false;
      }
    }

    goProfileBadge(){
      this.profileMenu.openMenu();//.openMenu();
    }
    goLogin(){
      this.router.navigate(['/login']);
    }

    goProfile(userId:string|null){
      userId??=this.loggedInAccount?.id!;
      if(userId)
        this.router.navigate(['/user'],{ queryParams:{id:userId}});
      else this.router.navigate(['/login']);
    }
    goLogout(){
      this.authService.logout();
      this.router.navigate(['/']);
    }
    goFeed(){
      this.router.navigate(['/']);
    }
    doLoadProfile(usr:User){
      this.loadedProfile = usr;
    }
    ngOnInit(): void {
      //console.log("MAIN PAGE INIT",this.loggedInAccount);
      const segments: UrlSegment[] = this.route.snapshot.url;
      if(this.loggedIn==false && this.mode!=3) this.mode=2;
      if(segments.length>0 && segments[0].path =='user') this.mode=3;


    }
}
