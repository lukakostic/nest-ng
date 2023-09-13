
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from '../user/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects } from '../user/user.effects';
import { State } from '../user/user.reducer';
import * as UserActions from '../user/user.actions'
import { Actions, ofType } from '@ngrx/effects';
import { Post } from '../post/post.model';
import { PageMainComponent } from '../page-main/page-main.component';
import { Following } from '../user/following.model';
import * as PostActions from '../post/post.actions';
import { CommentM } from '../comment/comment.model';
@Component({
  selector: 'app-page-post',
  templateUrl: './page-post.component.html',
  styleUrls: ['./page-post.component.scss']
})
export class PagePostComponent implements OnInit{
  @Input() head: TemplateRef<any>;
  @Input() mainPage : PageMainComponent;

  postId:string|null = null;
  post: Post|null = null;
  comments : CommentM[]|null = null;

  other : any[] | null = null;

  isLoggedIn: boolean = false;
  loggedInUser$:any = this.store.select(state=> {
    let loggedInAccount = ((state as any)['auth']).loggedInUser;
    this.isLoggedIn = (loggedInAccount!=null);
    console.log("page post logged inddddddddddddddddddd",this.isLoggedIn);
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: UserService,
    private store: Store<State>
    ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.queryParamMap.get('id');
      console.log("POST ID (params)",this.postId);
      //this.loadFullPost();
    
    if(this.postId==null||this.postId==""){
      let url = window.location.pathname;
      console.log("URL",url);
      let id = url.substring(url.lastIndexOf('/') + 1);
      //if there are multiple query params, remove all except first
      let firstQuery = id.indexOf('?');
      let secondQuery = id.indexOf('&');
      //get text between ?id=...&..
      if(firstQuery!=-1&&secondQuery!=-1){
        id = id.substring(firstQuery+1+3,secondQuery);
        this.postId = id;
      }
    }

    let isLoggedIn = this.authService.getLoggedUser()!=null;
    console.log("POST ID",this.postId);
  
    this.authService.reqPost('/loadFullPost',{id:this.postId}).subscribe((response: any) => {
        console.log("POST LOAD RESPONSE",response);
        if(response){
          this.post = response.post;
          this.comments = response.comments;
        }
      //localStorage.setItem('token', response.access_token);
      //return response;
    });


    if(isLoggedIn){
      this.authService.reqPost('/allFollowingMe',{}).subscribe((response: any) => {
        console.log("All following me",response);
        if(response!=null){
          this.other = response.map((f:any)=>f.to);
        }
      }
    );
    }
  }

  submitComment(text:string){
    if(this.authService.getLoggedUser()!=null){
      this.authService.reqPost('/uploadComment',{comment:{text:text},toId:this.postId,isPost:true}).subscribe(
        (response: any) => {
          console.log("Comment response",response);
          if(response!=null){
            this.comments?.push(response);
            //this.comments = response;
          }
        }
      );
    }
  }
}
