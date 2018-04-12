import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public helper: HelperProvider,
    public services: ServicesProvider,
    public crypto: CryptoProvider
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  fp_login(event){
    this.helper.createFile("settings.json");
    
    alert(event.checked);
  }

}
