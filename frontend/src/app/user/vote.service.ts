import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { Observable, map } from 'rxjs';
import { User } from './user.model';
import { Store } from '@ngrx/store';
import * as UserActions from './user.actions';
import { AuthEffects } from './user.effects';
import { State } from './user.reducer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
@Injectable()
export class VoteService {
    constructor(
        private userService : UserService
    ){}
    apiUrl = 'http://localhost:3000';

    voteComment(commentId:string,positive:boolean){
        return this.userService.reqPost('/voteComment',{commentId,positive});
    }
    votePost(postId:string,positive:boolean){
        return this.userService.reqPost('/votePost',{postId,positive});
    }
    
    unvote(postId:number){
        return this.userService.reqPost('/unvote',{postId});
    }

}