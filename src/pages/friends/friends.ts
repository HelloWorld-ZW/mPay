import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,ToastController,Events } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { HelperProvider } from '../../providers/helper/helper';



@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {


  email: string;

  pbk: any;
  sessKey: any;
  sessIv: any;

  previousVal:any=null;

  uuid_cipher: any;

  start:any=0;
  end:any=9;

  friendsList: any = new Array();
  haveMore: any = 1;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public services: ServicesProvider,
    public crypto: CryptoProvider,
    public helper: HelperProvider,
    public toastCtrl: ToastController,
    public event: Events

  ) {
    this.email = navParams.get("email");

    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");

    this.uuid_cipher = this.crypto.RSAEncypto(this.helper.getDeviceUUID(), this.pbk);

    this.loadFriends(this.start, this.end);
    //this.loopLoading();

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }

  onAddTaped() {

    let alert = this.alertCtrl.create({
      title: 'Friend Email',
      message: 'Please enter email to find frined',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'friendEmail',
          placeholder: 'Email Address',
          type:'email',
          value: this.previousVal
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Search',
          handler: data => {
            this.previousVal = data.friendEmail;
            this.searchFriend(data.friendEmail.toLowerCase());
          }
        }
      ]
    });
    alert.present({
      keyboardClose: false
    });

  }

  searchFriend(email){
    var msg = '';
    let toast = this.toastCtrl.create({
      duration: 3000,
      position:'top'
    });

    if(email == '' || email == null){
      msg = 'Email Cannot be empty !!';
      toast.setMessage(msg);
      this.onAddTaped();
    }
    else if(!this.helper.validateEmail(email)){
      msg = 'Invalid Email Address !!';
      toast.setMessage(msg);
      this.onAddTaped();
    }
    else if(email==this.email){
      msg = 'Cannot add yourself !!';
      toast.setMessage(msg);
      this.onAddTaped();
    }
    else{
      let data = JSON.stringify({
        'uuid': this.uuid_cipher,
        'friendEmail' : this.crypto.AESEncypto(email, this.sessKey,this.sessIv)
      });
      this.services.doPOST("mpay/account/findFriend", data).then((response)=>{
        let responseJson = JSON.parse(response.toString());
        if(responseJson.response==1){
          let friendName = this.crypto.AESDecypto(responseJson.friendName, this.sessKey, this.sessIv);
          this.showConfirmation(friendName, email);
        }
        else{
          toast.setMessage(responseJson.response);
        }
      });
    }

    toast.present();
  }

  showConfirmation(name, email){
    let confirm = this.alertCtrl.create({
      title: 'Add Friend? ',
      message: 'Add <b>'+ name +'</b> to list?',
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: () => {
            this.addFriend(email);
          }
        }
      ]
    });
    confirm.present();
  }

  addFriend(email){

    let toast = this.toastCtrl.create({
      duration: 3000,
      position:'top'
    });

    var msg = '';

    let emails = JSON.stringify({
      'selfEmail': this.email,
      'friendEmail': email
    });

    let data = JSON.stringify({
      'uuid': this.uuid_cipher,
      'data': this.crypto.AESEncypto(emails, this.sessKey, this.sessIv)
    });

    this.services.doPOST("mpay/account/addFriend", data).then((response)=>{
      let responseJson = JSON.parse(response.toString());
      if(responseJson.response==1){
        let friendName = this.crypto.AESDecypto(responseJson.friendName, this.sessKey, this.sessIv);
        toast.setMessage(friendName+" added successfully to list!")
      }
      else if(responseJson.response==0){
        let message = this.crypto.AESDecypto(responseJson.message, this.sessKey, this.sessIv);
        toast.setMessage(message);
      }
      else{
        toast.setMessage(responseJson.response);
      }

      toast.present();

    });
  }

  loadFriends(start, end){
    let data = JSON.stringify({
      'uuid': this.uuid_cipher,
      'email': this.crypto.AESEncypto(this.email, this.sessKey,this.sessIv),
      'start':start,
      'end': end
    });

    this.services.doPOST("mpay/account/loadFriend", data).then((response)=>{

      let responseJson = JSON.parse(response.toString());

      if(responseJson.response==1){
        let responseList = JSON.parse(this.crypto.AESDecypto(responseJson.list,this.sessKey, this.sessIv));

        // (responseList).forEach(aFriend => {

        //   this.friendsList.push(aFriend);

        // });

        this.friendsList = this.friendsList.concat(responseList);
      }

      //this.haveMore = responseJson.more;

      if(responseJson.more==1){
        this.loadFriends(this.start+10, this.end+10);
      }

    });
  }

   loopLoading(){

    while(this.haveMore==1){
      this.loadFriends(this.start, this.end);
      this.start+=10;
      this.end+=10;
    }

  }

}
