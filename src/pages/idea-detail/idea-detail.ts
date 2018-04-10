import { Component } from '@angular/core';
import { NavParams, IonicPage, NavController, ViewController } from 'ionic-angular';
import { Parse } from 'parse';
import { ViewIdeaPage } from '../view-idea/view-idea';

/**
 * Generated class for the IdeaDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-idea-detail',
  templateUrl: 'idea-detail.html',
})
export class IdeaDetailPage {
  TypeUsing;
  Title;
  Description;
  Name;
  Email;
  Phone;
  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
  	
  }

  ionViewDidLoad() {
  	

    console.log("Load Detail Page");
  	var currentUser = Parse.User.current();
  	this.TypeUsing = currentUser.get('TypeOfUser');
  	console.log(this.TypeUsing);

  	if (this.TypeUsing == "Student")
	  {
    	let button = document.getElementById("linkButton");

    	button.style.display = "none";
	  }

  	this.Title = this.navParams.get('idea').Title;
  	this.Description = this.navParams.get('idea').Description;

  	var Users = Parse.Object.extend('User');
  	var userQuery = new Parse.Query(Users);
  	console.log(this.navParams.get('idea').Creator);
    userQuery.equalTo("objectId", this.navParams.get('idea').Creator);

    var self = this;

    userQuery.first({
      success: function(result) {
      	console.log("result: " + result);
      	self.Name = result.get("firstName") + " " + result.get("lastName");
      	self.Email = result.get("contactEmail");
      	self.Phone = result.get("phone");
      	console.log(self.Name, self.Email, self.Phone);
      },
      error: function(error) {
      	alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  Link(){
  	let newLink = {
      Expert: Parse.User.current().id,
      Student: this.navParams.get('idea').Creator,
      Title: this.Title,
      Description: this.Description,
    };

    this.view.dismiss(newLink);
  }

  close() {
    this.view.dismiss();
  }
}
