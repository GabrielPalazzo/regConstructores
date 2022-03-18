
type Persona = {
  nombre: string
  apellido: string
  email: string
  cuit: string
}

type Usuario = {
  "iss": string,
  "iat": string,
  "aud": string,
  "sub": string,
  cuit: string
  "GivenName": string,
  "Surname": string,
  "Email": string,
  "Role": Array<string>
}

type Apoderado = { 
  codigo?: string
  status?: 'APROBADO' | 'RECHAZADO' | null | 'EN REVISION' | 'OBSERVADO'   // APROBADO EN REVISION DESESTIMADO 
  nombre: string,
  apellido: string,
  email: string,
  nroDocumento: string,
  tipoDocumento: string,
  cuit: string
  esAdministrador: boolean
  imagenesDni: Array<Archivo>
  tipoApoderado: string
  fotosDNI: Array<Archivo>
  actaAutoridades: Array<Archivo>
  actaAdminLegitimado: Array<Archivo>
  observacionRegistro?:string
}

type Archivo = {
  createdAt: number
  cid: string
  fileName: string
  uid:string,
  name:string,
  size:number,
  type:string
}

type UbicacionGeografica ={
  lat: number
  lng: number
  slug: string
}
type DatosObraGeneral = {
  estado: string
  codigo: string
  tipoContratacion:string
  nivel:string
  fechaAdjudicacion:string
  fechaInicio:string
  fechaFin:string
  acta: Array<Archivo>
  observacionesDelRegistro ?:{
    denominacion: string
    datosGenerales: string 
  }
}
type Redeterminaciones ={
  id: string
  monto:number
  fecha:string
  descripcion:string
  archivos: Array<Archivo>
  status?: null | 'APROBADA' | 'EN REVISION' | 'OBSERVADA'
  observacionRegistro?:string
}
type AmpliacionesObras ={
  id: string
  monto:number
  fecha:string
  descripcion:string
  archivos: Array<Archivo>
  status?: null | 'APROBADA' | 'EN REVISION' | 'OBSERVADA'
  observacionRegistro?:string
}
type Certificaciones ={
  numeroCertificacion:number
  descripcion:string
  monto:number
  fecha:string
}
type CertificacionesCerradas={
  fecha:string
  monto:number
  numeroCertificacion:number
  descripcion:string
}


type DDJJObra ={
  id: string
  actasObra: Array<Archivo>
  status?:'APROBADA' | 'OBSERVADA' | 'A REVISAR' | 'RECHAZADA' | 'DESESTIMADA' | '' | 'SUPERVIZADA' | 'REVISADA' | null
  fechaAprobacion?: number
  denominacion:string
  ubicacion:Array<string>
  datosObra:Array<DatosObraGeneral>
  ubicacionGeografica:Array<UbicacionGeografica>
  ampliaciones:Array<AmpliacionesObras>
  redeterminaciones: Array<Redeterminaciones>
  certificaciones: Array<{
    status?: null | 'APROBADA' | 'EN REVISION' | 'OBSERVADA'
    observacionRegistro?:string
    codigo: string,
    monto: number
    periodo: string
    descripcion: string
    archivos:Array<Archivo>
    
  }>
  archivosOrdenDeCompra:Array<Archivo>
  plazoPorContrato:number
  prorroga:number
  archivosOrdenDeCompra:Array<Archivo>
  prorrogaNueva:Array<{
    prorrogaMeses:number
    prorrogaFecha:string
    archivosPlazos: Array<Archivo>
    status?: null | 'APROBADA' | 'EN REVISION' | 'OBSERVADA'
  }>
  transcurrido:number
  restante:number
  razonSocialUTE:string
  cuitUTE:string
  participacionUTE:string
  razonSocialComitente:string
  cuitComitente:string
  montoInicial:number
  especialidad1: string
  subEspecialidad1:Array<string>
  subEspecialidades1Otros:string
  especialidad2: string
  subEspecialidad2:Array<string>
  subEspecialidades2Otros:string
  especialidad3: string
  subEspecialidad3:Array<string>
  subespecialidades:string
  subEspecialidades3Otros:string
  observacionesDelRegistro?: { //TODO MARIA
    denominacion: string
    ubicacionGeografica: string
    transcurrido:number
    plazoPorContrato:number
    restante:number
    razonSocialUTE:string
    cuitUTE:string
    participacionUTE:string
    razonSocialComitente:string
    cuitComitente:string
    montoInicial:number
    especialidad1: string
    subEspecialidad1:Array<string>
    subEspecialidades1Otros:string
    especialidad2: string
    subEspecialidad2:Array<string>
    subEspecialidades2Otros:string
    especialidad3: string
    subEspecialidad3:Array<string>
    subespecialidades:string
    subEspecialidades3Otros:string
    datosGenerales:string
    archivosOrdenDeCompra:Array<Archivo>
    addProrroga:string
    certificacionesTitles:string
    ampliacionesTitle:string
    redeterminacionesTitle:string
    likeProrroga:string
    ubicacion:Array<string>
    ubicacionText:string
    tipoContratacion:string
    nivel:string
  }
  
}

type AutoridadEmpresa  ={
  nombre: string
  apellido: string
  tipoDocumento: string
  nroDocumento: string
  tipoOrgano: string
  tipoCargo: string
  direccion: string
  cuit: string
  inhibiciones: boolean
  observaciones: string
  fotosDNI: Array<Archivo>
}


type Ejercicio = {
  codigo?: string
  status?: 'APROBADO' | 'RECHAZADO' | null | 'EN REVISION' | 'OBSERVADO'   // APROBADO EN REVISION DES ESTIMADO 
  fechaInicio: string
  fechaCierre: string
  activoCorriente: number
  activoNoCorriente: number
  pasivoCorriente: number
  pasivoNoCorriente: number
  ventasEjercicio: number
  capitalSuscripto: number
  archivos: Array<Archivo>
  archivosActaAsamblea: Array<Archivo>,
  observacionRegistro?:string
}


type TramiteAlta = {
  _id?: string,
  creatorId: Usuario,
  inscripcionAFIPConstancia: Array<Archivo>
  revisiones?: Array<RevisionTramite>
  id: string
  createdAt?: Date
  submitedAt?: Date
  razonSocial: string
  nombreTitular: string
  apellidoTitular: string
  esCasadoTitular: boolean
  nombreConyuge: string
  apellidoConyuge: string
  tipoDocumentoConyuge: string
  documentoConyugue: string
  archivoDocConyuge: Array<Archivo>
  personeria: 'PF' | 'SA' | 'SRL' | 'Cooperativa' | 'UTE' | 'PJESP' | 'OFS' | ''
  tipoEmpresa: []
  emailInstitucional: string
  cuit: string
  nroLegajo: string
  asignadoA?: Usuario
  tipoEmpresa: {
    label: string
    value: string
    option: string
  }
  apoderados: Array<Apoderado>
  statusObs?: Array<{
    attribute: string
    obs: string
  }>
  categoria: 'PRE INSCRIPTO' | 'INSCRIPTO' | 'DESACTUALIZADO' | 'INSCRIPTO CON ACTUALIZACION'
  status: "BORRADOR" | "OBSERVADO" | "VERIFICADO" | "PENDIENTE DE REVISION" | "A SUPERVISAR" | "SUBSANADO" | "PENDIENTE DE APROBACION" | "EN REVISION" | "SUBSANADO EN REVISION" | "SUBSANADO A SUPERVISAR"
  subCategoria: 'ACTUALIZACION' | 'INSCRIPCION'
  rechazos:Array<{
    rechazadoPor: Usuario
    fecha: number
    motivo: string
  }>
  propietario: Usuario
  certificadoFiscal: Archivo
  email: string
  ieric: string
  vtoIeric: string
  archivoIERIC: Array<Archivo>
  domicilioReal: string
  domicilioLegal: string
  telefono: string
  telefonoAlternativo:string
  constanciaDomicilioLegal: Array<Archivo>
  registroPublicoDeComercio: string
  archivoPropietarios:Array<Archivo>
  archivoPropietarios2:Array<Archivo>
  igj: string
  rubroConstruccion: {
    lugar: string,
    fecha: string
    datos: string
  }
  inversionesPermanentes: Array<{
    cuitNit: string,
    empresaParticipada:string,
    actividad: string,
    porcentajeCapital:number,
    votos:number,
  }>
  autoridadesVencimiento: boolean
  autoridadesFechaVencimiento: string
  autoridadesSociedad: Array<{
    nombre: string
    apellido: string
    tipoDocumento: string
    nroDocumento: string
    tipoOrgano: string
    tipoCargo: string
    direccion: string
    cuit: string
    inhibiciones: boolean
    observaciones: string
    fotosDNI: Array<Archivo>
  }>
  sistemaCalidad: Array<{
    cuit: string,
    norma: string,
    direccion: string,
    fechaOtorgamiento: string
    fechaExpiracion: string
    archivos: Array<Archivo>
  }>
  propietarios: Array<{
    titular: string,
    cuit: string,
    porcentajeCapital: number
    montoCapital: number
    cantidadVotos: number
    tipoPersoneria: string
    observaciones: string
    archivos: Array<Archivo>
  }>,
  ejercicios: Array<Ejercicio>,
  ddjjObras: Array<DDJJObra>,
  matriculaComerciante: {
    datos: string,
    fecha: string,
    archivo?: Archivo
  },
  altaAFIP: {
    datos: string,
    fecha: string,
    archivo?: Archivo
  },
  ultimaModificacionMatriculaOActividadesAFIP: {
    datos: string,
    fecha: string,
    archivo?: Archivo
  },
  fechaInscripcionMatriculaComerciante: string
  aplicaDecretoDoscientosDos: boolean
  datosDecretoDoscientosDos: Array<{
    razonSocial: string
    cuit: string
    tipoFuncionario: string
    tipoVinculo: string
    observaciones: string
  }>,
  poseeIERIC: boolean
  datosSocietarios: {
    fechaInscripcion: string,
    fechaVencimiento: string,
    archivoAutoridades: Array<Archivo>,
    cooperativa : {
      archivoActaConstitutiva: Array<Archivo>
      inscriptionINAES: {
        datos:string
        fecha:string
      }
      modificacionINAES: {
        datos:string
        fecha: string
        archivos: Array<Archivo>
      }
      ultimaModifcacionINAES: {
        datos: string
        fecha: string
        archivos: Array<Archivo>
      }
    }
    sociedadAnonima: {
      contrato: {
        fecha: string
        archivos: Array<Archivo>
      }
      inscripcion: {
        datos: string
        fecha: string
      }
      modificacion: {
        datos: string
        fecha: string
        archivos: Array<Archivo>
      }
      ultimaModificacion:{
        datos: string
        fecha: string
        archivos: Array<Archivo>
      }
    }
    ute: {
      archivosContrato: Array<Archivo>
      inscripcionUTE: {
        datos:string
        fecha: string
      },
      modificacionUTE: {
        datos: string
        fecha:string
        archivos: Array<Archivo>
      }
    }
    PJESP: {
      archivosContrato: Array<Archivo>
      archivoModificacion: Array<Archivo>
      archivoUltimaModificacion: Array<Archivo>
      inscripcionConstitutiva: {
        datos:string
        fecha: string
      },
      inscripcionSucursal: {
        datos:string
        fecha: string
      },
      modifcicacionObjeto: {
        datos:string
        fecha: string
      },
      ultimaModificacionInscripcion: {
        datos:string
        fecha: string
      },
      fechaVencimiento: {
        fecha: string
      },
    }
    personaFisica: {
      constanciaInscripcion: Array<Archivo>,
      constanciaMatriculaComerciante: Array<Archivo>
    }
  }
  aprobacion?:{
    aprobadoPor: Usuario,
    aprobadoAt: number,
    
  }
  supervision?:{
    supervisadoPor: Usuario,
    supervisadoAt: number 
  }
  userBackoffice?:{
    userPor: Usuario,
    userDate:number
  }
  cantidadObservado?: number,
  cantidadSubsanado?:number,
 
}

type ValidatorErrorElement = {
  attribute: string
  dataId: string
  error: string
}

type CertificadoCapacidad = {
  _id?:string
  tramite: TramiteAlta,
  otorgadoPor: {
    usuario: Usuario,
    fecha: number
  }
  vigencia: {
    fechaDesde: number,
    fechaHasta: number
  }
  status:'VIGENTE' | 'SUSPENDIDO' | 'SANCIONADO'
  capacidadFinanciera: number
  capacidadEjecucion: number
  datosSancion?:{
    usuario: Usuario
    motivo: string
    referencia: string
  }
  evidencia?:any
}

type RevisionTramite ={
  version: number
  creator: Usuario
  status: 'ABIERTA' | 'CERRADA',
  reviews:Array<{
    field: string
    review: string
    isOk: boolean
  }>
}
