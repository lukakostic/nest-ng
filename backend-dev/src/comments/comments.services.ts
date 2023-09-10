
import { Injectable } from '@nestjs/common';
import { PostM } from '../_entities/post.entity';
import { CommentM } from '../_entities/comment.entity';
//import UserEntity from '../db/entity/user.entity';
//import CreateUserDto from './dto/create-user.dto';
//import BookEntity from '../db/entity/book.entity';
//import {getConnection} from "typeorm";

@Injectable()
export class CommentServices {
    
    async insert(commentDetails: CommentM): Promise<CommentM> {
        const commentEntity: CommentM = CommentM.create();
        Object.assign(commentEntity, commentDetails);
        await CommentM.save(commentEntity);
        return commentEntity;
    }

    async getAllComments(): Promise<CommentM[]> {
        return await CommentM.find();
    }
    async getCommentById(commentId: string): Promise<CommentM> {
        return await CommentM.findOne({ where: { id: commentId } });
    }
    async getCommentsByUserId(userId: string): Promise<CommentM[]> {
        return await CommentM.find({
            where: {
                user: {
                    id: userId
                }
            }
        });

    }
    async getCommentsByUserUsername(username: string): Promise<CommentM[]> {
        return await CommentM.find({
            where: {
                user: {
                    username: username
                }
            }
        });
    }
    async deleteComment(commentId: string): Promise<void> {
        await CommentM.delete({ id: commentId });
    }
}