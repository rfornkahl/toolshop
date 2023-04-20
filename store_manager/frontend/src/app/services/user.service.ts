import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  signup(data:any){
    return this.httpClient.post(this.url+
      "/user/signup",data,{
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
  }

  forgotPassword(data:any){
    return this.httpClient.post(this.url+
      "/user/forgotpassword", data,{
        headers: new HttpHeaders().set("Content-Type","application/json")
      })
  }


login(data:any){
  return this.httpClient.post(this.url+
    "/user/login", data,{
      headers: new HttpHeaders().set("Content-Type","application/json")
    })
}

token(){
  return this.httpClient.get(this.url+
    "/user/token");
}

resetPassword(data:any){
  return this.httpClient.post(this.url+
    "/user/resetpassword", data,{
      headers: new HttpHeaders().set("Content-Type","application/json")
    })
}

getUsers(){
  return this.httpClient.get(this.url+"/user/allusers");
}

update(data:any){
  return this.httpClient.patch(this.url+"/user/update",data,{
    headers: new HttpHeaders().set("Content-Type","application/json")
  })
}

add(data:any){
  return this.httpClient.patch(this.url+"/user/add",data,{
    headers: new HttpHeaders().set("Content-Type","application/json")
  })
}



delete(id:any){
  return this.httpClient.delete(this.url + '/user/delete/'+id,{
    headers: new HttpHeaders().set('Content-Type', "application/json")
  })
}


}
