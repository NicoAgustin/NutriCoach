import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SemanaNutriPageRoutingModule } from './semana-nutri-routing.module';

import { SemanaNutriPage } from './semana-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SemanaNutriPageRoutingModule
  ],
  declarations: [SemanaNutriPage]
})
export class SemanaNutriPageModule {}
