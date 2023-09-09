export class Post {
    constructor(
        public id: string,
        public userId: string,
        
        public title: string, 
        public text: string, 
        public images: string[]
    ) {}
}