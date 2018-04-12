import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IdeaDetailPage } from '../idea-detail/idea-detail';
import { Parse } from 'parse';
import { Data } from '../../providers/data';

/**
 * Generated class for the ViewLinkedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-linked',
  templateUrl: 'view-linked.html',
})
export class ViewLinkedPage 
{
    constructor(public navCtrl: NavController, public navParams: NavParams,
                public data: Data) 
    {
        
    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad ViewLinkedPage');
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

    get LinkedIdeasList(): any[]
    {
        return this.data.LinkedItemsList;
    }
}
