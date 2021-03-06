import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';
import * as randomString from 'randomstring';
import * as nodeRSA from 'node-rsa';
import { Device } from '@ionic-native/device';
import * as aesCorss from 'aes-cross';
import * as buffer from 'buffer';
import * as convertString from 'convert-string';
import * as SHA1 from 'crypto-js/SHA1';
import * as SHA256 from 'crypto-js/SHA256';
import { HelperProvider } from '../helper/helper';


@Injectable()
export class CryptographyProvider {

  //serverPbkAPI:string ="http://172.21.6.179:8080/mServer/publicKeyApi";
  //headers:Headers;
  //options: RequestOptions;

  publicKey:any;
  symmertricKey:any;

  //new
  pbkValue:any;
  sessionKeyVal:any;
  sessionIvVal:any;

  constructor(public http: Http,
    private storage:Storage,
    private device:Device,
    private helper:HelperProvider
  ) {
    
      this.getKeysFromLocal('serverPublicKey');

      this.pbkValue = this.helper.getStorageData("ServerPBK");
      this.sessionKeyVal = this.helper.getStorageData("sessKey");
      this.sessionIvVal = this.helper.getStorageData("sessIv");

      setTimeout(()=>{
        this.getKeysFromLocal('symmetricKey');
      },3000);
  }

  // getPbkFromServer(){
    
  //   this.http.get(this.serverPbkAPI).map(res => res.json()).subscribe(data => {
  //     console.log(data.key);
  //     this.storage.set("serverPbulicKey", data.key);
  //   });

  // }


  getPbkFromLocal(){
    this.storage.ready().then(() => {
        this.storage.get('serverPublicKey').then((val)=>{
          this.publicKey = val;
        });
    });
    /*
    .then(retrieved => this.getPbkKey(retrieved)) //callback function
    .catch(e =>  console.error('ERROR: could not read Storage, error:', e));
    */
  }



  getKeysFromLocal(key:string){
    this.storage.ready().then(() => {
      this.storage.get(key).then((val)=>{
        
        if(key == 'serverPublicKey'){
          this.publicKey = val;
        }
        else{
          this.symmertricKey = val;
        }
      });
    });
  }


  // sentSymmetricKeyToServer(){
  //   // To do :  symmertricKey identify (判定key是哪位用户的)
  //   this.SymmertricKey = JSON.stringify({
  //     "uuid":this.device.uuid,
  //     "key":this.genRandString(),
  //     "iv":this.genRandString()
  //   });

  //   var key=new nodeRSA();  
  //   key.setOptions({encryptionScheme: 'pkcs1'}) 
  //   var keyData = '-----BEGIN PUBLIC KEY-----' +this.publicKey+ '-----END PUBLIC KEY-----';
  //   key.importKey(keyData, 'pkcs8-public');
    
  //   var cipher = key.encrypt(this.SymmertricKey,'base64');
  //   console.log(cipher);
  // }

  RSAEncryptionUseServerPBK(data:string){
    
    this.getPbkFromLocal();
    var key=new nodeRSA();  
    key.setOptions({encryptionScheme: 'pkcs1'}) 
    var keyData = '-----BEGIN PUBLIC KEY-----' +this.publicKey+ '-----END PUBLIC KEY-----';
    key.importKey(keyData, 'pkcs8-public');
    
    var cipher = key.encrypt(data,'base64');
    return cipher;
  }

  AESEncryption(plaintext:string){
    var keys = JSON.parse(this.symmertricKey);
    var key = new buffer.Buffer(convertString.stringToBytes(keys.key));
    var iv = new buffer.Buffer(convertString.stringToBytes(keys.iv));
    var ciphertext = aesCorss.encText(plaintext,key,iv);
    return ciphertext;
  }

  AESDecryption(ciphertext:string){
    var keys = JSON.parse(this.symmertricKey);
    var key = new buffer.Buffer(convertString.stringToBytes(keys.key));
    var iv = new buffer.Buffer(convertString.stringToBytes(keys.iv));
    
    var plaintext = aesCorss.decText(ciphertext,key,iv);
    return plaintext;
  }
  
  Sha1Hash(data:string){
    return SHA1(data);
  }
  
  Sha256Hash(data:string){
    return SHA256(data);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  RSAEnc(plain:string){
    var publicKey = this.pbkValue.__zone_symbol__value;
    var key=new nodeRSA();  
    key.setOptions({encryptionScheme: 'pkcs1'}) 
    var keyData = '-----BEGIN PUBLIC KEY-----' +publicKey+ '-----END PUBLIC KEY-----';
    key.importKey(keyData, 'pkcs8-public');
    
    var cipher = key.encrypt(plain,'base64');
    return cipher;
  }

  AESEnc(plain:string){
    var buffer_key = new buffer.Buffer(convertString.stringToBytes(this.sessionKeyVal.__zone_symbol__value));
    var buffer_iv = new buffer.Buffer(convertString.stringToBytes(this.sessionIvVal.__zone_symbol__value));
    return aesCorss.encText(plain,buffer_key,buffer_iv);
  }

  AESDec(cipher:string){
    var buffer_key = new buffer.Buffer(convertString.stringToBytes(this.sessionKeyVal.__zone_symbol__value));
    var buffer_iv = new buffer.Buffer(convertString.stringToBytes(this.sessionIvVal.__zone_symbol__value));
    return aesCorss.decText(cipher,buffer_key,buffer_iv);
  }

  // Do Decrypt and Encrypt operation here.

}
