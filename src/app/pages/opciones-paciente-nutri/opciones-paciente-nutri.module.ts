import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpcionesPacienteNutriPageRoutingModule } from './opciones-paciente-nutri-routing.module';

import { OpcionesPacienteNutriPage } from './opciones-paciente-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcionesPacienteNutriPageRoutingModule
  ],
  declarations: [OpcionesPacienteNutriPage]
})
export class OpcionesPacienteNutriPageModule {}
