import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';

@Injectable()
export class CryptographyProvider {

  serverPbkAPI:string ="http://192.168.1.9:8080/hashServer/publicKeyApi";
  headers:Headers;
  options: RequestOptions;

  publicKey:string=null;

  constructor(public http: Http,
    private storage:Storage) {
    
      this.headers = new Headers({
        'Content-Type': 'application/json',
        "Accept":'application/json'
      });

      this.options = new RequestOptions({ headers: this.headers });

      this.getServerPbk();

  }

  getServerPbk(){
    
    this.http.get(this.serverPbkAPI).map(res => res.json()).subscribe(data => {
      console.log(data.key);
      this.storage.set("serverPbulicKey", data.key);
    });

  }


  getPbkFromLocal(){
    // return new Promise(resolve => {
    //   this.storage.get("serverPbulicKey").then((data)=>{
    //     resolve(data);
    //   })
    // });

    //let that = this;
    this.storage.ready().then(() => {
        return this.storage.get('serverPbulicKey');
    })
    .then(retrieved => this.getPbkKey(retrieved)) //callback function
    .catch(e =>  console.error('ERROR: could not read Storage, error:', e));

  }

  getPbkKey(keyVal){
    console.log(keyVal);

    //DO DATA Encryption
  }

}
