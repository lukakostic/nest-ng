import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostM } from '../_entities/post.entity';
import { User } from '../_entities/user.entity';
import { Upvote } from '../_entities/upvote.entity';
import {CommentM} from '../_entities/comment.entity';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { UserServices } from '../users/users.services';
import { PostServices } from '../posts/posts.services';
import { VoteServices } from '../votes/votes.services';
import { CommentServices } from '../comments/comments.services';

import { UserReq,Usr } from '../app.controller';

@Controller()
export class PostController {
  constructor(
    private readonly usersServices: UserServices,
    private readonly postsServices: PostServices,
  ) { }
  @Get("allPosts")
  getPosts(): Promise<PostM[]> {
    return this.postsServices.getAllPosts();
  }
  @Post("postById")
  getPostById(@Body() postId: string): Promise<PostM> {
    return this.postsServices.getPostById(postId);
  }
  @Post("postsByUser")
  getPostsByUser(@Body() usr: Usr): Promise<PostM[]|null> {
    if(usr.id!==null)
      return this.postsServices.getPostsByUserId(usr.id);
    else if(usr.username!==null)
      return this.postsServices.getPostsByUserUsername(usr.username);
    else
      return null;
  }
  @Post("uploadPost")
  async uploadPost(@Body() r: UserReq<{ post: Partial<PostM> }>): Promise<PostM> {
    let usr = await this.usersServices.loginToken(r.token);
    r.post.user = usr;
    r.post.timestamp = Date.now();
    return this.postsServices.insert(r.post as PostM);
  }
  @Post("feed")
  async feed(@Body() r: UserReq<{}>): Promise<PostM[]|null> {
    let usr = await this.usersServices.loginToken(r.token);
    if(usr)
    return this.postsServices.feed(usr.id);
    else return null;
  }

}