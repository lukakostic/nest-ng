import { Action, createReducer, on } from '@ngrx/store';
import { Post } from './post.model';
import * as PostActions from './post.actions';

export const postFeatureKey = 'post';

export interface State {
  posts: {[index:string]:Post[]|null};    //multi post type cache
  uploadedPost: Post | null;
  error: any;
}

export const initialState: State = {
  posts: {},
  uploadedPost: null,
  error: null
};

export const postReducer = createReducer(
  initialState,
  on(PostActions.loadFeed, (state, action) => ({
    ...state,
    posts: {...state.posts,feed:null},
    error: null
  })),
  on(PostActions.loadPosts, (state, action) => ({
    ...state,
    posts: {...state.posts,[action.id??"all"]:null},
    error: null
  })),
  on(PostActions.loadPostsS, (state, action) => {
    console.log("LOAD POSTS SUCCESS",action.postsType,action.posts);
    console.log("SZ",JSON.stringify(state));
    console.log("ZX",JSON.stringify(action.posts))
    return {
    ...state,
    posts: { ...state.posts, [action.postsType]:action.posts },
    postsType: action.postsType,
    error: null
  }}),
  on(PostActions.loadPostsE, (state, action) => ({
    ...state,
    //posts: {},
    error: action.error
  })),

  on(PostActions.clearPostCache, (state, action) => ({
    ...state,
    posts: {},
  })),

  on(PostActions.createPostsS, (state, action) => ({
    ...state,
    uploadedPost: action.post,
    error: null
  })),
  
);
