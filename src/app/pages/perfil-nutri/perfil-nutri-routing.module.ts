import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilNutriPage } from './perfil-nutri.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilNutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilNutriPageRoutingModule {}
