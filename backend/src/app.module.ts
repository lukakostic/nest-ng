import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
//import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'luka',
      password: 'password',
      database: 'mydatabase',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Specify the location of your entities
      synchronize: true, // This will automatically create database tables based on your entities
    }),
    UsersModule, 
  ],
  controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}

import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttachUserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.user) {
      // Attach user to request if found
    }
    next();
  }
}
