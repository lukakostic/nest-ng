import { Component } from '@angular/core';

@Component({
  selector: 'app-page-main',
  templateUrl: './page-main.component.html',
  styleUrls: ['./page-main.component.scss']
})
export class PageMainComponent {
  mode = 0;  // 0 = feed, 1 = all posts, 2 = my posts
}
