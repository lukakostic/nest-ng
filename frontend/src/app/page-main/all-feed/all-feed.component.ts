
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subject, takeUntil, tap,take, exhaustMap } from 'rxjs';
//import * as PostActions from '../post/post.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Post } from '../../post/post.model';
import * as PostActions from '../../post/post.actions';
import { State } from '../../post/post.reducer';
import { User } from 'src/app/auth/user.model';
import { PageMainComponent } from '../page-main.component';


@Component({
  selector: 'app-all-feed',
  templateUrl: './all-feed.component.html',
  styleUrls: ['./all-feed.component.scss']
})
export class AllFeedComponent implements OnInit{
  @Input() head: TemplateRef<any>;
  @Input() mainPage : PageMainComponent;
  posts$: Observable<Post[]> = this.store.select(state=> ((state as any)['feed']).posts );

  constructor(
    private http: HttpClient,
    private store: Store<State>
    ) {}
    allUsers: User[] = [];

  ngOnInit(): void {
/*
    let state: any = null;
    this.store.pipe(take(1)).subscribe((s:any) => state = s);
    console.log("STATE",state);
    this.store.dispatch(PostActions.loadFeed({token:(state as any).auth.token}));
  */  
    this.store.dispatch(PostActions.loadPosts({id:null}));
    console.log("ALL users ping");
    this.http.get('http://localhost:3000/allUsers').subscribe((response: any) => {
        
      console.log("ALL users ",response);
      this.allUsers = response;
      //localStorage.setItem('token', response.access_token);
      return response;
    });
  }
}
