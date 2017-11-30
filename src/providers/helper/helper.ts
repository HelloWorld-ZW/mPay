import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as randomString from 'randomstring';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { CryptographyProvider } from '../cryptography/cryptography';
import { CommunicationProvider } from '../communication/communication';

@Injectable()
export class HelperProvider {

  constructor(public http: Http, 
    private device:Device,
    private storage:Storage,
    private cryptography: CryptographyProvider,
    private communication: CommunicationProvider) {
    console.log('Hello HelperProvider Provider');
  }

  

  genRandString(){
    return randomString.generate({
      length:16,
      charset:'alphanumeric'
    });
  }

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
      "platform":"ios",//this.device.platform,
      "manufacturer":"apple",//this.device.manufacturer,
      "model":"iPhone 6"//this.device.model
    });
    return info;
  }

  EncAndPostData(){
    var cipher = this.cryptography.RSAEncryptionUseServerPBK(this.getDeviceInfo());
    var data = JSON.stringify({
      "cipher": cipher
    });
    
    console.log(data);
    this.communication.postDeviceInfo(data);

    console.log(cipher+"\n\n\n\n"+cipher.length);
  }


  // Do help functions here
}
