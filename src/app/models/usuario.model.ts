export interface Usuario {
    nutricionista: boolean,
    cuentaActiva: boolean,
    fechaDePausa: string
}

export interface Paciente {
    email: string,
    nombre: string,
    dni: string,
    obraSocial: string,
    numAfiliado: string,
    telefono: string,
    consideraciones: string,
    fotoPerfil: string
}

export interface PacienteXNutricionista {
    nombre: string,
    nutricionista: string,
    perfilCompleto: boolean
}