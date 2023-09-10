import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostM } from '../_entities/post.entity';
import { User } from '../_entities/user.entity';
import { Upvote } from '../_entities/upvote.entity';
import { CommentM } from '../_entities/comment.entity';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { UserServices } from '../users/users.services';
import { PostServices } from '../posts/posts.services';
import { VoteServices } from '../votes/votes.services';
import { CommentServices } from '../comments/comments.services';

import { UserReq, Usr } from '../app.controller';

@Controller()
export class VoteController {
    constructor(
        private readonly usersServices: UserServices,
        private readonly voteServices: VoteServices,
    ) { }
    @Post()
    async votePost(@Body() r: UserReq<{ postId: string, positive: boolean }>): Promise<Upvote> {
        let usr = await this.usersServices.loginToken(r.token);
        return this.voteServices.votePost(usr.id, r.postId, r.positive);
    }
    @Post()
    async voteComment(@Body() r: UserReq<{ commentId: string, positive: boolean }>): Promise<Upvote> {
        let usr = await this.usersServices.loginToken(r.token);
        return this.voteServices.voteComment(usr.id, r.commentId, r.positive);
    }
    @Post()
    async getUserPCVote(@Body() r: UserReq<{ postId: string }>): Promise<Upvote | null> {
        let usr = await this.usersServices.loginToken(r.token);
        return this.voteServices.getUserPCVote(usr.id, r.postId);
    }
    @Post()
    async getUserVotes(@Body() r: UserReq<{ id: string }>): Promise<Upvote[] | null> {
        return this.voteServices.getUserVotes(r.id);
    }
    @Post()
    async getPCVotes(@Body() r: UserReq<{ id: string }>): Promise<Upvote[] | null> {
        return this.voteServices.getPCVotes(r.id);
    }
    @Post()
    async getPCVoteCount(@Body() r: UserReq<{ id: string }>): Promise<number> {
        return this.voteServices.getPCVoteCount(r.id);
    }
    @Post()
    async getVoteCountAndUserVote(@Body() r: UserReq<{ id: string }>): Promise<{ count: number, userVote: Upvote | null }> {
        let usr = await this.usersServices.loginToken(r.token);
        let count = await this.voteServices.getPCVoteCount(r.id);
        let userVote = (usr===null)?null:(await this.voteServices.getUserPCVote(usr.id, r.id));
        return { count, userVote };
    }
}
