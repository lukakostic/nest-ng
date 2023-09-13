import { createAction, props } from '@ngrx/store';
import { User } from './user.model';
//import { Post } from './post.model';


export type UserToken = { token:string|null, user:User|null };

export const loginRequest = createAction(
  '[Auth] Login Request',
  props<{ username:string, password:string,redirect:boolean }>()
);
export const loginTokRequest = createAction(
  '[Auth] LoginByToken Request',
  props<{ redirect:boolean }>()
);
export const registerRequest = createAction(
  '[Auth] Register Request',
  props<{ username:string, password:string, email:string,redirect:boolean }>()
);

export const loginS = createAction(
  '[Auth] Login Success',
  props<UserToken>()
);
export const registerE = createAction(
  '[Auth] Register Error',
  props<{ error: string }>()
);
export const loginE = createAction(
  '[Auth] Login Error',
  props<{ error: string }>()
);



  import { Injectable } from '@angular/core';
  import { Actions, createEffect, ofType } from '@ngrx/effects';
  import { EMPTY } from 'rxjs';
  import { map,exhaustMap, mergeMap, catchError } from 'rxjs/operators';
  import { HttpClient } from '@angular/common/http';
  //import * as PostActions from './post.actions';
  //import { User } from './user.model';\
  import { UserService } from './user.service';


@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: UserService,
    private http: HttpClient
  ) {}
  
  loginReq$ = createEffect(() => this.actions$.pipe(
    ofType(loginRequest),//PostActions.loadPosts),
    mergeMap((action) => this.authService.login(action.username, action.password)
      .pipe(
        map((res:any)  => {
            console.log("login request res",res);
            if(res == null || res?.token==null) return loginE({error:"Login error"});
            this.authService.loggedIn(res!.user, res!.token);
            return loginS(res);
            //return PostActions.loadPostsS({ posts })
        }),
        catchError(() => EMPTY)
      ))
    )
    );
  
    loginTokReq$ = createEffect(() => this.actions$.pipe(
      ofType(loginTokRequest),//PostActions.loadPosts),
      mergeMap((action) => this.authService.loginByToken()
        .pipe(
          map((res:any)  => {
              console.log("login tok request res",res);
              if(res == null || res?.token==null) return loginE({error:"Login error"});
              this.authService.loggedIn(res!.user, res!.token);
              return loginS(res);
              //return PostActions.loadPostsS({ posts })
          }),
          catchError(() => EMPTY)
        ))
      )
      );

  registerReq$ = createEffect(() => this.actions$.pipe(
    ofType(registerRequest),//PostActions.createPosts),
    mergeMap((action) => this.authService.register2(action as any)
      .pipe(
        //map(res => loginS(res as any)), //PostActions.createPostsS({ post })),
        map((res:any) => {
            console.log("register request res",res);
            if(res == null) return registerE({error:"Register error (check details)"});
            this.authService.loggedIn(res!.user, res!.token);
            return loginS(res);
            //return PostActions.loadPostsS({ posts })
        }),
        catchError(() => EMPTY)
      ))
    )
  );
}

import { Action, createReducer, on } from '@ngrx/store';
//import { Post } from './post.model';
//import * as PostActions from './post.actions';


export interface State {
  loggedInUser: User | null;
  token: string | null;
  error: any;
  redirectOnLogin:boolean;
}

export const initialState: State = {
  loggedInUser: null,
  token: null,
  error: null,
  redirectOnLogin:false
};

export const authReducer = createReducer(
  initialState,
  on(loginRequest, (state, action) => {
    console.log("login req new",action);
    return {
    ...state,
    redirectOnLogin: action.redirect,
  }}),
  on(loginTokRequest, (state, action) => {
    console.log("loginTok req new",action);
    return {
    ...state,
    redirectOnLogin: action.redirect,
  }}),
  on(registerRequest, (state, action) => {
    console.log("register req new",action);
    return {
    ...state,
    redirectOnLogin: action.redirect,
  }}),
  on(loginS, (state, action) => {
    //console.log("SZ",JSON.stringify(state));
    //console.log("ZX",JSON.stringify(action.posts))
            console.log("login succ",action);
    return {
    ...state,
    token: action.token,
    loggedInUser: action.user,
    error: null
  }}),
  on(loginE, (state, action) => ({
    ...state,
    loggedInUser: null,
    token: null,
    error: 'Login error '+action.error
  })),
  on(registerE, (state, action) => ({
    ...state,
    loggedInUser: null,
    token: null,
    error: 'Register error '+action.error
  })),
/*
  on(PostActions.createPostsS, (state, action) => ({
    ...state,
    uploadedPost: action.post,
    error: null
  })),
  */
);
