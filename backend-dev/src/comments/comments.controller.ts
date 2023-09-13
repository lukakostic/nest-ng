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
    private readonly voteServices: VoteServices
    ,
  ) { }
  
  @Get("comments")
  getComments(): Promise<CommentM[]> {
    return this.commentServices.getAllComments();
  }
  @Post("loadCommentsPost")
  async loadCommentsPost(@Body() r:UserReq<{postId:string,depth?:number}> ): Promise<CommentM[]> {
    r.depth??=1;
    let usr = await this.usersServices.loginToken(r.token);
    let comments = await this.loadCommentsPostForUser(usr?usr.id:null,r.postId,null,r.depth);
    return comments;
  }
  async loadCommentsPostForUser(userId:string|null,postId:string,parentComment?:CommentM,depth?:number): Promise<CommentM[]> {
    depth ??= 1;
    let comments = await this.commentServices.getCommentsByPostId(postId);
    for(let i=0;i<comments.length;i++){
      let c = comments[i];
      c['userVote'] = userId?(await this.voteServices.getUserPCVote(userId,c.id)):null;
      c['voteCount'] = await this.voteServices.getPCVoteCount(c.id);
      c['replies'] = [];
    }
    if(parentComment) parentComment['replies'] = comments;
    /*
    if(depth>1){
    for(let i=0;i<comments.length;i++){
        await this.loadCommentsPostForUser(userId,postId,comments[i],depth-1);
    }
    */
    return comments;
  }
  @Post("loadComment")
  async loadComment(@Body() r: UserReq<{id: string}>): Promise<CommentM> {
    let usr = await this.usersServices.loginToken(r.token);
    let c = this.loadCommentForUser(usr?usr.id:null,r.id);
    return c;
  }
  async loadCommentForUser(userId:string|null,commId:string): Promise<CommentM> {
    let c = await this.commentServices.getCommentById(commId);
    c['userVote'] = userId?(await this.voteServices.getUserPCVote(userId,c.id)):null;
    c['voteCount'] = await this.voteServices.getPCVoteCount(c.id);
    c['replies'] = [];
    return c;
  }
  /*
  @Post("getCommentsByUserId")
  getCommentsByUser(@Body() usr: Usr): Promise<CommentM[]|null> {
    if(usr.id!==null)
      return this.commentServices.getCommentsByUserId(usr.id);
    else if(usr.username!==null)
      return this.commentServices.getCommentsByUserUsername(usr.username);
    else
      return null;
  }
  */
  @Post("uploadComment")
  async uploadComment(@Body() r: UserReq<{ comment: Partial<CommentM>, toId:string, isPost:boolean }>): Promise<CommentM> {
    let usr = await this.usersServices.loginToken(r.token);
    if(usr==null) return null;
    if(r.comment.id) delete r.comment.id;
    r.comment.user = usr.id as any;
    r.comment.timestamp = Date.now();
    r.comment.replyToId = r.toId;
    r.comment.replyType = r.isPost?"post":"comment";
    let c = await this.commentServices.insert(r.comment as CommentM);
    c.user = usr;
    return c;
  }
}