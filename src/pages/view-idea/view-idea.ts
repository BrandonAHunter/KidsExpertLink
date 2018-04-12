import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { IdeaDetailPage } from '../idea-detail/idea-detail';
import { CreateIdeaPage } from '../create-idea/create-idea';
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
    private ideaToDelete;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, 
                private alertCtrl: AlertController, public data: Data) 
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

    editIdea(idea)
    {
        if (idea != undefined)
        {
            this.navCtrl.push(CreateIdeaPage, 
            {
                item: idea
            });
        }
    }

    askToDeleteIdea(idea)
    {
        this.ideaToDelete = idea;
        this.presentConfirmDelete();
    }

    private deleteIdea()
    {
        this.data.removeIdea(this.ideaToDelete.IdeaId);
    }

    private presentAlert(text: string) 
    {
        console.log(text);
        let alert = this.alertCtrl.create(
        {
            title: 'Alert',
            subTitle: text,
            buttons: ['Ok']
        });
        alert.present();
    }

    private presentConfirmDelete() 
    {
        let alert = this.alertCtrl.create({
        title: 'Confirm delete',
        message: 'Are you sure you want to delete this idea?',
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    
                }
            },
            {
                text: 'Delete',
                role: 'delete',
                handler: () => {
                    this.deleteIdea();
                }
            }
        ]
        });

        alert.present();
    }
}
