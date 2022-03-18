import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { NavigationStep } from '../components/steps'
import { InputText } from '../components/input_text'
import { HeaderPrincipal } from '../components/header'
import { Button, Steps, Card, Result, Alert, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { saveTramite, setStatusGeneralTramite } from '../redux/actions/main'
import { getEmptyTramiteAlta, getReviewAbierta, getTramiteByCUIT, getUsuario, isConstructora, isPersonaFisica, sendTramite, hasObservacionesObra } from '../services/business';
import { validatorTramite } from '../services/validator'
import { Loading } from '../components/loading';
import {Certificado} from '../components/certificado'
import { RootState } from '../redux/store';
import _ from 'lodash'

const { Step } = Steps;
export default (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [waitingType, setWaitingType] = useState('sync')
  const dispatch = useDispatch()
  const router = useRouter()
  const [tramite, setTramite] = useState<TramiteAlta>(useSelector((state: RootState) => state.appStatus.tramiteAlta) || getEmptyTramiteAlta())
  const revisionTramite = useSelector((state: RootState) => state.revisionTramites)
  const tipoAccion: string = useSelector((state: RootState) => state.appStatus.tipoAccion) || 'SET_TRAMITE_NUEVO'
  const [erroresSeccionInformacionBasica, setErroresSeccionInformacionBasica] = useState<Array<ValidatorErrorElement>>([])
  const [erroresSeccionDomicilio, setErroresSeccionDomicilio] = useState<Array<ValidatorErrorElement>>([])
  const [erroresSeccionComercial, setErroresSeccionComercial] = useState<Array<ValidatorErrorElement>>([])
  const [erroresSeccionDDJJ, setErroresSeccionDDJJ] = useState<Array<ValidatorErrorElement>>([])
  const [erroresSeccionObras, setErroresSeccionObras] = useState<Array<ValidatorErrorElement>>([])
  const [puedeEnviarTramimte, setPuedeEnviarTramite] = useState(false)
  const statusGeneralTramite = useSelector((state: RootState) => state.appStatus.resultadoAnalisisTramiteGeneral)
  const obra: DDJJObra = props.obra

  useEffect(() => {
    if (!tramite.cuit && tipoAccion !== 'SET_TRAMITE_NUEVO')
      router.push('/')

    if (getUsuario().isConstructor()) {

      validatorTramite.load(tramite)
      setPuedeEnviarTramite(validatorTramite.habilitadoParaEnviarTramiteAlRegistro())
      setErroresSeccionInformacionBasica(validatorTramite.parseInfomacionBasicaSection())
      setErroresSeccionDomicilio(validatorTramite.parseDomicilioSection())
      setErroresSeccionComercial(validatorTramite.parseDatosComercialesSection())
      setErroresSeccionDDJJ(validatorTramite.parseDDJJSection())
      dispatch(setStatusGeneralTramite([
        validatorTramite.parseInfomacionBasicaSection().length > 0 ? 'error' : 'finish',
        validatorTramite.parseDomicilioSection().length > 0 || validatorTramite.parseDatosComercialesSection().length > 0 ? 'error' : 'finish',
        validatorTramite.parseDDJJSection().length > 0 ? 'error' : 'finish',
        validatorTramite.parseObrasSection().length > 0 ? 'error' : 'finish']))
    }

  }, [])


  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const save = async () => {
    setWaitingType('sync')

    setIsLoading(true)
    if (tramite._id) {
      await dispatch(saveTramite(tramite))
    } else {
      if (!(await getTramiteByCUIT(tramite.cuit)))
        await dispatch(saveTramite(tramite))
    }
    setIsLoading(false)
  }

  const updateObjTramite = () => {
    setTramite(Object.assign({}, tramite))
  }

  const [showProfile, setShowProfile] = useState(false)
  const [activeProfile, setActiveProfile] = useState<TramiteAlta>(null)
  const [modalObservaciones, setModalObservaciones] = useState(false)

  const [activeProfile2, setActiveProfile2] = useState<TramiteAlta>(null)
  const [showProfile2, setShowProfile2] = useState(false)


  const EnviarParaPreInscripcion = () => {

    if (!puedeEnviarTramimte) {
      return <Result
        status="403"
        title="No puede enviar el tramite"
        subTitle="Lo lamento, pero solo un administrador legitimado o titular puede enviar el trámite al registro"
        extra={<Button onClick={() => router.push('/')} type="primary">Volver a la bandeja</Button>}
      />
    }
    return <div className="px-20 py-6 text-center m-auto mt-6">
      <div className="text-2xl font-bold py-4 text-center"> Enviar trámite</div>
      {erroresSeccionInformacionBasica.length === 0
        && erroresSeccionDomicilio.length === 0
        && erroresSeccionDDJJ.length === 0
        && erroresSeccionComercial.length === 0
        && erroresSeccionObras.length === 0
        ?

        <div>
          <Card className="rounded mr-2 text-center m-autop" style={{ width: 500, margin: 'auto' }}>
            <div className="text-base font-bold text-primary-700 pb-2 "> ¿Desea confirmar el envío de su trámite?</div>
            <div className="text-muted-700 text-sm  mt-2 self-center"  > Puede revisar cada uno de los pasos haciendo click en los mismos</div>
          </Card>

          <Modal title="ATENCIÓN" visible={isModalVisible}
            footer={[
              <Button onClick={() => handleCancel()}>Cancelar</Button>,
              <Button disabled={!puedeEnviarTramimte} type="primary" onClick={() => {
                setIsLoading(true)
                if(tramite.status === 'BORRADOR') {
                  tramite.submitedAt = new Date() 
                }  
                tramite.submitedAt = !tramite.submitedAt ? new Date()  : tramite.submitedAt
                sendTramite(tramite).then(result => {
                  dispatch(saveTramite(result))
                  router.push('/success')
                })
              }}> Confirmar Tramite</Button>

            ]

            }
          >
            <p>Se recuerda que la información antes solicitada en los distintos formularios de este trámite, y lo consignado por el interesado y/o sus representantes, revisten carácter de Declaración Jurada. Dichos formularios deberán ser completados según lo establecido por Disposición DI-2021-3-APN-ONC#JGM,
               y ante cualquier faltante u omisión se aplicará lo allí dispuesto, pudiendo cierta información no ser subsanable. Normativa e instructivos: 
               <a href="https://www.argentina.gob.ar/jefatura/innovacion-publica/onc/registro-nacional-de-constructores" target="_blank">https://www.argentina.gob.ar/jefatura/innovacion-publica/onc/registro-nacional-de-constructores</a>
  
</p><p>
La confirmación y envío del trámite presume que el interesado y/o sus representantes se han informado y sus declaraciones juradas cumplen con lo dispuesto en el reglamento mencionado
</p><p>
<strong>SE RECUERDA:</strong>
</p><p>
La presentación del balance del último ejercicio cerrado deberá realizarse dentro de los SEIS (6) meses, contados a partir de la fecha de cierre del mismo.
</p><p>
<strong>ACTUALIZACIÓN / PRE ADJUDICACIONES / ADJUDICACIONES</strong><br/>
Cualquier trámite de actualización, ya sea por la Actualización anual, general y obligatoria, como así también para declarar una Pre Adjudicación o Adjudicación de Obra, implica que el interesado deba actualizar su Declaración Jurada de Obras por completo. Es decir:
</p><ul>
<ol>Actualizar las obras en ejecución, pre adjudicadas y adjudicadas, ya declaradas con anterioridad, y cargar sus avances correspondientes.</ol>
<ol>Declarar nuevas obras finalizadas o en ejecución, en las que se haya o se encuentre trabajando con posterioridad a lo consignado en la última actualización aprobada, y no se encuentren declaradas al momento de solicitar esta nueva actualización.</ol>
<ol>No se considerarán, a los efectos de la determinación de la Capacidad Económica Financiera Referencial, todo antecedente y/o avance de obra que no hubiese sido declarado oportunamente.</ol>
          </ul>
            <p>
              La confirmación y envío del trámite presume que el interesado y/o sus representantes se han informado y sus declaraciones juradas cumplen con lo dispuesto en el reglamento mencionado
</p>

          </Modal>
          <div className="mt-6 pt-4 text-center">
            <Button disabled={!puedeEnviarTramimte} type="primary" onClick={showModal}> Confirmar Tramite</Button>
          </div>
        </div>
        :
        <Card className="rounded mr-2 text-center m-autop" style={{ width: 500, margin: 'auto' }}>
          <div className="text-base font-bold text-warning-700 px-8 pb-2 mb-4">
            <div>
              Revise los items incompletos para enviar el trámite
      </div>
            <div className="text-gray-800 text-left p-2 font-thin">
              {erroresSeccionInformacionBasica.length > 0 ?
                <div className="mb-8">
                  <div className="font-bold">Información Básica</div>
                  <ul>
                    {erroresSeccionInformacionBasica.map((e: ValidatorErrorElement) => <li>{e.error}</li>)}
                  </ul>
                </div> : ''}
              {erroresSeccionDomicilio.length > 0 ?
                <div className="mb-8">
                  <div className="font-bold">Domicilio</div>
                  <ul>
                    {erroresSeccionDomicilio.map((e: ValidatorErrorElement) => <li>{e.error}</li>)}
                  </ul>
                </div> : ''}
              {erroresSeccionComercial.length > 0 ?
                <div className="mb-8">
                  <div className="font-bold">Información Comercial</div>
                  <ul>
                    {erroresSeccionComercial.map((e: ValidatorErrorElement) => <li>{e.error}</li>)}
                  </ul>
                </div> : ''}
              {erroresSeccionDDJJ.length > 0 ?
                <div className="mb-8">
                  <div className="font-bold">Declaración Jurada de Balances</div>
                  <ul>
                    {erroresSeccionDDJJ.map((e: ValidatorErrorElement) => <li>{e.error}</li>)}
                  </ul>
                </div> : ''}
            </div>
          </div>
        </Card>}






    </div>
  }

  const EnviarBackOffice = () => {
    const reviewAbierta = revisionTramite.revision && revisionTramite.revision.reviews.filter(r => !r.isOk)
   
   
    return <div className="px-20 py-6 text-center m-auto mt-6">


      <div className="text-2xl font-bold py-4 text-center"> Enviar trámite</div>
      {
        (!_.isEmpty(reviewAbierta) && getUsuario().isAprobador) &&
        <div style={{ width: 500, margin: 'auto' }} className="text-left pb-4">
          <Alert
            message="Atención"
            description="Este trámite tiene observaciones por lo cual será devuelto al remitente para realizar las subsanaciones pertinentes "
            type="warning"
            showIcon

          />
        </div>
      }
      <Card className="rounded mr-2 text-center m-autop" style={{ width: 500, margin: 'auto' }}>
        <div className="text-base font-bold text-primary-700 pb-2 "> ¿Desea continuar con el tratamiento de su tramite?</div>
        <div className="text-muted-700 text-sm  mt-2 self-center"  >{!_.isEmpty(reviewAbierta) ? 'Este tramite será enviando directamente al remitente ya que contiene las siguientes observaciones ' : getUsuario().isAprobador ? 'Este tramite está en condiciones de ser aprobado. Si está de acuerdo pulse Enviar Tramite' : 'Este tramite será enviado al siguiente nivel de supervisión'}</div>
        {
          reviewAbierta &&
          <div className="text-left pt-4 ">
            <ul className="list-disc">
              {reviewAbierta.map(r => <li>{r.review}
              </li>)}
              
            </ul>
          </div>
        }
        


      </Card>
      <div className="mt-6 pt-4 text-center">
       {/* 
       <div >
       
         <Certificado
        tramite={tramite} />
        </div>*/}
        <Button type="primary" onClick={() => {
          setIsLoading(true)
          sendTramite(tramite).then(result => {
            dispatch(saveTramite(result))
            router.push('/')
          })
        }}>Confirmar trámite</Button>
      </div>
    </div>
  }

  if ((!tramite.cuit) || (isLoading))
    return <Loading message="" type="waiting" />

  return <div>

<Modal title="Certificado"
      visible={showProfile}
      onOk={handleOk}
      footer={[
        <Button type="primary" >Descargar Certificado</Button>,
        <Button onClick={handleCancel}>Cerrar</Button>


      ]}
      onCancel={() => setShowProfile(false)}
      width={1000}>
      <div><Certificado
        razonSocial={activeProfile2 && activeProfile2.razonSocial}
        capacidadContratacion={0}
        capacidadEjecucion={0}
        obras={[]}
        porcentajesEspecialidades={[]}
        tipoEmpresa={'Cns'}
        personeria={'sdf'}
        cuit={'232323'}
      /></div>


    </Modal> 

    <HeaderPrincipal tramite={tramite} onExit={() => router.push('/')} onSave={() => {
      save()
      router.push('/')
    }} />
    <div className="border-gray-200 border-b-2 px-20">
      <NavigationStep current={4} 
      generalStatus={statusGeneralTramite} 
      completaBalanceYObras={ isConstructora(tramite)} />
    </div>
    {getUsuario().isConstructor() ? <EnviarParaPreInscripcion /> : <EnviarBackOffice />}


  </div>
}


