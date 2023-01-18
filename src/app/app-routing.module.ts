import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TracklistComponent } from './tracklist/tracklist.component';
import { VideoComponent } from './video/video.component';

const routes: Routes = [
  { path: 'tracklist', component: TracklistComponent },
  { path: 'video', component: VideoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
