import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrosNutriPage } from './registros-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrosNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrosNutriPageRoutingModule {}
