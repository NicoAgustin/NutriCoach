import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { DetalleSemana, ReaccionesXPaciente, RegistroAlimento } from 'src/app/models/plan.model';

@Component({
  selector: 'app-semana-nutri',
  templateUrl: './semana-nutri.page.html',
  styleUrls: ['./semana-nutri.page.scss'],
})
export class SemanaNutriPage implements OnInit {

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  nombre: string = ""
  correo: string = ""
  primeraSemanaInicio: string = ""
  primeraSemanaFin: string = ""
  arrayFechas: intervaloFechas[] = []
  registroAlimentos: RegistroAlimento[] = []
  registroAlimentosEnSemana: RegistroAlimento[] = []
  detalleAlimentos: DetalleSemana
  reacciones: ReaccionesXPaciente = {
    aguaBebida: "",
    caloriasIngeridas: "",
    caloriasQuemadas: "",
    fecha: ""
  }
  colorReaccioncaloriasIngeridas = "dark"
  colorReaccioncaloriasQuemadas = "dark"
  colorReaccionaguaBebida = "dark"

  data = [
    { category: 'Almuerzo', percentage: 0 },
    { category: 'Cena', percentage: 0 },
    { category: 'Merienda', percentage: 0 },
    { category: 'Desayuno', percentage: 0 },
    { category: 'Otros', percentage: 0 },
  ];
  primeraCarga: boolean = false


  async ngOnInit() {
    if (this.correo !== this.utilSvc.getElementInLocalStorage('paciente-correo')) {
      this.utilSvc.presentLoading()
      this.inicializarVariables()
      this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
      this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
      await this.cargarDatos()
    }
  }

  async ionViewWillEnter() {
    if (this.correo !== this.utilSvc.getElementInLocalStorage('paciente-correo')) {
      this.utilSvc.presentLoading()
      this.inicializarVariables()
      this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
      this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
      await this.cargarDatos().then(()=> {console.log(this.reacciones)})
    }
  }

  inicializarVariables() {
    this.data = [
      { category: 'Almuerzo', percentage: 0 },
      { category: 'Cena', percentage: 0 },
      { category: 'Merienda', percentage: 0 },
      { category: 'Desayuno', percentage: 0 },
      { category: 'Otros', percentage: 0 },
    ];
    this.reacciones = {
      aguaBebida: "",
      caloriasIngeridas: "",
      caloriasQuemadas: "",
      fecha: ""
    }
    this.primeraSemanaInicio = ""
    this.primeraSemanaFin = ""
    this.arrayFechas = []
    this.registroAlimentos = []
    this.registroAlimentosEnSemana = []
    this.detalleAlimentos = {
      almuerzo: 0,
      cena: 0,
      desayuno: 0,
      otros: 0,
      merienda: 0,
      caloriasTotales: 0,
      agua: 0,
      caloriasQuemadas: 0
    }


  }

  volver() {
    this.router.navigate(['/tabs/opciones-paciente-nutri'])
  }

  async cargarDatos() {
    this.getInicioSemana()
    await this.obtenerRegistros()
    await this.obtenerReacciones()
    setTimeout(async () => {
      this.utilSvc.dismissLoading()
    }, 1000);
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


  async obtenerRegistros() {
    let serv = (await this.firebaseSvc.getRegistro(this.correo, 'Registros', 'registros')).subscribe(registros => {
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

  async obtenerReacciones() {
    (await this.firebaseSvc.getDocument('ReaccionesXPaciente', this.correo)).toPromise().then((resp) => {
      let data: ReaccionesXPaciente = resp.data() as ReaccionesXPaciente
      if (data.fecha == new Date(this.arrayFechas[0].fechaInicio).toISOString().substring(0, 10)) {
        this.reacciones = data
        this.colorReaccioncaloriasIngeridas = this.asignarColor(this.reacciones.caloriasIngeridas)
        this.colorReaccioncaloriasQuemadas = this.asignarColor(this.reacciones.caloriasQuemadas)
        this.colorReaccionaguaBebida = this.asignarColor(this.reacciones.aguaBebida)
      }
    })
  }

  asignarColor(reaccion: string) {
    switch (reaccion) {
      case "happy-outline":
        return "success"
      case "sad-outline":
        return "danger"
      default:
        return "dark"
    }
  }

  verReaccion(reaccion: string, card: string) {
    let mensaje
    switch (reaccion) {
      case "happy-outline":
        mensaje = '¡Muy bien!'
        break;
      case "sad-outline":
        mensaje = '¡Podes mejorar!'
        break;
      default:
        mensaje = reaccion
    }
    Swal.fire({
      title: 'Reacción',
      text: mensaje,
      heightAuto: false,
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      confirmButtonColor: '#DC143C'
    }).then((result) => {
      if(result.isConfirmed){
        this.eliminarReaccion(card)
        Swal.close()
      }
    })
  }

  async eliminarReaccion(card: string){
    this.utilSvc.presentLoading();
    (await this.firebaseSvc.getDocument('ReaccionesXPaciente', this.correo)).toPromise().then(async (resp) => {
      let reacciones = resp.data() as ReaccionesXPaciente
        switch (card) {
          case "aguaBebida":
            reacciones.aguaBebida = ""
            break;
          case "caloriasIngeridas":
            reacciones.caloriasIngeridas = ""
            break;
          case "caloriasQuemadas":
            reacciones.caloriasQuemadas = ""
            break;
        }
        await this.firebaseSvc.updateDocument('ReaccionesXPaciente', this.correo, reacciones).then(async () => {
          setTimeout(async () => {
            await this.obtenerReacciones()
            this.utilSvc.dismissLoading()
          }, 800);
        })
    })
  }

  mostrarMensajeNutri(msj: string) {
    Swal.fire({
      title: 'Mensaje de tu profesional',
      text: msj,
      heightAuto: false,
      confirmButtonText: 'Aceptar'
    })
  }

  async reaccionar(mensaje: string, card: string) {
    if(mensaje == 'chatbubble-ellipses-outline'){
      const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'Dar recomendación',
        inputPlaceholder: 'Escriba su mensaje al paciente...',
        inputAttributes: {
          'aria-label': 'Escriba su mensaje al paciente'
        },
        showCancelButton: true,
        heightAuto: false,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Enviar",
        reverseButtons: true,
        allowOutsideClick: false
      })
      
      if (text) {
        this.uploadReaccion(text, card)
      }
    } else {
      this.uploadReaccion(mensaje, card)
    }
   
    
  }

  async uploadReaccion(mensaje: string, card: string){
    this.utilSvc.presentLoading();
    (await this.firebaseSvc.getDocument('ReaccionesXPaciente', this.correo)).toPromise().then(async (resp) => {
      let registro = resp.data() as ReaccionesXPaciente
      let reacciones: ReaccionesXPaciente = {
        aguaBebida: "",
        caloriasIngeridas: "",
        caloriasQuemadas: "",
        fecha: new Date(this.arrayFechas[0].fechaInicio).toISOString().substring(0, 10)
      }

      if ((typeof resp.data() !== 'undefined') && registro.fecha == reacciones.fecha) {
        reacciones = resp.data() as ReaccionesXPaciente
        switch (card) {
          case "aguaBebida":
            reacciones.aguaBebida = mensaje
            break;
          case "caloriasIngeridas":
            reacciones.caloriasIngeridas = mensaje
            break;
          case "caloriasQuemadas":
            reacciones.caloriasQuemadas = mensaje
            break;
        }
        await this.firebaseSvc.updateDocument('ReaccionesXPaciente', this.correo, reacciones).then(async () => {
          setTimeout(async () => {
            await this.obtenerReacciones()
            this.utilSvc.dismissLoading()
          }, 800);
        })
      } else {
        switch (card) {
          case "aguaBebida":
            reacciones.aguaBebida = mensaje
            break;
          case "caloriasIngeridas":
            reacciones.caloriasIngeridas = mensaje
            break;
          case "caloriasQuemadas":
            reacciones.caloriasQuemadas = mensaje
            break;
        }
        await this.firebaseSvc.setDocument('ReaccionesXPaciente', this.correo, reacciones).then(async () =>{
          setTimeout(async () => {
            await this.obtenerReacciones()
            this.utilSvc.dismissLoading()
          }, 800);
        })
      }
    })
  }


}

interface intervaloFechas {
  fechaInicio: Date,
  fechaFin: Date
}