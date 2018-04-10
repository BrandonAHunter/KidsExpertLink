import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { IdeaDetailPage } from '../idea-detail/idea-detail';
import { Parse } from 'parse';
/**
 * Generated class for the SearchIdeaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-idea',
  templateUrl: 'search-idea.html',
})
export class SearchIdeaPage {
  Title;
  Description;
  Ideas;
  IdeaList = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  	this.Ideas = Parse.Object.extend('Idea');
    var ideaQuery = new Parse.Query(this.Ideas);

    var self = this;

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
        self.IdeaList.push(newItem);
        console.log(self.IdeaList[i]);
      }
      },
      error: function(error) {
      	alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchIdeaPage');
  }

  viewIdeaDetail(idea) {

    let addModal = this.modalCtrl.create(IdeaDetailPage, {idea: idea});

    addModal.onDidDismiss((Linked) => {

      if (Linked) {
        //TODO: Add Linked Info To Linked database table
      }

    });

    addModal.present();

  }
}
