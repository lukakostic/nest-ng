import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../auth/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, loginS } from '../auth/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-main',
  templateUrl: './page-main.component.html',
  styleUrls: ['./page-main.component.scss']
})
export class PageMainComponent {
  mode = 0;  // 0 = feed, 1 = my posts, 2 = all posts
  loggedInAccount : User|null = null;
  loggedInAccount$ = this.store.select(state=> {
    let loggedInUser = ((state as any)['auth']).loggedInUser;
    if(loggedInUser){
      this.loggedInAccount = loggedInUser;
      return loggedInUser;
    }
    return null;
  } );
  constructor(
    private authService: AuthService,
    private store: Store<State>,
    private router: Router) {
      
    }

    goProfile(){

    }
    goLogin(){
      this.router.navigate(['/login']);
    }
}
