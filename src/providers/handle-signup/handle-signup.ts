import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class HandleSignupProvider {

  constructor(public http: Http) {
    console.log('Hello HandleSignupProvider Provider');
  }

  doAccountSignUp(email:string, name:string, phone:string, password:string, type:string){
    //let url = "http://192.168.1.9:8080/hashServer/accountServ";
    let url = "http://172.21.6.220:8080/hashServer/accountServ";
    let data = JSON.stringify({
      "email": email,
      "name":name,
      "phone":phone,
      "password":password,
      "type":type
    });
    //let data = "hello world";
    let headers = new Headers({'Content-Type': 'application/json',
                    "Accept":'application/json'
                    });
                    
    let options = new RequestOptions({ headers: headers });
    
    return new Promise(resolve => {
      this.http.post(url, data, options)
        .map(res => res.json()).subscribe(data => {
            let responseData = data;
            resolve(responseData);            
        },
        err => {
          alert(err);
        });
    });
  }
}
