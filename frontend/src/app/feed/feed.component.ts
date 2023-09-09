import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from '../post.model';
import * as PostActions from '../post.actions';
import { State } from '../post.reducer';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  //posts: Post[] = [];

  posts$: Observable<Post[]> = this.store.select(state=>
    {
    console.log("AAx ",((state as any)['feed']).posts);
    return ((state as any)['feed']).posts
  });

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.store.dispatch(PostActions.loadPosts());
  }

}