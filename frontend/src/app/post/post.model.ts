import { User } from "../user/user.model";

export class Post {
    constructor(
        public id: string,
        
        public title: string, 
        public text: string, 
        public images: string[],

        public timestamp: number,
        public user : User = null as any,
        public voteCount :number = 0,
        public userVote :any = null
    ) {}
}