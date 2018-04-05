import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Parse } from 'parse';

// Providers
// import { AuthProvider } from '../../providers/auth/auth';

// Pages
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  password: string = '';
  username: string = '';
  firstName;
  lastName;
  phone;
  email: string = '';
  TypeOfUser;

  constructor(public navCtrl: NavController, private loadCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('Initiate Signup');
  }

  public doRegister() {

    var user = new Parse.User();
      user.set("username", this.username);
      user.set("password", this.password);
      user.set("email", this.email);
      user.set("firstName", this.firstName);
      user.set("lastName", this.lastName);
      user.set("phone", this.phone);
      user.set("TypeOfUser", this.TypeOfUser);


      // other fields can be set just like with Parse.Object
      // user.set("phone", "888-888-888");
      var self=this;
      user.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
          console.log("signup success"+user.get("username"));
          self.navCtrl.pop();
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });


    console.log("sign up");

  }

}
