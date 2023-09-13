import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { UserController } from './users/users.controller';
import { PostController } from './posts/posts.controller';
import { VoteController } from './votes/votes.controller';
import { CommentController } from './comments/comments.controller';

import { UserServices } from './users/users.services';
import { PostServices } from './posts/posts.services';
import { VoteServices } from './votes/votes.services';
import { CommentServices } from './comments/comments.services';

//import { AppService } from './app.service';

//import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',//'localhost',, // This is the name of the PostgreSQL service defined in docker-compose.yml
      port: 5432,
      username: 'luka',
      password: 'password',
      database: 'db2',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Specify the location of your entities
      synchronize: true, // This will automatically create database tables based on your entities
    }),
    AuthModule,
  //  UsersModule, 
  ],
  controllers: [AppController,
    UserController,
    PostController,
    VoteController,
    CommentController,
  ],
  providers: [UserServices,  
    PostServices,
    VoteServices,
    CommentServices,
    AuthService,
    JwtService
  ],
})
export class AppModule {}
