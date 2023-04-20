import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constatns';
import {saveAs} from 'file-saver';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ProductComponent } from '../dialog/product/product.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig } from '@angular/material/dialog';



@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns:string[] = ['name', 'category', 'price', 'quantity', 'total', 'delete'];
  dataSource:any = [];
  manageOrderForm:any = FormGroup;
  categories:any = [];
  products:any = [];
  price:any;
  quantity:any;
  total:number = 0;
  responseMessage:any;
  onEditProduct = new EventEmitter();
  dialogRef: any;
  

  constructor(private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    private productService:ProductService,
    private snackbarService:SnackbarService,
    private billService:BillService,
    private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategories();
    this.manageOrderForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      streetAddress:[null,[Validators.required,Validators.pattern(GlobalConstants.streetCodeRegex)]],
      city:[null,[Validators.required,Validators.pattern(GlobalConstants.cityRegex)]],
      state:[null,[Validators.required]],
      zipCode:[null,[Validators.required,Validators.pattern(GlobalConstants.zipCodeRegex)]],
      paymentMethod:[null,[Validators.required]],
      cardNumber:[null,[Validators.required, Validators.pattern(GlobalConstants.cardNumberRegex)]],
      expirationDate:[null,[Validators.required, Validators.pattern(GlobalConstants.expirationDateRegex)]],
      cvv:[null,[Validators.required, Validators.pattern(GlobalConstants.cvvRegex)]],
      accountNumber:[null,[Validators.required, Validators.pattern(GlobalConstants.accountNumberRegex)]],
      routingNumber:[null,[Validators.required, Validators.pattern(GlobalConstants.routingNumberRegex)]],
      product:[null,[Validators.required]],
      category:[null,[Validators.required]],
      quantity:[null,[Validators.required]],
      price:[null,[Validators.required]],
      total:[0,[Validators.required]]
    })
  }

  getCategories(){
    this.categoryService.get().subscribe((response:any)=>{
      this.ngxService.stop();
      this.categories = response;
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  getProductsByCategory(value:any){
    this.productService.getProductsByCategory(value.id).subscribe((response:any)=>{
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('$0');
      this.manageOrderForm.controls['quantity'].setValue('0');
      this.manageOrderForm.controls['total'].setValue('$0.00');
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  getProductDetails(value:any){
    this.productService.getById(value.id).subscribe((response:any)=>{
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue(response.quantity);
      this.manageOrderForm.controls['total'].setValue(this.price*response.quantity);
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  setQuantity(value:any){
    var temp = this.manageOrderForm.controls['quantity'].value;
    if(temp > 0){
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    } else if(temp != ''){
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    
    }
  }

validateProductAdd(){
  if(this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0)
  return true;
  else
  return false;
}

validateSubmit(){
  if (this.total === 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.controls['email'].value === null || 
  this.manageOrderForm.controls['contactNumber'].value === null || 
  this.manageOrderForm.controls['streetAddress'].value === null || 
  this.manageOrderForm.controls['city'].value === null || this.manageOrderForm.controls['state'].value === null || 
  this.manageOrderForm.controls['zipCode'].value === null || 
  this.manageOrderForm.controls['paymentMethod'].value === null || !(this.manageOrderForm.controls['email'].valid ||
  !(this.manageOrderForm.controls['contactNumber'].valid || !(this.manageOrderForm.controls['streetAddress'].valid || 
  !(this.manageOrderForm.controls['city'].valid || !(this.manageOrderForm.controls['state'].valid || 
  !(this.manageOrderForm.controls['zipCode'].valid)))))))
  return true;
  else
  return false;
}

add(){
  var formData = this.manageOrderForm.value;
  var productName = this.dataSource.find((e:{id:number;})=>e.id == formData.product.id);
  if(productName === undefined){
    this.total = this.total + formData.total;
    this.dataSource.push({id:formData.product.id, name:formData.product.name, category:formData.category.name, quantity:formData.quantity, price:formData.price, total:formData.total});
    this.dataSource = [...this.dataSource];
    this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
  }
else{
    this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
  }
}
  


handleDeleteAction(value:any, element:any){
  this.total = this.total - element.total;
  this.dataSource.splice(value,1);
  this.dataSource = [...this.dataSource];
}


submitAction(){
  this.ngxService.start();
  var formData = this.manageOrderForm.value;
  var data = {
    name:formData.name,
    email:formData.email,
    contactNumber:formData.contactNumber,
    streetAddress:formData.streetAddress,
    city:formData.city,
    state:formData.state,
    zipCode:formData.zipCode,
    paymentMethod:formData.paymentMethod,
    total:formData.total,
    quantity:formData.quantity,
    productDetails: JSON.stringify(this.dataSource)
  }
    
  this.billService.generateReport(data).subscribe((response:any)=>{
   
    this.downloadFile(response?.uuid);

    // Deduct quantity from product in database
    for (const product of this.dataSource) {
      const productData = { id: product.id, quantity: product.quantity };
      this.billService.updateQuantity(productData).subscribe((response:any)=>{
        this.manageOrderForm.reset();
        this.dataSource=[];
        this.total=0;
      },(error:any)=>{
        this.ngxService.stop();
        if(error.error?.message){
          this.responseMessage = error.error?.message
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
      });
    }
  });
}



downloadFile(fileName:any){
  var data ={
    uuid:fileName
  }
  this.billService.getPDF(data).subscribe((response:any)=>{
    saveAs(response,fileName+'.pdf');
    this.ngxService.stop();
  },(error:any)=>{
    this.ngxService.stop();
    if(error.error?.message){
      this.responseMessage = error.error?.message
    }else{
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
  })
}



}



