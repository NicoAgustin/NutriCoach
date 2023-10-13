export interface RegistroMedicion {
    fecha: string,
    medicion: MedicionPaciente
  }

  export interface MedicionPaciente {
    peso: number, 
    talla: number,
    cintura: number, 
    ombligo: number,
    cadera: number
  }