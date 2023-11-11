import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicionesPacienteNutriPage } from './mediciones-paciente-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: MedicionesPacienteNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicionesPacienteNutriPageRoutingModule {}
