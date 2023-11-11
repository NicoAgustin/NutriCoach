import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicionesHistoricoNutriPageRoutingModule } from './mediciones-historico-nutri-routing.module';

import { MedicionesHistoricoNutriPage } from './mediciones-historico-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicionesHistoricoNutriPageRoutingModule
  ],
  declarations: [MedicionesHistoricoNutriPage]
})
export class MedicionesHistoricoNutriPageModule {}
