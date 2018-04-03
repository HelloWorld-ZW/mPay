import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController,LoadingController, Events } from 'ionic-angular';
import { AddcardPage } from '../addcard/addcard';

import {CryptoProvider} from '../../providers/crypto/crypto';
import { HelperProvider } from '../../providers/helper/helper';
import { ServicesProvider } from '../../providers/services/services';


@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {


  cards: any = new Array();
  email: any;
  hasCard:any;
  
  pbk:any;
  sessKey:any;
  sessIv:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public crypto: CryptoProvider,
    public helper: HelperProvider,
    public services: ServicesProvider,
    public events: Events
    
  ) {

    this.email = navParams.get("email");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");
    this.pbk = navParams.get("pbk");
    
    this.realodCardListener();
  }

  ionViewDidLoad() {
    this.loadCards();
  }

  presentActionSheet(CardNum) {

    //console.log("card click = "+ CardNum);

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Option',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
          }
        }, {
          text: 'View Balance',
          handler: () => {
            console.log('View Balance clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  loadCards(){
    let uuid = (JSON.parse(this.helper.getDeviceInfo()).uuid) + "";
    let cipher = JSON.stringify({
      "uuid": this.crypto.RSAEncypto(uuid, this.pbk),
      "email": this.crypto.RSAEncypto(this.email, this.pbk)
    });
    this.loadCardsRetturns(cipher)
  }

  async loadCardsRetturns(cipher) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let response = await this.services.doPOST("mpay/registercard/loadCards", cipher).then(data => { return data; });
    loading.dismiss();

    let responseJson = JSON.parse(response.toString());
    let hiden = "**** **** **** ";
    if (responseJson.response == 1) {
      this.hasCard = true;
      this.cards = JSON.parse(this.crypto.AESDecypto(responseJson.card, this.sessKey, this.sessIv));
      (this.cards).forEach((aCard)=>{
        aCard.hidedNum = hiden+ (aCard.CardNum.toString()).substring(12,16);
        switch((aCard.CardNum.toString()).substring(0,1)){
          case '4':
            aCard.bgImg = "assets/imgs/visa.png";
            break;
          case '5':
            aCard.bgImg = "assets/imgs/master.png";
            break;
        }
      });

    }
    else{
      this.hasCard = false;
    }
  }

  addCard() {
    let navPar = {
      email:this.email,
      pbk:this.pbk,
      sessKey:this.sessKey,
      sessIv:this.sessIv
    };

    this.navCtrl.push(AddcardPage, navPar);
  }

  realodCardListener() {
    this.events.subscribe('reloadCards', () => {
      this.loadCards();
    });
  }
}
