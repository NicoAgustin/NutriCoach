import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inicial',
        loadChildren: () => import('../inicial/inicial.module').then( m => m.InicialPageModule)
      },
      {
        path: 'mediciones',
        loadChildren: () => import('../mediciones/mediciones.module').then( m => m.MedicionesPageModule)
      },
      {
        path: 'plan',
        loadChildren: () => import('../plan/plan.module').then( m => m.PlanPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
