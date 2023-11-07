import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), canActivate: [NoAuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'ver-paciente-nutri',
    loadChildren: () => import('./pages/ver-paciente-nutri/ver-paciente-nutri.module').then( m => m.VerPacienteNutriPageModule)
  },  {
    path: 'opciones-paciente-nutri',
    loadChildren: () => import('./pages/opciones-paciente-nutri/opciones-paciente-nutri.module').then( m => m.OpcionesPacienteNutriPageModule)
  },
  {
    path: 'sugerencias-nutri',
    loadChildren: () => import('./pages/sugerencias-nutri/sugerencias-nutri.module').then( m => m.SugerenciasNutriPageModule)
  },
  {
    path: 'semana-nutri',
    loadChildren: () => import('./pages/semana-nutri/semana-nutri.module').then( m => m.SemanaNutriPageModule)
  },
  {
    path: 'registros-nutri',
    loadChildren: () => import('./pages/registros-nutri/registros-nutri.module').then( m => m.RegistrosNutriPageModule)
  },
  {
    path: 'mediciones-paciente-nutri',
    loadChildren: () => import('./pages/mediciones-paciente-nutri/mediciones-paciente-nutri.module').then( m => m.MedicionesPacienteNutriPageModule)
  },
  {
    path: 'mediciones-a-tomar-nutri',
    loadChildren: () => import('./pages/mediciones-a-tomar-nutri/mediciones-a-tomar-nutri.module').then( m => m.MedicionesATomarNutriPageModule)
  },
  {
    path: 'mediciones-historico-nutri',
    loadChildren: () => import('./pages/mediciones-historico-nutri/mediciones-historico-nutri.module').then( m => m.MedicionesHistoricoNutriPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
