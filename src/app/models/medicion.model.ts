export interface RegistroMedicion {
    fecha: string,
    medicion: MedicionPaciente
  }

  export interface RegistroMedicionNutri {
    fecha: string,
    medicion: MedicionNutri
  }

  export interface MedicionPaciente {
    peso: number, 
    talla: number,
    cintura: number, 
    ombligo: number,
    cadera: number
  }

  export interface MedicionNutri {
    peso: number,
    talla: number,
    perCabeza: number,
    perBrazoRelajado: number,
    perBrazoFlexionado: number,
    perAntebrazo: number,
    perTorax: number,
    perCintura: number,
    perCadera: number,
    perMuslo: number,
    perPantorrilla: number,
    pliTriceps: number,
    pliSubescapular: number,
    pliSupraespinal: number,
    pliAbdominal: number,
    pliMuslo: number,
    pliPantorrilla: number
  }

  // export interface MedicionNutri {
  //   peso: number, 
  //   talla: number,
  //   cintura: number, 
  //   ombligo: number,
  //   cadera: number,
  //   triceps: number,
  //   subescapular: number,
  //   supraespinal: number,
  //   abdominal: number,
  //   muslo: number,
  //   pantorrilla: number,
  //   sumaPliegues: number,
  //   scoreAdiposo: number,
  //   masaAdiposa: number,
  //   brazo: 
  // }