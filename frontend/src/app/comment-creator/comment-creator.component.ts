import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-comment-creator',
  templateUrl: './comment-creator.component.html',
  styleUrls: ['./comment-creator.component.scss']
})
export class CommentCreatorComponent implements OnInit{
  @Output() onSubmit = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<boolean>();
  
  @Input() cancelable = true;

  text:string = "";

  isLoggedIn = false;

  constructor(
    private authService: UserService
  ){
    
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getLoggedUser()!=null;
  }
  cancel(){
    if(this.cancelable)
      this.onCancel.emit(true);
  }
  post(){
    this.onSubmit.emit(this.text);
    this.text = "";
  }
}
