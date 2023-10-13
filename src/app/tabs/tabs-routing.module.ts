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
        loadChildren: () => import('../pages/inicial/inicial.module').then( m => m.InicialPageModule)
      },
      {
        path: 'mediciones',
        loadChildren: () => import('../pages/mediciones/mediciones.module').then( m => m.MedicionesPageModule)
      },
      {
        path: 'plan',
        loadChildren: () => import('../pages/plan/plan.module').then( m => m.PlanPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../pages/perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: 'inicial-nutri',
        loadChildren: () => import ('../pages/inicial-nutri/inicial-nutri.module').then( m => m.InicialNutriPageModule)
      },
      {
        path: 'mediciones-nutri',
        loadChildren: () => import ('../pages/mediciones-nutri/mediciones-nutri.module').then( m => m.MedicionesNutriPageModule)
      },
      {
        path: 'plan-nutri',
        loadChildren: () => import ('../pages/plan-nutri/plan-nutri.module').then( m => m.PlanNutriPageModule)
      },
      {
        path: 'perfil-nutri',
        loadChildren: () => import ('../pages/perfil-nutri/perfil-nutri.module').then( m => m.PerfilNutriPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
