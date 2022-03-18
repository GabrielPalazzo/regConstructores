import { getTimeProps } from 'antd/lib/date-picker/generatePicker'
import axios from 'axios'
import * as jwt from "jsonwebtoken"
import _ from 'lodash'
import moment from 'moment'
import { customAlphabet, nanoid } from 'nanoid'
import { CalculadoraCapacidad } from 'rnc-main-lib'



export const getToken = () => {
  return localStorage.getItem('token') ? localStorage.getItem('token') : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSZWdpc3RybyBkZSBDb25zdHJ1Y3RvcmVzIiwiaWF0IjoxNjA3ODY4NDE0LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoibGVvbmFyZG9sZWVuZW5AZ21haWwuY29tIiwiR2l2ZW5OYW1lIjoiUGFibG8gIiwiU3VybmFtZSI6Ikxlc2Nhbm8iLCJjdWl0IjoiMjAzNjc2MjgzNzYiLCJFbWFpbCI6Imxlc2Nhbm9wQGplZmF0dXJhLmdvYi5hciIsIlJvbGUiOlsiSkVGRSBSRUdJU1RSTyJdfQ.S_nPHiFUCMrGsO30pslXrXRqXaAQk9HyS4K3rIGchfU'
}

export const setToken = (token) => {
  localStorage.setItem('token', token)
}
export const saveTramiteService = (tramite: TramiteAlta): Promise<TramiteAlta> => {
  return axios.post('/api/tramite', tramite, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  }).then((createdTramite) => {
    return createdTramite.data
  })
}

export const getTramitesParaVerificar = (): Promise<Array<TramiteAlta>> => {
  return axios.get('/api/tramite/getTramitesParaVerificar', {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  }).then((tramites) => {
    return tramites.data['tramites'] as any
  })
}


export const getTramites = (): Promise<Array<TramiteAlta>> => {
  return axios.get('/api/tramites', {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  }).then((tramites) => {
    return tramites.data['tramites'] as any
  })
}

export const getTramiteByCUIT = (cuit: string): Promise<TramiteAlta> => {
  return axios.get(`/api/tramite/find?cuit=${cuit}`, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  }).then((t) => {
    return t.data.tramite as TramiteAlta
  }).catch(err => {
    return null
  })
}

export const getTramiteByID = (_id: string): Promise<TramiteAlta> => {
  return axios.get(`/api/tramite/findById?_id=${_id}`, {
   
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  }).then((t) => {
    return t.data.tramite as TramiteAlta
  }).catch(err => {
    return null
  })
}

export const getCertificados = (cuit: string , token: string = null): Promise<any> => {
  return axios.get(`/api/certificado?cuit=${cuit}`, {
    headers: {
      Authorization: 'Bearer ' + token || getToken() 
    }
  }).then((t) => {
    return t.data.certificados
  }).catch(err => {
    return null
  })
}


export const migrarCertificados = async (key: string) => {
  return axios.get(`/api/certificado/migrador`, {
    headers: {
      Authorization: 'Bearer ' + getToken(),
      AuthorizationKey: key
    }
  }).then((t) => {
    return t.data.certificados
  }).catch(err => {
    return null
  })
}

export const migrarEmpresa = async (idProveedor: string, key: string) => {
  return axios.post(`/api/migrador`, { idProveedor, key }, {
    headers: {
      Authorization: 'Bearer ' + getToken(),
      AuthorizationKey: key
    }
  }).then((t) => {
    return t.data
  }).catch(err => {
    return null
  })
}

export const eliminarBorrador = async (tramite: TramiteAlta) => {
  return axios.get(`/api/tramite/remove?id=${tramite._id}`, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  })
}

export const rechazarTramite = (tramite: TramiteAlta, motivo: string) => {
  if (!tramite.rechazos)
    tramite.rechazos = []

  tramite.rechazos.push({
    rechazadoPor: getUsuario().userData(),
    fecha: new Date().getTime(),
    motivo
  })

  tramite.status = 'BORRADOR'
  return saveTramiteService(tramite)

}

export const getEmptyTramiteAlta = (): TramiteAlta => {
  return {
    rechazos: [],
    apoderados: [],
    creatorId: null,
    inscripcionAFIPConstancia: [],
    certificadoFiscal: null,
    cuit: '',
    telefono: '',
    telefonoAlternativo: '',
    email: '',
    id: '',
    ieric: '',
    nroLegajo: '',
    personeria: '',
    propietario: null,
    propietarios: [],
    emailInstitucional: '',
    razonSocial: '',
    nombreTitular: '',
    apellidoTitular: '',
    esCasadoTitular: false,
    nombreConyuge: '',
    apellidoConyuge: '',
    archivoDocConyuge:[],
    tipoDocumentoConyuge: '',
    documentoConyugue: '',
    status: 'BORRADOR',
    categoria: 'PRE INSCRIPTO',
    subCategoria: 'INSCRIPCION',
    tipoEmpresa: [],
    vtoIeric: '',
    archivoIERIC: [],
    registroPublicoDeComercio: '',
    igj: '',
    domicilioLegal: '',
    constanciaDomicilioLegal: [],
    domicilioReal: '',
    archivoPropietarios: [],
    archivoPropietarios2: [],
    rubroConstruccion: {
      lugar: '',
      fecha: '',
      datos: ''
    },
    autoridadesSociedad: [],
    autoridadesFechaVencimiento:'',
    inversionesPermanentes: [],
    autoridadesVencimiento: false,
    sistemaCalidad: [],
    ejercicios: [],
    ddjjObras: [],
    fechaInscripcionMatriculaComerciante: '',
    aplicaDecretoDoscientosDos: false,
    datosDecretoDoscientosDos: [],
    matriculaComerciante: {
      datos: '',
      fecha: ''
    },
    altaAFIP: {
      datos: '',
      fecha: ''
    },
    ultimaModificacionMatriculaOActividadesAFIP: {
      datos: '',
      fecha: ''
    },
    poseeIERIC: false,
    datosSocietarios: {
      cooperativa: {
        archivoActaConstitutiva: [],
        inscriptionINAES: {
          datos: '',
          fecha: ''
        },
        modificacionINAES: {
          datos: '',
          fecha: '',
          archivos: []
        },
        ultimaModifcacionINAES: {
          datos: '',
          fecha: '',
          archivos: []
        },
      },
      sociedadAnonima: {
        inscripcion: {
          datos: '',
          fecha: '',

        },
        modificacion: {
          datos: '',
          fecha: '',
          archivos: []
        },
        ultimaModificacion: {
          datos: '',
          fecha: '',
          archivos: []
        },

        contrato: {
          fecha: '',
          archivos: []
        }
      },
      ute: {
        archivosContrato: [],
        inscripcionUTE: {
          datos: '',
          fecha: ''
        },
        modificacionUTE: {
          fecha: '',
          datos: '',
          archivos: []
        }
      },
      PJESP: {
        archivosContrato: [],
        archivoModificacion: [],
        archivoUltimaModificacion: [],
        inscripcionConstitutiva: {
          datos: '',
          fecha: ''
        },
        inscripcionSucursal: {
          datos: '',
          fecha: ''
        },
        modifcicacionObjeto: {
          datos: '',
          fecha: ''
        },
        ultimaModificacionInscripcion: {
          datos: '',
          fecha: ''
        },
        fechaVencimiento: {
          fecha: ''
        }

      },
      personaFisica: {
        constanciaInscripcion: [],
        constanciaMatriculaComerciante: [],
      },
      fechaInscripcion: '',
      fechaVencimiento: '',
      archivoAutoridades: []
    }
  }
}

export const getEmptyObras = (): DDJJObra => {
  return {
    id: null,
    actasObra: [],
    denominacion: '',
    ubicacion: [],
    datosObra: [],
    ampliaciones: [],
    ubicacionGeografica: [],
    razonSocialUTE: '',
    cuitUTE: '',
    participacionUTE: '',
    razonSocialComitente: '',
    cuitComitente: '',
    montoInicial: 0,
    redeterminaciones: [],
    certificaciones: [],
    plazoPorContrato: 0,
    prorroga: 0,
    transcurrido: 0,
    restante: 0,
    especialidad1: '',
    especialidad2: '',
    especialidad3: '',
    subEspecialidades1Otros: '',
    subEspecialidades2Otros: '',
    subEspecialidades3Otros: '',
    subEspecialidad1: [],
    subEspecialidad2: [],
    subEspecialidad3: [],
    subespecialidades: '',
    archivosOrdenDeCompra: [],
    prorrogaNueva: [],
  }
}

export const getColorStatus = (tramite: TramiteAlta) => {
  if (!tramite) return 'gray'

  switch (tramite.status) {
    case 'BORRADOR':
      return 'purple'
    case 'VERIFICADO':
      return 'green'
    case 'OBSERVADO':
      return 'gray'
    default:
      return 'blue'
  }
}

export const getStatusObsParsed = (tramite: TramiteAlta): string => {
  return tramite && tramite.statusObs ? tramite.statusObs.map(e => e.obs).join(', ') : 'No tiene observaciones'
}

export const getUsuario = () => {
  let user: any = null
  const token = localStorage.getItem('token')

  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET as string, (err, decode) => {
      if (err) return null
      user = decode
    })
  }

  return {
    userData: () => user,
    isConstructor: () => user && user.Role.filter(r => r === 'CONSTRUCTOR').length > 0,
    isBackOffice: () => user && user.Role.filter(r => r === 'EVALUADOR ECONOMICO' || r === 'EVALUADOR TECNICO' || r === 'CONTROLADOR ECONOMICO' || r === 'CONTROLADOR TECNICO' || r === 'JEFE REGISTRO' || r === 'SUPERVISOR').length > 0,
    isControlador: () => user && user.Role.filter(r => _.includes(['EVALUADOR ECONOMICO', 'EVALUADOR TECNICO'], r)).length > 0,
    isSupervisor: () => user && user.Role.filter(r => r.includes('SUPERVISOR')).length > 0,
    isAprobador: () => user && user.Role.filter(r => r === 'JEFE REGISTRO').length > 0
  }
}

export const isInReview = (tramite: TramiteAlta) => {

  if (!tramite.revisiones || !tramite.asignadoA)
    return false

  return tramite.asignadoA.cuit === getUsuario().userData().cuit

}

export const getReviewAbierta = (tramite: TramiteAlta): RevisionTramite => {
  if (!tramite) return null

  return tramite.revisiones ? _.last(tramite.revisiones
    .filter(r => r && !_.isEmpty(r.reviews.filter(review => !review.isOk)))) : null
}

export const closeSession = () => {
  localStorage.clear()
}

export const isConstructora = (tramite: TramiteAlta): boolean => {
  if (!tramite.tipoEmpresa) return false
  return tramite.tipoEmpresa.filter(te => te === 'CONSTRUCTORA').length === 1
}

export const requiereBalance = (tramite: TramiteAlta): boolean => {
  if (tramite.personeria === 'UTE') return false
  return true
}

export const requiereObras = (tramite: TramiteAlta): boolean => {
  if (tramite.personeria === 'UTE') return false
  return true
}

export const isPersonaFisica = (tramite: TramiteAlta): boolean => {
  return tramite.personeria === 'PF'
}

export const isPersonaExtranjera = (tramite: TramiteAlta): boolean => {
  return tramite.personeria === 'PJESP'
}

export const isTramiteEditable = (tramite: TramiteAlta): boolean => {
  return (tramite && tramite.status === 'BORRADOR')  ||(tramite && tramite.status === 'OBSERVADO') || (tramite && !tramite.cuit) || (!tramite)
}



const aprobarTramite = async (tramite: TramiteAlta): Promise<CertificadoCapacidad> => {

  return axios.post('/api/tramite/aprobar', tramite, {
    headers: {
      Authorization: 'Bearer ' + getToken()
    }
  }).then((certificado) => {
    return certificado.data
  })
}

export const sendTramite = async (tramite: TramiteAlta): Promise<TramiteAlta> => {


  if ((tramite.categoria === 'PRE INSCRIPTO' || tramite.categoria === 'DESACTUALIZADO') && (getUsuario().isConstructor())) {
    tramite.creatorId = getUsuario().userData()
  }

  if (tramite.status === 'BORRADOR') {
    tramite.status = "PENDIENTE DE REVISION"
    return saveTramiteService(tramite)
  }
  
  


  if (getUsuario().isAprobador()) {
    if (getReviewAbierta(tramite)) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado = tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
      return saveTramiteService(tramite)
    } else {
      const certificado = await aprobarTramite(tramite)
      return certificado.tramite
    }

  }

  
  
  
  


  if (tramite.status === 'PENDIENTE DE REVISION' && getUsuario().isBackOffice()) {
    if (getReviewAbierta(tramite).reviews.filter(r => !r.isOk).length > 0) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado =  tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
      tramite.userBackoffice = {
        userPor: getUsuario().userData(),
        userDate: new Date().getTime()
      }
    } else{
      tramite.status = 'A SUPERVISAR'
    tramite.asignadoA = null
   
    }
    return saveTramiteService(tramite)
    
  }

  if (tramite.status === 'EN REVISION' && getUsuario().isBackOffice()) {
    if (getReviewAbierta(tramite).reviews.filter(r => !r.isOk).length > 0) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado =  tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
      tramite.userBackoffice = {
        userPor: getUsuario().userData(),
        userDate: new Date().getTime()
      }
     } else{
    tramite.status = 'A SUPERVISAR'
    tramite.asignadoA = null
   }
    
    return saveTramiteService(tramite)
  }
 

  if (tramite.status === 'OBSERVADO' && getUsuario().isConstructor()) {
    tramite.status = 'SUBSANADO'
    tramite.cantidadSubsanado = tramite && tramite.cantidadSubsanado ? tramite.cantidadSubsanado + 1 : 1
    tramite.asignadoA = tramite.supervision && tramite.supervision.supervisadoPor ? tramite.supervision.supervisadoPor :  tramite.userBackoffice && tramite.userBackoffice.userPor
   return saveTramiteService(tramite)
  }

  if ((tramite.status === 'SUBSANADO') && (getUsuario().isBackOffice())) {
    if (getReviewAbierta(tramite).reviews.filter(r => !r.isOk).length > 0) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado =  tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
      tramite.userBackoffice = {
        userPor: getUsuario().userData(),
        userDate: new Date().getTime()
      }
    } else{
      tramite.status = 'SUBSANADO A SUPERVISAR'
    tramite.asignadoA = null
   
    }
    return saveTramiteService(tramite)
    
    
  }


  if ((tramite.status === 'SUBSANADO EN REVISION') && (getUsuario().isBackOffice())) {
    tramite.status = 'SUBSANADO A SUPERVISAR' 
    tramite.asignadoA = null
    return saveTramiteService(tramite)
  }
  

  if (tramite.status === 'SUBSANADO A SUPERVISAR' && getUsuario().isSupervisor() || tramite.status === 'SUBSANADO A SUPERVISAR' && getUsuario().isAprobador() ) {
    if (getReviewAbierta(tramite) && getReviewAbierta(tramite).reviews.filter(r => !r.isOk).length > 0) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado =  tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
   
      tramite.supervision = {
        supervisadoPor: getUsuario().userData(),
        supervisadoAt: new Date().getTime()
      }
    } else {
      tramite.status = 'PENDIENTE DE APROBACION'
      //tramite.revisiones=[]
    }
    tramite.asignadoA = null
    tramite.supervision = {
      supervisadoPor: getUsuario().userData(),
      supervisadoAt: new Date().getTime()
    }
    return saveTramiteService(tramite)
  }


  if (tramite.status === 'SUBSANADO EN REVISION' && getUsuario().isSupervisor()  ) {
    if (getReviewAbierta(tramite).reviews.filter(r => !r.isOk).length > 0) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado =  tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
   
      tramite.userBackoffice = {
        userPor: getUsuario().userData(),
        userDate: new Date().getTime()
      }
    } else {
      tramite.status = 'PENDIENTE DE APROBACION'
      //tramite.revisiones=[]
    }
    tramite.asignadoA = null
    tramite.supervision = {
      supervisadoPor: getUsuario().userData(),
      supervisadoAt: new Date().getTime()
    }
    return saveTramiteService(tramite)
  }
 

  
  if (tramite.status === 'A SUPERVISAR' && getUsuario().isSupervisor()) {
    if (getReviewAbierta(tramite).reviews.filter(r => !r.isOk).length > 0) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado =  tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
   
      tramite.supervision = {
        supervisadoPor: getUsuario().userData(),
        supervisadoAt: new Date().getTime()
      }
    } else {
      tramite.status = 'PENDIENTE DE APROBACION'
      //tramite.revisiones=[]
    }
    tramite.asignadoA = null
    tramite.supervision = {
      supervisadoPor: getUsuario().userData(),
      supervisadoAt: new Date().getTime()
    }
    return saveTramiteService(tramite)
  }

  if (tramite.status === 'PENDIENTE DE APROBACION') {
    if (getReviewAbierta(tramite).reviews.filter(r => !r.isOk).length > 0) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado =  tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
   
      tramite.asignadoA = null
    } else {
      tramite.categoria = 'INSCRIPTO'
      tramite.status = 'VERIFICADO'
      //tramite.revisiones=[]
    }
    return saveTramiteService(tramite)
  }


  
  if (tramite.status === 'EN REVISION' ) {
    if (getReviewAbierta(tramite).reviews.filter(r => !r.isOk).length > 0) {
      tramite.status = 'OBSERVADO'
      tramite.cantidadObservado =  tramite.cantidadObservado && tramite.cantidadObservado ? tramite.cantidadObservado + 1 : 1
   
      tramite.userBackoffice = {
        userPor: getUsuario().userData(),
        userDate: new Date().getTime()
      }
    } else {
      tramite.categoria = 'INSCRIPTO'
      tramite.status = 'VERIFICADO'
      //tramite.revisiones=[]
    }
    return saveTramiteService(tramite)
  }
 
 
  


}

export const getObservacionesTecnicoRaw = (revisionTramite: RevisionTramite): string => {
  return revisionTramite ? revisionTramite.reviews.filter(r => !r.isOk).map(r => r.review).join(', ') : ''
}

export const allowGuardar = (tramite: TramiteAlta) => {

  if (['BORRADOR', 'OBSERVADO'].includes(tramite.status) && getUsuario().isConstructor())
    return true

  if (getUsuario().isControlador() && [ 'PENDIENTE DE REVISION','EN REVISION', 'SUBSANADO','SUBSANADO A SUPERVISAR','SUBSANADO EN REVISON'].includes(tramite.status) && (tramite.asignadoA && tramite.asignadoA.cuit === getUsuario().userData().cuit))
    return true
  
    if (getUsuario().isBackOffice() && ['PENDIENTE DE REVISION', 'EN REVISION', 'SUBSANADO', 'A SUPERVISAR', 'SUBSANADO A SUPERVISAR','SUBSANADO EN REVISION'].includes(tramite.status) && (tramite.asignadoA && tramite.asignadoA.cuit === getUsuario().userData().cuit))
    return true
  if (getUsuario().isSupervisor() && ['PENDIENTE DE REVISION', 'EN REVISION', 'SUBSANADO', 'A SUPERVISAR', 'SUBSANADO A SUPERVISAR','SUBSANADO EN REVISON'].includes(tramite.status) && (tramite.asignadoA && tramite.asignadoA.cuit === getUsuario().userData().cuit))
    return true

  if (getUsuario().isAprobador() && ['PENDIENTE DE REVISION','EN REVISION', 'SUBSANADO', 'A SUPERVISAR', 'A APROBAR', 'SUBSANADO A SUPERVISAR','SUBSANADO EN REVISON'].includes(tramite.status) && (tramite.asignadoA && tramite.asignadoA.cuit === getUsuario().userData().cuit))
    return true




  return false
}

export const getCodigoObra = () => {
  const nanoid = customAlphabet('1234567890abcdef', 10)
  return nanoid().toUpperCase()
}

export const getUniqCode = () => {
  const nanoid = customAlphabet('1234567890abcdef_=?@#', 10)
  return nanoid().toUpperCase()
}

export const generarCertificado = async (tramite: TramiteAlta, usuario: Usuario, db): Promise<CertificadoCapacidad> => {

  const calculadora = new CalculadoraCapacidad(tramite)
  await calculadora.init()
  const capacidadEjecucion = calculadora
    .getMontoCertificacionesPorPeriodo()
    .aplicarIndiceCorreccion()
    .ordenarMontoDescendente()
    .tomarLosTresPrimerosElementos()
    .aplicarPromedioLineal()
    .aplicarIndicesEconomicos()

  const capacidadFinanciera = _.isEmpty(tramite.ddjjObras) ? capacidadEjecucion :
    capacidadEjecucion - calculadora.filtrarObrasCandidatas()
      .value
      .map(obra => {
        return calculadora.getCompromiso(obra)
      })
      .reduce((acc, val) => acc += val, 0)



  const certificado: CertificadoCapacidad = {
    _id: nanoid(),
    tramite,
    otorgadoPor: {
      usuario,
      fecha: new Date().getTime()
    },
    vigencia: {
      fechaDesde: new Date().getTime(),
      fechaHasta: moment().add(1, 'year').toDate().getTime()
    },
    status: 'VIGENTE',
    capacidadEjecucion,
    capacidadFinanciera,
  }

  await db.collection('certificadosOtorgados').save(certificado);
  return certificado

}


export const cambiarADesActualizado = async (tramite: TramiteAlta): Promise<TramiteAlta> => {
  
  delete tramite["_id"]
  tramite.categoria = 'DESACTUALIZADO'
  tramite.subCategoria ='ACTUALIZACION'
  tramite.status = 'BORRADOR'
  //await saveTramiteService(tramite)
  return tramite = await saveTramiteService(tramite)
}



export const calcularSaldoObra = (obra: DDJJObra) => {

  const sumaRedeterminaciones = obra.redeterminaciones && obra.redeterminaciones.length !== 0 || obra.redeterminaciones && obra.redeterminaciones.length === 0 ? obra.redeterminaciones.map(r => parseInt(r.monto.toFixed(2), 10)).reduce((acc, val) => acc += val, 0) : 0
  const sumaAmpliaciones = obra.ampliaciones && obra.ampliaciones.length !==  0 || obra.ampliaciones && obra.ampliaciones.length ===  0 ? obra.ampliaciones.map(a => parseInt(a.monto.toFixed(2), 10)).reduce((acc, val) => acc += val, 0) : 0
  const sumaCertifcaciones = obra.certificaciones && obra.certificaciones.length !== 0 || obra.certificaciones && obra.certificaciones.length === 0 ? obra.certificaciones.map(c => c.monto).reduce((acc, val) => acc += val, 0) : 0

  const saldo = (obra.montoInicial + sumaRedeterminaciones + sumaAmpliaciones) - sumaCertifcaciones 

  return saldo 
}

export const calcularCertificaciones = (obra: DDJJObra) => {

  const sumaCertifcaciones = obra.certificaciones && obra.certificaciones.length !== 0 ? obra.certificaciones.map(c => c.monto).reduce((acc, val) => acc += val, 0) : 0

  const saldo = sumaCertifcaciones

  return saldo

}

export const getVigenciaCertificado = (tramite:TramiteAlta) => {
  const ultimoEjercicioIdx = _.last(tramite.ejercicios.map(e => moment(e.fechaCierre, 'DD/MM/YYYY').toDate().getTime()).sort())
  const ultimoEjercicio : Ejercicio = tramite.ejercicios.filter(e => moment(e.fechaCierre, 'DD/MM/YYYY').toDate().getTime() === ultimoEjercicioIdx)[0]
  return moment(ultimoEjercicio.fechaCierre, 'DD/MM/YYYY').add(18,'months').format('DD/MM/YYYY')
}

export const hasObservacionesObra =(obra:DDJJObra)=>{
 return obra.observacionesDelRegistro && obra.observacionesDelRegistro.denominacion
      || obra.observacionesDelRegistro &&  obra.observacionesDelRegistro.ubicacionGeografica
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.plazoPorContrato
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.transcurrido
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.restante
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.razonSocialUTE
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.cuitUTE
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.participacionUTE
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.razonSocialComitente
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.cuitComitente
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.montoInicial
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.especialidad1
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.subEspecialidad1
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.subEspecialidades1Otros
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.especialidad2
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.subEspecialidad2
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.subEspecialidades2Otros
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.especialidad3
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.subEspecialidad3
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.subespecialidades
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.subEspecialidades3Otros
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.datosGenerales
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.archivosOrdenDeCompra
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.addProrroga
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.certificacionesTitles
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.ampliacionesTitle
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.redeterminacionesTitle
			|| obra.observacionesDelRegistro && obra.observacionesDelRegistro.likeProrroga
      || obra.observacionesDelRegistro && obra.observacionesDelRegistro.ubicacion
      || obra.observacionesDelRegistro && obra.observacionesDelRegistro.ubicacionText
}

/**
 * Este metodo permite determinar a ciencia cierta cual es el estado de la obra ya que existsen multiples instancias y condiciones que afectan a su calculo
 * @param obra Obra sobre la cual se quiere hacer el analisis
 * @returns Devuele el estado calculado de la obra
 */
export const determinarEstadoObra = (obra:DDJJObra) : 'APROBADA' | 'OBSERVADA' |'SUPERVIZADA' |'A REVISAR' | 'RECHAZADA' | 'DESESTIMADA' | 'REVISADA' | null | '' =>{
  if (obra.status==='APROBADA' )
    return  !_.isEmpty(obra.certificaciones && obra.certificaciones.filter(c => c.status === 'OBSERVADA')) 
    || !_.isEmpty(obra.ampliaciones && obra.ampliaciones.filter(c => c.status === 'OBSERVADA')) 
    || !_.isEmpty(obra.redeterminaciones && obra.redeterminaciones.filter(c => c.status === 'OBSERVADA'))
    || hasObservacionesObra(obra) ? 'OBSERVADA' : 'APROBADA'
  
  if (obra.status ===null )
    return  !_.isEmpty(obra.certificaciones && obra.certificaciones.filter(c => c.status === 'OBSERVADA')) 
    || !_.isEmpty(obra.ampliaciones && obra.ampliaciones.filter(c => c.status === 'OBSERVADA')) 
    || !_.isEmpty(obra.redeterminaciones && obra.redeterminaciones.filter(c => c.status === 'OBSERVADA'))
    || hasObservacionesObra(obra) ? 'OBSERVADA' : 'A REVISAR'
    || obra.status === null ? 'A REVISAR' : '' 
   
  if (!obra.status )
    return  !_.isEmpty(obra.certificaciones && obra.certificaciones.filter(c => c.status === 'OBSERVADA')) 
    || !_.isEmpty(obra.ampliaciones && obra.ampliaciones.filter(c => c.status === 'OBSERVADA')) 
    || !_.isEmpty(obra.redeterminaciones && obra.redeterminaciones.filter(c => c.status === 'OBSERVADA'))
    || hasObservacionesObra(obra) ? 'OBSERVADA' : 'A REVISAR'
    || obra.status === null ? 'A REVISAR' : '' 
   
    return obra.status

  
}

//export const isActualizacion =  (tramite:TramiteAlta) : boolean => {

	//getCertificados(tramite.cuit)
	//	.then(certificados => {
		//	!_.isEmpty(certificados.filter( c => c.tramite._id=== tramite._id))
	//	})
	//const certificados = await getCertificados(tramite.cuit)
	// return !_.isEmpty(certificados.filter( c => c.tramite._id=== tramite._id))
//}