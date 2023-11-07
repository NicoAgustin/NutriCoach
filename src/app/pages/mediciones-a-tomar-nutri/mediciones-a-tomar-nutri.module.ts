import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicionesATomarNutriPageRoutingModule } from './mediciones-a-tomar-nutri-routing.module';

import { MedicionesATomarNutriPage } from './mediciones-a-tomar-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicionesATomarNutriPageRoutingModule
  ],
  declarations: [MedicionesATomarNutriPage]
})
export class MedicionesATomarNutriPageModule {}
