import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constatns';

@Component({
  selector: 'app-user-component',
  templateUrl: './user-component.component.html',
  styleUrls: ['./user-component.component.scss']
})
export class UserComponentComponent implements OnInit {
    onAddUser = new EventEmitter();
    onEditUser = new EventEmitter();
    userForm:any = FormGroup;
    dialogAction:any = "Add";
    action:any = "Add";
    responseMessage:any;
    roles = [{
      value : "admin",
      viewValue : "admin"
    },{
      value : "user",
      viewValue : "user"
    }];
    selectedValue: any;

    

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private userService:UserService,
  public dialogRef:MatDialogRef<UserComponentComponent>,
  private snackbarService: SnackbarService) { }

   ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      role: [null, [Validators.required]]
    })
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.userForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction === 'Edit'){
      this.edit();
    }else{
      this.add();
    }
  }
  
  add(){
    var formData = this.userForm.value;
    var data = {
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      role:formData.role,
    }
    this.userService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddUser.emit(); 
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    }, (error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  edit(){
    var formData = this.userForm.value;
    var data = {
      id: this.dialogData.data.id,
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      role:formData.role,
    }
    this.userService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditUser.emit(); 
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    }, (error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}
