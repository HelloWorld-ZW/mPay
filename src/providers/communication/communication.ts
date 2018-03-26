import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { CryptographyProvider } from '../cryptography/cryptography';
import { HelperProvider } from '../helper/helper';

@Injectable()
export class CommunicationProvider {

  host:string = "http://172.20.10.6:8080/mPay_server/";
  headers: any;
  options: any;

  constructor(public http: Http,
    private storage: Storage,
    private cryptography: CryptographyProvider,
    private helper: HelperProvider,) {

      this.headers = new Headers({'Content-Type': 'application/json',
      "Accept":'application/json'
      });

      this.options = new RequestOptions({ headers: this.headers });

  }

  getPbkFromServer(){
    var url = this.host+"publicKeyApi";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      console.log(data.key);
      this.storage.set("serverPublicKey", data.key);
    });
  }

  /*
  postSymmetricKey(key:any){
    var url = this.host+"getSymmetricKey";
    
    return new Promise(resolve => {
      this.http.post(url, key, this.options)
        .map(res => res.json()).subscribe(data => {
            let responseData = data;
            resolve(responseData);            
        },
        err => {
          alert(err);
        });
    });

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

  postDeviceInfoAndSymmetricKeys(data:any){
    var url = this.host+"getDeviceAndKey";
    
      return new Promise(resolve => {
        this.http.post(url, data, this.options)
          .map(res => res.json()).subscribe(data => {
              let responseData = data;
              resolve(responseData);            
          },
          err => {
            alert(err);
          });
      });
      
  }
*/
  postDeviceInfoAndSymmetricKey(){
    var url = this.host+"getDeviceAndKey";

    var cipher = this.cryptography.RSAEncryptionUseServerPBK(this.helper.getDeviceInfoAndGenerateKeys());
    
    var data = JSON.stringify({
      "cipher": cipher
    });

    return new Promise(resolve => {
      this.http.post(url, data, this.options)
        .map(res => res.json()).subscribe(data => {
            let responseData = data;
            resolve(responseData);            
        },
        err => {
          alert(err);
        });
    });
  }

  
  doAccountSignUp(email:string, fullname:string, phone:string, password:string, type:string){
    // let url = this.host+"doAccountRegister";

    // var hashedPSW = this.cryptography.Sha1Hash(password);
    // var regData = JSON.stringify({
    //   'email':email,
    //   'fullname':fullname,
    //   'phone':phone,
    //   'password':hashedPSW,
    //   'type':type
    // });

    // var regCipher = this.cryptography.AESEncryption(regData);

    // var cipherWithDevice = JSON.stringify({
    //   'device': this.helper.getDeviceUUID(),
    //   'cipher': regCipher
    // });

    // return new Promise(resolve => {
    //   this.http.post(url, cipherWithDevice, this.options)
    //     .map(res => res.json()).subscribe(data => {
    //         let responseData = data;
    //         console.log(responseData);  
    //         resolve(responseData);            
    //     },
    //     err => {
    //       alert(err);
    //     });
    // });
    //console.log(cipherWithDevicc);
  }
  

  doAccountSignIn(email:string, password:string){
    let url = this.host+"doAccountSignIn";
    var hashPassword = this.cryptography.Sha256Hash(password).toString();
    //console.log("SHA256======= "+this.cryptography.Sha256Hash(password).toString());
    var loginData = JSON.stringify({
      'login_email': email,
      'login_password': hashPassword,
      'device_UUID': this.helper.getDeviceUUID()
    });

    return new Promise(resolve => {
      this.http.post(url, loginData, this.options)
        .map(res => res.text()).subscribe(data => {
            let responseData = data;
            //this.helper.setToLocalStorage("logindata",data);
            resolve(responseData);            
        },
        err => {
          alert(err);
        });
    });
  }

  getQrCodeDetail(transCode:string){
    let url = this.host+"getQrCodeDetail";
    var tCode = JSON.stringify({
      'transCode': transCode
    });

    return new Promise(resolve => {
      this.http.post(url, tCode, this.options)
        .map(res => res.text()).subscribe(data => {
            resolve(data);
        },
        err => {
          alert(err);
        });
    });
  }
  // Do http request here

  ///////////////////////////////////////////////////////////////////////////
  doPOST(link:string, cipher:string){

  }

  doGET(link:string){

  }
}
