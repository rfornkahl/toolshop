import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  contact(data:any){
    return this.httpClient.post(this.url+
      "/contact/contact-us",data,{
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
  }

  adminContact(data:any){
    return this.httpClient.post(this.url+
      "/contact/admin-contact",data,{
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
  }
}
