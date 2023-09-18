
import { Injectable } from '@nestjs/common';
import { User } from 'src/_entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwtSuperSecret';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
    ) {}

  async validateUsernamePw(username: string, password: string): Promise<User|null> {
    //if(username.match(/[^a-zA-Z0-9]/)) return null;
    //if(username.length<4 || password.length<3) return null;
    
    const user = await User.findOne({where: {username: username}});
    if(user==null) return null;
    if(await bcrypt.compare(password,user.password)) return user;
    return null;
  }

  async signUser(user: User) : Promise<string> {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload,{secret:jwtConstants.secret});
  }
}
