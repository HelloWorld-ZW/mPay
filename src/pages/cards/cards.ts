import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Events, LoadingController} from 'ionic-angular';
import { AddcardPage } from '../addcard/addcard';
import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { ServicesProvider } from '../../providers/services/services';
import { HelperProvider } from '../../providers/helper/helper';


@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html',
})
export class CardsPage {

  cards: any = new Array();
  email: any;
  hasCard:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public helper: HelperProvider,
    public crypto: CryptographyProvider,
    public services: ServicesProvider, ) {

    this.email = this.helper.getStorageData("loggedIn");

    setTimeout(() => {
      this.loadCards();
    }, 150);
    this.realodCardListener();
  }

  ionViewDidLoad() {
    //console.log('this is output when card view loaded_2');
  }

  presentActionSheet(CardNum) {

    console.log("card click = "+ CardNum);

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

  realodCardListener() {
    this.events.subscribe('reloadCards', () => {
      console.log("reload");
      this.loadCards();
    });
  }

  loadCards() {
    let loginEmail = this.email.__zone_symbol__value;
    let uuid = (JSON.parse(this.helper.getDeviceInfo()).uuid) + "";
    let cipher = JSON.stringify({
      "uuid": this.crypto.RSAEnc(uuid),
      "email": this.crypto.RSAEnc(loginEmail)
    });

    //TODO: do POST 
    this.loadCardsRetturns(cipher);

    console.log(cipher);
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

      this.cards = JSON.parse(this.crypto.AESDec(responseJson.card));
      (this.cards).forEach((aCard)=>{
        aCard.hidedNum = hiden+ (aCard.CardNum.toString()).substring(12,16);
        switch((aCard.CardNum.toString()).substring(0,1)){
          case '4':
            aCard.bgImg = "/assets/imgs/visa.png";
            break;
          case '5':
            aCard.bgImg = "/assets/imgs/master.png";
            break;
        }
        console.log(aCard.hidedNum);
        console.log(aCard.CardNum);
      });
        //.put("hidedNum", hiden+(JSON.parse(aCard).CardNum).toString().substring(12,15));
      
      console.log(JSON.stringify(this.cards[0]));
    }
    else {
      this.hasCard = false;
    }
  }

  addCard() {
    this.navCtrl.push(AddcardPage);
  }
}
