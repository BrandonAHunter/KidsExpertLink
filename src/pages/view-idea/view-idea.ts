import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { IdeaDetailPage } from '../idea-detail/idea-detail';
import { Parse } from 'parse';


// Providers
import { Data } from '../../providers/data';
/**
 * Generated class for the ViewIdeaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-idea',
  templateUrl: 'view-idea.html',
})
export class ViewIdeaPage {
  static ideas = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public dataService: Data) {
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewIdeaPage');
  }

  getIdeas(){
    return ViewIdeaPage.ideas;
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
