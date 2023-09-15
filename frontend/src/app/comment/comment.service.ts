import { Injectable } from '@angular/core';
// import { take, tap } from 'rxjs/operators';
// import { Observable, map } from 'rxjs';
// import { User } from './user.model';
// import { Store } from '@ngrx/store';
// import * as UserActions from './user.actions';
// import { AuthEffects } from './user.effects';
// import { State } from './user.reducer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user.service';
@Injectable()
export class CommentService {
    constructor(
        private userService : UserService
    ){}
    apiUrl = 'http://localhost:3000';

    loadCommentsPost(id:string){
        return this.userService.reqPost('/loadCommentsPost',{postId:id,depth:1})
    }

    uploadComment(commentText:string,toId:string,isPost:boolean){
        return this.userService.reqPost('/uploadComment',{comment:{text:commentText},toId:toId,isPost:isPost})
    }

}