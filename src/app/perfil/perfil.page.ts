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
  userProfile :any = {
    email: 'user@example.com',
    nombre: '',
    dni: '',
    obraSocial: '',
    numAfiliado: '',
    telefono: '',
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
        '<input type="password" id="current-password" class="swal2-input" placeholder="Contraseña actual" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="password" id="new-password" class="swal2-input" placeholder="Nueva contraseña" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="password" id="new-password-confirm" class="swal2-input" placeholder="Confirmar contraseña" style= "width:80%; margin:1em 0.7em 3px;">',
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
        } else if((currentPassword != newPassword) && (newPassword != newPasswordConfirm) && (newPasswordConfirm != newPassword)) {
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
    }).then((result)=>{
      if(result.isConfirmed){
        this.borrarDatos();
      }
    })
  }

  borrarDatos(){
    Swal.fire({
      icon: 'info',
      title: '¿Desea borrar sus datos?',
      text: 'Sus datos no se podrán recuperar una vez eliminada la cuenta',
      showCancelButton: false,
      showDenyButton: true,
      denyButtonText: 'Borrar datos',
      confirmButtonText: 'Mantener datos',
      cancelButtonText: 'Cancelar',
      reverseButtons: false,
      heightAuto: false
    })
    .then((result) => {
      if (result.isDenied) {
        this.isProfileLoaded = false;      
        this.router.navigate(['/home']),
        Swal.fire({
          icon:'success',
          title:'Cuenta eliminada',
          confirmButtonText: 'Aceptar',
          heightAuto: false});
      }
      if (result.isConfirmed){
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
        '<input type="text" id="dato1" class="swal2-input" placeholder="Nombre completo" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="text" id="dato2" class="swal2-input" placeholder="Numero de DNI" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="text" id="dato3" class="swal2-input" placeholder="Obra social" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="text" id="dato4" class="swal2-input" placeholder="Numero de afiliado" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="text" id="dato5" class="swal2-input" placeholder="Telefono" style= "width:80%; margin:1em 0.7em 3px;">' ,
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

        if(!dato1 || !dato2 || !dato3 || !dato4 || !dato5){
          Swal.showValidationMessage('Por favor, complete todos los campos');
         }

         this.userProfile.nombre = dato1;
         this.userProfile.dni = dato2;
         this.userProfile.obraSocial = dato3;
         this.userProfile.numAfiliado = dato4;
         this.userProfile.telefono = dato5; 
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
  
  //Funcion para modificar los datos del usuario
  modificarDato(propiedad: string) {
    if (this.userProfile.hasOwnProperty(propiedad)) {
      let placeholderText = '';

      if (propiedad === 'nombre') {
        placeholderText = 'Nombre';
      } else if (propiedad === 'dni') {
        placeholderText = 'N° de DNI';
      } else if (propiedad === 'obraSocial') {
        placeholderText = 'Obra social';
      } else if (propiedad === 'numAfiliado') {
        placeholderText = 'N° de afiliado';
      } else if (propiedad === 'telefono') {
        placeholderText = 'Telefono';
      }
      Swal.fire({
        heightAuto: false,
        title: `Editar ${placeholderText}`,
        input: 'text',
        inputValue: this.userProfile[propiedad],
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debes ingresar un valor';
          } else {
            // Actualizar el valor en userProfile
            this.userProfile[propiedad] = value;
            // Lógica adicional de guardado si es necesario
          }
          return null;
        }
      });
    } else {
      console.error(`La propiedad no existe en userProfile.`);
    }
  }


}
