
import { Injectable } from '@nestjs/common';
import { Upvote } from '../_entities/upvote.entity';
import { User } from '../_entities/user.entity';
import { PostM } from '../_entities/post.entity';
//import UserEntity from '../db/entity/user.entity';
//import CreateUserDto from './dto/create-user.dto';
//import BookEntity from '../db/entity/book.entity';
//import {getConnection} from "typeorm";

@Injectable()
export class VoteServices {
    
    async votePost(userId:string, postId: string, positive:boolean): Promise<Upvote> {
        const upvoteEntity: Upvote = Upvote.create();
        upvoteEntity.user = await User.findOne({where: {id: userId}});
        upvoteEntity.replyToId = postId;//await PostM.findOne({where: {id: postId}});
        upvoteEntity.replyType = 'post';
        upvoteEntity.positive = positive;
        await Upvote.save(upvoteEntity);
        return upvoteEntity;
    }
    async voteComment(userId:string, commentId: string, positive:boolean): Promise<Upvote> {
        const upvoteEntity: Upvote = Upvote.create();
        upvoteEntity.user = await User.findOne({where: {id: userId}});
        upvoteEntity.replyToId = commentId;//await PostM.findOne({where: {id: postId}});
        upvoteEntity.replyType = 'comment';
        upvoteEntity.positive = positive;
        await Upvote.save(upvoteEntity);
        return upvoteEntity;
    }
    async getUserPCVote(userId:string, postId: string): Promise<Upvote|null> {
        return await Upvote.findOne({where: {user: {id: userId}, replyToId: postId}});
    }
    async getUserVotes(userId:string): Promise<Upvote[]|null> {
        return await Upvote.find({where: {user: {id: userId}}});
    }
    async getPCVotes(postId: string): Promise<Upvote[]> {
        return await Upvote.find({where: {replyToId: postId}});
    }
    async getPCVoteCount(postId: string): Promise<number> {
        return await Upvote.count({where: {replyToId: postId}});
    }
    async deleteVote(voteId:string): Promise<void> {
        await Upvote.delete({id: voteId});
    }
}