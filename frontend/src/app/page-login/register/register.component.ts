import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { UserService } from '../../user/user.service';
import { Store } from '@ngrx/store';
import { Observable,map,tap } from 'rxjs';
import { User } from '../../user/user.model';
//import * as PostActions from '../post/post.actions';
import * as UserActions from '../../user/user.actions';
import { AuthEffects } from 'src/app/user/user.effects';
import { State } from 'src/app/user/user.reducer';
//import * as PostActions from '../post/post.actions';
//import { AuthEffects, State } from '../../auth/auth.actions';


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

  error$ = this.store.select(state=> ((state as any)['auth']).error);

  constructor(
    private authService: UserService,
    private store: Store<State>
  ) {}


  onRegister() {
    this.store.dispatch(UserActions.registerRequest({
      username:this.username,
      password:this.password,
      email:this.email,
      redirect:true
    }));
  
  }
}
