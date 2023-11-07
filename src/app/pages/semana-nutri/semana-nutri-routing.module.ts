import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SemanaNutriPage } from './semana-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: SemanaNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SemanaNutriPageRoutingModule {}
