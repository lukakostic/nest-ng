export class Post {
    constructor(
        public id: string,
        public user: string,
        
        public title: string, 
        public text: string, 
        public images: string[]
    ) {}
}