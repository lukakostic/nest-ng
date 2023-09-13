
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
    async unvote(userId:string, postId: string): Promise<true|null> {
        let d = await Upvote.delete({user: userId as any, replyToId: postId});
        if(d.affected>0) return true;
        return null;
    }
        
    async vote(userId:string, postId: string, type:'post'|'comment', positive:boolean): Promise<Upvote> {
        console.log("vote",userId,postId,type,positive)
        //delete old
        await Upvote.delete({user: userId as any, replyToId: postId});
        const upvoteEntity: Upvote = Upvote.create();
        upvoteEntity.user = userId as any;//await User.findOne({where: {id: userId}});
        upvoteEntity.replyToId = postId;//await PostM.findOne({where: {id: postId}});
        upvoteEntity.replyType = type;
        upvoteEntity.positive = positive;
        await Upvote.save(upvoteEntity);
        return upvoteEntity;
    }
    async votePost(userId:string, postId: string, positive:boolean): Promise<Upvote> {
       return await this.vote(userId, postId, 'post', positive);
    }
    async voteComment(userId:string, commentId: string, positive:boolean): Promise<Upvote> {
        return await this.vote(userId, commentId, 'comment', positive);
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
        let p = await Upvote.count({where: {replyToId: postId, positive: true}});
        let n = await Upvote.count({where: {replyToId: postId, positive: false}});
        return p-n;
    }
    async deleteVote(voteId:string): Promise<void> {
        await Upvote.delete({id: voteId});
    }
}