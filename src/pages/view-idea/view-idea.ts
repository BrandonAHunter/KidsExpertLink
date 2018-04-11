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
export class ViewIdeaPage 
{
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, 
                public data: Data) 
    {

    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad ViewIdeaPage');
    }

    getIdeas()
    {
        return this.data.LinkedItemsList;
    }

    viewIdeaDetail(idea) 
    {
        if (idea != undefined)
        {
            this.navCtrl.push(IdeaDetailPage, 
            {
                item: idea
            });
        }
    }
}
