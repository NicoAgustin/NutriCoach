import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  isProfileLoaded: boolean = false; //Booleano de datos cargados
  
  //Informacion del usuario
  userProfile = {
    email: 'usuario@example.com',
    nombre: 'Nombre Apellido',
    dni: '12345678',
    obraSocial: 'Obra Social',
    numAfiliado: '12345',
    telefono: '123-456-7890',
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  cerrarSesion(){
    this.router.navigate(['/home']);
  }

  //Funcion de cambio de contraseña
  cambiarContrasena(){
    Swal.fire({
      heightAuto: false,
      title: 'Cambiar Contraseña',
      html:
        '<input type="password" id="current-password" class="swal2-input" placeholder="Contraseña actual">' +
        '<input type="password" id="new-password" class="swal2-input" placeholder="Nueva contraseña">' +
        '<input type="password" id="new-password-confirm" class="swal2-input" placeholder="Confirmar contraseña">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      preConfirm: () => {
        const currentPassword = (document.getElementById('current-password') as HTMLInputElement).value;
        const newPassword = (document.getElementById('new-password') as HTMLInputElement).value;
        const newPasswordConfirm = (document.getElementById('new-password-confirm') as HTMLInputElement).value;
  
       
        if (!currentPassword || !newPassword || !newPasswordConfirm) {
          Swal.showValidationMessage('Por favor, complete los campos');
        } else if ((currentPassword == newPassword) && (currentPassword == newPasswordConfirm)) {
          Swal.showValidationMessage('La contraseña no puede ser la misma');
        } else if((currentPassword != newPassword) && (newPassword != newPasswordConfirm)) {
          Swal.showValidationMessage('Confirmacion de contraseña incorrecta');
        }


        return { currentPassword, newPassword };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon:'success',
          title:'Contraseña Cambiada',
          text:'Tu contraseña ha sido actualizada.',
          confirmButtonText: 'Aceptar',
          heightAuto: false});
      }
    });
  }

  //Funcion para eliminar la cuenta de usuario
  eliminarCuenta(){
    Swal.fire({
      icon: 'warning',
      title: '¿Deseas eliminar la cuenta?',
      text: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/home']),
        Swal.fire({
          icon:'success',
          title:'Cuenta eliminada',
          confirmButtonText: 'Aceptar',
          heightAuto: false});
      }
    });
  }

  //Funcion para cargar los datos del usuario
  cargarDatos(){
    Swal.fire({
      heightAuto: false,
      title: "Cargar Datos",
      html:
        '<input type="text" id="dato1" class="swal2-input" placeholder="Nombre completo">' +
        '<input type="text" id="dato2" class="swal2-input" placeholder="Numero de DNI">' +
        '<input type="text" id="dato3" class="swal2-input" placeholder="Obra social">' +
        '<input type="text" id="dato4" class="swal2-input" placeholder="Numero de afiliado">' +
        '<input type="text" id="dato5" class="swal2-input" placeholder="Telefono">' ,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      preConfirm: () => {
        const dato1 = (document.getElementById('dato1') as HTMLInputElement).value;
        const dato2 = (document.getElementById('dato2') as HTMLInputElement).value;
        const dato3 = (document.getElementById('dato3') as HTMLInputElement).value;
        const dato4 = (document.getElementById('dato4') as HTMLInputElement).value;
        const dato5 = (document.getElementById('dato5') as HTMLInputElement).value;
        return { dato1, dato2 , dato3 ,dato4, dato5};
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const data = result.value;
        //Aca se envian los datos al backend
        console.log("Datos ingresados:", data);
        Swal.fire({
          icon:'success',
          title:'Datos guardados',
          confirmButtonText: 'Aceptar',
          heightAuto: false});
          this.isProfileLoaded= true;
      }
    });
  };
  

}
