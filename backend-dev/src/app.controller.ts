import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostM } from './_entities/post.entity';
import { User } from './_entities/user.entity';
import { Upvote } from './_entities/upvote.entity';
import {CommentM} from './_entities/comment.entity';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { UserServices } from './users/users.services';
import { PostServices } from './posts/posts.services';
import { VoteServices } from './votes/votes.services';
import { CommentServices } from './comments/comments.services';
import { UserController } from './users/users.controller';

/* type which contains token:string property, as well as any other properties passed */
export type UserReq<T> = T & { token: string };
export type Usr = {username: string|null, id: string|null};

const bcrypt = require('bcrypt');
const saltRounds = 10;

@Controller()
export class AppController {
  constructor(
    /*
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PostM)
    private readonly postRepository: Repository<PostM>) {
    */
   
    private readonly usersServices: UserServices,
    private readonly postsServices: PostServices,
    private readonly voteServices: VoteServices,
    private readonly commentServices: CommentServices,
    
  ) { }

  @Post("makeTestUsers")
  async makeTestUsers() {
    let register = new UserController(this.usersServices).register;
    [
      {username:"user1",email:"111@gmail.com",password:"123"},
      {username:"user2",email:"222@gmail.com",password:"123"},
      {username:"user3",email:"333@gmail.com",password:"123"},
      {username:"user4",email:"444@gmail.com",password:"123"}
    ].forEach(async user=>await register(user));
  }


}
