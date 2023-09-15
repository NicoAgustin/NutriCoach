import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { IonContent, Platform } from '@ionic/angular';


@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
})
export class InicialPage implements OnInit {

  @ViewChild("slideplan", { static: false }) slidePlan?: ElementRef<{ swiper: Swiper }>
  private slidePlanConfig?: SwiperOptions

  @ViewChild(IonContent)
  content!: IonContent;


  primeraSemanaInicio:string=""
  primeraSemanaFin:string=""
  arrayFechas: intervaloFechas[] = []

  public doughnutChartLabels: string[] = [
    'Almuerzo',
    'Cena',
    'Desayuno',
    'Otros',
    'Merienda'
  ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { 
        data: [350, 450, 100, 20, 60],
        backgroundColor: [
          'rgb(255, 99, 132)', //ROJO
          'rgb(54, 162, 235)', //AZUL
          'rgb(255, 205, 86)', //AMARILLO
          'rgb(128,128,128)', //GRIS
          'rgb(128,0,0)' //MARRON
        ] }
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  constructor() { }

  ngOnInit() {
    this.getInicioSemana()
  }

  ionViewDidEnter(){
  }


 getInicioSemana() {
    var result = new Date(new Date().toDateString());
    while (result.getDay() != 1) {
      result.setDate(result.getDate() - 1);
    }
    this.primeraSemanaInicio = result.toString()
    result.setDate(result.getDate() + 6)
    this.primeraSemanaFin = result.toString()
    console.log(this.primeraSemanaInicio)
    this.getArrayFechas()
  }  

  getArrayFechas(){ //Se calculan tentativamente 4 semanas, por si se desea ampliar el resumen
    var inicio = new Date(this.primeraSemanaInicio)
    var fin = new Date(this.primeraSemanaFin)
    for(let i = 0 ; i <= 3 ; i++) {
      inicio.setDate(inicio.getDate() - 7)
      fin.setDate(fin.getDate() - 7)
      let intervalo: intervaloFechas = {
        fechaInicio: new Date(inicio.toISOString()),
        fechaFin: new Date(fin.toISOString())
      }
      this.arrayFechas.push(intervalo)
    }
  }

  verSemana(){
    this.slidePlan?.nativeElement.swiper.slideNext(250)
    this.content.scrollToTop(0)
  }

  verRecomendaciones(){
    this.slidePlan?.nativeElement.swiper.slidePrev(250)
    this.content.scrollToTop(0);
  }

  descargarRecetas(){
    //ACÁ SE VA A DESCARGAR EL PDF CON LAS RECETAS DEL NUTRI
  }


  



}

interface intervaloFechas {
  fechaInicio: Date,
  fechaFin: Date
}
