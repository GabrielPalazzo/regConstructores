import React from 'react';
import { Steps } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { setPaso, setStatusGeneralTramite } from '../redux/actions/main'
import { SET_PASOS } from '../redux/reducers/main'
import { allowGuardar } from '../services/business';
import { RootState } from '../redux/store';
const { Step } = Steps;


export interface NavigationStepProps {
  current: number,
  generalStatus?: Array<any>,
  completaBalanceYObras: boolean
}

export const NavigationStep: React.FC<NavigationStepProps> = ({
  current = 0,
  generalStatus = ['wait', 'wait', 'wait', 'wait', 'wait'],
  completaBalanceYObras = false
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta || {})

  const cleanErrors = () => {
    dispatch(setStatusGeneralTramite(['wait', 'wait', 'wait', 'wait', 'wait']))
  }

  if (!tramite)
    return <div></div>

  const showEnviar = () => {
    if (!allowGuardar(tramite))
      return ''

    return <Step
      title="Enviar trámite"
      status={generalStatus[4]}
      className="cursor-pointer"
      onClick={() => {
        dispatch(setPaso(SET_PASOS.SET_PASO_ENVIAR))
        cleanErrors()
        router.push('/enviar_tramite')
      }}
    />
  }
 
  const completo = () => {
    return <Steps current={current}
    type="navigation"
    size="small"
    className="site-navigation-steps">
      <Step

        status={generalStatus[0]}
        title="Inscripción"
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_INSCRIPCION))
          cleanErrors()
          router.push('/informacion_basica')
        }}
      />
      <Step
        title="Información"
        status={generalStatus[1]}
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_INFORMACION))
          cleanErrors()
          router.push('/domicilio')
        }}
      />
      <Step
        disabled={!completaBalanceYObras}
        status={generalStatus[2]}
        title="Declaración Jurada de Balances"
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_BALANCES))
          cleanErrors()
          router.push('/ejercicios')
        }}
      />
      <Step
        disabled={!completaBalanceYObras}
        status={generalStatus[3]}
        title="Declaración Jurada de Obras"
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_OBRAS))
          cleanErrors()
          router.push('/obras')
        }} />

      <Step
        title="Finalizar trámite"
        status={generalStatus[4]}
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_ENVIAR))
          cleanErrors()
          router.push('/enviar_tramite')
        }}
      />
    </Steps>
  }

  const completoSinEnviar = () => {
    return <Steps current={current}
    type="navigation"
    size="small"
    className="site-navigation-steps">
      <Step

        status={generalStatus[0]}
        title="Inscripción"
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_INSCRIPCION))
          cleanErrors()
          router.push('/informacion_basica')
        }}
      />
      <Step
        title="Información"
        status={generalStatus[1]}
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_INFORMACION))
          cleanErrors()
          router.push('/domicilio')
        }}
      />
      <Step
        disabled={!completaBalanceYObras}
        status={generalStatus[2]}
        title="DDJ de Ejercicios"
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_BALANCES))
          cleanErrors()
          router.push('/ejercicios')
        }}
      />
      <Step
        disabled={!completaBalanceYObras}
        status={generalStatus[3]}
        title="DDJ de obras"
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_OBRAS))
          cleanErrors()
          router.push('/obras')
        }} />
    </Steps>
  }

  const sinObrasYConEnviar = () => {
    return <Steps current={current}
    type="navigation"
    size="small"
    className="site-navigation-steps">
      <Step

        status={generalStatus[0]}
        title="Inscripción"
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_INSCRIPCION))
          cleanErrors()
          router.push('/informacion_basica')
        }}
      />
      <Step
        title="Información"
        status={generalStatus[1]}
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_INFORMACION))
          cleanErrors()
          router.push('/domicilio')
        }}
      />
      

      <Step
        title="Enviar trámite"
        status={generalStatus[4]}
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_ENVIAR))
          cleanErrors()
          router.push('/enviar_tramite')
        }}
      />
    </Steps>
  }

  const sinObrasYSinEnviar = () => {
    return <Steps current={current}
    type="navigation"
    size="small"
    className="site-navigation-steps">
      <Step

        status={generalStatus[0]}
        title="Inscripción"
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_INSCRIPCION))
          cleanErrors()
          router.push('/informacion_basica')
        }}
      />
      <Step
        title="Información"
        status={generalStatus[1]}
        className="cursor-pointer"
        onClick={() => {
          dispatch(setPaso(SET_PASOS.SET_PASO_INFORMACION))
          cleanErrors()
          router.push('/domicilio')
        }}
      />
    </Steps>
  }

  const renderStepers = () =>{
    if (completaBalanceYObras && allowGuardar(tramite))
      return completo()

    
    if (completaBalanceYObras && !allowGuardar(tramite))
      return completoSinEnviar()

    if (!completaBalanceYObras && allowGuardar(tramite))
      return sinObrasYConEnviar()

    if (!completaBalanceYObras && !allowGuardar(tramite))
      return sinObrasYSinEnviar()

  }

  
  return <div className="px-20 pt-2">
    {renderStepers()}
    <style>
      {`
      .ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item{
        padding-bottom:5px;
      }
      .ant-steps-item::after{
        display:none !important;
      }
      .ant-steps-item-icon, .ant-steps-item-content{
        margin-right:20px
      }
      `}
    </style>
  </div>
}








