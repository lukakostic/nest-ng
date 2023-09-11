import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Store } from '@ngrx/store';
import { Observable,map,tap } from 'rxjs';
import { User } from '../../auth/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, registerRequest } from '../../auth/auth.actions';

//import * as PostActions from '../post/post.actions';
//import { AuthEffects, State } from '../../auth/auth.actions';

export type UserRegData ={
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName: string = "";
  lastName: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  registered: boolean = false;


  constructor(private authService: AuthService,
    private store: Store<State>) {}


  onRegister() {
    const userData : UserRegData = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password
    };
    //send http post to localhost:3000/register
    this.store.dispatch(registerRequest({username:this.username,password:this.password,email:this.email,redirect:true}));
    /*
    this.authService.login(this.username, this.password).subscribe(user => {
      this.loggedIn = true;
    });*/
/*
    this.authService.register(userData).subscribe(response => {
      this.registered = true;
    });
  */  
  }
}
