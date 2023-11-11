import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { MedicionPaciente, RegistroMedicion } from 'src/app/models/medicion.model';
import { Highlight } from 'src/app/models/highlight.model';

@Component({
  selector: 'app-mediciones-paciente-nutri',
  templateUrl: './mediciones-paciente-nutri.page.html',
  styleUrls: ['./mediciones-paciente-nutri.page.scss'],
})
export class MedicionesPacienteNutriPage implements OnInit {

  nombre: string = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  correo: string = this.utilSvc.getElementInLocalStorage('paciente-correo')
  registroFecha: string = new Date().toISOString().substring(0, 10)
  hayRegistro: boolean = false
  highlightedDates: any[] = []
  max: string = new Date().toISOString().substring(0, 10)
  medicion: MedicionPaciente = {
    peso: 0,
    talla: 0,
    cintura: 0,
    ombligo: 0,
    cadera: 0
  }
  registroMediciones: RegistroMedicion[] = []
  mediciones: RegistroMedicion[]

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
    this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
    this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
    this.registroMediciones = []
    this.highlightedDates = []
    this.getMediciones()
  }
  

  ionViewWillEnter() {
    if (this.correo !== this.utilSvc.getElementInLocalStorage('paciente-correo')) {
      this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
      this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
      this.registroFecha = new Date().toISOString().substring(0, 10)
      this.registroMediciones = []
      this.highlightedDates = []
      this.getMediciones()
    }
  }

  async getMediciones() {
    this.utilSvc.presentLoading()
    let serv = (await this.firebaseSvc.getRegistro(this.correo, 'Mediciones', 'registros')).subscribe(registros => {
      this.registroMediciones = registros as RegistroMedicion[]
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
    })
    serv.unsubscribe
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
          cintura: 0,
          ombligo: 0,
          cadera: 0
        }
      }
    }
    if (this.registroMediciones.length == 0) {
      this.hayRegistro = false
      this.medicion = {
        peso: 0,
        talla: 0,
        cintura: 0,
        ombligo: 0,
        cadera: 0
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
