import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ContactUsComponent } from '../contact-us/contact-us.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog:MatDialog,
    private router:Router,
    private userService:UserService
    ) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') != null){
      this.userService.token().subscribe((response:any)=>{
      this.router.navigate(['/stockmanager/dashboard']);
    },(error:any)=>{
      console.log(error);
    })
  }
}

  signupAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    this.dialog.open(SignupComponent, dialogConfig);
  }

  forgotPasswordAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

  loginAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    this.dialog.open(LoginComponent, dialogConfig);
  }

  contactUsAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "450px";
    this.dialog.open(ContactUsComponent, dialogConfig);
  }

}
