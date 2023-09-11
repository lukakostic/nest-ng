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
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnDestroy{
  isLogin = true;
  
  destroyed$ = new Subject<boolean>();

  constructor(
    private router: Router,
    private updates$: Actions,
    private authService: AuthService,
    private store: Store<State>) {
      updates$.pipe(
        ofType(loginS),
        takeUntil(this.destroyed$)
     )
     .subscribe((s) => {
      console.log("LOGIN STATE",s);
        
        this.router.navigate(['/']);
        //need to import router as service in constructor:

     });
    }

  ngOnDestroy() {
      this.destroyed$.next(true);
      this.destroyed$.complete();
  }

  showLogin() {
    this.isLogin = true;
  }

  showRegister() {
    this.isLogin = false;
  }
}
