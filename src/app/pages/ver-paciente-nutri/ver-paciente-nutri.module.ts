import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPacienteNutriPageRoutingModule } from './ver-paciente-nutri-routing.module';

import { VerPacienteNutriPage } from './ver-paciente-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPacienteNutriPageRoutingModule
  ],
  declarations: [VerPacienteNutriPage]
})
export class VerPacienteNutriPageModule {}
