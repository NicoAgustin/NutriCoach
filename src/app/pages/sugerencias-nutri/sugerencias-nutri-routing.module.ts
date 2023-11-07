import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SugerenciasNutriPage } from './sugerencias-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: SugerenciasNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SugerenciasNutriPageRoutingModule {}
