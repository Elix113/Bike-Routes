import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {path:'map', component: MapComponent},
  {path:'list', component: ListComponent},
  {path:'list/:view', component: ListComponent},
  {path:'', component: MapComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
