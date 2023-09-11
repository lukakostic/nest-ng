import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map,exhaustMap, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as PostActions from './post.actions';
import { Post } from './post.model';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root',
})
export class PostService {
    constructor(
      private http: HttpClient
    ) {}
    getFeed(token:string){
      return this.http.post<Post[]>('http://localhost:3000/feed',token)
    }
    getAllPosts(){
      return this.http.get<Post[]>('http://localhost:3000/allPosts')
    }
    getPosts(userId:string){
      return this.http.post<Post[]>('http://localhost:3000/postsByUser',{id:userId})
    }
    uploadPost(post:Partial<Post>){
      return this.http.post<Post>('http://localhost:3000/uploadPost',post)
    }
}


@Injectable()
export class PostEffects {

  constructor(
    private actions$: Actions,
    private postService: PostService,
    private authService: AuthService,
    private http: HttpClient
  ) {}
  
  loadFeed$ = createEffect(() => this.actions$.pipe(
    ofType(PostActions.loadFeed),
    exhaustMap((s) =>{ 
      let tok = this.authService.getLoginToken();
      if(tok==null) return [PostActions.loadPostsE({error:'Not logged in'})];
      console.log("get feed token:",tok);
      return this.postService.getFeed(tok).pipe(
        map(posts => {
          console.log("ALOOOOOOOO",posts);
          if(posts==null) return PostActions.loadPostsE({error:'Not logged in / feed error'});
            
            return PostActions.loadPostsS({ posts,postsType:'feed' })
        }),
        catchError(() => EMPTY)
      )})
    )
    );
    loadAllPosts$ = createEffect(() => this.actions$.pipe(
      ofType(PostActions.loadPosts),
      exhaustMap((s) => 
      (s.id? this.postService.getPosts(s.id) : this.postService.getAllPosts())
        .pipe(
          map(posts => {
              console.log("ALOOOOOOOO",posts);
              return PostActions.loadPostsS({ posts,postsType:'all' })
          }),
          catchError(() => EMPTY)
        ))
      )
      );

  createPosts$ = createEffect(() => this.actions$.pipe(
    ofType(PostActions.createPosts),
    exhaustMap((action) => this.postService.uploadPost(action.post)
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
