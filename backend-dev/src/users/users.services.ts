
import { Injectable } from '@nestjs/common';
import {User} from '../_entities/user.entity';
//import UserEntity from '../db/entity/user.entity';
//import CreateUserDto from './dto/create-user.dto';
//import BookEntity from '../db/entity/book.entity';
//import {getConnection} from "typeorm";
import bcrypt from 'bcrypt';

function OmitUser(u:User|User[]|null){
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
      (await User.findOne({where: {username: obj.username}}))===null &&
      (await User.findOne({where: {email: obj.email}}))===null
    );
  }
  async validateUsernamePw(username: string, password: string): Promise<User|null> {
    const user = await User.findOne({where: {username: username}});
    if(user===null) return null;
    if(await bcrypt.compare(password,user.password)) return user;
    return null;
  }
  async deleteUser(userId: string): Promise<void> {
    await User.delete({id: userId});
  }

  /*
  async getBooksOfUser(userID: number): Promise<BookEntity[]> {
    console.log(typeof(userID));
    const user: UserEntity = await UserEntity.findOne({where: {id: userID}, relations: ['books']});
    return user.books;
  }
  */
}
