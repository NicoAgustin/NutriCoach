import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import Swal from 'sweetalert2';





@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit {
  @ViewChild("detallemenu", { static: false }) swiper?: ElementRef<{ swiper: Swiper }>
  private swiperConfig?: SwiperOptions

  @ViewChild("slideplan", { static: false }) slidePlan?: ElementRef<{ swiper: Swiper }>
  private slidePlanConfig?: SwiperOptions

  tagDefaultColor = Array(4).fill('secondary');
  children = [
    { id: 0, name: 'Desayuno' },
    { id: 1, name: 'Almuerzo' },
    { id: 2, name: 'Merienda' },
    { id: 3, name: 'Cena' },
  ];



  seleccionMenu: number = 0;

  desayunos: plan[] = [
    {
      tipo: "Vegetariano",
      contenido: "Tostada con palta y tomate"
    },
    {
      tipo: "Omnivoro",
      contenido: "Tostada con palta y jamón"
    },
    {
      tipo: "Vegetariano",
      contenido: "Leche con cereales"
    }
  ]

  almuerzos: plan[] = [
    {
      tipo: "Vegetariano",
      contenido: "Pasta con brócoli y queso"
    },
    {
      tipo: "Omnivoro",
      contenido: "Pechuga de pollo con guisantes y quinoa"
    },
    {
      tipo: "Vegetariano",
      contenido: "Lentejas con zanahoria y cebolla"
    }
  ]

  meriendas: plan[] = [
    {
      tipo: "Vegetariano",
      contenido: "Tostada con palta y tomate"
    },
    {
      tipo: "Omnivoro",
      contenido: "Tostada con palta y jamón"
    },
    {
      tipo: "Vegetariano",
      contenido: "Leche con cereales"
    }
  ]

  cenas: plan[] = [
    {
      tipo: "Vegetariano",
      contenido: "Pasta con brócoli y queso"
    },
    {
      tipo: "Omnivoro",
      contenido: "Pechuga de pollo con guisantes y quinoa"
    },
    {
      tipo: "Vegetariano",
      contenido: "Lentejas con zanahoria y cebolla"
    }
  ]

  desayuno!: plan
  almuerzo!: plan
  merienda!: plan
  cena!: plan
  indiceDesayuno: number = 0
  indiceAlmuerzo: number = 0
  indiceCena: number = 0
  indiceMerienda: number = 0
  pasarSlide:string = "false"
  aguaArray: number[] = []
  agua: number = 0
  alimentosIngeridos: alimentoCategoria[] = [];
  registroFecha:string= new Date().toISOString().substring(0, 10)
  caloriasTotales:number=0
  unRegistroAlimentos: registroAlimento[] = []
  hayRegistro: boolean = false
  highlightedDates: any[]=[]
  max: string = new Date().toISOString().substring(0, 10)
  caloriasQuemadas:number = 0

  
 
  constructor() {}
  
  ngOnInit() {
    this.inicializarPlan()
    this.seleccionItem(0)
    this.revisarRegistro(this.registroFecha)
    this.cargarHighlightFechas()
    //this.registroFecha=Date.now()
  }

  verRecomendaciones(){
    this.slidePlan?.nativeElement.swiper.slideNext(250)
  }

  verIngesta(){
    this.slidePlan?.nativeElement.swiper.slidePrev(250)
  }

  inicializarPlan(){
    this.desayuno = this.desayunos[0]
    this.almuerzo = this.almuerzos[0]
    this.merienda = this.meriendas[0]
    this.cena = this.cenas[0]
  }

  cambiarDesayuno(){
    this.indiceDesayuno = this.indiceDesayuno + 1
    if (this.indiceDesayuno >= this.desayunos.length){
      this.indiceDesayuno = 0
    }
    this.desayuno = this.desayunos[this.indiceDesayuno]
  }

  cambiarAlmuerzo(){
    this.indiceAlmuerzo = this.indiceAlmuerzo + 1
    if (this.indiceAlmuerzo >= this.almuerzos.length){
      this.indiceAlmuerzo = 0
    }
    this.almuerzo = this.almuerzos[this.indiceAlmuerzo]
  }

  cambiarMerienda(){
    this.indiceMerienda = this.indiceMerienda + 1
    if (this.indiceMerienda >= this.meriendas.length){
      this.indiceMerienda = 0
    }
    this.merienda = this.meriendas[this.indiceMerienda]
  }

  cambiarCena(){
    this.indiceCena = this.indiceCena + 1
    if (this.indiceCena >= this.meriendas.length){
      this.indiceCena = 0
    }
    this.cena = this.cenas[this.indiceCena]
  }


  swiperSlideChanged(event:any){
    this.seleccionMenu = event.detail[0].activeIndex
    this.changeTagColor(this.seleccionMenu)

  }


  changeTagColor(i:any) {
    for(let x = 0; x < this.tagDefaultColor.length; x++){
      if(x == i){
        this.tagDefaultColor[x] = 'dark'
      } else {
        this.tagDefaultColor[x] = 'secondary'
      }
    }
  }

  seleccionItem(i:any){
    this.swiper?.nativeElement.swiper.slideTo(i, 250)
    this.changeTagColor(i)
  }

  sumarAgua(){
    if(this.agua < 2.5){
      this.aguaArray.push(1)
      this.agua = this.agua + 0.5
    }
  }

  restarAgua(){
    if (this.agua > 0){
      this.aguaArray.pop()
      this.agua = this.agua - 0.5
    }
  }

  async agregarAlimento(){
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

  async agregarAlimentoDos(cat: any){
    const { value: text } = await Swal.fire({
      title:'Agregar ' + cat,
      input: 'textarea',
      //inputLabel: cat,
      inputPlaceholder: 'Ingrese el alimento ingerido',
      inputAttributes: {
        'aria-label': 'Ingrese el alimento ingerido'
      },
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true
    })
    
    if (text) {
      this.agregarAlimentoTres(cat, text)
      }
    }
    async agregarAlimentoTres(cat:any, txt:any){
      const { value: calorias } = await Swal.fire({
        input:'number',
        inputLabel: 'Calorías',
        inputPlaceholder: 'kcal',
        showCancelButton: true,
        heightAuto: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        reverseButtons: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (Number(value) >= 0 && Number(value) <= 2000) {
              let unAlimentoAdd: alimentoCategoria = {
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
        }
      })
    }
  


  agregarAlimentoLista(alimento:alimentoCategoria){
    this.alimentosIngeridos.push(alimento)
    this.caloriasTotales = 0
    for(let i = 0; i < this.alimentosIngeridos.length; i++){
      this.caloriasTotales = this.caloriasTotales + this.alimentosIngeridos[i].calorias
    }
  }

  setDate(fecha:any){
    if(typeof(fecha) != 'undefined'){
      this.registroFecha=fecha
      this.revisarRegistro(fecha)
      this.cargarHighlightFechas()
    }
  }

  revisarRegistro(fecha:any){
    for(let i = 0; i < this.unRegistroAlimentos.length; i++){
      if (this.unRegistroAlimentos[i].fecha.substring(0,10) === fecha.substring(0,10)){
        console.log('fecha iguales')
        this.hayRegistro = true
        this.aguaArray = []
        this.agua = this.unRegistroAlimentos[i].agua
        this.alimentosIngeridos = this.unRegistroAlimentos[i].alimentos
        this.caloriasTotales = this.unRegistroAlimentos[i].caloriasTotales
        this.caloriasQuemadas = this.unRegistroAlimentos[i].caloriasQuemadas
        for(let x = 0;x < this.agua/0.5; x++){
          this.aguaArray.push(1)
        }
        break
      }
      else{
        console.log('fecha distintas')
        this.hayRegistro = false
        this.agua = 0
        this.alimentosIngeridos = []
        this.caloriasTotales = 0
        this.aguaArray = []
        this.caloriasQuemadas = 0
      }
    }
  }

  enviarRegistro(){
    Swal.fire({
      title:'¿Desea enviar el registro?',
      text: 'Luego no se podrá editar',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
    }).then((result)=>{
      if(result.isConfirmed){
        let unregistro: registroAlimento = {
          fecha: this.registroFecha,
          alimentos: this.alimentosIngeridos,
          agua: this.agua,
          caloriasTotales: this.caloriasTotales,
          caloriasQuemadas: this.caloriasQuemadas
        }
        this.unRegistroAlimentos.push(unregistro)
        this.hayRegistro = true
      } else{
        Swal.close()
      }
    })

  }

  cargarHighlightFechas(){
    for(let i = 0; i < this.unRegistroAlimentos.length; i++){
      console.log("Se guarda la fecha así: " + this.unRegistroAlimentos[i].fecha.substring(0,10))
      let unRegistro: highlight = {
        date: this.unRegistroAlimentos[i].fecha.substring(0,10),
        textColor:'#09721b',
        backgroundColor: '#c8e5d0'
      }
      this.highlightedDates.push(unRegistro)
    }
  }

  restarCalorias(){
    this.caloriasQuemadas = this.caloriasQuemadas - 10
    if(this.caloriasQuemadas < 0){
      this.caloriasQuemadas = 0
    }
  }

  sumarCalorias(){
    this.caloriasQuemadas = this.caloriasQuemadas + 10
  }

  borrarIngesta(i:number){
    let contenido = ""
    if(this.alimentosIngeridos[i].contenido.length>30){
      contenido = this.alimentosIngeridos[i].contenido.substring(0,30) + "..."
    } else{
      contenido = this.alimentosIngeridos[i].contenido
    }
    Swal.fire({
      title:"¿Desea eliminarlo?",
      html: '<p align="left">' + '<b>Categoria: </b>' + this.alimentosIngeridos[i].categoria + '</br>' +
      '<b>Calorías: </b>' + this.alimentosIngeridos[i].calorias + '</br>' +
      '<b>Contenido: </b>' + contenido +
      '</p>',
        showCancelButton: true,
        heightAuto: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#DC143C',
        reverseButtons: true,
    }).then((result)=>{
      if(result.isConfirmed){
            this.caloriasTotales = this.caloriasTotales - this.alimentosIngeridos[i].calorias
            this.alimentosIngeridos.splice(i, 1)
      } else{
        Swal.close()
      }
    })
  }

  editarIngesta(i:number){
    let contenido = ""
    if(this.alimentosIngeridos[i].contenido.length>30){
      contenido = this.alimentosIngeridos[i].contenido.substring(0,30) + "..."
    } else{
      contenido = this.alimentosIngeridos[i].contenido
    }
    Swal.fire({
      title:"¿Qué desea editar?",
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
    }).then((result)=>{
      if(result.isConfirmed){
        this.editarCalorias(i)
      } else if(result.isDenied){
        this.editarContenido(i)
      } else if(result.isDismissed){
        this.editarCategoria(i)
      }
    })
  }

  async editarCalorias(i:number){
    const { value: calorias } = await Swal.fire({
      input:'number',
      inputLabel: 'Calorías',
      inputPlaceholder: 'kcal',
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
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

  async editarContenido(i:number){
    const { value: text } = await Swal.fire({
      title:'Agregar ' + this.alimentosIngeridos[i].categoria,
      input: 'textarea',
      //inputLabel: cat,
      inputPlaceholder: 'Ingrese el alimento ingerido',
      inputAttributes: {
        'aria-label': 'Ingrese el alimento ingerido'
      },
      showCancelButton: true,
      heightAuto: false,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true
    })
    
    if (text) {
      this.alimentosIngeridos[i].contenido = text
      }
  }

  async editarCategoria(i:number){
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

  verInfoIngesta(i:number){
    Swal.fire({
      title: this.alimentosIngeridos[i].categoria,
      text: this.alimentosIngeridos[i].contenido,
      heightAuto: false,
      confirmButtonText: 'Aceptar'
    })
  }

  descargarRecomendaciones(){
    //ACÁ SE VA A DESCARGAR EL PDF CON LAS RECOMENDACIONES DEL NUTRI
  }


}





interface plan {
  tipo: string,
  contenido: string
}

interface alimentoCategoria {
  categoria: string,
  contenido: string,
  calorias: number
}

interface registroAlimento{
  fecha: string,
  alimentos: alimentoCategoria[],
  agua: number,
  caloriasTotales: number,
  caloriasQuemadas:number
}

interface highlight{
  date: string,
  textColor: string,
  backgroundColor: string
}
