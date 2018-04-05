import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IdeaDetailPage } from './idea-detail';

@NgModule({
  declarations: [
    IdeaDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(IdeaDetailPage),
  ],
})
export class IdeaDetailPageModule {}
