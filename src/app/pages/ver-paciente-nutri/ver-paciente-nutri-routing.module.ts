import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPacienteNutriPage } from './ver-paciente-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: VerPacienteNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPacienteNutriPageRoutingModule {}
