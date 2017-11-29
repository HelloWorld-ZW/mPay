import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';
import * as randomString from 'randomstring';
import * as nodeRSA from 'node-rsa';

@Injectable()
export class CryptographyProvider {

  serverPbkAPI:string ="http://192.168.1.9:8080/mServer/publicKeyApi";
  headers:Headers;
  options: RequestOptions;

  publicKey:any;
  SymmertricKey:any;

  constructor(public http: Http,
    private storage:Storage) {
    
      this.headers = new Headers({
        'Content-Type': 'application/json',
        "Accept":'application/json'
      });

      this.options = new RequestOptions({ headers: this.headers });

      //this.getPbkFromServer();

      this.getPbkFromLocal();

  }

  getPbkFromServer(){
    
    this.http.get(this.serverPbkAPI).map(res => res.json()).subscribe(data => {
      console.log(data.key);
      this.storage.set("serverPbulicKey", data.key);
    });

  }


  getPbkFromLocal(){
    this.storage.ready().then(() => {
        this.storage.get('serverPbulicKey').then((val)=>{
          this.publicKey = val;
        });
    });
    /*
    .then(retrieved => this.getPbkKey(retrieved)) //callback function
    .catch(e =>  console.error('ERROR: could not read Storage, error:', e));
    */

  }

  async getPbk(){
    //this.getPbkFromLocal();

    console.log(this.publicKey);
  }

  generateSymmetricKeys(){
    return randomString.generate({
      length:16,
      charset:'alphanumeric'
    });
  }

  sentSymmetricKeyToServer(){
    // To do :  symmertricKey identify (判定key是哪位用户的)
    this.SymmertricKey = JSON.stringify({
      "key":this.generateSymmetricKeys(),
      "iv":this.generateSymmetricKeys()
    });

    var key=new nodeRSA();  
    key.setOptions({encryptionScheme: 'pkcs1'}) 
    var keyData = '-----BEGIN PUBLIC KEY-----' +this.publicKey+ '-----END PUBLIC KEY-----';
    key.importKey(keyData, 'pkcs8-public');
    
    var cipher = key.encrypt(this.SymmertricKey,'base64');
    console.log(cipher);
  }


}
