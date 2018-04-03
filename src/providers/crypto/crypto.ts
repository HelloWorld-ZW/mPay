import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as aesCorss from 'aes-cross';
import * as buffer from 'buffer';
import * as convertString from 'convert-string';
import * as SHA256 from 'crypto-js/SHA256';
import * as nodeRSA from 'node-rsa';


@Injectable()
export class CryptoProvider {

  constructor() {
    console.log('Hello CryptoProvider Provider');
  }

  RSAEncypto(plaintext:string, pbk:string){
    var key=new nodeRSA();  
    key.setOptions({encryptionScheme: 'pkcs1'}) 
    var keyData = '-----BEGIN PUBLIC KEY-----' +pbk+ '-----END PUBLIC KEY-----';
    key.importKey(keyData, 'pkcs8-public');
    
    var cipher = key.encrypt(plaintext,'base64');
    return cipher;
  }

  AESEncypto(plaintext:string, key:string, iv:string){
    var buffer_key = new buffer.Buffer(convertString.stringToBytes(key));
    var buffer_iv = new buffer.Buffer(convertString.stringToBytes(iv));
    return aesCorss.encText(plaintext,buffer_key,buffer_iv);
  }

  AESDecypto(ciphertext:string, key:string, iv:string){
    var buffer_key = new buffer.Buffer(convertString.stringToBytes(key));
    var buffer_iv = new buffer.Buffer(convertString.stringToBytes(iv));
    return aesCorss.decText(ciphertext,buffer_key,buffer_iv);
  }

  SHA256(data:string){
    return SHA256(data);
  }

}
