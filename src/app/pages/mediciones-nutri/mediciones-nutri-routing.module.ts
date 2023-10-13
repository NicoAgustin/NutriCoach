import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicionesNutriPage } from './mediciones-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: MedicionesNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicionesNutriPageRoutingModule {}
