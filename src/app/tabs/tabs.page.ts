import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  nutricionista: boolean

  constructor( private utilSvc: UtilsService ) { 
    
  }

   ngOnInit() {
    this.nutricionista =  this.utilSvc.nutricionista
  }

  ionViewWillEnter(){
    this.nutricionista =  this.utilSvc.nutricionista
  }
  

}
