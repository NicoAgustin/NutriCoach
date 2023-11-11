import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrosNutriPageRoutingModule } from './registros-nutri-routing.module';

import { RegistrosNutriPage } from './registros-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrosNutriPageRoutingModule
  ],
  declarations: [RegistrosNutriPage]
})
export class RegistrosNutriPageModule {}
