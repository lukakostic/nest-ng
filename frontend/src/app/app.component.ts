import { Component, OnInit,OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { User } from './user/user.model';
//import * as PostActions from '../post/post.actions';
import { Router } from '@angular/router';
import { UserService } from './user/user.service';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, loginS } from './user/auth.actions';
import { Actions, ofType } from '@ngrx/effects';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  destroyed$ = new Subject<boolean>();

  loggedInUser$: Observable<User> = this.store.select(state=> {
    console.log("Logged in user change! ",JSON.stringify((state as any)['auth']));
    return ((state as any)['auth']).loggedInUser;
  });
  loginToken$: Observable<string> = this.store.select(state=> ((state as any)['auth']).token );
  //posts$: Observable<Post[]> = this.store.select(state=> ((state as any)['feed']).posts );

  constructor(private store: Store<State>,
    private router: Router,
    private updates$: Actions,
    private authService: UserService
    ) {
      updates$.pipe(
        ofType(loginS),
        takeUntil(this.destroyed$)
     )
     .subscribe((s) => {
        console.log("LOGIN STATE",s);
        if(this.authService.getAuthState()?.redirectOnLogin) this.router.navigate(['/']);
        //need to import router as service in constructor:

     });
    }

  ngOnInit(): void {
    let token = this.authService.getLoginToken();
    console.log("On init token",token);
    if(token===undefined) console.log("TOKEN IS UNDEFINED");
    if(token)
     this.store.dispatch(loginRequest({token,redirect:false}));//PostActions.loadPosts());
  }
  ngOnDestroy() {
      this.destroyed$.next(true);
      this.destroyed$.complete();
  }


}
