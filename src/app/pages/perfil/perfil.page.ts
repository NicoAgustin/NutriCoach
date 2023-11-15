import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon, SweetAlertInput, SweetAlertOptions } from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { Usuario, Paciente } from 'src/app/models/usuario.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PacienteXNutricionista } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  isProfileLoaded: boolean = false; //Booleano de datos cargados
  loading: boolean = false
  correo: string = ""
  foto: string

  //Informacion del usuario

  userProfile: Paciente = {
    email: this.utilSvc.getElementInLocalStorage('correo'),
    nombre: '',
    dni: '',
    obraSocial: '',
    numAfiliado: '',
    telefono: '',
    consideraciones: '',
    fotoPerfil: 'https://ionicframework.com/docs/img/demos/avatar.svg'
  };

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  async ngOnInit() {
    this.loading = true
    this.correo = this.utilSvc.getElementInLocalStorage('correo');
    this.obtenerDatosPerfil()
  }

  async ionViewWillEnter() {
    if (this.correo !== this.utilSvc.getElementInLocalStorage('correo')) {
      this.loading = true;
      this.obtenerDatosPerfil()
    }
  }

  async obtenerDatosPerfil() {
    (await this.firebaseSvc.getDocument('Pacientes', this.utilSvc.getElementInLocalStorage('correo'))).toPromise().then((resp) => {
      if (typeof resp.data() !== 'undefined') {
        this.userProfile = resp.data() as Paciente
        this.isProfileLoaded = true
      } else {
        this.isProfileLoaded = false
      }
      this.loading = false
    }).catch((error) => {
      this.loading = false
      console.log(error.message)
      this.mostrarMensaje('Error al obtener datos del perfil', 'error')
    })
    this.correo = this.utilSvc.getElementInLocalStorage('correo');
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

  //Funcion de cambio de contraseña
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
      heightAuto: false,
      allowOutsideClick: false,
    }).then(async () => {
      this.utilSvc.presentLoading()
      await this.firebaseSvc.signOut()
      this.utilSvc.clearLocalStorage()
      this.utilSvc.dismissLoading()
    });
  }

  mostrarMensaje(mensaje: string, icon: SweetAlertIcon) {
    Swal.fire({
      icon: icon,
      text: mensaje,
      heightAuto: false
    })
  }

  //Funcion para eliminar la cuenta de usuario
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
    let user: string = this.utilSvc.getElementInLocalStorage('correo')
    let imagepath = `${user}/Perfil/`
    await this.firebaseSvc.deleteDocumentInCollection('Mediciones', 'registros', user)
    await this.firebaseSvc.deleteDocumentInCollection('Registros', 'registros', user)
    await this.firebaseSvc.deleteDocument('Mediciones', user)
    await this.firebaseSvc.deleteDocument('Registros', user)
    await this.firebaseSvc.deleteDocument('Usuarios', user)
    await this.firebaseSvc.deleteDocument('Pacientes', user)
    await this.firebaseSvc.deleteDocument('PlatosXPaciente', user)
    await this.firebaseSvc.deleteDocument('PacientesXNutricionista', user)
    await this.firebaseSvc.deleteDocument('ReaccionesXPaciente', user)
    await this.firebaseSvc.deleteImage(imagepath)
  }

  //Funcion para cargar los datos del usuario
  cargarDatos() {
    Swal.fire({
      heightAuto: false,
      title: "Cargar Datos",
      html:
        '<input type="text" id="dato1" class="swal2-input" placeholder="Nombre completo" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="number" id="dato2" class="swal2-input" placeholder="Numero de DNI" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="text" id="dato3" class="swal2-input" placeholder="Obra social" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="number" id="dato4" class="swal2-input" placeholder="Numero de afiliado" style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="number" id="dato5" class="swal2-input" placeholder="Telefono" style= "width:80%; margin:1em 0.7em 3px;">',
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      preConfirm: () => {
        const dato1 = (document.getElementById('dato1') as HTMLInputElement).value;
        const dato2 = (document.getElementById('dato2') as HTMLInputElement).value;
        const dato3 = (document.getElementById('dato3') as HTMLInputElement).value;
        const dato4 = (document.getElementById('dato4') as HTMLInputElement).value;
        const dato5 = (document.getElementById('dato5') as HTMLInputElement).value;

        if (!dato1 || !dato2 || !dato3 || !dato4 || !dato5) {
          Swal.showValidationMessage('Por favor, complete todos los campos');
        }

        this.userProfile.nombre = dato1;
        this.userProfile.dni = dato2;
        this.userProfile.obraSocial = dato3;
        this.userProfile.numAfiliado = dato4;
        this.userProfile.telefono = dato5;
        return { dato1, dato2, dato3, dato4, dato5 };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const data = result.value;
        this.cargarDatos2()
        //Aca se envian los datos al backend

        //   Swal.fire({
        //     icon: 'success',
        //     title: 'Datos guardados',
        //     confirmButtonText: 'Aceptar',
        //     heightAuto: false
        //   });
        //   this.isProfileLoaded = true;
      }
    });
  };

  async cargarDatos2() {
    await Swal.fire({
      input: 'textarea',
      inputLabel: 'Consideraciones',
      inputPlaceholder: 'Medicaciones, enfermedades preexistentes, etc...',
      inputAttributes: {
        'aria-label': 'Medicaciones, enfermedades preexistentes, etc...'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      allowOutsideClick: false,
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.userProfile.consideraciones = result.value || ""
        await this.firebaseSvc.setDocument('Pacientes', this.utilSvc.getElementInLocalStorage('correo'), this.userProfile)
        await this.actualizarPaciente()
        this.isProfileLoaded = true
      } else {
        this.userProfile.nombre = ""
        this.userProfile.dni = ""
        this.userProfile.obraSocial = ""
        this.userProfile.numAfiliado = ""
        this.userProfile.telefono = ""
        this.userProfile.consideraciones = ""
        this.isProfileLoaded = false
      }
    })
  }

  async actualizarPaciente(){
    (await this.firebaseSvc.getDocument('PacientesXNutricionista', this.utilSvc.getElementInLocalStorage('correo'))).toPromise().then(async (resp) => {
      let paciente : PacienteXNutricionista = resp.data() as PacienteXNutricionista
      paciente.perfilCompleto = true
      paciente.paciente = this.userProfile.nombre
      this.utilSvc.setElementInLocalStorage('pacienteNutricionista', paciente)
      await this.firebaseSvc.updateDocument('PacientesXNutricionista', this.utilSvc.getElementInLocalStorage('correo'), paciente)
    })

  }

  //Funcion para modificar los datos del usuario
  modificarDato(propiedad: string) {
    if (this.userProfile.hasOwnProperty(propiedad)) {
      let placeholderText = '';
      let inputType: SweetAlertInput
      inputType = 'text'

      if (propiedad === 'nombre') {
        placeholderText = 'Nombre';
      } else if (propiedad === 'dni') {
        placeholderText = 'N° de DNI';
        inputType = 'number'
      } else if (propiedad === 'obraSocial') {
        placeholderText = 'Obra social';
      } else if (propiedad === 'numAfiliado') {
        placeholderText = 'N° de afiliado';
        inputType = 'number'
      } else if (propiedad === 'telefono') {
        placeholderText = 'Telefono';
        inputType = 'number'
      } else if (propiedad === 'consideraciones') {
        placeholderText = 'Consideraciones'
        inputType = 'textarea'
      }
      Swal.fire({
        heightAuto: false,
        title: `Editar ${placeholderText}`,
        input: inputType,
        inputValue: this.userProfile[propiedad],
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        inputValidator: async (value) => {
          if (!value && propiedad !== 'consideraciones') {
            return 'Debes ingresar un valor';
          } else {
            // Actualizar el valor en userProfile
            this.userProfile[propiedad] = value;
            await this.firebaseSvc.updateDocument('Pacientes', this.utilSvc.getElementInLocalStorage('correo'), this.userProfile)
            if(propiedad == 'nombre'){
              await this.actualizarPaciente()
            }
            // Lógica adicional de guardado si es necesario
          }
          return null;
        }
      });
    } else {
      console.error(`La propiedad no existe en userProfile.`);
    }
  }

  editarFoto() {
    Swal.fire({
      text: '¿Editar la foto de perfil?',
      imageUrl: this.userProfile.fotoPerfil,
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
        this.userProfile.fotoPerfil = await this.firebaseSvc.uploadImage(imagepath, this.foto)
        await this.firebaseSvc.updateDocument('Pacientes', uid, this.userProfile)
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


}
