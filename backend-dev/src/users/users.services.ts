
import { Injectable } from '@nestjs/common';
import {User} from '../_entities/user.entity';
//import UserEntity from '../db/entity/user.entity';
//import CreateUserDto from './dto/create-user.dto';
//import BookEntity from '../db/entity/book.entity';
//import {getConnection} from "typeorm";
import { Following } from 'src/_entities/following.entity';
import { FindOptionsWhere } from 'typeorm';

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
    console.log("token:",token,this.loginTokens[token]);
    console.log(this.loginTokens);
    if (this.loginTokens[token]) return this.getUserById(this.loginTokens[token]);
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
    console.log("get user by id ",userId);
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
  async deleteUser(userId: string): Promise<void> {
    await User.delete({id: userId});
  }

  async followUser(user1Id: string, user2Id): Promise<Following|null> {
    if(user1Id==user2Id) return null;
    
    const followingEntity: Following = Following.create();
    followingEntity.from = user1Id as any;
    followingEntity.to = user2Id as any;
    //followingEntity.to = await User.findOne({where: {id: user2Id}});
    console.log("followUser",followingEntity.to,followingEntity.from);
    followingEntity.timestamp = Date.now();
    await Following.save(followingEntity);
    return followingEntity;
  }
  async unfollowUser(user1Id: string, user2Id): Promise<true|null> {
    console.log("unfollow user",user1Id,user2Id);
    if(user1Id==user2Id) return null;
    let res = await Following.delete({from: user1Id, to: user2Id} as any);
   
    if(res.affected>0) return true;
    return null;
  }
  async isUserFollowing(user1Id:string,user2Id:string): Promise<Following|null> {
    return await Following.createQueryBuilder('f')
    .select()
    .where("f.from = :u1", { u1:user1Id })
    .andWhere("f.to = :u2", { u2:user2Id })
    .getOne();
    //return await Following.findOne({where: {from: usr1, to: usr2}});
  }
  async getAllFollowing(userId:string): Promise<Following[]> {
    console.log("getAllFollowing",userId);
    return await Following.createQueryBuilder('f')
    .select()
    .leftJoinAndSelect("f.to", "user")
    //.from(Following, "f")
    .where("f.from = :u", { u:userId })
    .orderBy("f.timestamp", "DESC")
    .getMany();
    //return await Following.find({where: {from: usr}});
  }
  async getAllFollowers(userId:string):Promise<Following[]>{//:Promise<User[]>{//: Promise<Following[]> {
    console.log("getAllFollowers",userId);
    return (await Following.createQueryBuilder('f')
    .select()
    .leftJoinAndSelect("f.from", "user")
    .where("f.to = :u", { u:userId })
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
