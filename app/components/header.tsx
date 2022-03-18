import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button, Modal, Avatar, Dropdown, Menu, Input, Alert, Space, Tag, Tooltip, Timeline } from 'antd';
import { allowGuardar, cambiarADesActualizado, closeSession, getEmptyTramiteAlta, getUsuario, getColorStatus, rechazarTramite, hasObservacionesObra } from '../services/business';
import { ExclamationCircleOutlined, EditOutlined, SaveOutlined, ArrowLeftOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons';
import { setUpdateBorrador } from '../redux/actions/main';
import { cargarUltimaRevisionAbierta } from '../redux/actions/revisionTramite';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';
import _ from 'lodash'
import obras from '../pages/obras';

const { TextArea } = Input

export interface HeaderPrincipalProps {
  tramite: TramiteAlta
  onExit: () => void
  onSave: () => void
}


export const HeaderPrincipal: React.FC<HeaderPrincipalProps> = ({
 
  tramite,
  onExit,
  onSave
}) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showCancelar, setShowCancelar] = useState(false)
  const [showModalRechazar, setShowModalRechazar] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [loadingRechazo, setLoadingRechazo] = useState(false)
  const dispatch = useDispatch()
  const [activeProfile2, setActiveProfile2] = useState<TramiteAlta>(null)
  const [showProfile2, setShowProfile2] = useState(false)
  const revisionTramite = useSelector((state: RootState) => state.revisionTramites)

  const tramiteSession = useSelector((state: RootState) => state.appStatus.tramiteAlta) || getEmptyTramiteAlta()
  const [isModalVisibleObservaciones, setIsModalVisibleObservaciones] = useState(false);
  const confirmCancel = () => {
    setShowCancelar(false)
    onExit()
  }

  useEffect(() => {
    setUser(getUsuario())
  }, [])

  const cerrarSesion = () => {
    closeSession()
    router.push('/login')
  }

  const showModalObservaciones = () => {
    setIsModalVisibleObservaciones(true);
  };

  const handleOkObservaciones = () => {
    setIsModalVisibleObservaciones(false);
  };

  const handleCancelObservaciones = () => {
    setIsModalVisibleObservaciones(false);
  };



  const menu = (
    <Menu>
      <Menu.Item>
        <div >
          <a href="https://www.argentina.gob.ar/jefatura/innovacion-publica/onc/registro-nacional-de-constructores/normas-internas" target="_blank">
            Normativa e Instructivos
          </a>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={cerrarSesion}>
          Cerra sesión
        </div>
      </Menu.Item>


    </Menu>
  );
  const reviewAbierta = revisionTramite.revision && revisionTramite.revision.reviews.filter(r => !r.isOk)
  
 


	

  const handleRechazarTramite = async () => {

    setLoadingRechazo(true)
    await rechazarTramite(tramite, motivoRechazo)
    router.push('/backoffice/bandeja')
  }


  const ButtonActualizar = () => {
    const [showActualizarConfirmacion, setShowActualizarConfirmacion] = useState(false)
    const [waitingConfirmFromServer, setWaitingConfirmFromServer] = useState(false)
    const handleConfirmarAcutalizar = async () => {
      setWaitingConfirmFromServer(true)
      const newTramite = await cambiarADesActualizado(tramite)
      console.log('tramite:', newTramite._id)
      await dispatch(setUpdateBorrador(newTramite))
      await dispatch(cargarUltimaRevisionAbierta(newTramite))
      router.push('/informacion_basica')
      // setWaitingConfirmFromServer(false)
      // setShowActualizarConfirmacion(false)
    }

    return <div>
      <Modal
        title="Actualización de datos"
        visible={showActualizarConfirmacion}
        onCancel={() => setShowActualizarConfirmacion(false)}
        footer={[
          <Button key="back" onClick={() => setShowActualizarConfirmacion(false)}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" loading={waitingConfirmFromServer} onClick={handleConfirmarAcutalizar}>
            Aceptar
          </Button>,
        ]}
      >
        <p>Ud puede comenzar el proceso de actualización y enviarlo cuando considere necesario. </p>
        <p>Una vez que pulsa Aceptar comienza el proceso de actualización. </p>

        <p>Desea actualizar la información de su empresa?</p>
      </Modal>
      <Button onClick={() => setShowActualizarConfirmacion(true)} type='text' style={{ fontWeight: 'bold', }}>  <EditOutlined /> Actualizar datos</Button>
    </div>
  }

  if (!user)
    return <div></div>


  return <div className="py-2 flex justify-between content-center border-gray-200 border-b-2">

    <Modal title="RECHAZAR TRAMITE"
      visible={showModalRechazar}

      footer={[
        <Button onClick={() => setShowModalRechazar(false)}>Cancelar</Button>,
        <Button loading={loadingRechazo} type="primary" onClick={handleRechazarTramite} >Rechazar</Button>
      ]}

    >
      <p>Esta seguro que desea rechazar el trámite?</p>
      <p>Por favor, indique el motivo de rechazo</p>
      <p />
      <TextArea value={motivoRechazo} onChange={e => setMotivoRechazo(e.target.value)} rows={4} />

    </Modal>
    <Modal title="Ver observaciones"
      visible={isModalVisibleObservaciones}
      onOk={handleOkObservaciones}
      onCancel={handleCancelObservaciones}
      width={1000}>
      <div className="text-3xl font-bold  text-black-700 pb-4 ">{activeProfile2 && activeProfile2.razonSocial}</div>
      <div className="text-base  text-black-700 pb-4 ">
        <Timeline>
          {activeProfile2 && activeProfile2.rechazos.map(e => <div><Timeline.Item>{e.motivo}</Timeline.Item></div>)}

          {reviewAbierta &&
            <div> {reviewAbierta.map(r => <Timeline.Item> {r.field}: {r.review} </Timeline.Item> )}</div>}
          
        </Timeline>
      </div>
    </Modal>

    <Modal
      title="Cancelar operación"
      visible={showCancelar}

      footer={[
        <Button onClick={() => setShowCancelar(false)}>Volver</Button>,
        <Button type="primary" onClick={confirmCancel} >Cancelar operación</Button>
      ]}

    >
      <p>Todos los cambios no guardados se perderán.</p>
    </Modal>
    <div className="flex px-4 pt-4 py-2">
      <Logo />
      <div className="pl-4 uppercase text-muted-700 align-middle pt-1 text-sm font-bold pb-4  ">{tramite.razonSocial}</div>
      <div className="pl-4 uppercase text-muted-700 align-middle pt-1 text-sm font-bold pb-4  ">cuit:{tramite.cuit}</div>
    </div>

    <div className="flex text-sm font-bold text-info-700 pr-6 text-right py-4 cursor-pointer">

      {(user.isConstructor() && (tramite.categoria == 'INSCRIPTO' && tramite.status === 'VERIFICADO')) || (user.isConstructor() && (tramite.categoria == 'INSCRIPTO CON ACTUALIZACION' && tramite.status === 'VERIFICADO')) || (user.isConstructor() && (tramite.categoria == 'DESACTUALIZADO' && tramite.status === 'VERIFICADO')) ?
        <ButtonActualizar /> : <div />}

      {user.isAprobador() && tramite.categoria !== 'INSCRIPTO' ? <Button onClick={() => {
        setShowModalRechazar(true)
      }} danger type='text' style={{ fontWeight: 'bold', marginLeft: '10px', color: '#F5222D' }} >
        <CloseOutlined />Rechazar tramite</Button> : ''}

     <Button danger type="text" onClick={() => setShowCancelar(true)} style={{ color: '#ED3D8F', fontWeight: 'bold', }}>
        <ArrowLeftOutlined /> Cancelar
      </Button>

      { tramite.status==='OBSERVADO'  ||  !user.isConstructor() && tramite.status !=='BORRADOR' ?
      
      <div className="text-left ">
        <Button type="link" style={{ textAlign: "left", padding: 0, color: '#0072bb' }}
          onClick={() => {
            showModalObservaciones()
            setActiveProfile2(tramite)
            setShowProfile2(true)
          }}> <BellOutlined /></Button>
      </div> : ''
      }


      {tramite && tramite.cuit && allowGuardar(tramiteSession) ? <Button type="link" style={{ fontWeight: 'bold', marginLeft: '10px' }} onClick={onSave}> <SaveOutlined /> Guardar y salir</Button> : ''}
      <Tooltip title="Estado de la Trámite">
        <Tag color={getColorStatus(tramite)}>{tramite.status}</Tag>
      </Tooltip>
      <div className=" text-xs   text-muted-700 mr-2 mt-2"> OBSERVADO:{tramite.cantidadObservado} </div>
      <div className=" text-xs   text-muted-700 mr-2 mt-2">SUBSANADO:{tramite.cantidadSubsanado} </div>
  
      <Dropdown overlay={menu} trigger={['click']}>
        <div onClick={e => e.preventDefault()}>
          <Avatar style={{ color: '#fff', backgroundColor: '#50B7B2', marginLeft: '10px' }} >{user.userData().GivenName.substring(0, 1)}</Avatar>
        </div>
      </Dropdown>
      </div>
    
      
    <style>
      {`
      .ant-tag{height: 25px;
        margin-top: 4px;
        padding-left: 5px;
        padding-right: 5px;
        margin-left: 10px;}`
      }
    </style>

  </div>
}

const Logo = () => (
  <svg width="153" height="28" viewBox="0 0 153 28" fill="none" >
    <rect width="152.542" height="28" fill="url(#pattern0)" />
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use href="#image0" transform="scale(0.00333333 0.0169492)" />
      </pattern>
      <image id="image0" width="300" height="59" href="data:image/png;base64,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" />
    </defs>
  </svg>
)



