import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class CommunicationProvider {

  host:string = "http://192.168.1.9:8080/aServer/";
  headers: any;
  options: any;

  constructor(public http: Http,
    private storage: Storage) {

      this.headers = new Headers({'Content-Type': 'application/json',
      "Accept":'application/json'
      });

      this.options = new RequestOptions({ headers: this.headers });

  }

  getPbkFromServer(){
    var url = this.host+"publicKeyApi";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      console.log(data.key);
      this.storage.set("serverPbulicKey", data.key);
    });
  }

  postSymmetricKey(key:any){
    var url = this.host+"getSymmetricKey";

    // do post method
  }

  postDeviceInfo(info:any){
    var url = this.host+"getDeviceInfo";

    return new Promise(resolve => {
      this.http.post(url, info, this.options)
        .map(res => res.json()).subscribe(data => {
            let responseData = data;
            resolve(responseData);            
        },
        err => {
          alert(err);
        });
    });
  }
  // Do http request here
}
