import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Post } from '../../post/post.model';
import * as PostActions from '../../post/post.actions';
import { State } from '../../post/post.reducer';
import { PageMainComponent } from '../page-main.component';
import { HttpClient } from '@angular/common/http';
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
    private http: HttpClient,
    private authService: UserService
    ) {}

  reqPosts(){
    let authState = this.authService.getAuthState();
    if(this.isMyFeed){
      if(!(authState?.loggedInUser?.id)) return;
      this.userId = null;
      this.store.dispatch(PostActions.loadFeed({token:authState?.token}));
    }else{
      this.userId = authState?.loggedInUser?.id ?? null;
      
      this.store.dispatch(PostActions.loadPosts({token:this.authService.getLoginToken(),id:this.userId}));
    }
  }
  ngOnInit(): void {
    this.reqPosts();

    this.http.post('http://localhost:3000/allFollowingMe',{token:this.authService.getLoginToken()}).subscribe(
      (response: any) => {
        console.log("All following me",response);
        if(response!=null){
          this.other = response.map((f:any)=>f.to);
        }
      }
    );
  }

}