import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mediciones',
  templateUrl: './mediciones.page.html',
  styleUrls: ['./mediciones.page.scss'],
})
export class MedicionesPage implements OnInit  {

  registroFecha:string= new Date().toISOString().substring(0, 19)
  hayRegistro: boolean = false
  highlightedDates: any[]=[]
  max: string = new Date().toISOString().substring(0, 10)
  medicion: MedicionPaciente = {
    peso: 0,
    talla: 0,
    cintura: 0, 
    ombligo: 0,
    cadera: 0
  }
  registroMediciones: registroPaciente[] = []



  constructor() { }

  ngOnInit() {
    this.revisarRegistro(this.registroFecha)
  }

  setDate(fecha:any){
    if(typeof(fecha) != 'undefined'){
      this.registroFecha=fecha
      this.revisarRegistro(fecha)
      this.cargarHighlightFechas()
    }
  }

  revisarRegistro(fecha:any){
    for(let i = 0; i < this.registroMediciones.length; i++){
      if (this.registroMediciones[i].fecha.substring(0,10) === fecha.substring(0,10)){
        console.log('fecha iguales')
        this.hayRegistro = true
        this.medicion = this.registroMediciones[i].medicion
        break
      }
      else{
        console.log('fecha distintas')
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
  }

  cargarHighlightFechas(){
    for(let i = 0; i < this.registroMediciones.length; i++){
      console.log("Se guarda la fecha así: " + this.registroMediciones[i].fecha.substring(0,10))
      let unRegistro: highlight = {
        date: this.registroMediciones[i].fecha.substring(0,10),
        textColor:'#09721b',
        backgroundColor: '#c8e5d0'
      }
      this.highlightedDates.push(unRegistro)
    }
  }

  async cargarPeso(){
    if(!this.hayRegistro){
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
            if(Number(value) > 0 && Number(value) <350){
              this.medicion.peso = Number(value)
              resolve()
            }else {
              resolve('Verifique el valor ingresado')
            }
          })
        }
      })
    }
   
  }

  async cargarTalla(){
    if(!this.hayRegistro){
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
          if(Number(value) > 0 && Number(value) <300){
            this.medicion.talla = Number(value)
            resolve()
          }else {
            resolve('Verifique el valor ingresado')
          }
        })
      }
    })
  }
  }

  async cargarCintura(){
    if(!this.hayRegistro){
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
          if(Number(value) > 0 && Number(value) <200){
            this.medicion.cintura = Number(value)
            resolve()
          }else {
            resolve('Verifique el valor ingresado')
          }
        })
      }
    })
  }
  }

  async cargarOmbligo(){
    if(!this.hayRegistro){
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
          if(Number(value) > 0 && Number(value) <200){
            this.medicion.ombligo = Number(value)
            resolve()
          }else {
            resolve('Verifique el valor ingresado')
          }
        })
      }
    })
  }
  }

  async cargarCadera(){
    if(!this.hayRegistro){
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
          if(Number(value) > 0 && Number(value) <200){
            this.medicion.cadera = Number(value)
            resolve()
          }else {
            resolve('Verifique el valor ingresado')
          }
        })
      }
    })
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
        let unregistro: registroPaciente = {
          fecha: this.registroFecha,
          medicion: this.medicion,
        }
        this.registroMediciones.push(unregistro)
        this.hayRegistro = true
      } else{
        Swal.close()
      }
    })
  }


}

interface MedicionPaciente {
  peso: number, 
  talla: number,
  cintura: number, 
  ombligo: number,
  cadera: number
}

interface registroPaciente {
  fecha: string,
  medicion: MedicionPaciente
}

interface highlight{
  date: string,
  textColor: string,
  backgroundColor: string
}
