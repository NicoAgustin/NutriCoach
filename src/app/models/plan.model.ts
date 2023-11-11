export interface AlimentoCategoria {
    categoria: string,
    contenido: string,
    calorias: number
  }
  
 export interface RegistroAlimento{
    fecha: string,
    alimentos: AlimentoCategoria[],
    agua: number,
    caloriasTotales: number,
    caloriasQuemadas:number
  }

  export interface PlatosXPaciente {
    almuerzo: string, 
    cena: string,
    recomendaciones: string,
    recetas: string
  }

  export interface ReaccionesXPaciente {
    aguaBebida: string, 
    caloriasIngeridas: string,
    caloriasQuemadas: string, 
    fecha: string
  }

  export interface DetalleSemana {
    almuerzo: number,
    cena: number,
    desayuno: number,
    otros: number,
    merienda: number,
    caloriasTotales: number,
    agua: number,
    caloriasQuemadas: number
  }

  export interface Platos {
    plato1: string,
    plato2: string,
    plato3: string,
    plato4: string,
    plato5: string,
    plato6: string,
  }