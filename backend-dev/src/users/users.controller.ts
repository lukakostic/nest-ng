import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { User } from '../_entities/user.entity';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { UserServices, OmitUser } from '../users/users.services';

import { UserReq,Usr } from '../app.controller';
import { Following } from 'src/_entities/following.entity';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const bcrypt = require('bcrypt');
const saltRounds = 10;

function genId(){return (Math.random().toString()+Math.random().toString());}
export type UserToken = {token:string,user:User};
@Controller()
export class UserController {
  constructor(
    private readonly usersServices: UserServices,
    private readonly authServices: AuthService
  ) { }


  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() userPw : Partial<User>): Promise<UserToken>|null {
    console.log("logging in",userPw);
    
    let usr = await this.authServices.validateUsernamePw(userPw!.username,userPw!.password);
    if(usr){
      console.log("calc token:");
      let token = await this.authServices.signUser(usr);
        this.usersServices.loginTokens[token] = usr.id;
        return {user:OmitUser(usr),token};
    }
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Post("editMyDescription")
  async editMyDescription(@Body() r: UserReq<{desc:string}>): Promise<User>|null {
    let usr = await this.usersServices.loginToken(r.token);
    if(usr==null) return null;
    return await this.usersServices.editDescription(usr.id,r.desc);
  }
  @UseGuards(JwtAuthGuard)
  @Post("loginByToken")
  async loginByToken(@Body() r:{token: string}): Promise<UserToken>|null {
    console.log("login by token ",r.token);
    let usr = await this.usersServices.loginToken(r.token);
    if(!usr) return {token:null,user:null};
    return {token:r.token,user: usr};
  }

  @Post("register")
  async register(@Body() user: Partial<User>): Promise<{user:User,token:string}|null> {
    //check if username contains any special characters
    if(user.username.match(/[^a-zA-Z0-9]/)) return null;
    
    console.log("registering",user);
    if(await this.usersServices.getUserExists(user as any)) return null; //check taken
    user.timestamp = Date.now();
    let pw = user.password;
    user.password = await bcrypt.hash(user.password, saltRounds);
    user.description = "";
    return await this.login({...(await this.usersServices.insert(user as User)),password:pw});
  }

  @Get("allUsers")
  getUsers(): Promise<User[]> {
    console.log("allUsers");
    return this.usersServices.getAllUsers();
  }


  @Post("follow")
  async follow(@Body() r: UserReq<{user:string}>): Promise<Following> {
    let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.followUser(usr.id,r.user);
  }
  @Post("unfollow")
  async unfollow(@Body() r: UserReq<{user:string}>): Promise<true|null> {
    let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.unfollowUser(usr.id,r.user);
  }

  @Post("followId")
  async followId(@Body() r: {from:string,toFollow:string}): Promise<Following> {
    return this.usersServices.followUser(r.from,r.toFollow);
  }
  @Post("allFollowing")
  async allFollowing(@Body() r:{id:string}): Promise<Following[]> {
    //let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.getAllFollowing(r.id);
  }
  @Post("allFollowingMe")
  async allFollowingMe(@Body() r: UserReq<{}>): Promise<Following[]> {
    let usr = await this.usersServices.loginToken(r.token);
    if(usr)
      return this.usersServices.getAllFollowing(usr.id);
      else return null;
  }
  @Post("allFollowers")
  async allFollowers(@Body() r:{id:string}): Promise<Following[]> {
    //let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.getAllFollowers(r.id);
  }
  @Post("isFollowing")
  async isFollowing(@Body() r: UserReq<{userId:string}>): Promise<Following|null> {
    let usr = await this.usersServices.loginToken(r.token);
    return this.usersServices.isUserFollowing(usr.id,r.userId);
  }

  @Post("userById")
  getUserById(@Body() r:{id: string}) {
    console.log("userById",r.id);
    return this.usersServices.getUserById(r.id);
    //return this.users.find(user=>user.id==id);
  }

  
  @Post("userAndFollowing")
  async userAndFollowing(@Body() r: UserReq<{user:string}>): Promise<{user:User,following:Following}|null> {
    let usr2 = await this.usersServices.getUserById(r.user);
    let usr = await this.usersServices.loginToken(r.token);
    let following = null;
    if(usr) following = await this.usersServices.isUserFollowing(usr.id,usr2.id);
    return {user:usr2,following};
  }
}
