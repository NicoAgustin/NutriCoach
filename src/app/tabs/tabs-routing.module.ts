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
        path: 'perfil-nutri',
        loadChildren: () => import ('../pages/perfil-nutri/perfil-nutri.module').then( m => m.PerfilNutriPageModule)
      },
      {
        path: 'ver-paciente-nutri',
        loadChildren: () => import ('../pages/ver-paciente-nutri/ver-paciente-nutri-routing.module').then(m => m.VerPacienteNutriPageRoutingModule)
      },
      {
        path: 'opciones-paciente-nutri',
        loadChildren: () => import ('../pages/opciones-paciente-nutri/opciones-paciente-nutri-routing.module').then(m => m.OpcionesPacienteNutriPageRoutingModule)
      },
      {
        path: 'sugerencias-nutri',
        loadChildren: () => import ('../pages/sugerencias-nutri/sugerencias-nutri-routing.module').then(m => m.SugerenciasNutriPageRoutingModule)
      },
      {
        path: 'semana-nutri',
        loadChildren: () => import ('../pages/semana-nutri/semana-nutri-routing.module').then(m => m.SemanaNutriPageRoutingModule)
      },
      {
        path: 'registros-nutri',
        loadChildren: () => import ('../pages/registros-nutri/registros-nutri-routing.module').then(m => m.RegistrosNutriPageRoutingModule)
      },
      {
        path: 'mediciones-paciente-nutri',
        loadChildren: () => import ('../pages/mediciones-paciente-nutri/mediciones-paciente-nutri.module').then(m => m.MedicionesPacienteNutriPageModule)
      },
      {
        path: 'mediciones-a-tomar-nutri',
        loadChildren: () => import ('../pages/mediciones-a-tomar-nutri/mediciones-a-tomar-nutri.module').then(m => m.MedicionesATomarNutriPageModule)
      },
      {
        path: 'mediciones-historico-nutri',
        loadChildren: () => import ('../pages/mediciones-historico-nutri/mediciones-historico-nutri.module').then(m => m.MedicionesHistoricoNutriPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
