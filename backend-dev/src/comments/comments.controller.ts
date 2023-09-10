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
export class CommentController {
  constructor(
    private readonly usersServices: UserServices,
    private readonly commentServices: CommentServices,
  ) { }
  @Get("comments")
  getComments(): Promise<CommentM[]> {
    return this.commentServices.getAllComments();
  }
  @Post("getCommentById")
  getCommentById(@Body() commentId: string): Promise<CommentM> {
    return this.commentServices.getCommentById(commentId);
  }
  @Post("getCommentsByUserId")
  getCommentsByUser(@Body() usr: Usr): Promise<CommentM[]|null> {
    if(usr.id!==null)
      return this.commentServices.getCommentsByUserId(usr.id);
    else if(usr.username!==null)
      return this.commentServices.getCommentsByUserUsername(usr.username);
    else
      return null;
  }

  @Post("uploadComment")
  async uploadComment(@Body() r: UserReq<{ comment: Partial<CommentM> }>): Promise<CommentM> {
    let usr = await this.usersServices.loginToken(r.token);
    r.comment.user = usr;
    r.comment.timestamp = Date.now();
    return this.commentServices.insert(r.comment as CommentM);
  }
}