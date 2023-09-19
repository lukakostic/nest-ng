
import { Action, createReducer, on } from '@ngrx/store';
//import { Post } from './post.model';
//import * as PostActions from './post.actions';
import * as UserActions from './user.actions';
import { User } from './user.model';

export interface State {
  loggedInUser: User | null;
  token: string | null;
  L_error: any;
  R_error: any;
  redirectOnLogin:boolean;
}

export const initialState: State = {
  loggedInUser: null,
  token: null,
  L_error: null,
  R_error: null,
  redirectOnLogin:false
};

export const authReducer = createReducer(
  initialState,
  
  on(UserActions.loginRequest, (state, action) => {
    console.log("login req new",action);
    return {
    ...state,
    redirectOnLogin: action.redirect,
    L_error: null,
  }}),
  
  on(UserActions.loginTokRequest, (state, action) => {
    console.log("loginTok req new",action);
    return {
    ...state,
    redirectOnLogin: action.redirect,
  }}),
  
  on(UserActions.registerRequest, (state, action) => {
    console.log("register req new",action);
    return {
    ...state,
    redirectOnLogin: action.redirect,
    R_error: null,
  }}),
  
  on(UserActions.loginS, (state, action) => {
    return {
    ...state,
    token: action.token,
    loggedInUser: action.user,
    L_error: null
  }}),
  
  on(UserActions.loginE, (state, action) => ({
    ...state,
    loggedInUser: null,
    token: null,
    L_error: action.error
  })),
  
  on(UserActions.registerE, (state, action) => ({
    ...state,
    loggedInUser: null,
    token: null,
    R_error: action.error
  })),

/*
  on(PostActions.createPostsS, (state, action) => ({
    ...state,
    uploadedPost: action.post,
    error: null
  })),
  */
);
