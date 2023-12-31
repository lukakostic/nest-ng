import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Post } from '../../post/post.model';
import * as PostActions from '../../post/post.actions';
import { State } from '../../post/post.reducer';
import { PageMainComponent } from '../page-main.component';
import { UserService } from 'src/app/user/user.service';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  @Input() head: TemplateRef<any>;
  @Input() isMyFeed: boolean = false;
  @Input() mainPage : PageMainComponent;
  
  userId:string|null;
  posts$: Observable<Post[]> = this.store.select(state=> ((state as any)['feed']).posts[this.isMyFeed?'feed':this.userId!] );
  other: any[] = [];
  constructor(private store: Store<State>,
    private authService: UserService
  ) {}

  reqPosts(){
    let authState = this.authService.getAuthState();
    if(this.isMyFeed){
      if(!(authState?.loggedInUser?.id)) return;
      this.userId = null;
      this.store.dispatch(PostActions.loadFeed());
    }else{
      this.userId = authState?.loggedInUser?.id ?? null;
      
      this.store.dispatch(PostActions.loadPosts({id:this.userId}));
    }
  }
  ngOnInit(): void {
    this.reqPosts();

    this.authService.allFollowingMe().subscribe((response: any) => {
        console.log("All following me",response);
        if(response!=null){
          this.other = response.map((f:any)=>f.to);
        }
      }
    );
  }

}