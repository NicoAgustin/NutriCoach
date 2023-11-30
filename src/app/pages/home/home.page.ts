import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { Usuario, PacienteXNutricionista, Nutricionista } from 'src/app/models/usuario.model';
import { PlatosXPaciente, ReaccionesXPaciente } from 'src/app/models/plan.model';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  showPassword = false;
  passwordToggleIcon = 'eye-off';
  modelLogin = {
    user: '',
    contrasena: ''
  };
  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  correo: string = ''
  pass: string = ''
  nutri: string = ''
  fotoTitulo: any
  


  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
    this.modelLogin.user = ''
    this.modelLogin.contrasena = ''
    this.correo = ''
    this.pass = ''
    this.nutri = ''
  }

  ionViewWillEnter() {
    this.modelLogin.user = ''
    this.modelLogin.contrasena = ''
  }

  ionViewDidEnter() {
    this.utilSvc.dismissLoading()
  }

  iniciar() {
    if (!this.emailRegex.test(this.modelLogin.user)) {
      this.mensajeError('Ingrese un correo válido')
    } else if (!this.modelLogin.user || !this.modelLogin.contrasena) {
      this.mensajeError('Debe completar todos los datos')
    }
    else {
      this.login()
    }
  }

  async login() {
    this.utilSvc.presentLoading()
    this.firebaseSvc.login(this.modelLogin.user, this.modelLogin.contrasena).then(async res => {
      (await this.firebaseSvc.getDocument('Usuarios', this.modelLogin.user)).toPromise().then((result) => {
        let usuario = result.data() as Usuario
        this.darInicio(res, usuario.nutricionista)
      })
     
    }, err => {
      this.utilSvc.dismissLoading()
      var mensaje: string = err.message
      if (mensaje.includes('invalid')) {
        this.notificarError('Verifique su usuario y/o contraseña')
      } else {
        this.notificarError('Error en el inicio de sesión. Intente nuevamente más tarde')
      }
      console.log(err)
    })
  }

  notificarError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      text: mensaje,
      heightAuto: false
    })
  }

  async recordar() {

    const { value: email } = await Swal.fire({
      title: 'Ingrese su correo',
      input: 'email',
      inputPlaceholder: 'correo@nutricoach.com',
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      heightAuto: false,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve('Correo no válido')
          }
          else if (value && !this.emailRegex.test(value)) {
            resolve('Correo no válido')
          }
          else {
            console.log("Se ingreso: " + value);
            this.enviarCorreo(value)
            //Swal.close()
          }
        })
      }
    }
    )
  }

  enviarCorreo(value: string) {
    //COMPLETAR EL ENVIO DE CORREO
    this.firebaseSvc.resetPassword(value).then(() => {
      this.notificarCorreo()
    }).catch(error => {
      this.mensajeError('Error al enviar enviar el correo')
    })


  }

  notificarCorreo() {
    Swal.fire({
      icon: 'success',
      title: 'Correo enviado',
      text: 'Verifique su bandeja de entrada',
      heightAuto: false
    })
  }

  changePassword(): void {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon === 'eye') { this.passwordToggleIcon = 'eye-off'; } else { this.passwordToggleIcon = 'eye'; }
  }

  registrar() {
    Swal.fire({
      showCancelButton: true,
      confirmButtonText: "Soy Nutricionista",
      cancelButtonText: "Soy Paciente",
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.registrarNutri()
      }
      if (result.dismiss.toString() == 'cancel') {
        this.registrarPaciente()
      }
    })

  }

  registrarPaciente() {
    Swal.fire({
      title: 'Complete sus datos',
      heightAuto: false,
      html:
        '<input value="' + this.correo + '" id="swal-input1" class="swal2-input" placeholder= \'Correo\' style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="password" value="' + this.pass + '" id="swal-input2" class="swal2-input" placeholder= \'Contraseña\' style= "width:80%; margin:1em 0.7em 3px;">',
      focusConfirm: false,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        this.correo = (document.getElementById('swal-input1') as HTMLInputElement).value
        this.pass = (document.getElementById('swal-input2') as HTMLInputElement).value
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!this.emailRegex.test(this.correo)) {
          Swal.fire({
            icon: 'error',
            text: 'Ingrese un correo válido',
            heightAuto: false
          }).then(() => {
            this.registrarPaciente()
          }
          )
        } else if (!this.correo || !this.pass) {
          Swal.fire({
            icon: 'error',
            text: 'Debe completar todos los campos',
            heightAuto: false
          }).then(() => {
            this.registrarPaciente()
          }
          )
        } else if (this.pass.length < 6) {
          Swal.fire({
            icon: 'error',
            text: 'La contraseña debe ser de al menos 6 caracteres',
            heightAuto: false
          }).then(() => {
            this.registrarPaciente()
          }
          )
        }
        else {
          //ACA SE DEBE REGISTRAR AL USUARIO
          this.utilSvc.presentLoading()
          const seRegistra = await this.registrarUsuarioNuevo()
          if (seRegistra) {
            let user: Usuario = {
              nutricionista: false,
              cuentaActiva: true,
              fechaDePausa: ""
            }
            this.firebaseSvc.setDocument('Usuarios', seRegistra.user.email, user)
            // this.firebaseSvc.setNutricionistaField(seRegistra.user.email, false)
            this.darInicio(seRegistra, false)
          } else {
            this.utilSvc.dismissLoading()
          }
          // this.correo=''
          // this.pass=''
          // this.notificarCorreo()
        }
      }
      if (result.isDismissed) {
        this.correo = ''
        this.pass = ''
        Swal.close()
      }
    })
  }

  async registrarUsuarioNuevo() {
    try {
      let registro = await this.firebaseSvc.signUp(this.correo, this.pass)
      return registro
    } catch (error) {
      if(error.message.includes(('already'))){
        this.notificarError('El usuario ya se encuentra en uso')
      } else {
        this.notificarError('Error en el proceso de registro. Intente nuevamente más tarde')
      }
      return false
    }
  }


  registrarNutri() {
    Swal.fire({
      title: 'Complete sus datos',
      heightAuto: false,
      html:
        '<input value="' + this.correo + '" id="swal-input1" class="swal2-input" placeholder= \'Correo\' style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="password" value="' + this.pass + '" id="swal-input2" class="swal2-input" placeholder= \'Contraseña\' style= "width:80%; margin:1em 0.7em 3px;">' +
        '<input type="number" value="' + this.nutri + '" id="swal-input3" class="swal2-input" placeholder= \'Matrícula\' style= "width:80%; margin:1em 0.7em 3px;">',
      focusConfirm: false,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        this.correo = (document.getElementById('swal-input1') as HTMLInputElement).value
        this.pass = (document.getElementById('swal-input2') as HTMLInputElement).value
        this.nutri = (document.getElementById('swal-input3') as HTMLInputElement).value
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.emailRegex.test(this.correo)) {
          Swal.fire({
            icon: 'error',
            text: 'Ingrese un correo válido',
            heightAuto: false
          }).then(() => {
            this.registrarNutri()
          }
          )
        } else if (this.pass.length < 6) {
          Swal.fire({
            icon: 'error',
            text: 'La contraseña debe ser de al menos 6 caracteres',
            heightAuto: false
          }).then(() => {
            this.registrarNutri()
          }
          )
        }
        else if (!this.correo || !this.pass || !this.nutri) {
          Swal.fire({
            icon: 'error',
            text: 'Debe completar todos los campos',
            heightAuto: false
          }).then(() => {
            this.registrarNutri()
          }
          )
        } else {
          //ACA SE DEBE REGISTRAR AL USUARIO
          this.registrarNutriFoto()
          // this.correo = ''
          // this.pass = ''
          // this.nutri = ''
          //this.notificarCorreo()
        }
      }
      if (result.isDismissed) {
        this.correo = ''
        this.pass = ''
        this.nutri = ''
        Swal.close()
      }
    })
  }

  registrarNutriFoto() {
    Swal.fire({
      text: "Te pedimos una foto de tu título para validar tu identidad",
      showCancelButton: true,
      confirmButtonText: "Tomar foto",
      heightAuto: false,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.almacenarTituloYRegistrar()
      }
      if (result.isDismissed) {
        this.registrarNutri()
      }
    })
  }

  almacenarTituloYRegistrar() {
    this.tomarFotografia().then(async () => {
      if (this.fotoTitulo != 'undefined') {
        this.utilSvc.presentLoading()
        const seRegistra = await this.registrarUsuarioNuevo()
        if (seRegistra) {
          let user: Usuario = {
            nutricionista: true,
            cuentaActiva: true,
            fechaDePausa: ""
          }
          let nutricionistaNuevo: Nutricionista = {
            email: this.correo,
            fotoPerfil: "",
            matricula: this.nutri,
            nombre: "",
            telefono: ""
          }
          let uid = seRegistra.user.email
          let mat = Number(this.nutri)
          await this.firebaseSvc.setDocument('Usuarios', uid, user)
          let imagepath = `${uid}/${mat}`
          let imageURL = await this.firebaseSvc.uploadImage(imagepath, this.fotoTitulo)
          await this.firebaseSvc.setMatricula(uid, Number(this.nutri), imageURL)
          await this.firebaseSvc.setDocument('Nutricionistas', this.correo, nutricionistaNuevo)
          this.darInicio(seRegistra, true)
        } else {
          this.utilSvc.dismissLoading()
        }
        // this.notificarCorreo()
        // this.fotoTitulo = ''
      } else {
        this.registrarNutriFoto()
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
    this.fotoTitulo = image.dataUrl 
  }


  mensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      text: mensaje,
      heightAuto: false
    })
  }

 async  darInicio(id: any, esNutri?: boolean) {
    let userId = id.user.uid
    let correo = id.user.email
    let nutricionista = false
    this.utilSvc.setElementInLocalStorage('usuario', userId)
    this.utilSvc.setElementInLocalStorage('correo', correo)
    if (typeof esNutri !== 'undefined'){
      await this.utilSvc.setElementInLocalStorage('nutricionista', esNutri)
      nutricionista = esNutri;
      (await this.firebaseSvc.getDocument('Usuarios', correo)).toPromise().then( async (doc) => {
        let user: Usuario = doc.data() as Usuario
        if(!user.cuentaActiva){
          let userUpdt: Usuario = {
            cuentaActiva: true,
            fechaDePausa: "",
            nutricionista: nutricionista
          }
          console.log("Se va a actualizar el usuario")
        await this.firebaseSvc.updateDocument('Usuarios', correo, userUpdt)
        }
      })}
     else {
      (await this.firebaseSvc.getDocument('Usuarios', correo)).toPromise().then(async (doc) =>{
        let user : Usuario = doc.data() as Usuario
        nutricionista = user.nutricionista
        console.log("Cuenta activa?:" + user.cuentaActiva)
        if(!user.cuentaActiva){
          let userUpdt: Usuario = {
            cuentaActiva: true,
            fechaDePausa: "",
            nutricionista: user.nutricionista
          }
          console.log("Se va a actualizar el usuario")
        await this.firebaseSvc.updateDocument('Usuarios', correo, userUpdt)
        }
      })
      await this.utilSvc.setElementInLocalStorage('nutricionista', nutricionista)

    }
    this.utilSvc.nutricionista = nutricionista
    if(nutricionista){
      this.utilSvc.dismissLoading()
      this.router.navigate(['/tabs/inicial-nutri'])
    } else {
      let referente : PacienteXNutricionista = {
        nombre: "",
        nutricionista: "",
        perfilCompleto: false,
        paciente: ""
      }
      let uid = this.utilSvc.getElementInLocalStorage('correo');
      (await this.firebaseSvc.getDocument('PacientesXNutricionista', uid)).toPromise().then(async (doc) => {
        let respuesta : PacienteXNutricionista = doc.data() as PacienteXNutricionista
        if (typeof respuesta == 'undefined') {
          let platos : PlatosXPaciente = {
            almuerzo: "",
            cena: "",
            recomendaciones: "",
            recetas: ""
          }
          let reacciones : ReaccionesXPaciente = {
            aguaBebida: "",
            caloriasIngeridas: "",
            caloriasQuemadas: "",
            fecha: ""
          }
          await this.firebaseSvc.setDocument('PacientesXNutricionista', uid, referente)
          await this.firebaseSvc.setDocument('PlatosXPaciente', uid, platos)
          await this.firebaseSvc.setDocument('ReaccionesXPaciente', uid, reacciones)
        } else {
          referente = respuesta
        }
        this.utilSvc.setElementInLocalStorage('pacienteNutricionista', referente)
        this.utilSvc.setElementInLocalStorage('msjBienvenida', false)
        this.utilSvc.dismissLoading()
        this.router.navigate(['/tabs/inicial'])
      })
    }
  }
}