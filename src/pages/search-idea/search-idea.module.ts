import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchIdeaPage } from './search-idea';

@NgModule({
  declarations: [
    SearchIdeaPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchIdeaPage),
  ],
})
export class SearchIdeaPageModule {}
