import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { IonContent, Platform } from '@ionic/angular';
import { PacienteXNutricionista, Paciente } from 'src/app/models/usuario.model';
import { UtilsService } from '../../services/utils.service';
import { FirebaseService } from '../../services/firebase.service';
import { PlatosXPaciente, ReaccionesXPaciente } from 'src/app/models/plan.model';
import Swal from 'sweetalert2';
import { RegistroAlimento, DetalleSemana } from 'src/app/models/plan.model';
import { ActivatedRoute, Router } from '@angular/router';;




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


  data = [
    { category: 'Almuerzo', percentage: 0 },
    { category: 'Cena', percentage: 0 },
    { category: 'Merienda', percentage: 0 },
    { category: 'Desayuno', percentage: 0 },
    { category: 'Otros', percentage: 0 },
  ];

  pacienteNutricionista: PacienteXNutricionista;
  paciente: Paciente = {
    email: "",
    nombre: "",
    dni: "",
    obraSocial: "",
    numAfiliado: "",
    telefono: "",
    consideraciones: "",
    fotoPerfil: ""
  }
  recomendaciones: PlatosXPaciente
  correo: string = ""
  loading: boolean = false
  hayRecomendaciones: boolean = false
  hayPlatos: boolean = false
  hayRecetas: boolean = false
  primeraSemanaInicio: string = ""
  primeraSemanaFin: string = ""
  arrayFechas: intervaloFechas[] = []
  nombrePaciente: string = "Aún no completaste tu perfil"
  nombreNutricionista: string = ""
  registroAlimentos: RegistroAlimento[] = []
  registroAlimentosEnSemana: RegistroAlimento[] = []
  detalleAlimentos: DetalleSemana
  etiquetasGrafico: any[] = []
  valoresGrafico: any[] = []
  primeraCarga: boolean = false
  reacciones: ReaccionesXPaciente = {
    aguaBebida: "",
    caloriasIngeridas: "",
    caloriasQuemadas: "",
    fecha: ""
  }
  colorReaccioncaloriasIngeridas = "dark"
  colorReaccioncaloriasQuemadas = "dark"
  colorReaccionaguaBebida = "dark"

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService,
  ) { }


  async ngOnInit() {

    this.primeraCarga = true
    await this.cargarDatos()
  }

  async ionViewWillEnter() {
    this.primeraCarga ? this.primeraCarga = false : await this.cargarDatos()
  }

  ionViewDidEnter() {
    this.mensajeBienvenida()
  }



  async cargarDatos() {
    this.correo = this.utilSvc.getElementInLocalStorage('correo')
    this.loading = true
    this.getInicioSemana()
    this.obtenerRecomendaciones()
    await this.obtenerRegistros()
    await this.obtenerReacciones()
    await this.obtenerNutricionista().then(() =>
      setTimeout(() => {
        this.loading = false
      }, 2000))
  }

  async obtenerReacciones() {
    (await this.firebaseSvc.getDocument('ReaccionesXPaciente', this.utilSvc.getElementInLocalStorage('correo'))).toPromise().then((resp) => {
      let data: ReaccionesXPaciente = resp.data() as ReaccionesXPaciente
      if (data.fecha == new Date(this.arrayFechas[0].fechaInicio).toISOString().substring(0, 10)) {
        this.reacciones = data
        this.colorReaccioncaloriasIngeridas = this.asignarColor(this.reacciones.caloriasIngeridas)
        this.colorReaccioncaloriasQuemadas = this.asignarColor(this.reacciones.caloriasQuemadas)
        this.colorReaccionaguaBebida = this.asignarColor(this.reacciones.aguaBebida)
      }
    })
  }

  asignarColor(reaccion: string){
    switch (reaccion) {
      case "happy-outline":
        return "success"
      case "sad-outline":
        return "danger"
      default:
        return "dark"
    }
  }

  verReaccion(reaccion: string) {
    switch (reaccion) {
      case "happy-outline":
        this.mostrarMensajeNutri('¡Muy bien!')
        break;
      case "sad-outline":
        this.mostrarMensajeNutri('¡Podes mejorar!')
        break;
      default:
        this.mostrarMensajeNutri(reaccion)
    }
  }

  mostrarMensajeNutri(msj: string) {
    Swal.fire({
      title: 'Mensaje de tu profesional',
      text: msj,
      heightAuto: false,
      confirmButtonText: 'Aceptar'
    })
  }


  async obtenerRegistros() {
    let serv = (await this.firebaseSvc.getRegistro(this.utilSvc.getElementInLocalStorage('correo'), 'Registros', 'registros')).subscribe(registros => {
      this.registroAlimentos = registros as RegistroAlimento[]
      if (this.registroAlimentos.length > 0) {
        this.obtenerPromedios()
      }
    })
    serv.unsubscribe
  }

  obtenerPromedios() {
    let inicio = new Date(this.arrayFechas[0].fechaInicio).toISOString().substring(0, 10)
    let fin = new Date(this.arrayFechas[0].fechaFin).toISOString().substring(0, 10)
    this.registroAlimentosEnSemana = []
    for (let i = 0; i < this.registroAlimentos.length; i++) {
      let fecha = new Date(this.registroAlimentos[i].fecha).toISOString().substring(0, 10)
      if (fecha >= inicio && fecha <= fin) {
        this.registroAlimentosEnSemana.push(this.registroAlimentos[i])
      }
    }
    this.detalleAlimentos = {
      agua: 0,
      almuerzo: 0,
      caloriasQuemadas: 0,
      caloriasTotales: 0,
      cena: 0,
      desayuno: 0,
      merienda: 0,
      otros: 0
    }
    let indice = 0
    for (let i = 0; i < this.registroAlimentosEnSemana.length; i++) {
      this.detalleAlimentos.agua = this.detalleAlimentos.agua + this.registroAlimentosEnSemana[i].agua
      this.detalleAlimentos.caloriasQuemadas = this.detalleAlimentos.caloriasQuemadas + this.registroAlimentosEnSemana[i].caloriasQuemadas
      this.detalleAlimentos.caloriasTotales = this.detalleAlimentos.caloriasTotales + this.registroAlimentosEnSemana[i].caloriasTotales
      for (let x = 0; x < this.registroAlimentosEnSemana[i].alimentos.length; x++) {
        switch (this.registroAlimentosEnSemana[i].alimentos[x].categoria) {
          case "Almuerzo":
            this.detalleAlimentos.almuerzo = this.detalleAlimentos.almuerzo + this.registroAlimentosEnSemana[i].alimentos[x].calorias
            break;
          case "Desayuno":
            this.detalleAlimentos.desayuno = this.detalleAlimentos.desayuno + this.registroAlimentosEnSemana[i].alimentos[x].calorias
            break;
          case "Merienda":
            this.detalleAlimentos.merienda = this.detalleAlimentos.merienda + this.registroAlimentosEnSemana[i].alimentos[x].calorias
            break;
          case "Cena":
            this.detalleAlimentos.cena = this.detalleAlimentos.cena + this.registroAlimentosEnSemana[i].alimentos[x].calorias
            break;
          case "Otros":
            this.detalleAlimentos.otros = this.detalleAlimentos.otros + this.registroAlimentosEnSemana[i].alimentos[x].calorias
            break;
        }
      }
      indice = i + 1
    }

    this.detalleAlimentos.agua = Number((this.detalleAlimentos.agua / indice).toFixed(2))
    this.detalleAlimentos.caloriasQuemadas = Math.round(this.detalleAlimentos.caloriasQuemadas / indice)
    this.detalleAlimentos.caloriasTotales = Math.round(this.detalleAlimentos.caloriasTotales / indice)
    this.detalleAlimentos.desayuno = Math.round(this.detalleAlimentos.desayuno / indice)
    this.detalleAlimentos.almuerzo = Math.round(this.detalleAlimentos.almuerzo / indice)
    this.detalleAlimentos.merienda = Math.round(this.detalleAlimentos.merienda / indice)
    this.detalleAlimentos.cena = Math.round(this.detalleAlimentos.cena / indice)
    this.detalleAlimentos.otros = Math.round(this.detalleAlimentos.otros / indice)
    for (let x = 0; x < this.data.length; x++) {
      switch (this.data[x].category) {
        case "Almuerzo":
          this.data[x].percentage = Math.round((this.detalleAlimentos.almuerzo / this.detalleAlimentos.caloriasTotales) * 100)
          break;
        case "Desayuno":
          this.data[x].percentage = Math.round((this.detalleAlimentos.desayuno / this.detalleAlimentos.caloriasTotales) * 100)
          break;
        case "Merienda":
          this.data[x].percentage = Math.round((this.detalleAlimentos.merienda / this.detalleAlimentos.caloriasTotales) * 100)
          break;
        case "Cena":
          this.data[x].percentage = Math.round((this.detalleAlimentos.cena / this.detalleAlimentos.caloriasTotales) * 100)
          break;
        case "Otros":
          this.data[x].percentage = Math.round((this.detalleAlimentos.otros / this.detalleAlimentos.caloriasTotales) * 100)
          break;
      }
    }
    this.data.sort((a, b) => b.percentage - a.percentage);
  }

  async obtenerRecomendaciones() {
    (await this.firebaseSvc.getDocument('PlatosXPaciente', this.utilSvc.getElementInLocalStorage('correo'))).toPromise().then((resp) => {
      this.recomendaciones = resp.data() as PlatosXPaciente
      if (this.recomendaciones.almuerzo == "" || this.recomendaciones.cena == "") {
        this.hayPlatos = false
      } else {
        this.hayPlatos = true
      }
      this.recomendaciones.recomendaciones == "" ? this.hayRecomendaciones = false : this.hayRecomendaciones = true
      this.recomendaciones.recetas == "" ? this.hayRecetas = false : this.hayRecetas = true
    })
  }

  async obtenerNutricionista() {
    this.pacienteNutricionista = this.utilSvc.getElementInLocalStorage('pacienteNutricionista')
    if (this.pacienteNutricionista.perfilCompleto) {
      (await this.firebaseSvc.getDocument('Pacientes', this.utilSvc.getElementInLocalStorage('correo'))).toPromise().then(async (resp) => {
        this.paciente = resp.data() as Paciente
        this.nombrePaciente = this.paciente.nombre
        this.pacienteNutricionista.nombre == "" ? this.nombreNutricionista = "Aún no asignado" : this.nombreNutricionista = this.pacienteNutricionista.nombre
        this.utilSvc.setElementInLocalStorage('nombrePaciente', this.nombrePaciente)
      })
    }
  }

  mensajeBienvenida() {
    if ((!this.pacienteNutricionista.perfilCompleto || this.pacienteNutricionista.nutricionista == "") && !this.utilSvc.getElementInLocalStorage('msjBienvenida')) {
      let msj1: string = ""
      let msj2: string = ""
      this.pacienteNutricionista.perfilCompleto ? "" : msj1 = "Te recomendamos completar los datos de tu perfil. "
      this.pacienteNutricionista.nutricionista == "" ? msj2 = "Tu nutricionista aún no te dió de alta, igualmente podés registrar tus mediciones y alimentación" : ""
      Swal.fire({
        title: 'Bienvenido a NutriCoach',
        text: msj1 + msj2,
        heightAuto: false,
        confirmButtonText: 'Aceptar'
      }).then(() => this.utilSvc.setElementInLocalStorage('msjBienvenida', true))
    }
  }


  getInicioSemana() {
    var result = new Date(new Date().toDateString());
    while (result.getDay() != 1) {
      result.setDate(result.getDate() - 1);
    }
    this.primeraSemanaInicio = result.toString()
    result.setDate(result.getDate() + 6)
    this.primeraSemanaFin = result.toString()
    this.getArrayFechas()
  }

  getArrayFechas() { //Se calculan tentativamente 4 semanas, por si se desea ampliar el resumen
    var inicio = new Date(this.primeraSemanaInicio)
    var fin = new Date(this.primeraSemanaFin)
    for (let i = 0; i <= 3; i++) {
      inicio.setDate(inicio.getDate() - 7)
      fin.setDate(fin.getDate() - 7)
      let intervalo: intervaloFechas = {
        fechaInicio: new Date(inicio.toISOString()),
        fechaFin: new Date(fin.toISOString())
      }
      this.arrayFechas.push(intervalo)
    }
  }

  verSemana() {
    this.slidePlan?.nativeElement.swiper.slideNext(250)
    this.content.scrollToTop(0)
  }

  verRecomendaciones() {
    this.slidePlan?.nativeElement.swiper.slidePrev(250)
    this.content.scrollToTop(0);
  }

  descargarRecetas() {
    if (this.hayRecetas) {
      const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.recomendaciones.recetas);
    link.setAttribute('download', 'recetas.pdf'); // Nombre del archivo a descargar

    // Simular un clic en el enlace para comenzar la descarga
    document.body.appendChild(link);
    link.click();

    // Eliminar el enlace después de la descarga
    document.body.removeChild(link);
    } else {
      Swal.fire({
        title: "Recetas",
        text: "Aún no tenés recetas recomendadas por tu profesional",
        confirmButtonText: 'Aceptar',
        heightAuto: false
      })
    }
  }






}

interface intervaloFechas {
  fechaInicio: Date,
  fechaFin: Date
}
