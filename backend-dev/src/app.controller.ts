import { Controller, Get, Post, Body, Param } from '@nestjs/common';
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
import { AuthService } from './auth/auth.service';

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
    private readonly authServices: AuthService
    
  ) { }

  @Get("testUsers/:n")
  async makeTestUsers(@Param('n') n:number) {
    let cont = new UserController(this.usersServices, this.authServices);
    let userCount = await User.count();
    for(let i=0;i<n;i++){
      let u = "user"+(userCount+1+i)+"-"+(Math.random()*10).toString().replace(".","").substring(0,3);
      await cont.register({
        username:u,
        email:u+"@gmail.com",
        password:"123",
      });
    }
  }
  @Get("testFollows/:n")
  async makeTestFollows(@Param('n') n:number) {
    let cont = new UserController(this.usersServices,this.authServices);
    let allUsers = await User.find();
    for(let i=0;i<n;i++){
      //pick two random users
      let t1 = allUsers[Math.floor(Math.random()*allUsers.length)].id;
      let t2 = t1;
      while(t1===t2) t2 = allUsers[Math.floor(Math.random()*allUsers.length)].id;
      console.log("follow",t1," -> ",t2);
      cont.followId({from:t1,toFollow:t2 });  
    }
  }
  


}
