
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map,exhaustMap, mergeMap, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import * as UserActions from './user.actions';
import { User } from './user.model';


@Injectable()
export class AuthEffects {

constructor(
  private actions$: Actions,
  private authService: UserService
) {}

loginReq$ = createEffect(() => this.actions$.pipe(
  ofType(UserActions.loginRequest),//PostActions.loadPosts),
  mergeMap((action) => this.authService.login2({username:action.username, password:action.password})
    .pipe(
      map((res:any)  => {
          console.log("login request res",res);
          if(res == null || res?.token==null) return UserActions.loginE({error:"Login error - invalid credentials?"});
          this.authService.loggedIn(res!.user, res!.token);
          return UserActions.loginS(res);
          //return PostActions.loadPostsS({ posts })
      }),
      catchError(((err:any) => {
        return UserActions.loginE({error:err.error});
      }) as any )
    ))
  )
  );

  loginTokReq$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loginTokRequest),//PostActions.loadPosts),
    mergeMap((action) => this.authService.loginByToken()
      .pipe(
        map((res:any)  => {
            console.log("login tok request res",res);
            if(res == null || res?.token==null) return UserActions.loginE({error:"Automatic (token) login error - expired token."});
            this.authService.loggedIn(res!.user, res!.token);
            return UserActions.loginS(res);
            //return PostActions.loadPostsS({ posts })
        }),
        catchError(() => EMPTY)
      ))
    )
    );

registerReq$ = createEffect(() => this.actions$.pipe(
  ofType(UserActions.registerRequest),//PostActions.createPosts),
  mergeMap((action) => this.authService.register2(action as any)
    .pipe(
      //map(res => loginS(res as any)), //PostActions.createPostsS({ post })),
      map((res:any) => {
          console.log("register request res",res);
          if(res == null) return UserActions.registerE({error:"Register error (check details)"});
          this.authService.loggedIn(res!.user, res!.token);
          return UserActions.loginS(res);
          //return PostActions.loadPostsS({ posts })
      }),
      catchError(((err:any) => {
        return UserActions.registerE({error:err.error});
      }) as any )
    ))
  )
);
}