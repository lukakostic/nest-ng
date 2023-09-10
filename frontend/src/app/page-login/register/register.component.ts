import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AuthService } from '../../auth.service';


export type UserRegData ={
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName: string = "";
  lastName: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  registered: boolean = false;

  constructor(private authService: AuthService) {}

  onRegister() {
    const userData : UserRegData = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password
    };
    //send http post to localhost:3000/register
    
    this.authService.register(userData).subscribe(response => {
      this.registered = true;
    });
    
  }
}
