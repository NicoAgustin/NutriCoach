import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Highlight } from 'src/app/models/highlight.model';
import { AlimentoCategoria, RegistroAlimento } from 'src/app/models/plan.model';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { PacienteXNutricionista } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit {

  aguaArray: number[] = []
  agua: number = 0
  alimentosIngeridos: AlimentoCategoria[] = [];
  registroFecha: string = new Date().toISOString().substring(0, 10)
  caloriasTotales: number = 0
  unRegistroAlimentos: RegistroAlimento[] = []
  hayRegistro: boolean = false
  highlightedDates: any[] = []
  max: string = new Date().toISOString().substring(0, 10)
  caloriasQuemadas: number = 0
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
    this.unRegistroAlimentos = []
    this.highlightedDates = []
    this.getRegistros()
  }

  async ionViewWillEnter() {
    this.completarTitulo()
    if( this.correo !== this.utilSvc.getElementInLocalStorage('correo')){
      this.registroFecha = new Date().toISOString().substring(0, 10)
      this.loading = true
      this.unRegistroAlimentos = []
      this.highlightedDates = []
      this.getRegistros()
      this.correo = this.utilSvc.getElementInLocalStorage('correo')
    }

    // this.revisarRegistro(this.registroFecha)
  }

  completarTitulo(){
    this.nombrePaciente = this.utilSvc.getElementInLocalStorage('nombrePaciente')
    this.nombreNutricionista
    this.pacienteNutricionista = this.utilSvc.getElementInLocalStorage('pacienteNutricionista')
    this.pacienteNutricionista.nombre == "" ? this.nombreNutricionista = "Aún no asignado" : this.nombreNutricionista = this.pacienteNutricionista.nombre
  }

  async getRegistros() {
    let serv = (await this.firebaseSvc.getRegistro(this.utilSvc.getElementInLocalStorage('correo'), 'Registros', 'registros')).subscribe(registros => {
      this.unRegistroAlimentos = registros as RegistroAlimento[]
      this.cargarHighlightFechas()
      this.revisarRegistro(this.registroFecha)
    })
    serv.unsubscribe
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }


  sumarAgua() {
    if (this.agua < 2.5) {
      this.aguaArray.push(1)
      this.agua = this.agua + 0.5
    }
  }

  restarAgua() {
    if (this.agua > 0) {
      this.aguaArray.pop()
      this.agua = this.agua - 0.5
    }
  }

  async agregarAlimento() {
    const { value: categoria } = await Swal.fire({
      title: 'Seleccione la categoría',
      input: 'select',
      inputOptions: {
        'Desayuno': 'Desayuno',
        'Almuerzo': 'Almuerzo',
        'Merienda': 'Merienda',
        'Cena': 'Cena',
        'Otros': 'Otros'
      },
      inputPlaceholder: 'Categorías',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      allowOutsideClick: false,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve()
          } else {
            resolve('Seleccionar categoría')
          }
        })
      }
    })

    if (categoria) {
      let cat = categoria
      this.agregarAlimentoDos(cat)
    }
  }

  async agregarAlimentoDos(cat: any) {
    const { value: text } = await Swal.fire({
      title: 'Agregar ' + cat,
      input: 'textarea',
      inputPlaceholder: 'Ingrese el alimento ingerido',
      inputAttributes: {
        'aria-label': 'Ingrese el alimento ingerido'
      },
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      allowOutsideClick: false,
    })

    if (text) {
      this.agregarAlimentoTres(cat, text)
    }
  }
  async agregarAlimentoTres(cat: any, txt: any) {
    const { value: calorias } = await Swal.fire({
      input: 'number',
      inputLabel: 'Calorías',
      inputPlaceholder: 'kcal',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      allowOutsideClick: false,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (Number(value) >= 0 && Number(value) <= 2000) {
            let unAlimentoAdd: AlimentoCategoria = {
              categoria: cat,
              contenido: txt,
              calorias: Number(value)
            }
            this.agregarAlimentoLista(unAlimentoAdd)
            resolve()
          } else {
            resolve('Verificar valor')
          }
        })
      },
      footer: '<p>Calorias de referencia: <a href="https://recetasdecocina.elmundo.es/tabla-calorias" target="_blank">Pagina web</a></p>'
    })
  }



  agregarAlimentoLista(alimento: AlimentoCategoria) {
    this.alimentosIngeridos.push(alimento)
    this.caloriasTotales = 0
    for (let i = 0; i < this.alimentosIngeridos.length; i++) {
      this.caloriasTotales = this.caloriasTotales + this.alimentosIngeridos[i].calorias
    }
  }

  setDate(fecha: any) {
    if (typeof (fecha) != 'undefined') {
      this.registroFecha = fecha
      this.revisarRegistro(fecha)
      this.cargarHighlightFechas()
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

  enviarRegistro() {
    Swal.fire({
      title: '¿Desea enviar el registro?',
      text: 'Luego no se podrá editar',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let unregistro: RegistroAlimento = {
          fecha: this.registroFecha,
          alimentos: this.alimentosIngeridos,
          agua: this.agua,
          caloriasTotales: this.caloriasTotales,
          caloriasQuemadas: this.caloriasQuemadas
        }
        this.loading = true
        this.unRegistroAlimentos.push(unregistro)
        this.firebaseSvc.setRegistro(this.utilSvc.getElementInLocalStorage('correo'), 'Registros', 'registros', unregistro).then(() => this.getRegistros())
        this.hayRegistro = true
      } else {
        Swal.close()
      }
    })

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

  restarCalorias() {
    this.caloriasQuemadas = this.caloriasQuemadas - 10
    if (this.caloriasQuemadas < 0) {
      this.caloriasQuemadas = 0
    }
  }

  sumarCalorias() {
    this.caloriasQuemadas = this.caloriasQuemadas + 10
  }

  borrarIngesta(i: number) {
    let contenido = ""
    if (this.alimentosIngeridos[i].contenido.length > 30) {
      contenido = this.alimentosIngeridos[i].contenido.substring(0, 30) + "..."
    } else {
      contenido = this.alimentosIngeridos[i].contenido
    }
    Swal.fire({
      title: "¿Desea eliminarlo?",
      html: '<p align="left">' + '<b>Categoria: </b>' + this.alimentosIngeridos[i].categoria + '</br>' +
        '<b>Calorías: </b>' + this.alimentosIngeridos[i].calorias + '</br>' +
        '<b>Contenido: </b>' + contenido +
        '</p>',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#DC143C',
      allowOutsideClick: false,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.caloriasTotales = this.caloriasTotales - this.alimentosIngeridos[i].calorias
        this.alimentosIngeridos.splice(i, 1)
      } else {
        Swal.close()
      }
    })
  }

  editarIngesta(i: number) {
    let contenido = ""
    if (this.alimentosIngeridos[i].contenido.length > 30) {
      contenido = this.alimentosIngeridos[i].contenido.substring(0, 30) + "..."
    } else {
      contenido = this.alimentosIngeridos[i].contenido
    }
    Swal.fire({
      title: "¿Qué desea editar?",
      html: '<p align="left">' + '<b>Categoria: </b>' + this.alimentosIngeridos[i].categoria + '</br>' +
        '<b>Calorías: </b>' + this.alimentosIngeridos[i].calorias + '</br>' +
        '<b>Contenido: </b>' + contenido +
        '</p>',
      showCancelButton: true,
      heightAuto: false,
      showCloseButton: true,
      showDenyButton: true,
      cancelButtonText: 'Categoría',
      confirmButtonText: 'Calorías',
      denyButtonText: 'Contenido',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.editarCalorias(i)
      } else if (result.isDenied) {
        this.editarContenido(i)
      } else if (result.dismiss.toString() == 'cancel') {
        this.editarCategoria(i)
      }
    })
  }

  async editarCalorias(i: number) {
    const { value: calorias } = await Swal.fire({
      input: 'number',
      inputLabel: 'Calorías',
      inputPlaceholder: 'kcal',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      reverseButtons: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (Number(value) >= 0 && Number(value) <= 2000) {
            this.caloriasTotales = this.caloriasTotales - this.alimentosIngeridos[i].calorias + Number(value)
            this.alimentosIngeridos[i].calorias = Number(value)

            resolve()
          } else {
            resolve('Verificar valor')
          }
        })
      }
    })
  }

  async editarContenido(i: number) {
    const { value: text } = await Swal.fire({
      title: 'Agregar ' + this.alimentosIngeridos[i].categoria,
      input: 'textarea',
      //inputLabel: cat,
      inputPlaceholder: 'Ingrese el alimento ingerido',
      inputAttributes: {
        'aria-label': 'Ingrese el alimento ingerido'
      },
      showCancelButton: true,
      heightAuto: false,
      allowOutsideClick: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true
    })

    if (text) {
      this.alimentosIngeridos[i].contenido = text
    }
  }

  async editarCategoria(i: number) {
    const { value: categoria } = await Swal.fire({
      title: 'Seleccione la categoría',
      input: 'select',
      inputOptions: {
        'Desayuno': 'Desayuno',
        'Almuerzo': 'Almuerzo',
        'Merienda': 'Merienda',
        'Cena': 'Cena',
        'Otros': 'Otros'
      },
      inputPlaceholder: 'Categorías',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      reverseButtons: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve()
          } else {
            resolve('Seleccionar categoría')
          }
        })
      }
    })
    if (categoria) {
      this.alimentosIngeridos[i].categoria = categoria
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

}


