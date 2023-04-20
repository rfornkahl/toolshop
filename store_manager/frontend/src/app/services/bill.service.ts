import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  updateProductQuantity(productData: { id: any; quantity: any; }) {
    throw new Error('Method not implemented.');
  }
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  generateReport(data:any){
    return this.httpClient.post(this.url + "/billing/report", data,{
    headers:new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  getPDF(data:any):Observable<Blob>{
    return this.httpClient.post(this.url + "/billing/pdf", data, {responseType: 'blob'});
  }

  getBills(){
    return this.httpClient.get(this.url+"/billing/getBillingStatments");
  }

  updateQuantity(data:any){
    return this.httpClient.patch(this.url + '/billing/updateQuantity/', data,{
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  delete(id:any){
    return this.httpClient.delete(this.url+"/billing/delete/"+id,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    });
  }
}
