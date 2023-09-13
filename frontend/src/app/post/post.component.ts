import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Post } from '../post/post.model';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { State } from '../user/auth.actions';
import { take } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit,OnChanges {

  @Input() inputPost: Post|null = null;
  post : Post | null = null;
  @Input() index: number = -1;
  votesWithoutUser = 0;

  isLoggedIn = false;
  isMyPost = false;

  constructor(
    private http: HttpClient,
    private authService: UserService,
    private store: Store<State>,
      ) {}
  
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
  
  calcVotesWithoutUser(){
    if(this.post!.userVote==null) return this.votesWithoutUser = this.post!.voteCount;
    let v = this.post!.voteCount;
    if(this.post!.userVote.positive)
      v--;
    else
      v++; 
    return this.votesWithoutUser = v;
  }
  get votes() {
    if(this.post==null) return 0;
    let v = 0;
    if(this.post.userVote)
      v = (this.post.userVote.positive) ? 1 : -1;
    return this.votesWithoutUser + v;
  }
  sendVote(positive:boolean){
    if(!this.isLoggedIn) return;
    if(this.post==null) return;
    let ov = this.votesWithoutUser;
    this.post.userVote = {positive};
    this.post.voteCount = ov+(positive?1:-1);
    this.http.post('http://localhost:3000/votePost',{token:this.authService.getLoginToken(),postId:this.post.id,positive}).subscribe(
      (response: any) => {
        console.log("USER VOTE",response);
        if(response){
          this.post!.userVote = response;
          this.post!.voteCount = ov+(this.post!.userVote.positive?1:-1);
        }else {
          this.post!.userVote = null;
          this.post!.voteCount = ov;
        }
        //this.userVote = response;
        
      }
    );
  }
  unvote(){
    if(!this.isLoggedIn) return;
    if(this.post==null) return;
    let ov = this.votesWithoutUser;
    let oldCount = this.post.voteCount;
    let oldVote = this.post.userVote?{...this.post.userVote}:null;
    this.post.userVote = null;
    this.post.voteCount = ov;
  this.http.post('http://localhost:3000/unvote',{token:this.authService.getLoginToken(),postId:this.post.id}).subscribe(
      (response: any) => {
        console.log("USER unVOTE",response);
        if(response==true){
          if(this.post!.userVote){
            this.post!.voteCount = ov;
            this.post!.userVote = null;
          }
        }else{
          this.post!.userVote = oldVote;
          this.post!.voteCount = oldCount;
        }
        //this.userVote = response;
      }
    );
  }
  onUpvote(event:Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    if(!this.isLoggedIn) return;
    if(this.post==null) return;
    if(this.post!.userVote?.positive) return this.unvote();
    this.sendVote(true);
  }
  onDownvote(event:Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    if(!this.isLoggedIn) return;
    if(this.post==null) return;
    if(this.post!.userVote?.positive==false) return this.unvote();
    this.sendVote(false);
  }

}
