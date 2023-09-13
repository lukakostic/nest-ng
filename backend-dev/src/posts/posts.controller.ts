import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
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
import { CommentController } from 'src/comments/comments.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class PostController {
  constructor(
    private readonly usersServices: UserServices,
    private readonly postsServices: PostServices,
    private readonly commentServices: CommentServices,
    private readonly voteServices: VoteServices,
  ) { }
  @Post("allPosts")
  async getPosts(@Body() r:UserReq<{}> ): Promise<PostM[]> {
    console.log("allPosts",r);
    let posts = await this.postsServices.getAllPosts();
    let usr = await this.usersServices.loginToken(r.token);
    
    for(let i=0;i<posts.length;i++){
      let p = posts[i];
      p['userVote'] = usr?(await this.voteServices.getUserPCVote(usr.id,p.id)):null;
      p['voteCount'] = await this.voteServices.getPCVoteCount(p.id);
    }
    return posts;
  }
  @Post("postById")
  async getPostById(@Body() r:UserReq<{postId: string}> ): Promise<PostM> {
    let p = await this.postsServices.getPostById(r.postId);
    let usr = await this.usersServices.loginToken(r.token);
    
    p['userVote'] = usr?(await this.voteServices.getUserPCVote(usr.id,p.id)):null;
    p['voteCount'] = await this.voteServices.getPCVoteCount(p.id);
    return p;
  }
  @Post("loadFullPost")
  async loadFullPost(@Body() r: UserReq<{ id: string }>): Promise<any> {
    let usr = await this.usersServices.loginToken(r.token);
    let cc = new CommentController(this.usersServices,this.commentServices,this.voteServices);
    let resp = {
      post: await this.postsServices.getPostById(r.id),
      comments: await cc.loadCommentsPost({token:r.token,postId:r.id,depth:1}), //this.postsServices.getCommentsByPostId(r.id),
    }
    resp.post['userVote'] = usr?(await this.voteServices.getUserPCVote(usr.id,resp.post.id)):null;
    resp.post['voteCount'] = await this.voteServices.getPCVoteCount(resp.post.id);
    
    return resp;
  }
  @Post("postsByUser")
  async getPostsByUser(@Body() r:UserReq<{id:string}>): Promise<PostM[]|null> {
    let posts = await this.postsServices.getPostsByUserId(r.id);
    let usr = await this.usersServices.loginToken(r.token);
    
    for(let i=0;i<posts.length;i++){
      let p = posts[i];
      p['userVote'] = usr?(await this.voteServices.getUserPCVote(usr.id,p.id)):null;
      p['voteCount'] = await this.voteServices.getPCVoteCount(p.id);
    }
    return posts;
  }

  @UseGuards(JwtAuthGuard)
  @Post("uploadPost")
  async uploadPost(@Body() r: UserReq<{ post: Partial<PostM> }>): Promise<PostM|null> {
    console.log("UPLOAD POST",r);
    let usr = await this.usersServices.loginToken(r.token);
    if(usr==null) return null;
    if(r.post.id!==undefined)delete r.post.id;
    r.post.user = usr;
    r.post.timestamp = Date.now();
    let p = await this.postsServices.insert(r.post as PostM);
    p.user  = usr;
    p['userVote'] = null;
    p['voteCount'] = 0;
    return p;
  }

  @UseGuards(JwtAuthGuard)
  @Post("feed")
  async feed(@Body() r: UserReq<{}>): Promise<PostM[]|null> {
    let usr = await this.usersServices.loginToken(r.token);
    if(!usr) return null;
    let posts = await this.postsServices.feed(usr.id);
    
    for(let i=0;i<posts.length;i++){
      let p = posts[i];
      p['userVote'] = usr?(await this.voteServices.getUserPCVote(usr.id,p.id)):null;
      p['voteCount'] = await this.voteServices.getPCVoteCount(p.id);
    }
    return posts;
  }

}