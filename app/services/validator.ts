import moment from "moment"
import { getUsuario, isPersonaFisica,isConstructora } from "./business"
import _ from 'lodash'

interface ValidatorInterface {
    load: (t:TramiteAlta) => void
    parseInfomacionBasicaSection(): Array<ValidatorErrorElement>
    parseDomicilioSection() : Array<ValidatorErrorElement>
    parseDatosComercialesSection():  Array<ValidatorErrorElement>
    parseDDJJSection() : Array<ValidatorErrorElement>
    parseObrasSection() : Array<ValidatorErrorElement>
   
}

class Validator implements ValidatorInterface {
    
    private tramite: TramiteAlta

    load(t:TramiteAlta) {
        this.tramite = t
    }

    

    habilitadoParaEnviarTramiteAlRegistro(): boolean {

      const usuario = getUsuario().userData()
      window['apoderados']= this.tramite.apoderados
      if (this.tramite.personeria!=='PF' ||  this.tramite.personeria==='PF')
        return !_.isEmpty( this.tramite.apoderados.filter( apoderado => (apoderado.cuit.toString() ===usuario.cuit.toString()) && apoderado.esAdministrador ))
      else
        return this.tramite.creatorId.cuit === usuario.cuit
    }
    
    parseInfomacionBasicaSection() : Array<ValidatorErrorElement> {
      const toValidate : Array<ValidatorErrorElement> = []
      
      if(!this.tramite.razonSocial)
        toValidate.push({
          attribute:'razonSocial',
          dataId:'',
          error:'La Razon Social es requerida'
        })
        

      if(!this.tramite.tipoEmpresa)
        toValidate.push({
          attribute:'tipoEmpresa',
          dataId:'',
          error:'Deberá seleccionar al menos un tipo de empresa'
        })

      if(!this.tramite.cuit)
        toValidate.push({
          attribute:'cuit',
          dataId:'',
          error:'El CUIT es requerido'
        })
        if(!this.tramite.tipoEmpresa)
        toValidate.push({
          attribute:'tipoEmpresa',
          dataId:'',
          error:'Deberá seleccionar al menos un tipo de empresa'
        })

        if(_.isEmpty(this.tramite.inscripcionAFIPConstancia)) 
        toValidate.push({
          attribute:'InscripcionConstancia',
          dataId:'',
          error:'La Constancia de Inscripción en AFIP es obligatoria'
        })
        if(_.isEmpty(this.tramite.apoderados) )
      toValidate.push({
        attribute:'apoderado',
        dataId:'',
        error:'Deberá cargar, al menos, un usuario Administrador Legitimado, el cual deberá confirmar el trámite.'
      })
        
        
        
      
      

      if(this.tramite.esCasadoTitular){
        if(!this.tramite.nombreConyuge)
        toValidate.push({
          attribute:'nombreConyuge',
          dataId:'',
          error:'El nombre del conyuge es requerido'
        })
        
      if(!this.tramite.apellidoConyuge)
        toValidate.push({
          attribute:'apellidoConyuge',
          dataId:'',
          error:'El apellido del conyuge es requerido'
        })
        
      if(!this.tramite.tipoDocumentoConyuge)
        toValidate.push({
          attribute:'tipoDocumentoConyuge',
          dataId:'',
          error:'El Tipo de documento del conyuge es requerido'
        })
        
      if(!this.tramite.documentoConyugue)
        toValidate.push({
          attribute:'documentoConyugue',
          dataId:'',
          error:'El Nro de documento del conyuge es requerido'
        })
        
      }

      

    //  if((isPersonaFisica(this.tramite) &&  (this.tramite.cuit != getUsuario().userData().cuit))){
    //  toValidate.push({
    //      attribute:'noMismaPersona',
    //      dataId:'',
    //      error:`Siendo una persona físca Los tramites son personales y no puede iniciar uno a nombre de terceros.
    //      Si quiere realizar un trámite a nombre de un tercero deberá agregarlo como usuario en la sección de apoderados / usuarios`
    //    })
    //  }

        

      return toValidate
    }

    parseDomicilioSection(): ValidatorErrorElement[] {
      const toValidate : Array<ValidatorErrorElement> = []

      if(!this.tramite.domicilioReal)
        toValidate.push({
          attribute:'domicilioReal',
          dataId:'',
          error:'Indíque el domicilio real'
        })
      
      if(!this.tramite.domicilioLegal)
        toValidate.push({
          attribute:'domicilioLegal',
          dataId:'',
          error:'Indíque el domicilio legal'
        })
      if(!this.tramite.telefono)
        toValidate.push({
          attribute:'telefono',
          dataId:'',
          error:'Indíque un número de telefono para ser notificado'
        })
       // if(_.isEmpty(this.tramite.constanciaDomicilioLegal)) 
       // toValidate.push({
       //   attribute:'ConstanciaDomicilioLegal',
       //   dataId:'',
       //   error:'La Constancia del domicilio legal es obligatoria'
       // })
      
      

      if(!this.tramite.emailInstitucional)
        toValidate.push({
          attribute:'emailInstitucional',
          dataId:'',
          error:'El domicilio electrónico es obligatorio, en el email declarado recibirá todas las notificaciones. '
        })

      

      
       
        
      return toValidate
    }
    parseDDJJSection(): ValidatorErrorElement[] {
      const toValidate : Array<ValidatorErrorElement> = []
      
      if((isConstructora(this.tramite) &&  (_.isEmpty(this.tramite.ejercicios))) ) 
      toValidate.push({
        attribute:'ejercicio',
        dataId:'',
        error:'Debe declarar al menos 1 balance'
      })

      return toValidate
    }
   
    parseObrasSection(): ValidatorErrorElement[] {
      const toValidate : Array<ValidatorErrorElement> = []
      return toValidate
    }    
    parseDatosComercialesSection(): ValidatorErrorElement[] {
      const toValidate : Array<ValidatorErrorElement> = []
      if (this.tramite.personeria==='PF' && !this.tramite.matriculaComerciante.datos)
        toValidate.push({
          attribute:'matriculaComercianteDatos',
          dataId:'',
          error:"Los datos de la matricula comerciante son requeridos"
        })
      if (this.tramite.personeria==='PF' && !this.tramite.matriculaComerciante.datos)
        toValidate.push({
          attribute:'matriculaComercianteFecha',
          dataId:'',
          error:"La fecha de Incripcion de la Matricula es requerida"
        })
      if (this.tramite.personeria==='PF' && !this.tramite.altaAFIP.datos)
        toValidate.push({
          attribute:'altaAFIPdatos',
          dataId:'',
          error:"Los datos del Alta de Afip  son requeridos"
        })

      if(this.tramite.personeria==='PF' &&  _.isEmpty(this.tramite.datosSocietarios.personaFisica.constanciaInscripcion)) 
        toValidate.push({
          attribute:'ConstanciaInscripcionPF',
          dataId:'',
          error:'La Constancia de Inscripcion  es obligatoria'
        })

      if(this.tramite.personeria==='PF' &&  _.isEmpty(this.tramite.datosSocietarios.personaFisica.constanciaMatriculaComerciante)) 
        toValidate.push({
          attribute:'MatriculaComerciantePF',
          dataId:'',
          error:'La constancia de la matricula   es obligatoria'
        })



      if (this.tramite.personeria==='PF' && !this.tramite.altaAFIP.fecha)
        toValidate.push({
          attribute:'altaAFIPfecha',
          dataId:'',
          error:"La fecha de  Alta de Afip  es requerida"
        })
      if (this.tramite.personeria==='SA'  && !this.tramite.datosSocietarios.sociedadAnonima.contrato.fecha)
        toValidate.push({
          attribute:'datosSocietariosContratoFecha',
          dataId:'',
          error:"La fecha de la firma del contrato constitutivo es Obligatoria"
        })
        
      if (this.tramite.personeria==='SRL'  && !this.tramite.datosSocietarios.sociedadAnonima.contrato.fecha)
        toValidate.push({
          attribute:'datosSocietariosContratoFecha',
          dataId:'',
          error:"La fecha de la firma del contrato constitutivo es Obligatoria"
        })
      if (this.tramite.personeria==='OFS'  && !this.tramite.datosSocietarios.sociedadAnonima.contrato.fecha)
        toValidate.push({
          attribute:'datosSocietariosContratoFecha',
          dataId:'',
          error:"La fecha de la firma del contrato constitutivo es Obligatoria"
        })
      if (this.tramite.personeria==='SA'  && !this.tramite.datosSocietarios.sociedadAnonima.inscripcion.datos)
        toValidate.push({
          attribute:'datosInscripcionContrato',
          dataId:'',
          error:"Los datos de la inscripcion del contrato son obligatorios"
        })
      if (this.tramite.personeria==='SRL'  && !this.tramite.datosSocietarios.sociedadAnonima.inscripcion.datos)
        toValidate.push({
          attribute:'datosInscripcionContrato',
          dataId:'',
          error:"Los datos de la inscripcion del contrato son obligatorios"
        })
      if (this.tramite.personeria==='OFS'  && !this.tramite.datosSocietarios.sociedadAnonima.inscripcion.datos)
        toValidate.push({
          attribute:'datosInscripcionContrato',
          dataId:'',
          error:"Los datos de la inscripcion del contrato son obligatorios"
        })
      if (this.tramite.personeria==='SA'  && !this.tramite.datosSocietarios.sociedadAnonima.inscripcion.fecha)
        toValidate.push({
          attribute:'FechaInscripcionContrato',
          dataId:'',
          error:"La fecha  de la inscripcion del contrato es obligatoria"
        })
      if (this.tramite.personeria==='SRL'  && !this.tramite.datosSocietarios.sociedadAnonima.inscripcion.fecha)
        toValidate.push({
          attribute:'FechaInscripcionContrato',
          dataId:'',
          error:"La fecha  de la inscripcion del contrato es obligatoria"
        })
      if (this.tramite.personeria==='OFS'  && !this.tramite.datosSocietarios.sociedadAnonima.inscripcion.fecha)
        toValidate.push({
          attribute:'FechaInscripcionContrato',
          dataId:'',
          error:"La fecha  de la inscripcion del contrato es obligatoria"
        })
      //if (this.tramite.personeria==='SA'  && !this.tramite.datosSocietarios.sociedadAnonima.modificacion.datos)
      //  toValidate.push({
      //    attribute:'modificacionDatosContrato',
      //    dataId:'',
      //    error:"Los datos de la modificacion del contrato son obligatorios"
      //  })
      //if (this.tramite.personeria==='SRL'  && !this.tramite.datosSocietarios.sociedadAnonima.modificacion.datos)
      //  toValidate.push({
      //    attribute:'modificacionDatosContrato',
      //    dataId:'',
      //    error:"Los datos de la modificacion del contrato son obligatorios"
      //  })
      //if (this.tramite.personeria==='OFS'  && !this.tramite.datosSocietarios.sociedadAnonima.modificacion.datos)
      //  toValidate.push({
      //    attribute:'modificacionDatosContrato',
      //    dataId:'',
      //    error:"Los datos de la modificacion del contrato son obligatorios"
      //  })
      if (this.tramite.personeria==='SA'  && !this.tramite.datosSocietarios.sociedadAnonima.modificacion.fecha)
        toValidate.push({
          attribute:'modificacionFechaContrato',
          dataId:'',
          error:"La fecha de  modificacion del contrato son obligatorios"
        })
      if(this.tramite.personeria==='SRL'   &&  _.isEmpty(this.tramite.datosSocietarios.sociedadAnonima.contrato.archivos)) 
        toValidate.push({
          attribute:'ArchivoContratoSA',
          dataId:'',
          error:'El  Contrato Constitutivo, junto con TODAS sus modificaciones hasta el día de hoy es obligatorio'
        })
        if(this.tramite.personeria==='SA'  &&  _.isEmpty(this.tramite.datosSocietarios.sociedadAnonima.contrato.archivos)) 
        toValidate.push({
          attribute:'ArchivoContratoSA',
          dataId:'',
          error:'El  Contrato Constitutivo, junto con TODAS sus modificaciones hasta el día de hoy es obligatorio'
        })
        if(this.tramite.personeria==='OFS' &&  _.isEmpty(this.tramite.datosSocietarios.sociedadAnonima.contrato.archivos)) 
        toValidate.push({
          attribute:'ArchivoContratoSA',
          dataId:'',
          error:'El  Contrato Constitutivo, junto con TODAS sus modificaciones hasta el día de hoy es obligatorio'
        })
     // if(this.tramite.personeria==='SA'  &&  _.isEmpty(this.tramite.datosSocietarios.sociedadAnonima.modificacion.archivos)) 
     //   toValidate.push({
     //     attribute:'ArchivoMODIFICACIONContratoSA',
     //     dataId:'',
     //     error:'El archivo de la   Modificación del Objeto Social a rubro Construcción inscripto en D.P.P.J / I.G.J. es obligatorio'
     //   })
     //   if(this.tramite.personeria==='SRL'  &&  _.isEmpty(this.tramite.datosSocietarios.sociedadAnonima.modificacion.archivos)) 
     //   toValidate.push({
     //     attribute:'ArchivoMODIFICACIONContratoSA',
     //     dataId:'',
     //     error:'El archivo de la   Modificación del Objeto Social a rubro Construcción inscripto en D.P.P.J / I.G.J. es obligatorio'
     //   })
        if(this.tramite.personeria==='OFS'  &&  _.isEmpty(this.tramite.datosSocietarios.sociedadAnonima.modificacion.archivos)) 
        toValidate.push({
          attribute:'ArchivoMODIFICACIONContratoSA',
          dataId:'',
          error:'El archivo de la   Modificación del Objeto Social a rubro Construcción inscripto en D.P.P.J / I.G.J. es obligatorio'
        })
      if (this.tramite.personeria==='SRL'  && !this.tramite.datosSocietarios.sociedadAnonima.modificacion.fecha)
        toValidate.push({
          attribute:'modificacionFechaContrato',
          dataId:'',
          error:"La fecha de  modificacion del contrato son obligatorios"
        })
      if (this.tramite.personeria==='OFS'  && !this.tramite.datosSocietarios.sociedadAnonima.modificacion.fecha)
        toValidate.push({
          attribute:'modificacionFechaContrato',
          dataId:'',
          error:"La fecha de  modificacion del contrato son obligatorios"
        })
      if (this.tramite.personeria==='SA'  && !this.tramite.datosSocietarios.fechaVencimiento)
        toValidate.push({
          attribute:'fechaVencimientoContrato',
          dataId:'',
          error:"La fecha de  vencimiento del contrato es obligatorio"
        }) 
      if (this.tramite.personeria==='SRL'  && !this.tramite.datosSocietarios.fechaVencimiento)
        toValidate.push({
          attribute:'fechaVencimientoContrato',
          dataId:'',
          error:"La fecha de  vencimiento del contrato es obligatorio"
        }) 
      if (this.tramite.personeria==='OFS'  && !this.tramite.datosSocietarios.fechaVencimiento)
        toValidate.push({
          attribute:'fechaVencimientoContrato',
          dataId:'',
          error:"La fecha de  vencimiento del contrato es obligatorio"
        }) 
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.inscripcionConstitutiva.datos)
        toValidate.push({
          attribute:'inscripcionConstitutivaDatos',
          dataId:'',
          error:"Los datos  de la inscripcion  son  obligatorios"
        }) 
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.inscripcionConstitutiva.fecha)
        toValidate.push({
          attribute:'inscripcionConstitutivaFecha',
          dataId:'',
          error:"La fecha de Inscripcion es obligatoria"
        }) 
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.inscripcionSucursal.datos)
        toValidate.push({
          attribute:'inscripcionSucursalDatos',
          dataId:'',
          error:"Los datos de la inscripcion de la sucursal son obligatorios"
        })
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.inscripcionSucursal.fecha)
        toValidate.push({
          attribute:'inscripcionSucursalFecha',
          dataId:'',
          error:"La fecha de inscripcion de la sucursal es obligatoria"
        })
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.modifcicacionObjeto.datos)
        toValidate.push({
          attribute:'modificacionObjetoDatos',
          dataId:'',
          error:"Los datos de modificacion del objeto es obligatorio"
        })
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.modifcicacionObjeto.fecha)
        toValidate.push({
          attribute:'modificacionObjetoFecha',
          dataId:'',
          error:"La fecha de la modificacion del objeto es obligatoria"
        })
      if (this.tramite.personeria==='UTE'  && !this.tramite.datosSocietarios.fechaInscripcion)
        toValidate.push({
          attribute:'fechaInscripcionUTE',
          dataId:'',
          error:"La fecha de inscripción es obligatoria"
        })
      if(this.tramite.personeria==='UTE' &&  _.isEmpty(this.tramite.datosSocietarios.ute.archivosContrato)) 
        toValidate.push({
          attribute:'ArchivoContratoUTE',
          dataId:'',
          error:'El Contrato de la U.T.E. y junto con TODAS sus modificaciones es obligatorio'
        })
      if (this.tramite.personeria==='UTE'  && !this.tramite.datosSocietarios.ute.inscripcionUTE.datos)
        toValidate.push({
          attribute:'InscripcioncontratoUTEDatos',
          dataId:'',
          error:"Los datos del contrato de  Inscripcion son obligatorios "
        })
      if (this.tramite.personeria==='UTE'  && !this.tramite.datosSocietarios.ute.inscripcionUTE.fecha)
        toValidate.push({
          attribute:'InscripcioncontratoUTEFecha',
          dataId:'',
          error:"La fecha de inscripcion de contrato es obligatoria "
        })
      if(this.tramite.personeria==='UTE' &&  _.isEmpty(this.tramite.datosSocietarios.ute.modificacionUTE.archivos)) 
        toValidate.push({
          attribute:'modificacionUTE',
          dataId:'',
          error:'La Última modificación del Contrato de la U.T.E'
        })


      if (this.tramite.personeria==='Cooperativa'  && !this.tramite.datosSocietarios.cooperativa.inscriptionINAES.datos)
        toValidate.push({
          attribute:'InscripcionINAESDatos',
          dataId:'',
          error:"Los datos de la inscripcion en INAES es Obligatoria "
        })
      if (this.tramite.personeria==='Cooperativa'  && !this.tramite.datosSocietarios.cooperativa.modificacionINAES.archivos)
        toValidate.push({
          attribute:'InscripcionINAESFecha',
          dataId:'',
          error:"el archivo de la Modificación del Objeto de la cooperativa a rubro construccion es obligatorio "
        })
      if(this.tramite.personeria==='Cooperativa' &&  _.isEmpty(this.tramite.datosSocietarios.cooperativa.archivoActaConstitutiva)) 
        toValidate.push({
          attribute:'rchivoActaConstitutivaCooperativa',
          dataId:'',
          error:'El Acta Constitutiva, junto con TODAS sus modificaciones hasta el día de hoy es obligatorio'
        })

      if (this.tramite.personeria==='Cooperativa'  && !this.tramite.datosSocietarios.cooperativa.archivoActaConstitutiva)
        toValidate.push({
          attribute:'archivoActaConstitutivaCooperativa',
          dataId:'',
          error:"Debera adjuntar el acta constitutiva "
        })
      if (this.tramite.personeria==='Cooperativa'  && !this.tramite.datosSocietarios.cooperativa.modificacionINAES.datos)
        toValidate.push({
          attribute:'modificacionInaesDatos',
          dataId:'',
          error:"Los datos de la modificacion estatutarias en Inaes es obligatoria "
        })
      if (this.tramite.personeria==='Cooperativa'  && !this.tramite.datosSocietarios.cooperativa.modificacionINAES.fecha)
        toValidate.push({
          attribute:'modificacionInaesFecha',
          dataId:'',
          error:"La fecha de la modificacion estatutaria en inaes es obligatoria "
        })  
      if(this.tramite.personeria==='Cooperativa' &&  _.isEmpty(this.tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.archivos)) 
        toValidate.push({
          attribute:'ArchivoultimaModifcacionINAESCooperativa',
          dataId:'',
          error:'El archivo de la  Última modificación estatutaria Inscripta en I.N.A.E.S. es obligatorio'
        })

      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.inscripcionConstitutiva.datos)
        toValidate.push({
          attribute:'InscripcionConstitutivaPJESPDatos',
          dataId:'',
          error:"Los datos de la inscripcion constitutiva en el pais de origen son obligatorios "
        }) 
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.inscripcionConstitutiva.fecha)
        toValidate.push({
          attribute:'InscripcionConstitutivaPJESPfecha',
          dataId:'',
          error:"La fecha de la inscripcion constitutiva en el pais de origen es obligatoria "
        }) 
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.inscripcionSucursal.datos)
        toValidate.push({
          attribute:'InscripcionSucursalPJESPdatos',
          dataId:'',
          error:"Los datos de la inscripcion de la sucursal en Argentina son obligatorios "
        })
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.inscripcionSucursal.fecha)
        toValidate.push({
          attribute:'InscripcionSucursalPJESPFecha',
          dataId:'',
          error:"La fecha de la inscripcion de la sucursal en Argentina  es obligatoria "
        })
      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.modifcicacionObjeto.datos)
        toValidate.push({
          attribute:'modificacionObjetolPJESPDatos',
          dataId:'',
          error:"Los datos de la Modificación del objeto de la Sucursal en Argentina son obligatorios "
        })

      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.modifcicacionObjeto.fecha)
        toValidate.push({
          attribute:'modificacionObjetolPJESPfecha',
          dataId:'',
          error:"La fecha de la Modificación del objeto de la Sucursal en Argentina son obligatorios "
        })
      if(this.tramite.personeria==='PJESP' &&  _.isEmpty(this.tramite.datosSocietarios.PJESP.archivosContrato)) 
        toValidate.push({
          attribute:'ArchivoContratoPJESP',
          dataId:'',
          error:'El archivo de la Inscripción efectiva de la sucursal en D.P.P.J. / I.G.J., junto con todas sus modificaciones es obligatorio'
        })

      if(this.tramite.personeria==='PJESP' &&  _.isEmpty(this.tramite.datosSocietarios.PJESP.archivoModificacion)) 
        toValidate.push({
          attribute:'ArchivoContratoModificiacionPJESP',
          dataId:'',
          error:'El archivo de la  Modificación del Objeto de la Sucursal Argentina al rubro Construcción inscripto en D.P.P.J / I.G.J. es obligatorio'
        })

      if (this.tramite.personeria==='PJESP'  && !this.tramite.datosSocietarios.PJESP.fechaVencimiento.fecha)
        toValidate.push({
          attribute:'FechaVencimientoPJESPfecha',
          dataId:'',
          error:"La fecha Fecha de vencimiento del Contrato / Acta Constitutiva es obligatoria "
        })

      //if (this.tramite.matriculaComerciante.fecha && this.tramite.altaAFIP.fecha){
      //  const fechaAltaMatricula = moment(this.tramite.matriculaComerciante.fecha,'DD/MM/YYYY')
      //  const fechaAltaAFIP = moment(this.tramite.altaAFIP.fecha,'DD/MM/YYYY')
      //  if (fechaAltaAFIP.diff(fechaAltaMatricula)>0)
      //    toValidate.push({
      //      attribute:'matriculaComercianteFecha',
      //      dataId:'',
      //      error:"La fecha de inscripción en AFIP no puede ser posterior a la fecha de inscripción como constructor"
      //    })}
      if (this.tramite.poseeIERIC){
        if(!this.tramite.ieric)
          toValidate.push({
            attribute:'ieric',
            dataId:'',
            error:'El número de Ieric es requerido (en caso que posea IERIC)'
          })
      
        if(!this.tramite.vtoIeric)
          toValidate.push({
            attribute:'vtoIeric',
            dataId:'',
            error:'La fecha de Vto de Ieric es requerido (En caso que posea IERIC)'
          })

          
      }

      
      return toValidate
    }  
}

export const validatorTramite = new Validator()