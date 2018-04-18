import { Component } from '@angular/core';
import { NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { FriendsPage } from '../friends/friends';
import { HistoryPage } from '../history/history';
//import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { SettingsPage } from '../settings/settings';
import { CardPage } from '../card/card';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FriendsPage;
  tab3Root = HistoryPage;

  pages = [CardPage, SettingsPage];

  username: string;
  email: string;
  password:any;

  balance: any;

  pbk: any;
  sessKey: any;
  sessIv: any;

  fpPay:any;
  fpLogin:any;

  //tab4Root = SettingsPage;
  constructor(public navParams: NavParams,
    public navCtl: NavController,
    public event: Events,
    public menuCtrl: MenuController
  ) {
    //console.log(navParams);
    this.username = navParams.get("username");
    this.balance = navParams.get("balance");

    this.username = navParams.get("username");
    this.email = navParams.get("email");
    this.password = navParams.get("password");
    
    this.balance = navParams.get("balance");

    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");

    this.fpPay = navParams.get("fpPay");
    this.fpLogin = navParams.get("fpLogin");


    this.event.subscribe("updateBalance", (balance) => {
      this.balance = balance;
    });

    this.event.subscribe("updateSettings", (settings) => {
      this.fpPay = settings.fpPay;
      this.fpLogin = settings.fpLogin;
    });
    //returnToLogin
    this.event.subscribe("returnToLogin", () => {
      this._logout();
    });

  }

  _logout() {
    this.navCtl.setRoot(LoginPage);
  }

  gotoPage(index) {

    let navPar = {
      email: this.email,
      password: this.password,
      pbk: this.pbk,
      sessKey: this.sessKey,
      sessIv: this.sessIv,
      fpPay: this.fpPay,
      fpLogin: this.fpLogin
    };

    this.navCtl.push(this.pages[index], navPar);
  }
}
