import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { MedicionNutri, RegistroMedicionNutri } from 'src/app/models/medicion.model';
import { Highlight } from 'src/app/models/highlight.model';

@Component({
  selector: 'app-mediciones-historico-nutri',
  templateUrl: './mediciones-historico-nutri.page.html',
  styleUrls: ['./mediciones-historico-nutri.page.scss'],
})
export class MedicionesHistoricoNutriPage implements OnInit {

  nombre: string = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  correo: string = this.utilSvc.getElementInLocalStorage('paciente-correo')
  registroFecha: string = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toISOString().substring(0, 10)
  hayRegistro: boolean = false
  highlightedDates: any[] = []
  max: string = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toISOString().substring(0, 10)
  medicion: MedicionNutri = {
    peso: 0,
    talla: 0,
    perCabeza: 0,
    perBrazoRelajado: 0,
    perBrazoFlexionado: 0,
    perAntebrazo: 0,
    perTorax: 0,
    perCintura: 0,
    perCadera: 0,
    perMuslo: 0,
    perPantorrilla: 0,
    pliTriceps: 0,
    pliSubescapular: 0,
    pliSupraespinal: 0,
    pliAbdominal: 0,
    pliMuslo: 0,
    pliPantorrilla: 0
  }
  registroMediciones: RegistroMedicionNutri[] = []
  mediciones: RegistroMedicionNutri[]


  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
    // this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
    // this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
    // this.utilSvc.presentLoading()
    // this.registroMediciones = []
    // this.highlightedDates = []
    // this.getMediciones()
  }

  ionViewWillEnter() {
    // if (this.correo !== this.utilSvc.getElementInLocalStorage('paciente-correo')) {
      this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
      this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
      this.utilSvc.presentLoading()
      this.registroFecha = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toISOString().substring(0, 10)
      this.registroMediciones = []
      this.highlightedDates = []
      this.getMediciones()
    // }
  }

  // async getMediciones() {
  //   this.utilSvc.presentLoading()
  //   let serv = (await this.firebaseSvc.getRegistro(this.correo, 'Mediciones', 'registros')).subscribe(registros => {
  //     this.registroMediciones = registros as RegistroMedicionNutri[]
  //     let fechas = this.registroMediciones.map(registro => registro.fecha)
  //     for (let i = 0; i < fechas.length; i++) {
  //       let unRegistro: Highlight = {
  //         date: fechas[i],
  //         textColor: '#09721b',
  //         backgroundColor: '#c8e5d0'
  //       }
  //       this.highlightedDates.push(unRegistro)
  //     }
  //     this.revisarRegistro(this.registroFecha)
  //   })
  //   serv.unsubscribe
  //   setTimeout(() => {
  //     this.utilSvc.dismissLoading()
  //   }, 1000);
  // }

  async getMediciones() {
    this.registroMediciones = []
    this.highlightedDates = []
    await this.firebaseSvc.getRegistroNutri(this.correo, 'Mediciones', 'registrosNutri').then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let r: RegistroMedicionNutri
        r = doc.data() as RegistroMedicionNutri
        this.registroMediciones.push(r)
      })
    })
    let fechas = this.registroMediciones.map(registro => registro.fecha)
    for (let i = 0; i < fechas.length; i++) {
      let unRegistro: Highlight = {
        date: fechas[i],
        textColor: '#09721b',
        backgroundColor: '#c8e5d0'
      }
      this.highlightedDates.push(unRegistro)
    }
    this.revisarRegistro(this.registroFecha)
    setTimeout(() => {
      this.utilSvc.dismissLoading()
    }, 1000);
  }

  setDate(fecha: any) {
    if (typeof (fecha) != 'undefined') {
      this.registroFecha = fecha.substring(0, 10)
      this.revisarRegistro(fecha)
      this.cargarHighlightFechas()
    }
  }


  revisarRegistro(fecha: any) {
    for (let i = 0; i < this.registroMediciones.length; i++) {
      if (this.registroMediciones[i].fecha.substring(0, 10) === fecha.substring(0, 10)) {
        this.hayRegistro = true
        this.medicion = this.registroMediciones[i].medicion
        break
      }
      else {
        this.hayRegistro = false
        this.medicion = {
          peso: 0,
          talla: 0,
          perCabeza: 0,
          perBrazoRelajado: 0,
          perBrazoFlexionado: 0,
          perAntebrazo: 0,
          perTorax: 0,
          perCintura: 0,
          perCadera: 0,
          perMuslo: 0,
          perPantorrilla: 0,
          pliTriceps: 0,
          pliSubescapular: 0,
          pliSupraespinal: 0,
          pliAbdominal: 0,
          pliMuslo: 0,
          pliPantorrilla: 0
        }
      }
    }
    if (this.registroMediciones.length == 0) {
      this.hayRegistro = false
      this.medicion = {
        peso: 0,
        talla: 0,
        perCabeza: 0,
        perBrazoRelajado: 0,
        perBrazoFlexionado: 0,
        perAntebrazo: 0,
        perTorax: 0,
        perCintura: 0,
        perCadera: 0,
        perMuslo: 0,
        perPantorrilla: 0,
        pliTriceps: 0,
        pliSubescapular: 0,
        pliSupraespinal: 0,
        pliAbdominal: 0,
        pliMuslo: 0,
        pliPantorrilla: 0
      }
    }
  }

  cargarHighlightFechas() {
    for (let i = 0; i < this.registroMediciones.length; i++) {
      let unRegistro: Highlight = {
        date: this.registroMediciones[i].fecha.substring(0, 10),
        textColor: '#09721b',
        backgroundColor: '#c8e5d0'
      }
      this.highlightedDates.push(unRegistro)
    }
  }

  volver() {
    this.router.navigate(['/tabs/mediciones-nutri'])
  }

}
