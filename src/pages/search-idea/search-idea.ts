import { Component, Pipe, PipeTransform } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { IdeaDetailPage } from '../idea-detail/idea-detail';
import { Data } from '../../providers/data';
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
export class SearchIdeaPage 
{
    private searchInput: string = '';
    private shouldShowCancel: boolean = true;

    constructor(public navCtrl: NavController, public navParams: NavParams, 
                public modalCtrl: ModalController, public data: Data,
                private loadCtrl: LoadingController, private _app: App) 
    {

    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad SearchIdeaPage');
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

    onSearchInput($event)
    {

    }
    
    onSearchCancel($event)
    {
        this.searchInput = '';
    }
    
    get IdeasList(): any[]
    {
        if (this.searchInput.length > 0)
        {
            let itemList = this.data.IdeaItemsList;
            let filteredList = [];
            for (var i = 0; i < itemList.length; i++)
            {
                let title: string = itemList[i].Title.toLowerCase().replace(" ", "");
                let searchLower: string = this.searchInput.toLowerCase().replace(" ", "");

                if (title.includes(searchLower) || searchLower.includes(title))
                {
                    filteredList.push(itemList[i]);
                }
            }
            return filteredList;
        }
        else
        {
            return this.data.IdeaItemsList;
        }
    }

    private Logout(){

        let loader = this.loadCtrl.create(
        {
            content: 'Logging out...'
        });

        loader.present();

        var self = this;

        console.log("Logout");
        Parse.User.logOut().then(() => {
              self.data.clearLoginData();
              loader.dismissAll();
              self._app.getRootNav().setRoot(SigninPage);
              self.data.load();
        });
    }
}
