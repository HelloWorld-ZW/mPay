import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as randomString from 'randomstring';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
//import { CryptographyProvider } from '../cryptography/cryptography';
//import { CommunicationProvider } from '../communication/communication';

@Injectable()
export class HelperProvider {

  localStorageVal : any;


  constructor(public http: Http, 
    private device:Device,
    private storage:Storage,
    //private cryptography: CryptographyProvider,
    //private communication: CommunicationProvider
  ) {
    console.log('Hello HelperProvider Provider');
  }

  

  genRandString(){
    return randomString.generate({
      length:16,
      charset:'alphanumeric'
    });
  }

  /*
  genSymmetricKey(){
    var key = JSON.stringify({
      "uuid":this.device.uuid,
      "key":this.genRandString(),
      "iv":this.genRandString()
    });
    this.storage.set("symmetricKey",key); //save key to local storage
    return key;
  }

  getDeviceInfo(){
    var info=JSON.stringify({
      "uuid": "this-is-test-uuid",//this.device.uuid,
      "platform":this.device.platform,
      "manufacturer":this.device.manufacturer,
      "model":this.device.model
    });
    return info;
  }

  EncAndPostDeviceInfo(){
    var cipher = this.cryptography.RSAEncryptionUseServerPBK(this.getDeviceInfo());
    var data = JSON.stringify({
      "cipher": cipher
    });
    
    console.log(data);
    this.communication.postDeviceInfo(data);

    console.log(cipher+"\n\n\n\n"+cipher.length);
  }
  EncAndPostSymmetricKey(){
    var key = this.genSymmetricKey();
    this.storage.set("symmetrick", key);
    var cipher = this.cryptography.RSAEncryptionUseServerPBK(key);

    var data = JSON.stringify({
      "cipher":cipher
    });
    this.communication.postSymmetricKey(data);

    console.log(cipher);
  }

  postData(dataType:string){
    switch(dataType){
      case "":
        break;
    }
  }
  */

  /////////////////////////////////////////

  getDeviceUUID(){
    return this.device.uuid;
  }
  getDeviceInfoAndGenerateKeys(){
    
    var key = this.genRandString();
    var iv = this.genRandString();
    var symmetricKey = JSON.stringify({
      "key":key,
      "iv":iv
    });

    this.storage.set("symmetricKey", symmetricKey);
    
    var data=JSON.stringify({
      "uuid": this.device.uuid,
      "platform":this.device.platform,
      "manufacturer":this.device.manufacturer,
      "model":this.device.model,
      "key":key,
      "iv":iv
    });

    return data;
  }



  // EncAndPostDeviceInfoAndSymmetricKey(){
  //   var cipher = this.cryptography.RSAEncryptionUseServerPBK(this.getDeviceInfoAndGenerateKeys());
  //   var data = JSON.stringify({
  //     "cipher": cipher
  //   });
    
  //   console.log(data);
  //   //this.communication.postDeviceInfoAndSymmetricKeys(data);
  // }


  // Do help functions here
}
