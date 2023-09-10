import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from '../_entities/user.entity';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { UserServices } from '../users/users.services';

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

  @Get("userById")
  getUserById(id: string) {
    return this.usersServices.getUserById(id);
    //return this.users.find(user=>user.id==id);
  }

  @Post("loginByToken")
  async loginByToken(@Body() token: string): Promise<User>|null {
    return this.usersServices.loginToken(token);
  }
  @Post("login")
  async login(@Body() userPw : Partial<User>): Promise<{user:User,token:string}>|null {
    userPw.password = await bcrypt.hash(userPw.password, saltRounds);
    let usr = await this.usersServices.validateUsernamePw(userPw!.username,userPw!.password);
    if(usr){
        let token = genId();
        this.usersServices.loginTokens[token] = usr.id;
        return {user:usr,token};
    }
    return null;
  }

  @Post("register")
  async register(@Body() user: Partial<User>): Promise<{user:User,token:string}|null> {
    let taken = await this.usersServices.getUserExists(user as any);
    if(taken) return null;
    user.timestamp = Date.now();
    user.password = await bcrypt.hash(user.password, saltRounds);
    return await this.login(await this.usersServices.insert(user as User));
  }
}
