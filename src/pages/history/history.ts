import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { HelperProvider } from '../../providers/helper/helper';


@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  email: string;
  pbk: any;
  sessKey: any;
  sessIv: any;

  transactions: any = new Array();

  groupedHistory:any = new Array();

  hasTransHistory:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public services: ServicesProvider,
    public crypto: CryptoProvider,
    public helper: HelperProvider,
    public loading: LoadingController

  ) {
    this.email = navParams.get("email");
    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");

    this.loadTrans();

  }

  ionViewDidLoad() {
    
    
  }

  loadTrans(){
    let uuid = (JSON.parse(this.helper.getDeviceInfo()).uuid) + "";
    let cipher = JSON.stringify({
      "uuid": this.crypto.RSAEncypto(uuid, this.pbk),
      "email": this.crypto.RSAEncypto(this.email, this.pbk),
      "start": 0,
      "end": 15
    });
    this.loadTransReturns(cipher)

    this.groupHistory();
  }
  async loadTransReturns(cipher){
    let loading = this.loading.create({
      content: 'Processing...'
    });
    loading.present();
    let response = await this.services.doPOST("mpay/transaction/history", cipher).then(data => { return data; });
    
    let responseJson = JSON.parse(response.toString());
    if(responseJson.response==1){
      this.hasTransHistory=true;

      let historyStr = this.crypto.AESDecypto(responseJson.cipher, this.sessKey, this.sessIv);
      let historyArray = JSON.parse(historyStr);

      this.transactions = historyArray;
    }
    else{
      this.hasTransHistory=false;
    }
    loading.dismiss();
  }

  groupHistory(){
    
    let currentDate = null;
    let currentTranHistory = [];

    this.transactions.array.forEach(obj => {
      let date = new Date(obj.datetime);
      let dateStr = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
      
      if(dateStr != currentDate){
        
        currentDate = dateStr;
        
        let newGroup = {
          "date": currentDate,
          "transHistory":[]
        };
        
        currentTranHistory = newGroup.transHistory;
        this.groupedHistory.push(newGroup);
      }

      currentTranHistory.push(obj);

    });
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {
      infiniteScroll.complete();
    }, 3000);
  }


}
