import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilNutriPageRoutingModule } from './perfil-nutri-routing.module';

import { PerfilNutriPage } from './perfil-nutri.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilNutriPageRoutingModule
  ],
  declarations: [PerfilNutriPage]
})
export class PerfilNutriPageModule {}
