import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UtilsService } from '../../services/utils.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-perfil-nutri',
  templateUrl: './perfil-nutri.page.html',
  styleUrls: ['./perfil-nutri.page.scss'],
})
export class PerfilNutriPage implements OnInit {

  constructor( 
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService) { }

  ngOnInit() {
  }

  cerrarSesion() {
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      heightAuto: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.utilSvc.presentLoading()
        await this.firebaseSvc.signOut()
        this.utilSvc.clearLocalStorage()
        this.utilSvc.dismissLoading()
      }
    })
    //this.router.navigate(['/home']);
  }

}
