import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as randomString from 'randomstring';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
//import { CryptographyProvider } from '../cryptography/cryptography';
//import { CommunicationProvider } from '../communication/communication';

@Injectable()
export class HelperProvider {

  localStorageVal: any;


  constructor(public http: Http,
    private device: Device,
    private storage: Storage,
    private file: File
    //private cryptography: CryptographyProvider,
    //private communication: CommunicationProvider
  ) {
    console.log('Hello HelperProvider Provider');
  }



  genRandString() {
    return randomString.generate({
      length: 16,
      charset: 'alphanumeric'
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

  getDeviceUUID() {
    return this.device.uuid;
  }

  getDeviceInfoAndGenerateKeys() {

    var key = this.genRandString();
    var iv = this.genRandString();
    var symmetricKey = JSON.stringify({
      "key": key,
      "iv": iv
    });

    this.storage.set("symmetricKey", symmetricKey);

    var data = JSON.stringify({
      "uuid": this.device.uuid,
      "platform": this.device.platform,
      "manufacturer": this.device.manufacturer,
      "model": this.device.model,
      "key": key,
      "iv": iv
    });

    return data;
  }

  getFromLocalStroage(key: string) {
    return this.storage.get(key);
  }

  setToLocalStorage(key: string, data: any) {
    this.storage.set(key, data);
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async getStorageData(key: string) {
    return await this.storage.get(key).then((val) => {
      //this.localStorageVal = val;
      return val;
      //console.log("helper: "+val);
    });

    // console.log("helper: "+this.localStorageVal);
    // return this.localStorageVal;

  }

  setStorageData(key: string, data: any) {
    this.storage.set(key, data);
  }

  getDeviceInfo() {
    return JSON.stringify({
      "uuid": this.device.uuid,
      "platform": this.device.platform,
      "manufacturer": this.device.manufacturer,
      "model": this.device.model
    });
  }

  generateSessionKey() {
    return JSON.stringify({
      key: this.genRandString(),
      iv: this.genRandString()
    });
  }

  cardValidate(card: string) {
    var drop_last_digit = card.replace(/\s/g, '').slice(0, -1);
    var reverse_digit = this.reverseString(drop_last_digit);
    var digits_array = reverse_digit.split("");
    var sum_digits = 0;

    digits_array.forEach((digit, index) => {
      if ((index + 1) % 2 != 0) {
        digit = (parseInt(digit) * 2).toString();
      }
      if (parseInt(digit) > 9) {
        digit = (parseInt(digit) - 9).toString();
      }
      sum_digits += parseInt(digit);
    })
    if ((10-(sum_digits % 10)) == parseInt(card.slice(-1))) {
      return true;
    }
    else {
      return false;
    }
  }

  reverseString(str: string) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var reverseStr = reverseArray.join("");
    return reverseStr;
  }


  writeFile(filename, data){
    this.file.writeFile(this.file.dataDirectory,filename, data, {replace:true});
  }

  readFile( filename){
    return this.file.readAsText(this.file.dataDirectory,filename);
  }

  createFile( filename){
    this.file.createFile(this.file.dataDirectory,filename, false);
  }

  checkFile(filename){
    return this.file.checkFile(this.file.dataDirectory, filename);
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


}
