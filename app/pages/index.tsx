import React, { useEffect, useState } from 'react';
import { Button, Card, Avatar, Menu, Dropdown, Breadcrumb } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'
import { setActionType } from '../redux/actions/main'
import { SET_TRAMITE_NUEVO } from '../redux/reducers/main'
import { useDispatch, useSelector } from 'react-redux'
import { BandejaConstructor } from '../components/bandejaConstructor';
import { closeSession, getToken, getTramites, getUsuario } from '../services/business';
import { Loading } from '../components/loading';
import axios from 'axios'
import { RootState } from '../redux/store';

export default () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<Usuario>(null)
  const [tramites, setTramites] = useState<Array<TramiteAlta>>([])
  const tipoAccion = useSelector((state: RootState) => state.appStatus.tipoAccion)


  const loadTramites = async () => {
    setTramites(await getTramites())
  }

  useEffect(() => {
    (async () => {
      const usuario = getUsuario().userData()

      if (!usuario) {
        router.push('/login')
        return
      }

      if (getUsuario().isBackOffice()) {
        router.push('/backoffice/bandeja')
        return
      }


      loadTramites()
      setIsLoading(false)
      setUser(usuario)

    })()
  }, [])



  const cerrarSesion = () => {
    closeSession()
    router.push('/login')
  }



  const noData = () => {
    return <div className="px-20"> <Card>
      <div className="mt-4">
        <div className="text-sm text-center">No hay trámites generados</div>
        <div className="text-primary-700 text-sm text-center mt-2 font-bold flex justify-center">Cargue uno presionando Nuevo trámite
  <svg width="70" height="31" viewBox="0 0 70 31" fill="none" xmlns="http://www.w3.org/2000/svg" className="pl-2">
            <path d="M30.8624 25.6685L31.1624 26.6225L30.8624 25.6685ZM69.9995 2.03192C70.0171 1.47992 69.5839 1.01814 69.0319 1.00051L60.0365 0.713215C59.4845 0.695585 59.0227 1.12878 59.0051 1.68078C58.9875 2.23279 59.4207 2.69457 59.9727 2.7122L67.9686 2.96757L67.7132 10.9635C67.6956 11.5155 68.1288 11.9773 68.6808 11.9949C69.2328 12.0125 69.6946 11.5793 69.7122 11.0273L69.9995 2.03192ZM1 29.8452C0.886109 30.8387 0.886455 30.8388 0.886848 30.8388C0.88704 30.8388 0.887479 30.8389 0.887865 30.8389C0.888635 30.839 0.889592 30.8391 0.890733 30.8392C0.893015 30.8395 0.896038 30.8398 0.899799 30.8402C0.907319 30.8411 0.917788 30.8422 0.931181 30.8436C0.957967 30.8464 0.996449 30.8503 1.04643 30.855C1.14638 30.8645 1.29231 30.8773 1.48262 30.8914C1.86323 30.9197 2.42138 30.9531 3.14418 30.9753C4.58971 31.0198 6.69421 31.0195 9.35444 30.8432C14.6748 30.4906 22.2199 29.4339 31.1624 26.6225L30.5625 24.7146C21.7905 27.4724 14.4045 28.5041 9.22219 28.8476C6.63111 29.0193 4.59145 29.0189 3.20566 28.9763C2.51279 28.955 1.98348 28.9231 1.63055 28.8969C1.45408 28.8838 1.32173 28.8722 1.23508 28.864C1.19176 28.8599 1.15986 28.8566 1.1396 28.8545C1.12946 28.8534 1.12224 28.8526 1.11795 28.8522C1.1158 28.8519 1.11439 28.8518 1.11371 28.8517C1.11337 28.8517 1.11322 28.8517 1.11325 28.8517C1.11326 28.8517 1.11342 28.8517 1.11343 28.8517C1.11364 28.8517 1.11389 28.8517 1 29.8452ZM31.1624 26.6225C49.0798 20.9894 57.7588 13.9165 69.6842 2.72932L68.3158 1.27068C56.4952 12.3597 48.0739 19.2091 30.5625 24.7146L31.1624 26.6225Z" fill="#0072BB" />
          </svg></div>
      </div>
    </Card> </div>
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <div >
          <a href="https://www.argentina.gob.ar/jefatura/innovacion-publica/onc/registro-nacional-de-constructores/normas-internas" target="_blank" style={{color:'#000'}}>
           Normativa e Instructivos
        </a>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={cerrarSesion}>
          Cerrar sesión
        </div>
      </Menu.Item>

    </Menu>
  );



  if (isLoading || !user)
    return <Loading message='' type='waiting' />




  return <div>
    <div className="py-2 flex justify-between content-center border-gray-200 border-b-2">
      <div className="px-4 pt-4 py-2">
        <img src="../img/logo.png" style={{ width: '150px' }} />
      </div>
      <div className="text-sm font-bold text-info-700 pr-6 text-right pt-2 cursor-pointer">
        <Dropdown overlay={menu} trigger={['click']}>
          <div onClick={e => e.preventDefault()}>
            <Avatar style={{ color: '#fff', backgroundColor: '#50B7B2' }} >{user.GivenName.substring(0, 1)}</Avatar>
          </div>
        </Dropdown>


      </div>

    </div>
    <div className="px-4 py-2 bg-gray-200">
      <Breadcrumb>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item><a href="https://www.argentina.gob.ar/jefatura" target="_blank"> Jefatura de Gabinete de Ministros</a></Breadcrumb.Item>
        <Breadcrumb.Item><a href="https://www.argentina.gob.ar/jefatura/innovacion-publica" target="_blank">Innovación Pública</a></Breadcrumb.Item>
        <Breadcrumb.Item><a href="https://www.argentina.gob.ar/jefatura/innovacion-publica/oficina-nacional-de-contrataciones-onc" target="_blank">Oficina Nacional de Contrataciones - ONC</a></Breadcrumb.Item>
        <Breadcrumb.Item><a href="https://www.argentina.gob.ar/jefatura/innovacion-publica/oficina-nacional-de-contrataciones-onc/acordar" target="_blank">Acordar</a></Breadcrumb.Item>
        <Breadcrumb.Item>Acuerdos</Breadcrumb.Item>
        <Breadcrumb.Item>Trámites</Breadcrumb.Item>
      </Breadcrumb>
    </div>
    <div className="md:px-8  mx-8 py-6 grid grid-cols-2 px-4 ">

      <div className="text-2xl font-bold py-4"> Empresas administradas</div>
      <div className="text-2xl font-bold py-4 text-right">
        <Button type="primary" icon={<PlusOutlined />}
          style={{ fontWeight: 600 }}
          onClick={async () => {
            await dispatch(setActionType(SET_TRAMITE_NUEVO))
            router.push('/informacion_basica')
          }}>Nueva inscripción </Button>
      </div>
    </div>
    <div className="pb-10">
      {tramites.length === 0 ? noData() : <BandejaConstructor masterLoadingFunction={setIsLoading} refreshFunction={loadTramites} tramites={tramites} />}
    </div>
    <div className="pb-4 text-center  border-gray-200 border-t-2" >


     <div className="text-sm mt-2"> version: 1.25.C.1</div> 


  </div>
  </div>
}




const Logo = () => (
  <svg width="153" height="30" viewBox="0 0 153 30" fill="none" >
    <rect width="152.542" height="30" fill="url(#pattern0)" />
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use href="#image0" transform="scale(0.00333333 0.0169492)" />
      </pattern>
      <image id="image0" width="300" height="59" href="data:image/png;base64,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" />
    </defs>
  </svg>
)

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">
        Cerrar sesion
      </a>
    </Menu.Item>

  </Menu>
);