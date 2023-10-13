import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanNutriPage } from './plan-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: PlanNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanNutriPageRoutingModule {}
