import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';


register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
  ) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      await SplashScreen.hide();
      //this.oneSignalPushService.configuracion();
    });
  }
}