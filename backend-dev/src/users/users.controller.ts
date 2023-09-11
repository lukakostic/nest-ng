import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { User } from '../_entities/user.entity';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { UserServices, OmitUser } from '../users/users.services';

import { UserReq,Usr } from '../app.controller';
import { Following } from 'src/_entities/following.entity';

const bcrypt = require('bcrypt');
const saltRounds = 10;

function genId(){return (Math.random().toString()+Math.random().toString());}

@Controller()
export class UserController {
  constructor(
    private readonly usersServices: UserServices
  ) { }

  @Get("allUsers")
  getUsers(): Promise<User[]> {
    console.log("allUsers");
    return this.usersServices.getAllUsers();
  }


  @Post("follow")
  async follow(@Body() r: UserReq<{toFollow:string}>): Promise<Following> {
    let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.followUser(usr.id,r.toFollow);
  }
  @Post("followId")
  async followId(@Body() r: {from:string,toFollow:string}): Promise<Following> {
    return this.usersServices.followUser(r.from,r.toFollow);
  }
  @Get("allFollowing/:id")
  async allFollowing(@Param('id') id:string): Promise<Following[]> {
    //let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.getAllFollowing(id);
  }
  @Get("allFollowers/:id")
  async allFollowers(@Param('id') id:string): Promise<Following[]> {
    //let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.getAllFollowers(id);
  }
  @Post("isFollowing")
  async isFollowing(@Body() r: UserReq<{userId:string}>): Promise<Following|null> {
    let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.isUserFollowing(usr.id,r.userId);
  }

  @Get("userById/:id")
  getUserById(@Param('id') id: string) {
    console.log("userById",id);
    return this.usersServices.getUserById(id);
    //return this.users.find(user=>user.id==id);
  }

  @Post("loginByToken")
  async loginByToken(@Body() token: string): Promise<User>|null {
    return this.usersServices.loginToken(token);
  }
  @Post("login")
  async login(@Body() userPw : Partial<User>): Promise<{user:User,token:string}>|null {
    console.log("logging in",userPw);
    //userPw.password = await bcrypt.hash(userPw.password, saltRounds);
    let usr = await this.usersServices.validateUsernamePw(userPw!.username,userPw!.password);
    if(usr){
        console.log("valid username pw");
        let token = genId();
        this.usersServices.loginTokens[token] = usr.id;
        return {user:OmitUser(usr),token};
    }
    return null;
  }

  @Post("register")
  async register(@Body() user: Partial<User>): Promise<{user:User,token:string}|null> {
    console.log("registering",user);
    let taken = await this.usersServices.getUserExists(user as any);
    console.log("taken",taken);
    if(taken) return null;
    user.timestamp = Date.now();
    let pw = user.password;
    user.password = await bcrypt.hash(user.password, saltRounds);
    user.description = "";
    console.log("registering2",user);
    return await this.login({...(await this.usersServices.insert(user as User)),password:pw});
  }
}
