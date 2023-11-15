import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';
import { MedicionNutri, RegistroMedicionNutri } from 'src/app/models/medicion.model';

@Component({
  selector: 'app-mediciones-nutri',
  templateUrl: './mediciones-nutri.page.html',
  styleUrls: ['./mediciones-nutri.page.scss'],
})
export class MedicionesNutriPage implements OnInit {

  nombre: string = this.utilSvc.getElementInLocalStorage('paciente-nombre')
  correo: string = this.utilSvc.getElementInLocalStorage('paciente-correo')
  medicion: MedicionNutri = {
    peso: 0,
    talla: 0,
    perCabeza: 0,
    perBrazoRelajado: 0,
    perBrazoFlexionado: 0,
    perAntebrazo: 0,
    perTorax: 0,
    perCintura: 0,
    perCadera: 0,
    perMuslo: 0,
    perPantorrilla: 0,
    pliTriceps: 0,
    pliSubescapular: 0,
    pliSupraespinal: 0,
    pliAbdominal: 0,
    pliMuslo: 0,
    pliPantorrilla: 0
  }
  registroMediciones: RegistroMedicionNutri[] = []
  mediciones: RegistroMedicionNutri[]
  sumaPliegues: number = 0
  scoreAdiposa: number = 0
  masaAdiposa: number = 0
  perBrazoCor: number = 0
  perAntebrazoCor: number = 0
  perMusloCor: number = 0
  perPantoCor: number = 0
  perToraxCor: number = 0
  sumaPerCor: number = 0
  scoreMuscular: number = 0
  masaMuscular: number = 0

  imc: any

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilsService
  ) { }

  ngOnInit() {
    // this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
    // this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
    // console.log("Se ejecuta onInit")
    // this.utilSvc.presentLoading()
    // this.registroMediciones = []
    // this.inicializar()
    // this.getMediciones()
  }

  ionViewWillEnter() {
    // if (this.correo !== this.utilSvc.getElementInLocalStorage('paciente-correo')) {
      console.log("Se ejecuta ionView")
      this.nombre = this.utilSvc.getElementInLocalStorage('paciente-nombre');
      this.correo = this.utilSvc.getElementInLocalStorage('paciente-correo');
      this.utilSvc.presentLoading()
      this.inicializar()
      this.registroMediciones = []
      this.getMediciones()
   // }
  }

  inicializar() {
    this.sumaPliegues = 0
    this.scoreAdiposa = 0
    this.masaAdiposa = 0
    this.perBrazoCor = 0
    this.perAntebrazoCor = 0
    this.perMusloCor = 0
    this.perPantoCor = 0
    this.perToraxCor = 0
    this.sumaPerCor = 0
    this.scoreMuscular = 0
    this.masaMuscular = 0
  }

  async getMediciones() {
    this.registroMediciones = []
    await this.firebaseSvc.getRegistroNutri(this.correo, 'Mediciones', 'registrosNutri').then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let r: RegistroMedicionNutri
        r = doc.data() as RegistroMedicionNutri
        this.registroMediciones.push(r)
      })
    })
    if (this.registroMediciones.length > 0) {
      this.registroMediciones.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaA.getTime() - fechaB.getTime();
      });
      this.registroMediciones.reverse()
      this.imc = (this.registroMediciones[0].medicion.peso / (this.registroMediciones[0].medicion.talla / 100) ** 2).toFixed(2)  //ultimoRegistro.medicion.peso / (ultimoRegistro.medicion.talla/100)**2
      this.calcularIndicadores()
    }

    setTimeout(() => {
      console.log("Mediciones: ")
      console.log(this.registroMediciones)
      this.utilSvc.dismissLoading()
    }, 1000);
  }

  calcularIndicadores() {
    if (this.registroMediciones.length > 0) {
      let registro: MedicionNutri = this.registroMediciones[0].medicion
      this.sumaPliegues = Number((registro.pliAbdominal + registro.pliMuslo + registro.pliPantorrilla + registro.pliSubescapular + registro.pliSupraespinal + registro.pliTriceps).toFixed(2))
      this.scoreAdiposa = Number((((this.sumaPliegues * (170.18 / registro.talla)) - 116.41) / 34.79).toFixed(2))
      this.masaAdiposa = Number((((this.scoreAdiposa * 5.85) + 25.6) / ((170.18 / registro.talla) ** 3)).toFixed(2))
      this.perBrazoCor = registro.perBrazoRelajado - ((registro.pliTriceps * 3.141) / 10)
      this.perAntebrazoCor = registro.perAntebrazo
      this.perMusloCor = registro.perMuslo - ((registro.pliMuslo * 3.141) / 10)
      this.perPantoCor = registro.perPantorrilla - ((registro.pliPantorrilla * 3.141) / 10)
      this.perToraxCor = registro.perTorax - ((registro.pliSubescapular * 3.141) / 10)
      this.sumaPerCor = Number((this.perAntebrazoCor + this.perBrazoCor + this.perMusloCor + this.perPantoCor + this.perToraxCor).toFixed(2))
      this.scoreMuscular = Number((((this.sumaPerCor * (170.18 / registro.talla)) - 207.21) / 13.74).toFixed(2))
      this.masaMuscular = Number((((this.scoreMuscular * 5.4) + 24.5) / ((170.18 / registro.talla) ** 3)).toFixed(2))
      console.log("Per. Brazo Corregido: " + this.perBrazoCor);
      console.log("Per. perAntebrazoCor: " + this.perAntebrazoCor);
      console.log("Per. perMusloCor: " + this.perMusloCor);
      console.log("Per. perPantoCor: " + this.perPantoCor);
      console.log("Per. perToraxCor: " + this.perToraxCor);
      console.log("Per. sumaPerCor: " + this.sumaPerCor);
      console.log("Fecha: " + this.registroMediciones[0].fecha)
      console.log("Suma pliegues: " + this.sumaPliegues)
      console.log("Score Adiposa: " + this.scoreAdiposa)
      console.log("Masa adiposa: " + this.masaAdiposa)
      console.log("Masa adiposa: " + this.masaAdiposa)
      console.log("Masa muscular: " + this.masaMuscular)
    }
  }

  calcularPosicionFlecha() {
    let seccion = 0;

    if (this.imc < 18.5) {
      seccion = 1;
    } else if (this.imc < 25) {
      seccion = 2;
    } else {
      seccion = 3;
    }

    let anchoSeccion = 100 / 3;
    let centroSeccion = (seccion - 0.5) * anchoSeccion;
    return `calc(${centroSeccion}% - 7.5px)`;
  }

  volver() {
    this.router.navigate(['/tabs/opciones-paciente-nutri'])
  }

  verMediciones() {
    this.router.navigate(['/tabs/mediciones-paciente-nutri'])
  }

  tomarMediciones() {
    this.router.navigate(['/tabs/mediciones-a-tomar-nutri'])
  }

  verHistorico() {
    this.router.navigate(['/tabs/mediciones-historico-nutri'])
  }
}
