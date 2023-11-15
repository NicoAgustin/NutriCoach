import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon, SweetAlertInput, SweetAlertOptions } from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { Usuario, Paciente, Nutricionista, PacienteNutri } from 'src/app/models/usuario.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PacienteXNutricionista } from 'src/app/models/usuario.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil-nutri',
  templateUrl: './perfil-nutri.page.html',
  styleUrls: ['./perfil-nutri.page.scss'],
})
export class PerfilNutriPage implements OnInit {

  constructor( 
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService) { }

    perfil : Nutricionista = {
      email: "",
      fotoPerfil: "https://ionicframework.com/docs/img/demos/avatar.svg",
      matricula: "",
      nombre: "",
      telefono: ""
    }
    loading: boolean = false
    foto: string
    private subscription: Subscription;
    pacientes: PacienteNutri[] = []

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.perfil.email = this.utilSvc.getElementInLocalStorage('correo')
    this.perfil.fotoPerfil = "https://ionicframework.com/docs/img/demos/avatar.svg"
    this.perfil.matricula = ""
    this.perfil.nombre = ""
    this.perfil.telefono = ""
    this.loading = true
    this.getDatos()
  }

  async getDatos(){
    (await this.firebaseSvc.getDocument('Nutricionistas', this.utilSvc.getElementInLocalStorage('correo'))).toPromise().then((res) => {
      this.perfil = res.data() as Nutricionista
      this.perfil.fotoPerfil == "" ? this.perfil.fotoPerfil = "https://ionicframework.com/docs/img/demos/avatar.svg" : false;
      this.loading = false
    })
}

editarFoto(){
  Swal.fire({
    text: '¿Editar la foto de perfil?',
    imageUrl: this.perfil.fotoPerfil,
    imageWidth: 270,
    imageHeight: 280,
    imageAlt: 'Foto de perfil',
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    heightAuto: false,
  }).then((res) => {
    if (res.isConfirmed) {
      this.tomarImagenYRegistrar();
    } else {
      Swal.close()
    }
  })
}

tomarImagenYRegistrar() {
  this.tomarFotografia().then(async () => {
    if (this.foto != 'undefined') {
      this.utilSvc.presentLoading()
      let uid = this.utilSvc.getElementInLocalStorage('correo')
      let imagepath = `${uid}/Perfil/`
      this.perfil.fotoPerfil = await this.firebaseSvc.uploadImage(imagepath, this.foto)
      await this.firebaseSvc.updateDocument('Nutricionistas', uid, this.perfil)
      this.utilSvc.dismissLoading()
    }
  })
}

async tomarFotografia() {
  let promptLabelHeader = 'Ingrese su matrícula'
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
    promptLabelHeader,
    promptLabelPhoto: 'Seleccionar de galería',
    promptLabelPicture: 'Tomar una foto'
  });
  this.foto = image.dataUrl
}

modificarDato(propiedad: string) {
  if (this.perfil.hasOwnProperty(propiedad)) {
    let placeholderText = '';
    let inputType: SweetAlertInput
    inputType = 'text'

    if (propiedad === 'nombre') {
      placeholderText = 'Nombre y Apellido';
    } else if (propiedad === 'telefono') {
      placeholderText = 'Teléfono';
      inputType = 'number'
    }
    Swal.fire({
      heightAuto: false,
      title: `Editar ${placeholderText}`,
      input: inputType,
      inputValue: this.perfil[propiedad],
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un valor';
        } else {
          // Actualizar el valor en userProfile
          this.perfil[propiedad] = value;
          this.firebaseSvc.updateDocument('Nutricionistas', this.utilSvc.getElementInLocalStorage('correo'), this.perfil)
          // Lógica adicional de guardado si es necesario
        }
        return null;
      }
    });
  } else {
    console.error(`La propiedad no existe en userProfile.`);
  }
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

  cambiarContrasena() {
    Swal.fire({
      heightAuto: false,
      title: 'Cambiar Contraseña',
      text: 'Enviaremos un enlace a su casilla de correo para comenzar el cambio de contraseña',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.utilSvc.presentLoading()
        this.firebaseSvc.enviarCodigoReset(this.utilSvc.getElementInLocalStorage('correo')).then(() => {
          this.utilSvc.dismissLoading()
          this.mensajeMail()
        }).catch((error) => {
          this.utilSvc.dismissLoading()
          this.mostrarMensaje('Ocurrió un error al enviar el correo', 'error')
          console.log(error)
        })
      }
    })
  }

  mensajeMail() {
    Swal.fire({
      icon: 'success',
      title: 'Correo enviado',
      text: 'Verifique su casilla para realizar el cambio de contraseña',
      confirmButtonText: 'Aceptar',
      heightAuto: false
    });
  }

  mostrarMensaje(mensaje: string, icon: SweetAlertIcon) {
    Swal.fire({
      icon: icon,
      text: mensaje,
      heightAuto: false
    })
  }

  eliminarCuenta() {
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
        this.borrarDatos();
      }
    })
  }

  borrarDatos() {
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
      .then(async (result) => {
        if (result.isDenied) {
          this.utilSvc.presentLoading()
          try {
            await this.firebaseSvc.eliminarCuenta().then(async () =>  await this.eliminarDatosDB())
            // await this.eliminarDatosDB().then(async () =>  await this.firebaseSvc.eliminarCuenta())
            await this.firebaseSvc.eliminarCuenta()
          } catch (error) {
            this.mostrarMensaje('Error al eliminar el usuario', 'error')
          } finally {
            this.utilSvc.clearLocalStorage()
            this.utilSvc.dismissLoading()
            Swal.fire({
              icon: 'success',
              title: 'Cuenta eliminada',
              confirmButtonText: 'Aceptar',
              heightAuto: false
            }).then(() => {
              this.firebaseSvc.signOut()
            });
          }
        }
        if (result.isConfirmed) {
          let userUpdt: Usuario = {
            cuentaActiva: false,
            fechaDePausa: new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })).toISOString().substring(0, 10),
            nutricionista: this.utilSvc.getElementInLocalStorage('nutricionista')
          }
          await this.firebaseSvc.updateDocument('Usuarios', this.utilSvc.getElementInLocalStorage('correo'), userUpdt)
          Swal.fire({
            title: 'Importante',
            text: 'Mantendremos los datos de su cuenta por 30 días. Luego se eliminará la cuenta y sus datos asociados',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            heightAuto: false,
            allowOutsideClick: false,
            reverseButtons: true
          }).then(async (result) => {
            if (result.isConfirmed) {
              this.utilSvc.presentLoading()
              await this.firebaseSvc.signOut()
              this.utilSvc.clearLocalStorage()
              this.utilSvc.dismissLoading()
            } else {
              Swal.close()
            }
          })
        }
      });
  }

  async eliminarDatosDB(){
    let user: string = this.perfil.email
    let imagepath = `${user}/Perfil`;
    let matpath = `${user}/${this.perfil.matricula}`;
    try{
      (await this.firebaseSvc.getSubcollection('Nutricionistas', this.utilSvc.getElementInLocalStorage('correo'), 'Pacientes')).subscribe((data) => {
        this.pacientes = []
        data.forEach(async (doc) => {
          let data: PacienteNutri = doc.payload.doc.data() as PacienteNutri
          console.log("Borrar nutri de paciente: " + data.correo)
          await this.actualizarPaciente(data.correo)
        })
      })
    }catch(error){
      console.log("Error al eliminar al nutricionista de la tabla PacientesXNutricionista")
    }
    console.log("Se comienzan a borrar los datos de la BD")
    await this.firebaseSvc.deleteDocument('Matriculas', user)
    await this.firebaseSvc.deleteDocument('Usuarios', user)
    await this.firebaseSvc.deleteDocumentInCollection('Nutricionistas', 'Pacientes', user)
    await this.firebaseSvc.deleteDocument('Nutricionistas', user)
    await this.firebaseSvc.deleteImage(imagepath)
    await this.firebaseSvc.deleteImage(matpath)
    await this.firebaseSvc.deleteImage(user)
  }

  async actualizarPaciente(correo: string){
   (await this.firebaseSvc.getDocument('PacientesXNutricionista', correo)).toPromise().then(async (reg) => {
    let pac : PacienteXNutricionista = reg.data() as PacienteXNutricionista
    pac.nombre = ""
    pac.nutricionista = ""
    await this.firebaseSvc.updateDocument('PacientesXNutricionista', correo, pac)
    await this.firebaseSvc.deleteDocument('PlatosXPaciente', correo)
    await this.firebaseSvc.deleteDocument('ReaccionesXPaciente', correo)
   })
  }

}
