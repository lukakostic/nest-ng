import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from '../user/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, loginS } from '../user/auth.actions';
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

  constructor(
    private http: HttpClient,
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

    let token = this.authService.getLoginToken();
    console.log("POST ID",this.postId);
    this.http.post('http://localhost:3000/loadFullPost',{token,id:this.postId}).subscribe((response: any) => {
        console.log("POST LOAD RESPONSE",response);
        if(response){
          this.post = response.post;
          this.comments = response.comments;
        }
      //localStorage.setItem('token', response.access_token);
      //return response;
    });


    if(token){
    this.http.post('http://localhost:3000/allFollowingMe',{token}).subscribe(
      (response: any) => {
        console.log("All following me",response);
        if(response!=null){
          this.other = response.map((f:any)=>f.to);
        }
      }
    );
    }
  }

  submitComment(text:string){
    let token = this.authService.getLoginToken();
    if(token){
      this.http.post('http://localhost:3000/uploadComment',{token,comment:{text:text},toId:this.postId,isPost:true}).subscribe(
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
