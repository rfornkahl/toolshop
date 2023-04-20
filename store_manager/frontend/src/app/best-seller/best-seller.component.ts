import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';


@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.scss']
})
export class BestSellerComponent implements OnInit {

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


}




