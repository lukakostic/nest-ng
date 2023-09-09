import { Controller, Get } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { User } from './entities/user.entity';

function genId(){
  return (Math.random().toString()+Math.random().toString());
}

@Controller()
export class AppController {
  users: User[];
  posts: Post[];

  constructor() {
    /*
    this.users = [
      Object.assign(new User(),{id:0,username:"U1111"}),
      Object.assign(new User(),{id:1,username:"U2222"}),
    ];
    this.posts = [
      new Post(genId(),this.users[0].id.toString(),'My first post', 'This is the text of my first post.', ['https://via.placeholder.com/150']),
      new Post(genId(),this.users[1].id.toString(),'My second post', 'This is the text of my second post.', ['https://via.placeholder.com/150', 'https://via.placeholder.com/150']),
      new Post(genId(),this.users[0].id.toString(),'My third post', 'This is the text of my third post.', [])
    ];
    */
  }

  @Get("posts")
  getPosts(): Post[] { return this.posts; }
  @Get("users")
  getUsers(): User[] { return this.users; }
}
