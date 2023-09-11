import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from '../_entities/user.entity';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { UserServices, OmitUser } from '../users/users.services';

import { UserReq,Usr } from '../app.controller';

const bcrypt = require('bcrypt');
const saltRounds = 10;

function genId(){return (Math.random().toString()+Math.random().toString());}

@Controller()
export class UserController {
  constructor(
    private readonly usersServices: UserServices
  ) { }

  @Get("users")
  getUsers(): Promise<User[]> {
    return this.usersServices.getAllUsers();
  }

  @Post("userById")
  getUserById(@Body() id: string) {
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
    console.log("registering2",user);
    return await this.login({...(await this.usersServices.insert(user as User)),password:pw});
  }
}
