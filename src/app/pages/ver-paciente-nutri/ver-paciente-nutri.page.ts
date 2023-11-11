import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { Paciente, PacienteNutri } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-ver-paciente-nutri',
  templateUrl: './ver-paciente-nutri.page.html',
  styleUrls: ['./ver-paciente-nutri.page.scss'],
})
export class VerPacienteNutriPage implements OnInit {

  nombre: string = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  correo: string = this.utilSvc.getElementInLocalStorage('paciente-correo')
  // fotoPerfil: string = 'https://ionicframework.com/docs/img/demos/avatar.svg'
  perfilPaciente: Paciente = {
    consideraciones: "",
    dni: "",
    email: "",
    fotoPerfil: "",
    nombre: "",
    numAfiliado: "",
    obraSocial: "",
    telefono: ""
  }
  hayPerfil: boolean = false

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre')
    this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo')
    this.hayPerfil = false
    this.utilSvc.presentLoading()
    this.obtenerDatosPaciente()
  }

  async obtenerDatosPaciente(){
    (await this.firebaseSvc.getDocument('Pacientes', this.utilSvc.getElementInLocalStorage('paciente-correo'))).toPromise().then((res) => {
      if(typeof res.data() !== 'undefined') {
       let paciente: Paciente = res.data() as Paciente
       this.perfilPaciente = paciente
       this.perfilPaciente.fotoPerfil == "" ? this.perfilPaciente.fotoPerfil = "https://ionicframework.com/docs/img/demos/avatar.svg" : false
       if(this.perfilPaciente.nombre.length > 1 && this.perfilPaciente.dni.length > 1){
        this.hayPerfil = true
       } else {
        this.hayPerfil = false
       }
      }
      this.utilSvc.dismissLoading()
    })
  }

  verFoto(){
    if(this.perfilPaciente.fotoPerfil !== "" && this.perfilPaciente.fotoPerfil !== "https://ionicframework.com/docs/img/demos/avatar.svg"){
      Swal.fire({
        imageUrl: this.perfilPaciente.fotoPerfil,
        imageWidth: 270,
        imageHeight: 280,
        imageAlt: 'Foto de perfil',
        confirmButtonText: 'Aceptar',
        heightAuto: false,
      })
    }
  }

  verConsideraciones(){
    if(this.perfilPaciente.consideraciones.length > 1){
      Swal.fire({
        title: 'Consideraciones',
        text: this.perfilPaciente.consideraciones,
        confirmButtonText: 'Aceptar',
        heightAuto: false,
      })
    }
  }

  volver(){
    this.router.navigate(['/tabs/opciones-paciente-nutri'])
  }

}
