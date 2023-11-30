import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'NutriCoach',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      //launchShowDuration: 3000,
      launchAutoHide: false,
      backgroundColor: '#6FBC42',
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true
    },
    "@capacitor/screen-orientation": {
      "preferredScreenOrientation": "portrait"
    }
  },
};

export default config;
