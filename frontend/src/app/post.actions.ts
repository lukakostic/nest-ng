import { createAction, props } from '@ngrx/store';
import { Post } from './post.model';


export const createPosts = createAction(
    '[Post] Create Post'
  );
export const createPostsS = createAction(
    '[Post] Create Post Success',
    props<{ posts: Post[] }>()
);
export const createPostsE = createAction(
    '[Post] Create Post Error',
    props<{ error: any }>()
);
  
export const loadPosts = createAction(
  '[Post] Load Posts'
);
export const loadPostsS = createAction(
  '[Post] Load Posts Success',
  props<{ posts: Post[] }>()
);
export const loadPostsE = createAction(
  '[Post] Load Posts Error',
  props<{ error: any }>()
);