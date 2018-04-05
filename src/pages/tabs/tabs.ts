import { Component } from '@angular/core';
import { Parse } from 'parse';

import { Data } from '../../providers/data';

import { CreateIdeaPage } from '../create-idea/create-idea';
import { ProfilePage } from '../profile/profile';
import { SearchIdeaPage } from '../search-idea/search-idea';
import { ViewIdeaPage } from '../view-idea/view-idea';
import { ViewLinkedPage } from '../view-linked/view-linked';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  title1 = 'Create Idea';
  tab1Root = CreateIdeaPage;
  title2 = 'View Ideas';
  tab2Root = ViewIdeaPage;
  tab3Root = ProfilePage;

  constructor() {
  	var currentUser = Parse.User.current();
  	var type = currentUser.get('TypeOfUser');
  	console.log(type);
  	if(type == 'Professional'){
  		this.title1 = 'Search Idea'
  		this.tab1Root = SearchIdeaPage;
  		this.title2 = 'Linked Idea'
  		this.tab2Root = ViewLinkedPage;
  	}
  }
}
