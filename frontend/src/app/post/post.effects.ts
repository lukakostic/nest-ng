import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable } from 'rxjs';
import { map,exhaustMap, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as PostActions from './post.actions';
import { Post } from './post.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
    constructor(
      private http: HttpClient,
      private authService: UserService
    ) {}
    getFeed(){
      return this.authService.reqPost('/feed',{}) as Observable<Post[]>;
    }
    getAllPosts(){
      return this.authService.reqPost('/allPosts',{}) as Observable<Post[]>;
    }
    getPosts(userId:string){
      console.log("getPosts",userId);
      return this.authService.reqPost('/postsByUser',{id:userId}) as Observable<Post[]>;
    }
    uploadPost(r:{post:Partial<Post>}){
      return this.authService.reqPost('/uploadPost',{...r}) as Observable<Post>;
    }
    loadFullPost(id:string){
      return this.authService.reqPost('/loadFullPost',{id:id}) as Observable<Post>;
    }
}


@Injectable()
export class PostEffects {

  constructor(
    private actions$: Actions,
    private postService: PostService,
    private authService: UserService,
    private http: HttpClient
  ) {}
  
  loadFeed$ = createEffect(() => this.actions$.pipe(
    ofType(PostActions.loadFeed),
    mergeMap((s) =>{ 
      if(this.authService.getLoggedUser()==null) return [PostActions.loadPostsE({error:'Not logged in'})];
      
      return this.postService.getFeed().pipe(
        map(posts => {
          console.log("LOADED FEED",posts);
          if(posts==null) return PostActions.loadPostsE({error:'Not logged in / feed error'});
            
            return PostActions.loadPostsS({ posts,postsType:'feed' })
        }),
        catchError(() => EMPTY)
      )})
    )
    );
    loadPosts$ = createEffect(() => this.actions$.pipe(
      ofType(PostActions.loadPosts),
      mergeMap((s) => {
        console.log("loadPosts$ start: ",s);
      return (s.id? this.postService.getPosts(s.id) : this.postService.getAllPosts()).pipe(
          map(posts => {
              console.log("loadPosts$",s.id,posts);
              return PostActions.loadPostsS({ posts,postsType:(s.id??'all') })
          }),
          catchError(() => EMPTY)
        )
})
      )
      );

  createPosts$ = createEffect(() => this.actions$.pipe(
    ofType(PostActions.createPosts),
    mergeMap((action) => this.postService.uploadPost(action as any)
      .pipe(
        map(post => PostActions.createPostsS({ post })),
        catchError(() => EMPTY)
      ))
    )
  );
/*
  uploadedPost$ = createEffect(() => this.actions$.pipe(
    ofType(PostActions.createPostsS),
    //get uploaded post from store and console log it
    map(action => { 
      console.log("Uploaded post",action.post);
      return action.post
    })
  ),{dispatch:false});
*/
    /*
  loadPosts$ = createEffect(() => this.actions$.pipe(
    ofType(PostActions.loadPosts),
    mergeMap(() => this.http.get<Post[]>('http://localhost:3000/posts')
      .pipe(
        map(posts => PostActions.loadPostsS({ posts })),
        catchError(() => EMPTY)
      ))
    )
  );*/

}
