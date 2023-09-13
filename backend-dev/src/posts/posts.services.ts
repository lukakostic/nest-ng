
import { Injectable } from '@nestjs/common';
import { PostM } from '../_entities/post.entity';
import { User } from 'src/_entities/user.entity';
import { Following } from 'src/_entities/following.entity';
//import UserEntity from '../db/entity/user.entity';
//import CreateUserDto from './dto/create-user.dto';
//import BookEntity from '../db/entity/book.entity';
//import {getConnection} from "typeorm";

@Injectable()
export class PostServices {

    async insert( postDetails: PostM): Promise<PostM> {
        const postEntity: PostM = PostM.create();
        Object.assign(postEntity, postDetails);
        console.log("INSERT POST",postEntity)
        await PostM.save(postEntity);
        return postEntity;
    }

    async getAllPosts(): Promise<PostM[]> {
        return await PostM.find({
            relations: ["user"],
            order: { timestamp: "DESC" }
        });
    }
    async getPostById(postId: string): Promise<PostM> {
        return await PostM.findOne({ where: { id: postId }, relations: ["user"],
        order: { timestamp: "DESC" } });
    }
    async getPostsByUserId(userId: string): Promise<PostM[]> {
        return await PostM.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ["user"],
            order: {
                timestamp: "DESC"
            }
        });
    }
    async feed(userId: string): Promise<PostM[]> {
        //let usr = await User.findOne({ where: { id: userId } });
        //get table of users followed by usr, join with posts, sort by timestamp
        
        //get all following from userId then get the ".to" of the following (user) and get all their posts
        /*
        let ret = await Following.createQueryBuilder("following")
            .leftJoinAndSelect("following.to", "user")
            .leftJoinAndSelect("user.posts", "post")
            .where("following.from = :id", { id: userId })
            .orderBy("post.timestamp", "DESC")
            .getMany() as any;
        */
       let ret = await PostM.createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("user.followers", "following")
            .where("following.from = :id", { id: userId })
            .orderBy("post.timestamp", "DESC")
            .getMany() as any;
            //console.log(typeof ret);
        //console.log(ret[0]);
        /*
        ret = ret.map(f=>f.to).map(u=>({
            ...u,
            posts: u.posts.map(p=>p.user=u)
        })
            
        ).flat();
        */
        return ret;
/*
        let ret = await Following.createQueryBuilder('f')
                .select()
                .leftJoinAndSelect("f.to", "user")
                //.from(Following, "f")
                .where("f.from = :u", { u:userId })
                .leftJoin("user.posts",PostM,"post")
                //.orderBy("post.timestamp", "DESC")
                .getMany() as any;
      
        return await PostM.createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("user.following", "following")
            .where("following.from = :id", { id: userId })
            .orderBy("post.timestamp", "DESC")
            .getMany();
            */
        /*
        return await PostM.find({
            join: {
                alias: "post",
                innerJoinAndSelect: {
                    user: "post.user"
                }
            },
            where: {
                user: {
                    following: {
                        to: usr
                    }
                }
            },
            order: {
                timestamp: "DESC"
            }
        });
        */
    }
    async getPostsByUsername(username: string): Promise<PostM[]> {
        return await PostM.find({
            where: {
                user: {
                    username: username
                }
            },
            relations: ["user"],
            order: { timestamp: "DESC" }
        });
    }
    async deletePost(postId: string): Promise<boolean> {
        let d = await PostM.delete({ id: postId });
        if(d.affected>0) return true;
        return false;
    }
    

}