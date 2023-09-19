
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommentM } from './comment.model';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { State } from '../user/user.reducer';
import { Votable } from '../user/Votable';
import { VoteService } from '../user/vote.service';
import { CommentService } from './comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent extends Votable implements OnInit{

  @Input() comment: CommentM;
  @Input() postId :string;

  isLoggedIn: boolean = false;
  isMyPost = false;
  loggedInUser$:any = this.store.select(state=> {
    let loggedInAccount = ((state as any)['auth']).loggedInUser;
    this.isLoggedIn = (loggedInAccount!=null);
    if(this.comment!=null && this.comment.user!=null && loggedInAccount!=null)
      this.isMyPost = loggedInAccount.id == this.comment.user?.id;
  });

  

  collapsed: boolean = true;

  showReplyBox = false;
  reply : string|null = null;

  constructor(
    private store : Store<State>,
    private authService: UserService,
    private commService: CommentService,
    //private store: Store<State>,
      private voteService2 : VoteService,
        ) {
          super(
            false,
            voteService2
          );
        }

   ngOnInit(): void {
     this.isLoggedIn = this.authService.getLoggedUser()!=null;
     this.calcVotesWithoutUser();
     if(this.comment!=null && this.comment.user!=null && this.isLoggedIn)
      this.isMyPost = this.authService.getLoggedUser()?.id == this.comment.user?.id;
   }

  toggleReply(){
    this.showReplyBox = !this.showReplyBox;
  }
  

  expandCom(newState = undefined as any){
    newState ??= !this.collapsed;
    this.collapsed = newState;
    
    if (!this.collapsed) {
        console.log('Loading replies of', this.comment);
        this.commService.loadCommentsPost(this.comment.id!).subscribe((response: any) => {
          console.log("Comment reply response",response);
          if(response!=null){
            //this.comments = response;
            (this.comment as any)['replies'] = response;
          }
        }
      ); 
    }
  }

  addReply(text:string) {
      console.log('REPLYING TO COM', text);
      this.showReplyBox = false;
      
      
      if(this.authService.getLoggedUser()!=null){
  
        this.commService.uploadComment(text,this.comment.id!,false).subscribe((response: any) => {
          console.log("Comment reply response",response);
            
            if(response!=null){
              //this.comments = response;
              //(this.comment as any)['replies'].push(response);
            }
            this.expandCom(false);
          }
        );
      }
  }

  getDate(){

    if(this.comment==null) return "";
    let date = new Date(parseInt(this.comment!.timestamp as any));
    let diff = Math.floor((Date.now() - date.getTime()) / 1000);
    let str = "";
    if(diff<60){
      str = diff + " seconds ago";
    }else if(diff<3600){
      str = Math.floor(diff/60) + " minutes ago";
    }
    else if(diff<86400){
      str = Math.floor(diff/3600) + " hours ago";
    }
    else if(diff<2592000){
      str = Math.floor(diff/86400) + " days ago";
    }
    else if(diff<31536000){
      str = Math.floor(diff/2592000) + " months ago";
    }
    else{
      str = Math.floor(diff/31536000) + " years ago";
    }

    let hrs = date.getHours();
    let min = date.getMinutes(); 
    return `${date.toLocaleDateString()} ${hrs}:${min} (${str})`;
  }

  cancelReply() {
    this.showReplyBox = false;  
    //comment.showReply = false;
      // this.reply = null;
  }

}
