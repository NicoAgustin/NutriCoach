import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-opciones-paciente-nutri',
  templateUrl: './opciones-paciente-nutri.page.html',
  styleUrls: ['./opciones-paciente-nutri.page.scss'],
})
export class OpcionesPacienteNutriPage implements OnInit {

  nombre: string = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  correo: string = this.utilSvc.getElementInLocalStorage('paciente-correo')

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  }

  volver(){
    this.router.navigate(['/tabs/inicial-nutri'])
  }

  verPerfil(){
    this.router.navigate(['/tabs/ver-paciente-nutri'])
  }

  verSugerencias(){
    this.router.navigate(['/tabs/sugerencias-nutri'])
  }

  verSemana(){
    this.router.navigate(['/tabs/semana-nutri'])
  }

  verMediciones(){
    this.router.navigate(['/tabs/mediciones-nutri'])
  }

  verRegistros(){
    this.router.navigate(['tabs/registros-nutri'])
  }

}
