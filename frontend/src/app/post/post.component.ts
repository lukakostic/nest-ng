import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  votes: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onUpvote() {
    this.votes++;
  }

  onDownvote() {
    this.votes--;
  }

}
