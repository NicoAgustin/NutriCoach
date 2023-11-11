import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicionesPacienteNutriPageRoutingModule } from './mediciones-paciente-nutri-routing.module';

import { MedicionesPacienteNutriPage } from './mediciones-paciente-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicionesPacienteNutriPageRoutingModule
  ],
  declarations: [MedicionesPacienteNutriPage]
})
export class MedicionesPacienteNutriPageModule {}
