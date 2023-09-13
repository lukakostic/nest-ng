
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Post } from '../../post/post.model';
import { PostService } from '../../post/post.effects';
import * as PostActions from '../../post/post.actions';
import { Store } from '@ngrx/store';
import { State } from '../../post/post.reducer';
import { Subject, map, take, takeUntil } from 'rxjs';
import { UserService } from '../../user/user.service';
import { loginS } from 'src/app/user/user.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit,OnDestroy {

  postForm: FormGroup;
  images: string[] = [];
  @Output() postCreated = new EventEmitter<boolean>();
  /* From a parent component you would listen like so:
  <app-creator (postCreated)="onPostCreated($event)"></app-creator>
  onPostCreated(post: Post) {
    console.log(post);
  }
  */
  destroyed$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private actions$: Actions,
    private postService: PostService,
    private authService: UserService,
    private store: Store<State>
  ) {

    actions$.pipe(
      ofType(PostActions.createPostsS),
      takeUntil(this.destroyed$)
   )
   .subscribe((s) => {
      //console.log("LOGIN STATE",s);
      //let state: any = null;
      //this.store.pipe(take(1)).subscribe((s:any) => state = s);
      this.postCreated.emit(true);
      //need to import router as service in constructor:

   });
   }

   ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
}
  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      image: ['']
    });
  }

  onAddImage() {
    const image = this.postForm.get('image')!.value;
    if (image) {
      this.images.push(image);
      this.postForm.get('image')!.reset();
    }
  }

  onRemoveImage(index: number) {
    this.images.splice(index, 1);
  }

  onSubmit() {
    const title = this.postForm.get('title')!.value;
    const text = this.postForm.get('text')!.value;
    const post = new Post("",title, text, [...this.images], -1, null as any);
    
    this.postForm.reset();
    this.images = [];
    if(this.authService.getLoggedUser()==null) return;
    console.log("UPLOAD POST",post);
    this.store.dispatch(PostActions.createPosts({post: post}));
  }

  onAddedPost(){
    this.actions$.pipe(
      ofType(PostActions.createPostsS),
      map(action => { 
        console.log("Uploaded post",action.post);
        return action.post
      })
    )
  }

}