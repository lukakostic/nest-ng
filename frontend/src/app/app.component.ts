import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from './auth/user.model';
//import * as PostActions from '../post/post.actions';
import { State, loginRequest } from './auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';


  loggedInUser$: Observable<User> = this.store.select(state=> ((state as any)['auth']).loggedInUser );
  loginToken$: Observable<string> = this.store.select(state=> ((state as any)['auth']).token );
  //posts$: Observable<Post[]> = this.store.select(state=> ((state as any)['feed']).posts );

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    //this.store.dispatch(loginRequest());//PostActions.loadPosts());
  }
}
