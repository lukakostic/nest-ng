
import { Injectable } from '@nestjs/common';
import { PostM } from '../_entities/post.entity';
import { User } from 'src/_entities/user.entity';
//import UserEntity from '../db/entity/user.entity';
//import CreateUserDto from './dto/create-user.dto';
//import BookEntity from '../db/entity/book.entity';
//import {getConnection} from "typeorm";

@Injectable()
export class PostServices {

    async insert(postDetails: PostM): Promise<PostM> {
        const postEntity: PostM = PostM.create();
        Object.assign(postEntity, postDetails);
        await PostM.save(postEntity);
        return postEntity;
    }

    async getAllPosts(): Promise<PostM[]> {
        return await PostM.find();
    }
    async getPostById(postId: string): Promise<PostM> {
        return await PostM.findOne({ where: { id: postId } });
    }
    async getPostsByUserId(userId: string): Promise<PostM[]> {
        return await PostM.find({
            where: {
                user: {
                    id: userId
                }
            }
        });
    }
    async feed(userId: string): Promise<PostM[]> {
        let usr = await User.findOne({ where: { id: userId } });
        //get table of users followed by usr, join with posts, sort by timestamp
        return await PostM.createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .leftJoinAndSelect("user.following", "following")
            .where("following.from = :id", { id: userId })
            .orderBy("post.timestamp", "DESC")
            .getMany();
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
    async getPostsByUserUsername(username: string): Promise<PostM[]> {
        return await PostM.find({
            where: {
                user: {
                    username: username
                }
            }
        });
    }
    async deletePost(postId: string): Promise<void> {
        await PostM.delete({ id: postId });
    }
    

}