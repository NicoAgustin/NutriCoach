import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { AlimentoCategoria, RegistroAlimento } from 'src/app/models/plan.model';
import { Highlight } from 'src/app/models/highlight.model';

@Component({
  selector: 'app-registros-nutri',
  templateUrl: './registros-nutri.page.html',
  styleUrls: ['./registros-nutri.page.scss'],
})
export class RegistrosNutriPage implements OnInit {

  nombre: string = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  correo: string = this.utilSvc.getElementInLocalStorage('paciente-correo')
  aguaArray: number[] = []
  agua: number = 0
  alimentosIngeridos: AlimentoCategoria[] = [];
  registroFecha: string = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toISOString().substring(0, 10)
  caloriasTotales: number = 0
  unRegistroAlimentos: RegistroAlimento[] = []
  hayRegistro: boolean = false
  highlightedDates: any[] = []
  max: string = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toISOString().substring(0, 10)
  caloriasQuemadas: number = 0
  loading: boolean = true

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
    // this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
    // this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
    // this.unRegistroAlimentos = []
    // this.highlightedDates = []
    // this.getRegistros()
  }

  ionViewWillEnter(){
    // if( this.correo !== this.utilSvc.getElementInLocalStorage('paciente-correo')){
      this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
      this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
      this.utilSvc.presentLoading()
      this.registroFecha = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toISOString().substring(0, 10)
      this.loading = true
      this.unRegistroAlimentos = []
      this.highlightedDates = []
      this.getRegistros()
    // }
  }

  async getRegistros() {
    let serv = (await this.firebaseSvc.getRegistro(this.correo, 'Registros', 'registros')).subscribe(registros => {
      this.unRegistroAlimentos = registros as RegistroAlimento[]
      this.cargarHighlightFechas()
      this.revisarRegistro(this.registroFecha)
    })
    serv.unsubscribe
    setTimeout(() => {
      this.utilSvc.dismissLoading()
      this.loading = false
    }, 1500);
  }

  cargarHighlightFechas() {
    for (let i = 0; i < this.unRegistroAlimentos.length; i++) {
      let unRegistro: Highlight = {
        date: this.unRegistroAlimentos[i].fecha.substring(0, 10),
        textColor: '#09721b',
        backgroundColor: '#c8e5d0'
      }
      this.highlightedDates.push(unRegistro)
    }
  }

  revisarRegistro(fecha: any) {
    for (let i = 0; i < this.unRegistroAlimentos.length; i++) {
      if (this.unRegistroAlimentos[i].fecha.substring(0, 10) === fecha.substring(0, 10)) {
        console.log('fecha iguales')
        this.hayRegistro = true
        this.aguaArray = []
        this.agua = this.unRegistroAlimentos[i].agua
        this.alimentosIngeridos = this.unRegistroAlimentos[i].alimentos
        this.caloriasTotales = this.unRegistroAlimentos[i].caloriasTotales
        this.caloriasQuemadas = this.unRegistroAlimentos[i].caloriasQuemadas
        for (let x = 0; x < this.agua / 0.5; x++) {
          this.aguaArray.push(1)
        }
        break
      }
      else {
        console.log('fecha distintas')
        this.hayRegistro = false
        this.agua = 0
        this.alimentosIngeridos = []
        this.caloriasTotales = 0
        this.aguaArray = []
        this.caloriasQuemadas = 0
      }
    }
    if (this.unRegistroAlimentos.length == 0) {
      this.hayRegistro = false
      this.agua = 0
      this.alimentosIngeridos = []
      this.caloriasTotales = 0
      this.aguaArray = []
      this.caloriasQuemadas = 0
    }
  }

  setDate(fecha: any) {
    if (typeof (fecha) != 'undefined') {
      this.registroFecha = fecha
      this.revisarRegistro(fecha)
      this.cargarHighlightFechas()
    }
  }

  verInfoIngesta(i: number) {
    Swal.fire({
      title: this.alimentosIngeridos[i].categoria,
      text: this.alimentosIngeridos[i].contenido,
      heightAuto: false,
      confirmButtonText: 'Aceptar'
    })
  }


  volver() {
    this.router.navigate(['/tabs/opciones-paciente-nutri'])
  }

}
