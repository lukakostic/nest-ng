import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
//import { AppService } from './app.service';

//import { UsersModule } from './users/users.module';
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
  //  UsersModule, 
  ],
  controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
