import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { HeaderPrincipal } from '../components/header'
import { Button, Steps, Card } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import { saveTramite, setStatusGeneralTramite } from '../redux/actions/main'
import { getEmptyTramiteAlta, getTramiteByCUIT, isConstructora, isPersonaFisica } from '../services/business';
import { RootState } from '../redux/store';

const { Step } = Steps;
export default () => {
  const [isLoading, setIsLoading] = useState(false)
  const [waitingType, setWaitingType] = useState('sync')
  const dispatch = useDispatch()
  const router = useRouter()
  const [tramite, setTramite] = useState<TramiteAlta>(useSelector((state: RootState) => state.appStatus.tramiteAlta) || getEmptyTramiteAlta())

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
 
  return <div>
    <HeaderPrincipal tramite={tramite} onExit={() => router.push('/')} onSave={() => {
      router.push('/')
    }} />


    <div className="px-20 py-6 text-center m-auto mt-6">
      <CheckCircleFilled style={{ fontSize: 60, color: '#2E7D33' }} />
      <div className="text-2xl font-bold py-4 text-center"> Su trámite ha sido enviado</div>
      <Card className="rounded mr-2 text-center m-autop" style={{ width: 500, margin: 'auto' }}>
        <div className="text-muted-700 text-sm px-8 mt-4 self-center"  > Su solicitud  ha sido completada y será enviada a la ONC para su revisión.</div>
        <div className="text-muted-700 text-sm px-8 mt-4 self-center"  > Nos pondremos en contacto al mail consignado del Administrador Legitimado.</div>
       { /*<div className="text-base font-bold mt-4 text-primary-700 pb-2 "> Numero de tramite : EX-2020-12345677-APN-MM</div>*/}
      </Card>

      <div className="mt-6 pt-4 text-center">
        <Button type="primary" onClick={() => router.push('/')}> Volver al inicio</Button>
      </div>
    </div>

  </div>
}


