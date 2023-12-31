import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Post } from '../post/post.model';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { State } from '../user/user.reducer';
import { take } from 'rxjs';
import { Votable } from '../user/Votable';
import { VoteService } from "../user/vote.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent extends Votable implements OnInit,OnChanges {

  @Input() inputPost: Post|null = null;
  post : Post | null = null;
  @Input() index: number = -1;


  isLoggedIn: boolean = false;
  isMyPost = false;
  loggedInUser$:any = this.store.select(state=> {
    let loggedInAccount = ((state as any)['auth']).loggedInUser;
    this.isLoggedIn = (loggedInAccount!=null);
    if(this.post!=null && this.post.user!=null && loggedInAccount!=null)
      this.isMyPost = loggedInAccount.id == this.post.user?.id;
  });

  constructor(
    private authService: UserService,
    private voteService2 : VoteService,
    private store: Store<State>,
      ) {
        super(
          true,
          voteService2
        );
      }
  
    ngOnChanges(){
      if(this.inputPost==null) return;
      if(this.post==null) this.loadPost();
    }
  loadPost(){
    this.post = {...this.inputPost} as Post;
    if(this.post.userVote) this.post.userVote = {...this.post.userVote};
    
    let loggedInUser = this.authService.getLoggedUser();
    this.isLoggedIn = !!loggedInUser;
    if(this.isLoggedIn==false) this.isMyPost = false;
    else this.isMyPost = (loggedInUser!.id == this.post.user.id);
    //console.log("POST",this.post);
    this.calcVotesWithoutUser();
  }
  ngOnInit(): void {
    if(this.inputPost==null) return;
    this.loadPost();
  }

  getPostDate(){
    if(this.post==null) return "";
    let date = new Date(parseInt(this.post!.timestamp as any));
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
  
}
