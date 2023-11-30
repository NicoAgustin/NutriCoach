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
    perfilCompleto: boolean,
    paciente: string
}

export interface Nutricionista {
    email: string,
    nombre: string,
    fotoPerfil: string,
    matricula: string,
    telefono: string,
}

export interface PacienteNutri {
    nombre: string,
    correo: string
}

export interface PacienteListado {
    nombre: string,
    correo: string,
    imc: string,
    tendencia: string
}

