
import { Injectable } from '@nestjs/common';
import { PostM } from '../_entities/post.entity';
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