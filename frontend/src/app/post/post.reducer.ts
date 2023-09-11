import { Action, createReducer, on } from '@ngrx/store';
import { Post } from './post.model';
import * as PostActions from './post.actions';

export const postFeatureKey = 'post';

export interface State {
  posts: Post[];
  postsType :string;//: 'feed' | 'all' | 'notLoaded' | 'error';
  uploadedPost: Post | null;
  error: any;
}

export const initialState: State = {
  posts: [],
  postsType: 'notLoaded',
  uploadedPost: null,
  error: null
};

export const postReducer = createReducer(
  initialState,
  on(PostActions.loadFeed, (state, action) => ({
    ...state,
    posts: [],
    postsType: 'notLoaded',
    error: null
  })),
  on(PostActions.loadPosts, (state, action) => ({
    ...state,
    posts: [],
    postsType: 'notLoaded',
    error: null
  })),
  on(PostActions.loadPostsS, (state, action) => {
    console.log("SZ",JSON.stringify(state));
    console.log("ZX",JSON.stringify(action.posts))
    return {
    ...state,
    posts: action.posts,
    postsType: action.postsType,
    error: null
  }}),
  on(PostActions.loadPostsE, (state, action) => ({
    ...state,
    posts: [],
    postsType: 'error',
    error: action.error
  })),

  on(PostActions.createPostsS, (state, action) => ({
    ...state,
    uploadedPost: action.post,
    error: null
  })),
  
);
