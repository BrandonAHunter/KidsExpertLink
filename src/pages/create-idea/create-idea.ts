import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Parse } from 'parse';
import { ViewIdeaPage } from '../view-idea/view-idea';

// Providers
import { Data } from '../../providers/data';
/**
 * Generated class for the CreateIdeaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-idea',
  templateUrl: 'create-idea.html',
})
export class CreateIdeaPage {
  Title;
  Description;
  Ideas;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.Ideas = Parse.Object.extend('Idea');
    var ideaQuery = new Parse.Query(this.Ideas);
    console.log(Parse.User.current().id);
    ideaQuery.equalTo("CreatedBy", Parse.User.current().id);
    ideaQuery.find({
      success: function(results) {
        // Do something with the returned Parse.Object values
      console.log(results.length);
      for (var i = 0; i < results.length; i++) {
        let newItem = {
            Title: results[i].get("Title"),
            Description: results[i].get("Description"),
            Creator: results[i].get("CreatedBy")
          };
        ViewIdeaPage.ideas.push(newItem);
        console.log(ViewIdeaPage.ideas[i]);
      }
      },
      error: function(error) {
      alert("Error: " + error.code + " " + error.message);
      }
    });

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateIdeaPage');
  }
  
  CreateDescription(){
  	var Idea = new this.Ideas();
  	
  	Idea.set('CreatedBy', Parse.User.current().id);
  	Idea.set('Title', this.Title);
  	Idea.set('Description', this.Description);
    var self = this;
  	Idea.save(null, {
  		success: function(menu) {
        let newItem = {
            Title: self.Title,
            Description: self.Description,
            Creator: Parse.User.current().id
          };
        ViewIdeaPage.ideas.push(newItem);
        self.Title = "";
        self.Description = "";
  		},
  		error: function(menu, error) {
   			alert('Failed to create new idea, with error code: ' + error.message);
  		}
	});
  }
}
