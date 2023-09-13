import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../user/user.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../user/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, loginS } from '../../user/auth.actions';
import { Actions, ofType } from '@ngrx/effects';

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
  loggedIn: boolean = false;

  constructor(
    private authService: UserService,
    private store: Store<State>) {
      
    }

  onLogin() {
    console.log("on login");
    this.store.dispatch(loginRequest({username:this.username,password:this.password,redirect:true}));
    /*
    this.authService.login(this.username, this.password).subscribe(user => {
      this.loggedIn = true;
    });*/

  }

}