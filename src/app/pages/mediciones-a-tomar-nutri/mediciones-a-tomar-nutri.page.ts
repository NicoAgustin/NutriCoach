import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { MedicionNutri, RegistroMedicionNutri } from 'src/app/models/medicion.model';

@Component({
  selector: 'app-mediciones-a-tomar-nutri',
  templateUrl: './mediciones-a-tomar-nutri.page.html',
  styleUrls: ['./mediciones-a-tomar-nutri.page.scss'],
})
export class MedicionesATomarNutriPage implements OnInit {

  nombre: string = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  correo: string = this.utilSvc.getElementInLocalStorage('paciente-correo')
  registroCompleto: boolean = false
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

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
    this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
    this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
  }

  ionViewWillEnter() {
    this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
    this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
    this.verificarRegistro()
  }

  volver() {
    this.router.navigate(['/tabs/mediciones-nutri'])
  }

  async cargarTalla() {
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
            this.verificarRegistro()
            resolve()
          } else {
            resolve('Verifique el valor ingresado')
          }
        })
      }
    })
  }

  async cargarPeso() {
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
            this.verificarRegistro()
            resolve()
          } else {
            resolve('Verifique el valor ingresado')
          }
        })
      }
    })
  }

  async cargarPerimetro(tipo: number) {
    let titulo = "Perímetro en cm"
    switch (tipo) {
      case 1:
        titulo = "Perímetro cabeza en cm"
        break;
      case 2:
        titulo = "Perímetro brazo relajado en cm"
        break;
      case 3:
        titulo = "Perímetro brazo flexionado en cm"
        break;
      case 4:
        titulo = "Perímetro antebrazo en cm"
        break;
      case 5:
        titulo = "Perímetro tórax en cm"
        break;
      case 6:
        titulo = "Perímetro cintura en cm"
        break;
      case 7:
        titulo = "Perímetro cadera en cm"
        break;
      case 8:
        titulo = "Perímetro muslo en cm"
        break;
      case 9:
        titulo = "Perímetro pantorrilla en cm"
        break;
    }
    await Swal.fire({
      title: titulo,
      input: 'number',
      //inputLabel: 'Ingresar peso',
      inputPlaceholder: 'Ingresar valor',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (Number(value) > 0) {
            switch (tipo) {
              case 1:
                this.medicion.perCabeza = Number(value)
                break;
              case 2:
                this.medicion.perBrazoRelajado = Number(value)
                break;
              case 3:
                this.medicion.perBrazoFlexionado = Number(value)
                break;
              case 4:
                this.medicion.perAntebrazo = Number(value)
                break;
              case 5:
                this.medicion.perTorax = Number(value)
                break;
              case 6:
                this.medicion.perCintura = Number(value)
                break;
              case 7:
                this.medicion.perCadera = Number(value)
                break;
              case 8:
                this.medicion.perMuslo = Number(value)
                break;
              case 9:
                this.medicion.perPantorrilla = Number(value)
                break;
            }
            this.verificarRegistro()
            resolve()
          } else {
            resolve('Verifique el valor ingresado')
          }
        })
      }
    })
  }

  async cargarPliegue(tipo: number) {
    let titulo = "Pliegue en mm"
    switch (tipo) {
      case 1:
        titulo = "Pliegue tríceps en mm"
        break;
      case 2:
        titulo = "Pliegue subescapular en mm"
        break;
      case 3:
        titulo = "Pliegue supraespinal en mm"
        break;
      case 4:
        titulo = "Pliegue abdominal en mm"
        break;
      case 5:
        titulo = "Pliegue muslo en mm"
        break;
      case 6:
        titulo = "Pliegue pantorrilla en mm"
        break;
    }
    await Swal.fire({
      title: titulo,
      input: 'number',
      //inputLabel: 'Ingresar peso',
      inputPlaceholder: 'Ingresar valor',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (Number(value) > 0) {
            switch (tipo) {
              case 1:
                this.medicion.pliTriceps = Number(value)
                break;
              case 2:
                this.medicion.pliSubescapular = Number(value)
                break;
              case 3:
                this.medicion.pliSupraespinal = Number(value)
                break;
              case 4:
                this.medicion.pliAbdominal = Number(value)
                break;
              case 5:
                this.medicion.pliMuslo = Number(value)
                break;
              case 6:
                this.medicion.pliPantorrilla = Number(value)
                break;
            }
            this.verificarRegistro()
            resolve()
          } else {
            resolve('Verifique el valor ingresado')
          }
        })
      }
    })
  }



  verificarRegistro() {
    this.registroCompleto = Object.values(this.medicion).every(valor => valor > 0);
    console.log("Se verifica registro: " + this.registroCompleto)
  }

  async enviarRegistro() {
    this.utilSvc.presentLoading()
    let registro: RegistroMedicionNutri = {
      fecha: new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toISOString().substring(0, 10),
      medicion: this.medicion
    };
    await this.revisarRegistros(registro.fecha)
    await this.firebaseSvc.setRegistro(this.correo, 'Mediciones', 'registrosNutri', registro).then(() => {
      setTimeout(() => {
        this.utilSvc.dismissLoading()
        this.informar()
      }, 1000);
    }).catch((err) => {
      Swal.fire({
        title: 'No se pudo enviar el registro',
        icon: 'error',
        heightAuto: false,
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      })
    })
  }

  async revisarRegistros(fecha: string) {
    await this.firebaseSvc.getRegistroFecha(this.correo, 'Mediciones', 'registrosNutri', fecha).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let r: RegistroMedicionNutri
        r = doc.data() as RegistroMedicionNutri
        if (r.fecha == fecha) {
          console.log("Se va a eliminar: " + doc.id)
          this.firebaseSvc.deleteRegistroNutri(this.correo, 'Mediciones', 'registrosNutri', doc.id)
        }
      })
    })
  }

  informar() {
    Swal.fire({
      title: 'Registro enviado',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      heightAuto: false,
    }).then(() => {
      this.inicializar()
      this.volver()
    })
  }

  inicializar() {
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
