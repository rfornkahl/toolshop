import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constatns';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm : any = FormGroup;
  responseMessage : any;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    private dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService) { }

    ngOnInit(): void {
      this.forgotPasswordForm = this.formBuilder.group({
        email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
        securityQuestion:[null,[Validators.required]],
        securityQuestionAnswer:[null,[Validators.required]],
        newPassword: [null,[Validators.required]],
        confirmPassword: [null,[Validators.required]]
      })
    }

  viewNewPassword(){
    var x = document.getElementById("newPassword") as HTMLInputElement;
 if (x.type === "password") {
   x.type = "text";
 } else {
   x.type = "password";
 }
 }

 viewConfirmPassword(){
  var x = document.getElementById("confirmPassword") as HTMLInputElement;
if (x.type === "password") {
 x.type = "text";
} else {
 x.type = "password";
}
}

validateSubmit(){
  if (this.forgotPasswordForm.controls['newPassword'].value != this.forgotPasswordForm.controls['confirmPassword'].value){
    return true;
  } else{
    return false;
  }
}

handleForgotPasswordSubmit(){
  this.ngxService.start();
  var formData = this.forgotPasswordForm.value;
  var data = {
    email: formData.email,
    securityQuestion: formData.securityQuestion,
    securityQuestionAnswer: formData.securityQuestionAnswer,
    newPassword: formData.newPassword,
    confirmPassword: formData.confirmPassword
  }
  this.userService.forgotPassword(data).subscribe((response:any)=>{
    this.ngxService.stop();
    this.responseMessage = response?.message;
    // this.dialogRef.close();
    this.snackbarService.openSnackBar(this.responseMessage,"Password has been successfully changed.");
  }, (error)=>{
    this.ngxService.stop();
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }else{
      this.responseMessage =GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
}

}
