import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Parse } from 'parse';

// Providers
import { Data } from '../../providers/data';
// https://ionicframework.com/docs/api/navigation/NavController/#setRoot

// Pages
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {
  registerPage = SignupPage;
  password: string = '';
  username: string = '';

  constructor(public navCtrl: NavController, data:Data, private loadCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('Initiated Signin');
  }

  public doSignin() {
    var self=this;
    Parse.User.logIn(this.username, this.password, {
    success: function(user) {
      console.log("logged in "+user.get("username"));
      self.navCtrl.setRoot(TabsPage);
    },
    error: function(user, error) {
    }
  });
  }

}
