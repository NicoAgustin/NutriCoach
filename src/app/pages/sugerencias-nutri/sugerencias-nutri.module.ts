import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SugerenciasNutriPageRoutingModule } from './sugerencias-nutri-routing.module';

import { SugerenciasNutriPage } from './sugerencias-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SugerenciasNutriPageRoutingModule
  ],
  declarations: [SugerenciasNutriPage]
})
export class SugerenciasNutriPageModule {}
