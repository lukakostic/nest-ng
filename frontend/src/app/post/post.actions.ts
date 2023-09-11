import { createAction, props } from '@ngrx/store';
import { Post } from './post.model';


export const createPosts = createAction(
    '[Post] Create Post',
    props<{ post: Partial<Post> }>()
  );
export const createPostsS = createAction(
    '[Post] Create Post Success',
    props<{ post: Post }>()
);
export const createPostsE = createAction(
    '[Post] Create Post Error',
    props<{ error: any }>()
);
  
export const loadFeed = createAction(
  '[Post] Load Feed',
  props<{ token: any }>()
);
export const loadPosts = createAction(
  '[Post] Load Posts',
  props<{ id:string|null }>()
);
export const loadPostsS = createAction(
  '[Post] Load Posts Success',
  props<{ posts: Post[], postsType:string }>()
);
export const loadPostsE = createAction(
  '[Post] Load Posts Error',
  props<{ error: any }>()
);