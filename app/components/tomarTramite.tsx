import React, { useEffect, useState } from 'react'
import { Tag } from 'antd'
import { UnlockFilled, LockFilled } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { lockTramite, unLockTramite } from '../redux/actions/main'
import { getUsuario } from '../services/business'
import { InitRevisionTramite } from '../redux/actions/revisionTramite'
import { RootState } from '../redux/store'

export interface TomarTramiteProps {
  user: Usuario
}

export const TomarTramite: React.FC<TomarTramiteProps> = ({
  user = null
}) => {

  const dispatch = useDispatch()
  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta || {})
  const revisionTramite: RevisionTramite = useSelector((state: RootState) => state.revisionTramites.revision)

  const [usuarioLogueado, setUsuarioLogueado] = useState(null)

  useEffect(() => {
    setUsuarioLogueado(getUsuario())
  },[])

  if ((!usuarioLogueado) || (!tramite))
    return <div></div>

  const Locked = () => {
    return <div onClick={() => {
      
      if (tramite.asignadoA.cuit === user.cuit){
        tramite.asignadoA = null
        dispatch(unLockTramite(Object.assign({},tramite)))
      }
        
    }}>
      <Tag color="red" className="" >
        <div><LockFilled /> {usuarioLogueado.userData().cuit === tramite.asignadoA.cuit ? 'Liberar Tramite' : tramite.asignadoA.GivenName + ', ' + tramite.asignadoA.Surname} </div>
      </Tag>
    </div>
  }

  const UnLocked = () => {
    return <div onClick={async () => {
 
    if ((tramite.status==='SUBSANADO A SUPERVISAR') 
    || (tramite.status ==='SUBSANADO EN REVISION')
    || (tramite.status ==='A SUPERVISAR')
    || (tramite.status ==='EN REVISION')
    || (tramite.status ==='PENDIENTE DE APROBACION')
    || (tramite.status ==='PENDIENTE DE REVISION')
    || (tramite.status ==='SUBSANADO')
      )  {
        tramite.asignadoA = user as Usuario
        await dispatch(InitRevisionTramite())
        await dispatch(lockTramite(Object.assign({},tramite)))
      }
      tramite.status 
    
    }
    
    
    }>
      <Tag color="green" className="" >
        <div><UnlockFilled /> Tomar Tramite </div>
      </Tag>
    </div>
  }

  if (!tramite)
    return <div></div>

  const showComponente = () => tramite.status==='PENDIENTE DE REVISION'|| 
    (tramite.status==='A SUPERVISAR' && getUsuario().isSupervisor())  || 
    (tramite.status==='A SUPERVISAR'  && getUsuario().isAprobador())  || 
    (tramite.status=='SUBSANADO' && getUsuario().isBackOffice()) ||  
    (tramite.status=='SUBSANADO EN REVISION' && getUsuario().isBackOffice()) ||  
    (tramite.status=='SUBSANADO A SUPERVISAR' && getUsuario().isSupervisor()) || 
    (tramite.status=='SUBSANADO A SUPERVISAR' && getUsuario().isAprobador()) || 
    (tramite.status=='EN REVISION' && getUsuario().isBackOffice())

  const isLocked = () => !tramite.asignadoA ? false : true


  return <div>
    {showComponente() ? !isLocked() ? <UnLocked />: <Locked />: ''}
  </div>
}