import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../user/user.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../user/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects } from 'src/app/user/user.effects';
import { State } from 'src/app/user/user.reducer';
import * as UserActions from '../../user/user.actions';

import { Actions, ofType } from '@ngrx/effects';
import { EmailValidator } from '@angular/forms';

//import * as PostActions from '../post/post.actions';
//import { AuthEffects, State } from '../../auth/auth.actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  error$ = this.store.select(state=> ((state as any)['auth']).L_error);

  constructor(
    private authService: UserService,
    private store: Store<State>)
     {
      
    }

  onLogin() {
    this.store.dispatch(UserActions.loginRequest({username:this.username,password:this.password,redirect:true}));
  }

}