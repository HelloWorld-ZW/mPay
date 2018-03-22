import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { CryptographyProvider } from '../cryptography/cryptography';
import { HelperProvider } from '../helper/helper';

@Injectable()
export class ServicesProvider {

  private HOST_URL:string = "http://172.21.2.79:8080/mPay_service1/webresources/";
  private headers: any;
  private options: any;

  constructor(public http: Http,
    private storage: Storage,
    private cryptography: CryptographyProvider,
    private helper: HelperProvider) {

    this.headers = new Headers({'Content-Type': 'text/plain',
    "Accept":'application/json'
    });

    this.options = new RequestOptions({ headers: this.headers });
  }

  getServerPBK(){
    var url = this.HOST_URL+"mpay/api/publickey";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      console.log("REST; "+data.keyValue);
      this.helper.setStorageData("ServerPBK", data.keyValue);
    });
  }

  doPOST(path:string, cipher:string){
    console.log("doPOST_==== "+cipher);
    return new Promise(resolve => {
      this.http.post(this.HOST_URL+path, cipher, this.options)
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

  doGET(path:string){

  }

  test(){
    console.log(this.cryptography.RSAEnc('hello_20170305201456587zhen@student.lit.ie'));
  }

}
