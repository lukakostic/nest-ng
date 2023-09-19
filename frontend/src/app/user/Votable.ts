import { VoteService } from "./vote.service";
export class Votable {
  votesWithoutUser = 0;

  constructor(
      private votePost : boolean,
      private voteService : VoteService
  ){}

  calcVotesWithoutUser(){
      let post = (this as any).comment ?? (this as any).post;
      if(post==null || post.userVote==null) return this.votesWithoutUser = post?.voteCount ?? 0;
      let v = post.voteCount!;
      if(post.userVote.positive)
        v--;
      else
        v++; 
      return this.votesWithoutUser = v;
    }

  get votes() {
      let post = (this as any).comment ?? (this as any).post;
      if(post==null) return 0;
      let v = 0;
      if(post.userVote)
        v = (post.userVote.positive) ? 1 : -1;  
      return this.votesWithoutUser + v;
    }


  sendVote(positive:boolean){
      if(!((this as any).isLoggedIn)){
          //throw new Error("Not logged in (Votable::sendVote");
          return;
      }
      let post = (this as any).comment ?? (this as any).post;
      if(post==null) return;
      let ov = this.votesWithoutUser;
      post.userVote = {positive};
      post.voteCount = ov+(positive?1:-1);
      (
        this.votePost?
        (this.voteService.votePost(post.id,positive)):
        (this.voteService.voteComment(post.id,positive))
      ).subscribe((response: any) => {
      //this.authService.reqPost('/voteComment',{commentId:this.comment.id,positive}).subscribe((response: any) => {
      console.log("USER VOTE",response);
          if(response){
            post.userVote = response;
            post.voteCount = ov+(post.userVote.positive?1:-1);
          }else {
            post.userVote = null;
            post.voteCount = ov;
          }
          //this.userVote = response;
          
        }
      );
  }
  unvote(){
    if(!((this as any).isLoggedIn)){
        //throw new Error("Not logged in (Votable::unvote");
        return;
    }
    let post = (this as any).comment ?? (this as any).post;
    if(post==null) return;
    let ov = this.votesWithoutUser;
    let oldCount = post.voteCount;
    let oldVote = post.userVote?{...post.userVote}:null;
    post.userVote = null;
    post.voteCount = ov;
    this.voteService.unvote(post.id).subscribe((response: any) => {
        console.log("USER unVOTE",response);
        if(response==true){
          if(post.userVote){
            post.voteCount = ov;
            post.userVote = null;
          }
        }else{
          post.userVote = oldVote;
          post.voteCount = oldCount;
        }
        //this.userVote = response;
      }
    );
  }
  onUpvote(event:Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    if(!((this as any).isLoggedIn)){
        //throw new Error("Not logged in (Votable::onUpvote");
        return;
    }
    let post = (this as any).comment ?? (this as any).post;
    if(post==null) return;
    if(post.userVote?.positive) return this.unvote();
    this.sendVote(true);
  }
  onDownvote(event:Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    if(!((this as any).isLoggedIn)){
        //throw new Error("Not logged in (Votable::onDownvote");
        return;
    }
    let post = (this as any).comment ?? (this as any).post;
    if(post==null) return;
    if(post.userVote?.positive==false) return this.unvote();
    this.sendVote(false);
  }
}