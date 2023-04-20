import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constatns';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  ResetPasswordForm:any = FormGroup;
  responseMessage:any;


  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ResetPasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackBarService:SnackbarService) { }

  ngOnInit(): void {
    this.ResetPasswordForm = this.formBuilder.group({
      oldPassword:[null,[Validators.required]],
      newPassword: [null,[Validators.required]],
      confirmPassword: [null,[Validators.required]]
    })
  }

  newPasswordVisible = false;

  validateSubmit(){
    if (this.ResetPasswordForm.controls['newPassword'].value != this.ResetPasswordForm.controls['confirmPassword'].value){
      return true;
    } else{
      return false;
    }
  }

  viewOldPassword(){
     var x = document.getElementById("oldPassword") as HTMLInputElement;
     this.newPasswordVisible = !this.newPasswordVisible;
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
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

  

  handleResetPasswordSubmit(){
    this.ngxService.start();
    var formData = this.ResetPasswordForm.value;
    var data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }
    this.userService.resetPassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackBarService.openSnackBar(this.responseMessage,"Password has been successfully changed.");
    }, (error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage =GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
