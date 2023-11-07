import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { Platos, PlatosXPaciente } from 'src/app/models/plan.model';
import { title } from 'process';
import Swal, { SweetAlertIcon, SweetAlertInput, SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-sugerencias-nutri',
  templateUrl: './sugerencias-nutri.page.html',
  styleUrls: ['./sugerencias-nutri.page.scss'],
})
export class SugerenciasNutriPage implements OnInit {

  nombre: string = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  correo: string = this.utilSvc.getElementInLocalStorage('paciente-correo')
  hayRecomendaciones: boolean = false
  recomendacion: PlatosXPaciente = {
    almuerzo: "",
    cena: "",
    recetas: "",
    recomendaciones: ""
  }
  platos: Platos = {
    plato1: "",
    plato2: "",
    plato3: "",
    plato4: "",
    plato5: "",
    plato6: "",
  }

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.utilSvc.presentLoading()
    this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
    this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
    (await this.firebaseSvc.getDocument('Platos', '10aZU0d6c8snLBwlnSZ3')).toPromise().then((pla) => {
        this.platos = pla.data() as Platos
      });
    this.getRecomendaciones()
  }

  async ionViewWillLeave(){
    this.recomendacion = {
      almuerzo: "",
      cena: "",
      recetas: "",
      recomendaciones: ""
    }
  }

  async getRecomendaciones() {
    (await this.firebaseSvc.getDocument('PlatosXPaciente', this.correo)).toPromise().then((res) => {
      if (typeof res.data() == 'undefined') {
        this.hayRecomendaciones = false
      } else {
        this.recomendacion = res.data() as PlatosXPaciente
        if (this.recomendacion.almuerzo == "" && this.recomendacion.cena == "" && this.recomendacion.recomendaciones == "") {
          this.hayRecomendaciones = false
        } else {
          this.hayRecomendaciones = true
        }
      }
      setTimeout(async () => {
        this.utilSvc.dismissLoading()
      }, 1000);
    })
  }

  volver() {
    this.router.navigate(['/tabs/opciones-paciente-nutri'])
  }

  agregarRecomendacion() {
    Swal.fire({
      title: '¿Qué deseas agregar?',
      showCancelButton: true,
      showCloseButton: true,
      showDenyButton: true,
      heightAuto: false,
      confirmButtonText: "Almuerzo",
      cancelButtonText: "Recomendación",
      denyButtonText: "Cena"
    }).then((result) => {
      if (result.isConfirmed) {
        this.recomendarDistribucion('A')
      } else if (result.isDenied) {
        this.recomendarDistribucion('C')
      }
      else if (result.dismiss.toString() == 'cancel') {
        this.recomendar()
      }
    })
  }



  async recomendarDistribucion(tipo: string) {
    let t: string
    tipo == "A" ? t = "almuerzo" : t = "cena"
    const { value: plato } = await Swal.fire({
      title: 'Distribución para ' + t,
      text: 'H = Harinas, P = Proteínas, C = Carbohidratos',
      input: 'select',
      heightAuto: false,
      reverseButtons: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputOptions: {
        'plato1': '1/3H 1/3V 1/3P',
        'plato2': '1/4H 1/2V 1/4P',
        'plato3': '1/2V 1/2P',
        'plato4': '1/2H 1/2P',
        'plato5': '3/4H 1/4P',
        'plato6': '4/4H'
      },
      inputPlaceholder: 'Seleccione',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve()
          } else {
            resolve('Seleccione una opción')
          }
        })
      }
    })
    if (plato) {
      this.guardarPlato(tipo, plato)
    }
  }

  async guardarPlato(tipo: string, plato: string) {
    this.utilSvc.presentLoading();
    let img: string = ""
    switch (plato) {
      case 'plato1':
        img = this.platos.plato1
        break
      case 'plato2':
        img = this.platos.plato2
        break
      case 'plato3':
        img = this.platos.plato3
        break
      case 'plato4':
        img = this.platos.plato4
        break
      case 'plato5':
        img = this.platos.plato5
        break
      case 'plato6':
        img = this.platos.plato6
        break
    };
    (await this.firebaseSvc.getDocument('PlatosXPaciente', this.correo)).toPromise().then(async (res) => {
      let registro : PlatosXPaciente = {
        almuerzo: "",
        cena: "",
        recetas: "",
        recomendaciones: ""
      }
      if (typeof res.data() !== 'undefined'){
        registro = res.data() as PlatosXPaciente
        tipo == 'A' ? registro.almuerzo = img : registro.cena = img
        await this.firebaseSvc.updateDocument('PlatosXPaciente', this.correo, registro)
        this.getRecomendaciones()
      } else {
        tipo == 'A' ? registro.almuerzo = img : registro.cena = img
        await this.firebaseSvc.setDocument('PlatosXPaciente', this.correo, registro)
        this.getRecomendaciones()
      }
    })

  }

  recomendar() {
    Swal.fire({
      input: 'textarea',
      inputLabel: 'Recomendaciones',
      inputPlaceholder: 'Escriba las sugerencias para el paciente',
      inputAttributes: {
        'aria-label': 'Medicaciones, enfermedades preexistentes, etc...'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      allowOutsideClick: false,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.length > 1) {
          this.guardarRecomendacion(result.value)
        }
      }
    })
  }

  async guardarRecomendacion(recomendacion: string) {
    this.utilSvc.presentLoading();
    (await this.firebaseSvc.getDocument('PlatosXPaciente', this.correo)).toPromise().then(async (res) => {
      if (typeof res.data() == 'undefined') {
        let registro: PlatosXPaciente = {
          almuerzo: "",
          cena: "",
          recetas: "",
          recomendaciones: recomendacion
        }
        await this.firebaseSvc.setDocument('PlatosXPaciente', this.correo, registro)
        this.getRecomendaciones()
      } else {
        let registro: PlatosXPaciente = res.data() as PlatosXPaciente
        registro.recomendaciones = recomendacion
        await this.firebaseSvc.updateDocument('PlatosXPaciente', this.correo, registro)
        this.getRecomendaciones()
      }
    })
  }

  async agregarReceta(){
    console.log("Se apreto agregar receta")
    const { value: file } =  await Swal.fire({
      title: '¿Desea subir un plan para el paciente?',
      text: 'Debe estar en formato pdf',
      input: 'file',
  inputAttributes: {
    'accept': '.pdf',
    'aria-label': 'Upload your profile picture'
  },
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    })
    if(file){
      this.subirArchivo(file)
      Swal.close()
      // const reader = new FileReader()
      // reader.onload = (e) => {
      //   console.log(e)
      // }
    }
  }

  subirArchivo(file: any){
    console.log("Se va a subir el archivo")
    this.utilSvc.presentLoading()
    // this.firebaseSvc.uploadPDF(file, this.utilSvc.getElementInLocalStorage('correo')).toPromise().then((res) => {
    //   console.log("Se subio el archivo")
    //   console.log(res)
    //   this.utilSvc.dismissLoading()
    // })
    // this.firebaseSvc.uploadPDF()
    this.firebaseSvc.uploadFile(file, this.correo).then(async (resPDF) => {
      (await this.firebaseSvc.getDocument('PlatosXPaciente', this.correo)).toPromise().then(async (resp) => {
        if (typeof resp.data() == 'undefined') {
          let registro: PlatosXPaciente = {
            almuerzo: "",
            cena: "",
            recetas: resPDF,
            recomendaciones: ""
          }
          await this.firebaseSvc.setDocument('PlatosXPaciente', this.correo, registro).then(() => {
            this.utilSvc.dismissLoading()
            this.mostrarMensaje('Archivo subido correctamente', 'success')
          })
          
        } else {
          let registro: PlatosXPaciente = resp.data() as PlatosXPaciente
          registro.recetas = resPDF
          await this.firebaseSvc.updateDocument('PlatosXPaciente', this.correo, registro).then(() => {
            this.utilSvc.dismissLoading()
            this.mostrarMensaje('Archivo subido correctamente', 'success')
          })
         
        }
        
      })
    }).catch((err) => {
      this.utilSvc.dismissLoading()
      this.mostrarMensaje('Ocurrió un error cargando el archivo', 'error')
    })
  }


  mostrarMensaje(mensaje: string, icon: SweetAlertIcon) {
    Swal.fire({
      icon: icon,
      text: mensaje,
      heightAuto: false
    })
  }


}
