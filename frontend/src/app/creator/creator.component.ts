
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Post } from '../post/post.model';
import { PostService } from '../post/post.effects';
import * as PostActions from '../post/post.actions';
import { Store } from '@ngrx/store';
import { State } from '../post/post.reducer';
import { map } from 'rxjs';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {

  postForm: FormGroup;
  images: string[] = [];
  @Output() postCreated = new EventEmitter<Post>();
  /* From a parent component you would listen like so:
  <app-creator (postCreated)="onPostCreated($event)"></app-creator>
  onPostCreated(post: Post) {
    console.log(post);
  }
  */

  constructor(
    private fb: FormBuilder,
    private actions$: Actions,
    private postService: PostService,
    private store: Store<State>
  ) { }

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
    const post = new Post("","",title, text, this.images);
    this.postCreated.emit(post);
    this.postForm.reset();
    this.images = [];
    let postObj = {
      title: title,
      text: text,
      images: this.images
    }

    this.store.dispatch(PostActions.createPosts({post: postObj}));
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