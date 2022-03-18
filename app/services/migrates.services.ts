import axios from 'axios'
import https from 'https'
import { MongoClient } from 'mongodb';
import { nanoid } from 'nanoid';
import config from '../config'
import { getCodigoObra, getEmptyTramiteAlta, getTramiteByCUIT } from './business';
import _ from 'lodash'
import moment from 'moment'



class ConnectionManager {
  public CONTRATAR_URL
  public CONTRATAR_KEY
  public client
  public headers

  public httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })

  constructor(key) {
    this.CONTRATAR_KEY = key
    this.CONTRATAR_URL = process.env.URL_CONTRATAR
    this.client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.headers = process.env.CONTRATAR_AUTH_MODE && process.env.CONTRATAR_AUTH_MODE === 'COOKIE' ? {
      Cookie: this.CONTRATAR_KEY
    } : {
      "Authorization": `Bearer ${this.CONTRATAR_KEY}`,
      "AuthorizationMethod": 'APIKEY'
    }

  }

  async dbUpd() {
    await this.client.connect()
  }

  async dbDown() {
    await this.client.close()
  }

  async doPreflight() {
    try {
      const result = await axios.get(`${process.env.URL_CONTRATAR}/API/Proveedores/ObtenerDatosConstancia?id=11444fecha=${moment().format('ddd D MMM YYYY')}`, {
        httpsAgent: this.httpsAgent,
        headers: this.headers
      })
      return {
        success: true,

      }
    } catch (error) {
      console.log(error)
      return {
        success: false,
        error
      }
    }
  }


}
export class MigrateService extends ConnectionManager {


  async proveedorYaMigrado(codigoProveedor) {

    const db = this.client.db(config.registro.dataBase)
    return (await db.collection('oldDatosInfoBasica').findOne({ "_id": codigoProveedor })) ? true : false
  }

  async migrarProveedoresPreInscripcion(codigoProveedor: string) {

    const db = await this.client.db(config.registro.dataBase)

    return axios.get(`${process.env.URL_CONTRATAR}/API/Proveedores/Get?id=${codigoProveedor}`, {
      httpsAgent: this.httpsAgent,
      headers: this.headers
    }).then(async result => {
      if (result.data) {
        await db.collection('oldDatosPreInscripcion').save({
          _id: codigoProveedor,
          ...result.data
        })

        console.log('PreInscripcion Migrada')
      }
    })
  }

  async migrarProveedoresInfoBasica(codigoProveedor: string) {

    const db = this.client.db(config.registro.dataBase)


    return axios.get(`${process.env.URL_CONTRATAR}/API/InformacionBasicaProveedor/GetByFilter?id=null&idProveedor=${codigoProveedor}`, {
      httpsAgent: this.httpsAgent,
      headers: this.headers
    }).then(async result => {
      if (result.data) {
        await db.collection('oldDatosInfoBasica').save({
          _id: codigoProveedor,
          ...result.data.Data
        })

        console.log('InfoBasica Migrada')
      }
    })
  }

  async migrarProveedoresBalances(codigoProveedor: string) {

    const db = this.client.db(config.registro.dataBase)

    return axios.get(`${process.env.URL_CONTRATAR}/API/DDJJBalances/Search/?idProveedor=${codigoProveedor}`, {
      httpsAgent: this.httpsAgent,
      headers: this.headers
    }).then(async result => {
      if (result.data) {
        await db.collection('oldBalances').save({
          _id: codigoProveedor,
          ...result.data.Data
        })
        console.log('Balances Migrados')
      }
    })
  }

  async getDatosParticularesObra(codigoProveedor: string, idRegistro: string) {

    const result = await axios.get(`${process.env.URL_CONTRATAR}/API/ObraProveedor/GetByFilter?id=${idRegistro}&idProveedor=${codigoProveedor}&estadoObra=undefined`, {
      httpsAgent: this.httpsAgent,
      headers: this.headers
    }).then(r => r.data.Data)
    return result
  }

  async migrarProveedoresDatosObra(codigoProveedor: string) {

    const db = this.client.db(config.registro.dataBase)


    return axios.get(`${process.env.URL_CONTRATAR}/API/ObraProveedor/GetSmall?id=null&idProveedor=${codigoProveedor}&estadoObra=undefined`, {
      httpsAgent: this.httpsAgent,
      headers: this.headers
    }).then(async obras => {
      if (obras.data) {

        const parseObras = async (obras) => {
          let waitTill = null

          const result = []
          if (!obras)
            obras = []
          console.log(`Parseando ${obras.length} Obras`)
          let contador = 0
          for (let obra of obras) {
            waitTill = new Date(new Date().getTime() + 1 * 150)
            obra.detalle = await this.getDatosParticularesObra(codigoProveedor, obra.Id)

            while (waitTill > new Date(new Date().getTime())) { }
            obras[contador] = obra
            console.log(`Obra ${contador + 1} `)
            contador += 1
          }
          return obras
        }


        await db.collection('oldObras').save({
          _id: codigoProveedor,
          obras: await parseObras(obras.data.Data)
        })


        console.log('Obras Migradas')
      }
    })
  }

  async migrarProveedoresCerficado(codigoProveedor: string) {
    const db = this.client.db(config.registro.dataBase)
    return axios.get(`${process.env.URL_CONTRATAR}/API/Proveedores/ObtenerDatosConstancia?id=${codigoProveedor}&fecha=${moment().format('ddd D MMM YYYY')}`, {
      httpsAgent: this.httpsAgent,
      headers: this.headers
    }).then(async result => {
     
      if (result.data) {
        await db.collection('certificados').save({
          _id: codigoProveedor,
          ...result.data
        })
        console.log(`Certificado Migrado. Proveedor ${codigoProveedor}`)
      }
    })
  }

}


export class Parser extends ConnectionManager {
  private tramite: TramiteAlta
  private preInscripcion
  private datosBasicos
  private ejercicios
  private obras
  private certificadoOld

  getTramite() {
    return this.tramite
  }

  formatearFecha(fecha) {
    return moment(fecha).format('DD/MM/YYYY')
  }

  async init(id: string) {
    this.tramite = getEmptyTramiteAlta()

    await this.dbUpd()
    const db = await this.client.db(config.registro.dataBase)
    this.preInscripcion = await db.collection('oldDatosPreInscripcion').findOne({ "_id": id })

    
    this.tramite.cuit = this.preInscripcion.InformacionEmpresa.NumeroCuit
    this.datosBasicos = (await db.collection('oldDatosInfoBasica').findOne({ "_id": this.preInscripcion._id }))['0']
    this.ejercicios = await db.collection('oldBalances').findOne({ "_id": this.preInscripcion._id })
    this.certificadoOld = await db.collection('certificados').findOne({ "_id": this.preInscripcion._id })
    this.ejercicios = Object.keys(this.ejercicios)
      .filter(k => k !== '_id')
      .map(e => this.ejercicios[e])

    this.obras = await db.collection('oldObras').findOne({ "_id": this.preInscripcion._id })
  }

  parseApoderados() {
    const mapToApoderados = (e): Apoderado => {

      return {
        nombre: e.DatosPersona.Nombre,
        apellido: e.DatosPersona.Apellido,
        email: e.DatosPersona.Email,
        nroDocumento: e.DatosPersona.NumeroDocumento,
        tipoDocumento: 'DNI',
        cuit:e.DatosPersona && e.DatosPersona.NumeroCuit ?  e.DatosPersona.NumeroCuit.replace(/-/g, "") : 0,
        esAdministrador: e.DatosPersona.EsAdministradorLegitimado,
        tipoApoderado: e.DatosPersona.EsAdministradorLegitimado ? 'Apoderado' : 'Administrativo/Gestor',
        fotosDNI: [],
        imagenesDni: [],
        actaAutoridades: [],
        actaAdminLegitimado: []
      }
    }

    return this.preInscripcion.PersonasLegales.map(mapToApoderados)


  // if (this.preInscripcion.InformacionEmpresa.tipoProveedor===1)
  //    return this.preInscripcion.PersonasLegales = [{
  //    nombre: this.preInscripcion.InformacionEmpresa.RazonSocial,
  //    apellido: this.preInscripcion.InformacionEmpresa.RazonSocial,
  //    email: "",
  //    nroDocumento: this.preInscripcion.InformacionEmpresa.NumeroCuit,
  //    tipoDocumento:'CUIT',
  //    cuit: this.preInscripcion.InformacionEmpresa.NumeroCuit,
  //    esAdministrador: true,
  //    fotosDNI: [],
  //    imagenesDni: [],
  //    actaAutoridades: [],
  //    actaAdminLegitimado: []
  //   } as Apoderado]
  //  else 
  //    this.preInscripcion.PersonasLegales.map(mapToApoderados) 
    
}


  getCreatorFromApoderados() {
    const user: Apoderado = this.parseApoderados()
      .filter((e: Apoderado) => e.esAdministrador)[0]

    return {
      cuit: user.cuit,
      GivenName: user.nombre,
      Surname: user.apellido,
      Email: '',
      sub: user.cuit,
      Role: ["CONSTRUCTOR"],
      iss: "",
      iat: "0",
      aud: ""
    }
  }

  parseEjercicios() {
    const mapEjercicio = (e): Ejercicio => {
      return {
        codigo: e.Id,
        status: 'APROBADO',
        fechaInicio: this.formatearFecha(e.FechaInicioEjercicio),
        fechaCierre: this.formatearFecha(e.FechaCierreEjercicio),
        activoCorriente: e.ActivoCorriente,
        activoNoCorriente: e.ActivoNoCorriente,
        pasivoCorriente: e.PasivoCorriente,
        pasivoNoCorriente: e.PasivoNoCorriente,
        ventasEjercicio: e.IngresosNetos,
        capitalSuscripto: e.CapitalSocial,
        archivos: [],
        archivosActaAsamblea: []
      }
    }
    this.tramite.ejercicios = this.ejercicios.map(mapEjercicio)
  }

  private determinarCategoria(categoria){
    console.log(categoria)
    if (_.includes(['Desactualizado por formulario','Inscripto con Actualización' ],categoria))
      return 'INSCRIPTO CON ACTUALIZACION'

    if (_.includes(['Desactualizado por documentos vencidos', 'Desactualizado' ],this.certificadoOld.EstadoProveedor))
      return 'DESACTUALIZADO'

    if (categoria ==='En evaluación')
      return 'PRE INSCRIPTO'

    return 'INSCRIPTO'
  }

  parseInformacionBasica() {

    
    this.tramite.cuit = this.preInscripcion.InformacionEmpresa.NumeroCuit
    this.tramite.status = this.determinarCategoria(this.certificadoOld.EstadoProveedor) ==='PRE INSCRIPTO' ? 'BORRADOR' :  "VERIFICADO"
    
    this.tramite.categoria =  this.determinarCategoria(this.certificadoOld.EstadoProveedor)
    this.tramite.personeria = getCodigoTipoPersoneria(this.preInscripcion.InformacionEmpresa.tipoProveedor) as any
    this.tramite.tipoEmpresa = this.preInscripcion.InformacionEmpresa.TiposEmpresa.map(t => getCodigoTipoEmpresa(t))
    this.tramite.razonSocial = this.preInscripcion.InformacionEmpresa.RazonSocial
    this.tramite.nroLegajo = this.preInscripcion.InformacionEmpresa.NumeroRegistroConstructores
    this.tramite.apoderados = this.parseApoderados()
    this.tramite.domicilioLegal = `${this.datosBasicos.DomicilioDC.NombreCalle} ${this.datosBasicos.DomicilioDC.Altura}, ${this.datosBasicos.DomicilioDC.Localidad.Descripcion} ${this.datosBasicos.DomicilioDC.Localidad.Departamento.Provincia.Descripcion}  ${this.datosBasicos.DomicilioDC.Localidad.Departamento.Provincia.Pais.Descripcion}`
    this.tramite.domicilioReal = `${this.datosBasicos.DomicilioEspecialDC.NombreCalle} ${this.datosBasicos.DomicilioEspecialDC.Altura}, ${this.datosBasicos.DomicilioEspecialDC.Localidad.Descripcion} ${this.datosBasicos.DomicilioEspecialDC.Localidad.Departamento.Provincia.Descripcion}  ${this.datosBasicos.DomicilioEspecialDC.Localidad.Departamento.Provincia.Pais.Descripcion}`

    this.tramite.createdAt = new Date()
    console.log('Info Basica Parseada')
  }

  parseObras() {

    const parseCertificacionesAnuales = (cert) => {
      return {
        codigo: cert.idBalance,
        monto: cert.Monto,
        periodo: moment(cert.FechaCierreEjercicio).format('DD/MM/YYYY'),
        descripcion: 'MIGRADA',
        archivos: []
      }
    }

    const parseCertificacionesVigentes = (cert) => {
      return {
        codigo: cert.Id,
        monto: cert.Monto,
        periodo: cert.Fecha,
        descripcion: 'MIGRADA',
        archivos: []
      }
    }

    const parseRedeterminaciones = (r) => {
      return {
        id: r.Id,
        monto: r.Monto,
        fecha: this.formatearFecha(r.Fecha),
        descripcion: 'MIGRADO',
        archivos: []
      }
    }

    const parseAmpliaciones = (r) => {
      return {
        id: r.Id,
        monto: r.Monto,
        fecha: this.formatearFecha(r.Fecha),
        descripcion: 'MIGRADO',
        archivos: []
      }
    }






    const parseObra = (raw: any): DDJJObra => {
      return {
        id: getCodigoObra(),
        actasObra: [],
        status: 'APROBADA',
        denominacion: raw.DatosBasicosObra.Denominacion,
        ubicacionGeografica: [],
        ubicacion: [],
        datosObra: [{
          estado: getEstado(raw.Estado),
          codigo: raw.DatosBasicosObra.codigo,
          tipoContratacion: getTipoContratacion(raw.DatosBasicosObra.TipoContratacion),
          nivel: getNivel(raw.DatosBasicosObra.Nivel),
          fechaAdjudicacion: raw.PlazosObra.FechaAdjudicacion ? this.formatearFecha(raw.PlazosObra.FechaAdjudicacion) : '',
          fechaInicio: raw.PlazosObra.FechaActaInicio ? this.formatearFecha(raw.PlazosObra.FechaActaInicio) : '',
          fechaFin: raw.PlazosObra.FechaActaFin ? this.formatearFecha(raw.PlazosObra.FechaActaFin) : '',
          acta: []
        }],
        ampliaciones: raw.Ampliaciones ? raw.Ampliaciones.map(parseAmpliaciones) : [],
        redeterminaciones: raw.Redeterminaciones ? raw.Redeterminaciones.map(parseRedeterminaciones) : [],
        certificaciones: _.concat(raw.CertificadoAnual ? raw.CertificadoAnual.map(parseCertificacionesAnuales) : [], raw.CertificadoVigente ? raw.CertificadoVigente.map(parseCertificacionesVigentes) : []), // Falta completar
        prorroga: raw.PlazosObra.PlazoProrroga,
        archivosOrdenDeCompra: [],
        prorrogaNueva: [{
          prorrogaMeses: raw.PlazosObra.PlazoProrroga,
          archivosPlazos: [],
          prorrogaFecha: ''
        }],
        plazoPorContrato: raw.PlazosObra.Plazo,
        transcurrido: raw.PlazosObra.PlazoTranscurrido,
        restante: raw.PlazosObra.Plazo + raw.PlazosObra.PlazoProrroga - raw.PlazosObra.PlazoTranscurrido,
        razonSocialUTE: raw.DatosBasicosObra.PersonaUTE ? raw.DatosBasicosObra.PersonaUTE.RazonSocial : 'NO INFORMA', // Falta Completar,
        cuitUTE: raw.DatosBasicosObra.PersonaUTE ? raw.DatosBasicosObra.PersonaUTE.Cuit : 'NO INFORMA', // FALTA COMPLETAR
        participacionUTE: raw.DatosBasicosObra.PersonaUTE ? raw.DatosBasicosObra.PersonaUTE.PorcentajeParticipacion : 'NO INFORMA',
        razonSocialComitente: raw.DatosBasicosObra.PersonaComitente ? raw.DatosBasicosObra.PersonaComitente.RazonSocial : 'NO INFORMADO',
        cuitComitente: raw.DatosBasicosObra.PersonaComitente ? raw.DatosBasicosObra.PersonaComitente.Cuit : "NO INFORMADO",
        montoInicial: raw.MontoInicialContrato,
        especialidad1: "NO INFORMA",
        subEspecialidad1: ["NO INFORMA"],
        subEspecialidades1Otros: "NO INFORMA",
        especialidad2: "NO INFORMA",
        subEspecialidad2: ["NO INFORMA"],
        subEspecialidades2Otros: "NO INFORMA",
        especialidad3: "NO INFORMA",
        subEspecialidad3: ["NO INFORMA"],
        subespecialidades: "",
        subEspecialidades3Otros: ""
      }
    }

    this.tramite.ddjjObras = this.obras.obras.map(o => parseObra(o.detalle[0]))
    console.log('Obras Parseada')
  }

  async save() {
    console.log('Tramite Cargado ')
    const db = await this.client.db(config.registro.dataBase)

    const tramiteAnterior = await db.collection('tramites').findOne({
      "cuit": this.tramite.cuit
    })

    
    const certificadoOriginal = await db.collection('certificadosOtorgados').findOne({
      "tramite.cuit": this.tramite.cuit
    })

    


    const newTramite = {
      _id: certificadoOriginal ? certificadoOriginal.tramite._id : nanoid(),
      ...this.tramite,
      createdAt: new Date(),
      creatorId: this.getCreatorFromApoderados(),
    };

  
    const certificadoViejo = await db.collection('certificados').findOne({
      "NumeroCUIT": newTramite.cuit
    })



    //Borramos certificado vigente y colocamos el que viene de la migracion
    await db.collection('certificadosOtorgados').deleteMany({"tramite.cuit": newTramite.cuit})

    const certificado: CertificadoCapacidad = {
      _id: nanoid(),
      tramite: newTramite,
      otorgadoPor: {
        usuario: null,
        fecha: new Date().getTime()
      },
      vigencia: {
        fechaDesde: new Date().getTime(),
        fechaHasta: moment().add(1, 'year').toDate().getTime()
      },
      status: 'VIGENTE',
      capacidadEjecucion: this.certificadoOld.CapacidadEjecucion,
      capacidadFinanciera: this.certificadoOld.CapacidadContratacion,
    }

    await db.collection('tramites').save(newTramite);
    console.log('Tramite Cargado ')
    await db.collection('certificadosOtorgados').save(certificado);
    console.log('Certificado Generado')
      
  }
}

const getCodigoTipoEmpresa = (id) => {
  switch (id) {
    case 3:
      return 'CONSTRUCTORA'
    case 4:
      return 'PROVEEDORA'
    default:
      return 'CONSULTORA'
  }
}


const getTipoContratacion = (id) => {
  return [
    {
      "Descripcion": "Pública",
      "Value": 1,
      "codigo": "Publica"
    },
    {
      "Descripcion": "Privado",
      "Value": 2,
      "codigo": "Privada"
    },
    {
      "Descripcion": "Subcontrato público",
      "Value": 3,
      "codigo": "SubPublica"
    },
    {
      "Descripcion": "Subcontrato privado",
      "Value": 4,
      "codigo": "SubPrivada"
    }
  ].filter(e => e.Value === id)[0].codigo
}

const getNivel = (id) => {

  return [
    {
      "Descripcion": "Nacional",
      "Value": 1,
      "codigo": "Nacional"
    },
    {
      "Descripcion": "Provincial",
      "Value": 2,
      "codigo": "Provincial"
    },
    {
      "Descripcion": "Municipal",
      "Value": 3,
      "codigo": "Municipal"
    },
    {
      "Descripcion": "Privada",
      "Value": 4,
      "codigo": "Privado"
    }
  ].filter(e => e.Value === id)[0].codigo
}

const getEstado = (id) => {

  return [
    {
      "Descripcion": "Finalizada",
      "Value": 1,
      "codigo": "Finalizada"
    },
    {
      "Descripcion": "En ejecución",
      "Value": 2,
      "codigo": "Ejecucion"
    },
    {
      "Descripcion": "En proceso de adjudicación",
      "Value": 3,
      "codigo": "Preadjudicada"
    },
    {
      "Descripcion": "Anulada",
      "Value": 4,
      "codigo": "Anulada"
    },
    {
      "Descripcion": "Adjudicada",
      "Value": 5,
      "codigo": "Adjudicada"

    },
    {
      "Descripcion": "Suspendida",
      "Value": 6,
      "codigo": "Suspendida"
    }
  ].filter(e => e.Value === id)[0].codigo
}

const getCodigoTipoPersoneria = (id) => {
  return [{
    "Descripcion": "Persona fisica",
    "Value": 1,
    "codigo": 'PF'
  }, {
    "Descripcion": "Sociedad de hecho",
    "Value": 2,
    "codigo": 'SH'
  }, {
    "Descripcion": "Cooperativa",
    "Value": 3,
    "codigo": 'Cooperativa'
  }, {
    "Descripcion": "Union transitoria de empresas",
    "Value": 4,
    "codigo": 'UTE'
  }, {
    "Descripcion": "Talleres protegidos",
    "Value": 5,
    "codigo": 'TP'
  }, {
    "Descripcion": "Sociedad anonima",
    "Value": 6,
    "codigo": 'SA'
  }, {
    "Descripcion": "Sociedad de responsabilidad limitada",
    "Value": 7,
    "codigo": 'SRL'
  }, {
    "Descripcion": "Otras formas societarias",
    "Value": 8,
    "codigo": 'OFS'
  }, {
    "Descripcion": "Persona fisica - Extranjero no residente",
    "Value": 9,
    'codigo': 'PFE'
  }, {
    "Descripcion": "Persona juridica - Extranjero sin sucursal",
    "Value": 10,
    'codigo': 'PJESS'
  }, {
    "Descripcion": "Persona juridica - Extranjero con sucursal",
    "Value": 11,
    'codigo': 'PJECS'
  }].filter(e => e.Value === id)[0].codigo

}


