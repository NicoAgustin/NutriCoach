import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicionesNutriPageRoutingModule } from './mediciones-nutri-routing.module';

import { MedicionesNutriPage } from './mediciones-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicionesNutriPageRoutingModule
  ],
  declarations: [MedicionesNutriPage]
})
export class MedicionesNutriPageModule {}
