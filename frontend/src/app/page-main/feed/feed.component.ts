import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Post } from '../../post/post.model';
import * as PostActions from '../../post/post.actions';
import { State } from '../../post/post.reducer';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  @Input() isMyFeed: boolean = false;
  
  posts$: Observable<Post[]> = this.store.select(state=> ((state as any)['feed']).posts );

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    let state: any = null;
    this.store.pipe(take(1)).subscribe((s:any) => state = s);
    console.log("STATE",state);
    if(this.isMyFeed){
      this.store.dispatch(PostActions.loadFeed({token:(state as any).auth.token}));
    }else{
      this.store.dispatch(PostActions.loadPosts({id:(state as any).auth.loggedInUser?.id}));
    }
  }

}