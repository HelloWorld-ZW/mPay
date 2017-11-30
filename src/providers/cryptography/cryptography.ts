import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';
import * as randomString from 'randomstring';
import * as nodeRSA from 'node-rsa';
import { Device } from '@ionic-native/device';


@Injectable()
export class CryptographyProvider {

  serverPbkAPI:string ="http://172.21.6.179:8080/mServer/publicKeyApi";
  headers:Headers;
  options: RequestOptions;

  publicKey:any;
  SymmertricKey:any;

  constructor(public http: Http,
    private storage:Storage,
    private device:Device) {
    
      this.headers = new Headers({
        'Content-Type': 'application/json',
        "Accept":'application/json'
      });

      this.options = new RequestOptions({ headers: this.headers });

      //this.getPbkFromServer();

      this.getPbkFromLocal();

  }

  // getPbkFromServer(){
    
  //   this.http.get(this.serverPbkAPI).map(res => res.json()).subscribe(data => {
  //     console.log(data.key);
  //     this.storage.set("serverPbulicKey", data.key);
  //   });

  // }


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

  genRandString(){
    return randomString.generate({
      length:16,
      charset:'alphanumeric'
    });
  }

  genSymmetricKey(){
    this.SymmertricKey = JSON.stringify({
      "uuid":this.device.uuid,
      "key":this.genRandString(),
      "iv":this.genRandString()
    });
  }


  RSAEncryptSymmetricKey(key:string){
    
  }

  sentSymmetricKeyToServer(){
    // To do :  symmertricKey identify (判定key是哪位用户的)
    this.SymmertricKey = JSON.stringify({
      "uuid":this.device.uuid,
      "key":this.genRandString(),
      "iv":this.genRandString()
    });

    var key=new nodeRSA();  
    key.setOptions({encryptionScheme: 'pkcs1'}) 
    var keyData = '-----BEGIN PUBLIC KEY-----' +this.publicKey+ '-----END PUBLIC KEY-----';
    key.importKey(keyData, 'pkcs8-public');
    
    var cipher = key.encrypt(this.SymmertricKey,'base64');
    console.log(cipher);
  }

  RSAEncryptionUseServerPBK(data:string){
    
    this.getPbkFromLocal();
    var key=new nodeRSA();  
    key.setOptions({encryptionScheme: 'pkcs1'}) 
    var keyData = '-----BEGIN PUBLIC KEY-----' +this.publicKey+ '-----END PUBLIC KEY-----';
    key.importKey(keyData, 'pkcs8-public');
    
    var cipher = key.encrypt(data,'base64');
    return cipher;
  }

  // Do Decrypt and Encrypt operation here.

}
