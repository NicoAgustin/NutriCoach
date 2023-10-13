import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicialNutriPage } from './inicial-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: InicialNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicialNutriPageRoutingModule {}
