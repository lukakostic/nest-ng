import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  posts: Post[] = [
    new Post('My first post', 'This is the text of my first post.', ['https://via.placeholder.com/150']),
    new Post('My second post', 'This is the text of my second post.', ['https://via.placeholder.com/150', 'https://via.placeholder.com/150']),
    new Post('My third post', 'This is the text of my third post.', [])
  ];

  constructor() { }

  ngOnInit(): void {
  }

}