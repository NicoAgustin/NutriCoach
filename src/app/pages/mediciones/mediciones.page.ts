import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { RegistroMedicion, MedicionPaciente } from '../../models/medicion.model';
import { Highlight } from 'src/app/models/highlight.model';
import { PacienteXNutricionista } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-mediciones',
  templateUrl: './mediciones.page.html',
  styleUrls: ['./mediciones.page.scss'],
})
export class MedicionesPage implements OnInit {

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
  loading: boolean = true
  correo: string = ""
  nombrePaciente : string = "Aún no completaste tu perfil"
  nombreNutricionista : string = ""
  pacienteNutricionista: PacienteXNutricionista;



  constructor(
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
    this.completarTitulo()
    this.correo = this.utilSvc.getElementInLocalStorage('correo')
    this.loading = true
    this.registroMediciones = []
    this.highlightedDates = []
    this.getMediciones()
  }

  async ionViewWillEnter() {
    this.completarTitulo()
    if( this.correo !== this.utilSvc.getElementInLocalStorage('correo')){
      this.registroFecha = new Date().toISOString().substring(0, 10)
      this.loading = true
      this.registroMediciones = []
      this.highlightedDates = []
      this.getMediciones()
      this.correo = this.utilSvc.getElementInLocalStorage('correo')
    }
  }

  completarTitulo(){
    this.nombrePaciente = this.utilSvc.getElementInLocalStorage('nombrePaciente')
    this.nombreNutricionista
    this.pacienteNutricionista = this.utilSvc.getElementInLocalStorage('pacienteNutricionista')
    this.pacienteNutricionista.nombre == "" ? this.nombreNutricionista = "Aún no asignado" : this.nombreNutricionista = this.pacienteNutricionista.nombre
  }

  async getMediciones() {
    let serv = (await this.firebaseSvc.getRegistro(this.utilSvc.getElementInLocalStorage('correo'), 'Mediciones', 'registros')).subscribe(registros => {
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
      this.loading = false
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

  async cargarPeso() {
    if (!this.hayRegistro) {
      await Swal.fire({
        title: 'Peso en kilogramos',
        input: 'number',
        //inputLabel: 'Ingresar peso',
        inputPlaceholder: 'Ingresar peso',
        showCancelButton: true,
        heightAuto: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (Number(value) > 0 && Number(value) < 350) {
              this.medicion.peso = Number(value)
              resolve()
            } else {
              resolve('Verifique el valor ingresado')
            }
          })
        }
      })
    }

  }

  async cargarTalla() {
    if (!this.hayRegistro) {
      await Swal.fire({
        title: 'Talla en centímetros',
        input: 'number',
        //inputLabel: 'Ingresar peso',
        inputPlaceholder: 'Ingresar talla',
        showCancelButton: true,
        heightAuto: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (Number(value) > 0 && Number(value) < 300) {
              this.medicion.talla = Number(value)
              resolve()
            } else {
              resolve('Verifique el valor ingresado')
            }
          })
        }
      })
    }
  }

  async cargarCintura() {
    if (!this.hayRegistro) {
      await Swal.fire({
        title: 'Cintura(mínima) en centímetros',
        input: 'number',
        //inputLabel: 'Ingresar peso',
        inputPlaceholder: 'Ingresar medición',
        showCancelButton: true,
        heightAuto: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (Number(value) > 0 && Number(value) < 200) {
              this.medicion.cintura = Number(value)
              resolve()
            } else {
              resolve('Verifique el valor ingresado')
            }
          })
        }
      })
    }
  }

  async cargarOmbligo() {
    if (!this.hayRegistro) {
      await Swal.fire({
        title: 'Ombligo en centímetros',
        input: 'number',
        //inputLabel: 'Ingresar peso',
        inputPlaceholder: 'Ingresar medición',
        showCancelButton: true,
        heightAuto: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (Number(value) > 0 && Number(value) < 200) {
              this.medicion.ombligo = Number(value)
              resolve()
            } else {
              resolve('Verifique el valor ingresado')
            }
          })
        }
      })
    }
  }

  async cargarCadera() {
    if (!this.hayRegistro) {
      await Swal.fire({
        title: 'Cadera en centímetros',
        input: 'number',
        //inputLabel: 'Ingresar peso',
        inputPlaceholder: 'Ingresar medición',
        showCancelButton: true,
        heightAuto: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (Number(value) > 0 && Number(value) < 200) {
              this.medicion.cadera = Number(value)
              resolve()
            } else {
              resolve('Verifique el valor ingresado')
            }
          })
        }
      })
    }
  }

  enviarRegistro() {
    Swal.fire({
      title: '¿Desea enviar el registro?',
      text: 'Luego no se podrá editar',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        let unregistro: RegistroMedicion = {
          fecha: this.registroFecha,
          medicion: this.medicion,
        }
        this.registroMediciones.push(unregistro)
        this.firebaseSvc.setRegistro(this.utilSvc.getElementInLocalStorage('correo'), 'Mediciones', 'registros', unregistro)
        this.hayRegistro = true
      } else {
        Swal.close()
      }
    })
  }


}



