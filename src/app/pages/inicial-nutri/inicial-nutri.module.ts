import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicialNutriPageRoutingModule } from './inicial-nutri-routing.module';

import { InicialNutriPage } from './inicial-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicialNutriPageRoutingModule
  ],
  declarations: [InicialNutriPage]
})
export class InicialNutriPageModule {}
