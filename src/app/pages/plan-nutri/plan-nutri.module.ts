import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanNutriPageRoutingModule } from './plan-nutri-routing.module';

import { PlanNutriPage } from './plan-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanNutriPageRoutingModule
  ],
  declarations: [PlanNutriPage]
})
export class PlanNutriPageModule {}
