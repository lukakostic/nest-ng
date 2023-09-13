import { User } from "../user/user.model";


export class CommentM{
 constructor(
  public text: string,
  public voteCount?: number,
  public userVote?: any,
  public id?: string,
  public user?: User,
  public timestamp?: string,
  public replyToId?: string,
  public replyType?: string,
  public replies?: CommentM[],
 ) {}
}
