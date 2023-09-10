import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  @Input() index: number = -1;
  votes: number = 0;

  constructor() { }

  ngOnInit(): void {
    console.log("POST",this.post);
  }

  onUpvote() {
    this.votes++;
  }

  onDownvote() {
    this.votes--;
  }

}
