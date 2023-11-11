import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicionesHistoricoNutriPage } from './mediciones-historico-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: MedicionesHistoricoNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicionesHistoricoNutriPageRoutingModule {}
