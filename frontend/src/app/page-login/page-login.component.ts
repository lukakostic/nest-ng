import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../user/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects } from '../user/user.effects';
import { State } from '../user/user.reducer';
import * as UserActions from '../user/user.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';


@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent {
  isLogin = true;

  constructor() {
    }


  showLogin() {
    this.isLogin = true;
  }

  showRegister() {
    this.isLogin = false;
  }
}
