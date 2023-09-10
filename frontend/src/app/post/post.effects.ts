import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map,exhaustMap, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as PostActions from './post.actions';
import { Post } from './post.model';


@Injectable({
  providedIn: 'root',
})
export class PostService {
    constructor(
      private http: HttpClient
    ) {}
    getPosts(){
      return this.http.get<Post[]>('http://localhost:3000/posts')
    }
    uploadPost(post:Partial<Post>){
      return this.http.put<Post>('http://localhost:3000/uploadPost',post)
    }
}


@Injectable()
export class PostEffects {

  constructor(
    private actions$: Actions,
    private postService: PostService,
    private http: HttpClient
  ) {}
  
  loadPosts$ = createEffect(() => this.actions$.pipe(
    ofType(PostActions.loadPosts),
    exhaustMap(() => this.postService.getPosts()
      .pipe(
        map(posts => {
            console.log("ALOOOOOOOO",posts);
            return PostActions.loadPostsS({ posts })
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

  uploadedPost$ = createEffect(() => this.actions$.pipe(
    ofType(PostActions.createPostsS),
    //get uploaded post from store and console log it
    map(action => { 
      console.log("Uploaded post",action.post);
      return action.post
    })
  ),{dispatch:false});

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
