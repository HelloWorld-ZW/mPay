import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-history-modal',
  templateUrl: 'history-modal.html',
})
export class HistoryModalPage {

  aTrans:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController) {

      this.aTrans = this.navParams.get('aTrans');

  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
