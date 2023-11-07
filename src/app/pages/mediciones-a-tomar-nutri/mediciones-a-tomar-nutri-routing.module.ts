import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicionesATomarNutriPage } from './mediciones-a-tomar-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: MedicionesATomarNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicionesATomarNutriPageRoutingModule {}
