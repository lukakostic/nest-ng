
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommentM } from './comment.model';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { State } from '../user/user.reducer';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit{

    @Input() comment: CommentM;
    /*
    @Input() user: any;
    loggedInUser = window.loggedInUser;
    currentComment: any;
    */
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

    votesWithoutUser = 0;
    calcVotesWithoutUser(){
      if(this.comment!.userVote==null) return this.votesWithoutUser = this.comment!.voteCount!;
      let v = this.comment!.voteCount!;
      if(this.comment!.userVote.positive)
        v--;
      else
        v++; 
      return this.votesWithoutUser = v;
    }
    get votes() {
      if(this.comment==null) return 0;
      let v = 0;
      if(this.comment.userVote)
        v = (this.comment.userVote.positive) ? 1 : -1;  
      return this.votesWithoutUser + v;
    }
    sendVote(positive:boolean){
      if(!this.isLoggedIn) return;
      if(this.comment==null) return;
      let ov = this.votesWithoutUser;
      this.comment.userVote = {positive};
      this.comment.voteCount = ov+(positive?1:-1);
      this.authService.reqPost('/voteComment',{commentId:this.comment.id,positive}).subscribe((response: any) => {
      console.log("USER VOTE",response);
          if(response){
            this.comment!.userVote = response;
            this.comment!.voteCount = ov+(this.comment!.userVote.positive?1:-1);
          }else {
            this.comment!.userVote = null;
            this.comment!.voteCount = ov;
          }
          //this.userVote = response;
          
        }
      );
    }
    unvote(){
      if(!this.isLoggedIn) return;
      if(this.comment==null) return;
      let ov = this.votesWithoutUser;
      let oldCount = this.comment.voteCount;
      let oldVote = this.comment.userVote?{...this.comment.userVote}:null;
      this.comment.userVote = null;
      this.comment.voteCount = ov;
      this.authService.reqPost('/unvoteComment',{commentId:this.comment.id}).subscribe((response: any) => {
          console.log("USER unVOTE",response);
          if(response==true){
            if(this.comment!.userVote){
              this.comment!.voteCount = ov;
              this.comment!.userVote = null;
            }
          }else{
            this.comment!.userVote = oldVote;
            this.comment!.voteCount = oldCount;
          }
          //this.userVote = response;
        }
      );
    }
    onUpvote(event:Event) {
      event.stopImmediatePropagation();
      event.preventDefault();
      if(!this.isLoggedIn) return;
      if(this.comment==null) return;
      if(this.comment!.userVote?.positive) return this.unvote();
      this.sendVote(true);
    }
    onDownvote(event:Event) {
      event.stopImmediatePropagation();
      event.preventDefault();
      if(!this.isLoggedIn) return;
      if(this.comment==null) return;
      if(this.comment!.userVote?.positive==false) return this.unvote();
      this.sendVote(false);
    }
  constructor(
    private store : Store<State>,
    private authService: UserService,
    //private store: Store<State>,
      ) {}

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

      /*
        if (onDoneCB === undefined) {
            this.collapseComments(comment.isExpanded, comment, 1);
            return;
        }
        */
        if (!this.collapsed) {
            console.log('Loading replies of', this.comment);
            this.authService.reqPost('/loadCommentsPost',{postId:this.comment.id,depth:1}).subscribe((response: any) => {
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
          this.authService.reqPost('/uploadComment',{comment:{text:text},toId:this.comment.id,isPost:false}).subscribe((response: any) => {
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
      //calculate difference:
      let diff = Math.floor((Date.now() - date.getTime()) / 1000);
      //turn to string "1 hour ago" or "2 days ago" or "5 seconds ago" etc depending on biggest time unit
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
      //let dateFormatted = date.toLocaleDateString(); // date.toISOString().slice(0,10);
      //return local date and time (24h format (no am pm) hours and minutes only) and difference
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
