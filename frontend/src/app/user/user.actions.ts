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



