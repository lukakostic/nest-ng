
import { Injectable } from '@nestjs/common';
import {User} from '../_entities/user.entity';
//import UserEntity from '../db/entity/user.entity';
//import CreateUserDto from './dto/create-user.dto';
//import BookEntity from '../db/entity/book.entity';
//import {getConnection} from "typeorm";
import { Following } from 'src/_entities/following.entity';

const bcrypt = require('bcrypt');

export function OmitUser(u:User|User[]|null){
  if(u instanceof Array) return u.map(OmitUser);
  if(u) u.password = undefined;
  return u;
}

@Injectable()
export class UserServices {

  loginTokens = {} as { [token: string]: string }; //map of token to user id
  loginToken(token: string): Promise<User> | null {
    if (token in this.loginTokens) return this.getUserById(this.loginTokens[token]);
    return null;
  }

  async insert(userDetails: User): Promise<User> {
    const userEntity: User = User.create();
    Object.assign(userEntity, userDetails);
    await User.save(userEntity);
    return userEntity;
  }
  async getAllUsers(): Promise<User[]> {
    return OmitUser(await User.find());
  } 
  async getUserById(userId: string): Promise<User> {
    return OmitUser(await User.findOne({where: {id: userId}}));
  }
  async getUserByEmail(email: string): Promise<User> {
    return OmitUser(await User.findOne({where: {email: email}}));
  }
  async getUserByUsername(username: string): Promise<User> {
    return OmitUser(await User.findOne({where: {username: username}}));
  }

  async getUserExists(obj:{username:string|null,email:string|null}): Promise<boolean> {
    return (
      (await User.findOne({where: {username: obj.username}}))!==null ||
      (await User.findOne({where: {email: obj.email}}))!==null
    );
  }
  async validateUsernamePw(username: string, password: string): Promise<User|null> {
    const user = await User.findOne({where: {username: username}});
    console.log("validate username pw",user);
    console.log({username,password})
    if(user===null) return null;
    if(await bcrypt.compare(password,user.password)) return user;
    return null;
  }
  async deleteUser(userId: string): Promise<void> {
    await User.delete({id: userId});
  }

  async followUser(user1Id: string, user2Id): Promise<Following> {
    const followingEntity: Following = Following.create();
    followingEntity.from = (await User.findOne({where: {id: user1Id}})).id as any;
    followingEntity.to = (await User.findOne({where: {id: user2Id}})).id as any;
    //followingEntity.to = await User.findOne({where: {id: user2Id}});
    //console.log("followUser",followingEntity.to,followingEntity.from);
    followingEntity.timestamp = Date.now();
    await Following.save(followingEntity);
    return followingEntity;
  }
  async isUserFollowing(user1Id:string,user2Id:string): Promise<Following|null> {
    let usr1 = await User.findOne({where: {id: user1Id}});
    let usr2 = await User.findOne({where: {id: user2Id}});
    return await Following.createQueryBuilder('f')
    .select()
    .where("f.from = :u1", { u1:usr1.id })
    .andWhere("f.to = :u2", { u2:usr2.id })
    .getOne();
    //return await Following.findOne({where: {from: usr1, to: usr2}});
  }
  async getAllFollowing(userId:string): Promise<Following[]> {
    console.log("getAllFollowing",userId);
    let usr = await User.findOne({where: {id: userId}});
    return await Following.createQueryBuilder('f')
    .select()
    .leftJoinAndSelect("f.to", "user")
    //.from(Following, "f")
    .where("f.from = :u", { u:usr.id })
    .orderBy("f.timestamp", "DESC")
    .getMany();
    //return await Following.find({where: {from: usr}});
  }
  async getAllFollowers(userId:string):Promise<Following[]>{//:Promise<User[]>{//: Promise<Following[]> {
    console.log("getAllFollowers",userId);
    let usr = await User.findOne({where: {id: userId}});
    return (await Following.createQueryBuilder('f')
    .select()
    .leftJoinAndSelect("f.from", "user")
    .where("f.to = :u", { u:usr.id })
    .orderBy("f.timestamp", "DESC")
    .getMany());//.map(f=>f.from);
    //return await Following.find({where: {to: usr}});
  }

  /*
  async getBooksOfUser(userID: number): Promise<BookEntity[]> {
    console.log(typeof(userID));
    const user: UserEntity = await UserEntity.findOne({where: {id: userID}, relations: ['books']});
    return user.books;
  }
  */
}
