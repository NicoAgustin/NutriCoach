import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public nutricionista: boolean = false;

  constructor(
    private loadingController: LoadingController
  ) { }

  //Funciones de loading
  async presentLoading(opts? : LoadingOptions) {
    const loading = await this.loadingController.create(opts);
    await loading.present();
  }
  async dismissLoading(){
    return this.loadingController.dismiss()
  }

  //Funciones de almacenamiento en localstorage
  setElementInLocalStorage(key: string, element: any){
    return localStorage.setItem(key, JSON.stringify(element))
  }
  getElementInLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key))
  }

  clearLocalStorage(){
    localStorage.clear()
  }

  getFechaDesde(meses: number){
    const mesesAtras = new Date();
    mesesAtras.setMonth(mesesAtras.getMonth() - meses);

    // Formatear la fecha a "YYYYMMDD"
    const year = mesesAtras.getFullYear();
    const month = (mesesAtras.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 porque en JavaScript los meses van de 0 a 11
    const day = mesesAtras.getDate().toString().padStart(2, '0');
    const fechaMesesAtras = `${year}-${month}-${day}`;
    return fechaMesesAtras
  }
}
