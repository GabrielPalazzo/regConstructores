import React, { useState, useEffect } from 'react';
import { Router, useRouter } from 'next/router'
import { NavigationStep } from '../components/steps'
import { InputText } from '../components/input_text'
import InputTextModal from '../components/input_text_modal'
import { HeaderPrincipal } from '../components/header'
import Upload from '../components/upload'
import Switch from '../components/switch'
import { Button, Card, Steps, Modal, Select, Table, Space, Empty, Alert, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SelectModal from '../components/select_modal'
import LikeDislike from '../components/like_dislike'
import Substeps from '../components/subSteps'
import { DeleteOutlined } from '@ant-design/icons'
import InputNumberModal from '../components/input_number'
import Wrapper from '../components/wrapper'

import DatePickerModal from '../components/datePicker_Modal'
import { useDispatch, useSelector } from 'react-redux'
import { getEmptyTramiteAlta, getTramiteByCUIT, isPersonaFisica, isConstructora, isTramiteEditable, allowGuardar } from '../services/business';
import { saveTramite, setTramiteView } from '../redux/actions/main'
import { updateRevisionTramite } from '../redux/actions/revisionTramite';
import moment from 'moment';
import { RootState } from '../redux/store';

const { Step } = Steps;
const { Option } = Select;






const renderNoData = () => {


  return (<div>
    <Card>
      <div className="mt-4">
        <div className="text-sm text-center">No hay Datos ingresados</div>
        <div className="text-primary-700 text-sm text-center mt-2 font-bold flex justify-center">Cargue uno presionando Agregar
          <svg width="70" height="31" viewBox="0 0 70 31" fill="none" xmlns="http://www.w3.org/2000/svg" className="pl-2">
            <path d="M30.8624 25.6685L31.1624 26.6225L30.8624 25.6685ZM69.9995 2.03192C70.0171 1.47992 69.5839 1.01814 69.0319 1.00051L60.0365 0.713215C59.4845 0.695585 59.0227 1.12878 59.0051 1.68078C58.9875 2.23279 59.4207 2.69457 59.9727 2.7122L67.9686 2.96757L67.7132 10.9635C67.6956 11.5155 68.1288 11.9773 68.6808 11.9949C69.2328 12.0125 69.6946 11.5793 69.7122 11.0273L69.9995 2.03192ZM1 29.8452C0.886109 30.8387 0.886455 30.8388 0.886848 30.8388C0.88704 30.8388 0.887479 30.8389 0.887865 30.8389C0.888635 30.839 0.889592 30.8391 0.890733 30.8392C0.893015 30.8395 0.896038 30.8398 0.899799 30.8402C0.907319 30.8411 0.917788 30.8422 0.931181 30.8436C0.957967 30.8464 0.996449 30.8503 1.04643 30.855C1.14638 30.8645 1.29231 30.8773 1.48262 30.8914C1.86323 30.9197 2.42138 30.9531 3.14418 30.9753C4.58971 31.0198 6.69421 31.0195 9.35444 30.8432C14.6748 30.4906 22.2199 29.4339 31.1624 26.6225L30.5625 24.7146C21.7905 27.4724 14.4045 28.5041 9.22219 28.8476C6.63111 29.0193 4.59145 29.0189 3.20566 28.9763C2.51279 28.955 1.98348 28.9231 1.63055 28.8969C1.45408 28.8838 1.32173 28.8722 1.23508 28.864C1.19176 28.8599 1.15986 28.8566 1.1396 28.8545C1.12946 28.8534 1.12224 28.8526 1.11795 28.8522C1.1158 28.8519 1.11439 28.8518 1.11371 28.8517C1.11337 28.8517 1.11322 28.8517 1.11325 28.8517C1.11326 28.8517 1.11342 28.8517 1.11343 28.8517C1.11364 28.8517 1.11389 28.8517 1 29.8452ZM31.1624 26.6225C49.0798 20.9894 57.7588 13.9165 69.6842 2.72932L68.3158 1.27068C56.4952 12.3597 48.0739 19.2091 30.5625 24.7146L31.1624 26.6225Z" fill="#0072BB" />
          </svg></div>
      </div>
    </Card>

  </div>)
}

export default (props) => {

  const [visible, setVisible] = useState<boolean>(false)

  const [modalPropietarios, setModalPropietarios] = useState(false)
  const [modalSanciones, setModalSanciones] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [waitingType, setWaitingType] = useState('sync')
  const dispatch = useDispatch()
  const router = useRouter()
  const [tramite, setTramite] = useState<TramiteAlta>(useSelector((state: RootState) => state.appStatus.tramiteAlta) || getEmptyTramiteAlta())
  const tipoAccion: string = useSelector((state: RootState) => state.appStatus.tipoAccion) || 'SET_TRAMITE_NUEVO'
  const statusGeneralTramite = useSelector((state: RootState) => state.appStatus.resultadoAnalisisTramiteGeneral)
  const [titular, setTitular] = useState('')
  const [cuit, setCuit] = useState('')
  const [porcentajeCapital, setPorcentajeCapital] = useState(0)
  const [montoCapital, setMontoCapital] = useState(0)
  const [cantidadVoto, setCantidadVoto] = useState(0)
  const [observaciones, setObservaciones] = useState('')
  const [tipoPersoneriaPropietarios, setTipoPersoneriaPropietarios] = useState('')
  const [archivos, setArchivos] = useState([])
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)


  useEffect(() => {
    if (!tramite.cuit && tipoAccion !== 'SET_TRAMITE_NUEVO')
      router.push('/')
  }, [])

  const save = async () => {
    setWaitingType('sync')

    setIsLoading(true)
    updateObjTramite()
    if (tramite._id) {
      await dispatch(saveTramite(tramite))
    } else {
      if (!(await getTramiteByCUIT(tramite.cuit)))
        await dispatch(saveTramite(tramite))
    }

  }

  const updateObjTramite = () => {
    setTramite(Object.assign({}, tramite))
  }






  const handleCancel = e => {
    setVisible(false)
  }



  const renderModalPropietarios = () => {
    return (<div>
      {showError ? <div className="mb-4">
        <Alert
          message=''
          description={error}
          type="error"
          showIcon
          closable
          afterClose={() => setShowError(false)}
        /></div> : ''}
      <div className="grid grid-cols-2 gap-4 ">
        <div className="pb-6" >
          <InputTextModal
            label="Titular"
            labelRequired="*"
            placeholder="Ingrese el Nombre y apellido"
            value={titular}
            bindFunction={(value) => setTitular(value)}
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <InputTextModal
            label="CUIT"
            placeholder="Ingrese el Código Tributario de su pais de origen"
            labelRequired="*"
            value={cuit}
            bindFunction={(value) => setCuit(value)}

            labelMessageError=""
            required />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 ">

        <div className="pb-6" >
          <InputNumberModal
            label="% del capital"
            labelRequired="*"
            className=""
            placeholder="Ingrese El porcentaje del Capital "
            step=".01"
            value={porcentajeCapital}
            bindFunction={(value) => { setPorcentajeCapital(value) }}
            labelMessageError=""
            required />

        </div>

        <div className="pb-6" >
          <InputNumberModal
            label="Monto del capital"
            labelRequired="*"
            className=""
            placeholder="Ingrese El porcentaje del Capital debe "
            step=".01"
            value={montoCapital}
            bindFunction={(value) => { setMontoCapital(value) }}
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <InputNumberModal
            label="Cantidad de votos"
            labelRequired="*"
            className=""
            placeholder="Ingrese El porcentaje del Capital debe "
            step=".01"
            value={cantidadVoto}
            bindFunction={(value) => { setCantidadVoto(value) }}
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <SelectModal
            title="Tipo de personeria"
            defaultOption="Seleccione el tipo de personeria"
            labelRequired="*"
            labelMessageError=""
            required
            value={tipoPersoneriaPropietarios}
            bindFunction={(value) => setTipoPersoneriaPropietarios(value)}
            option={tipoPersoneria.map(u => (
              <Option value={u.value}>{u.label}</Option>

            ))} />

        </div>
      </div>
      <div className="grid grid-cols-1  ">
        <div className="pb-6" >
          <InputTextModal
            label="Observaciones"
            placeholder="descripcion "
            value={observaciones}
            bindFunction={(value) => { setObservaciones(value) }}
            labelMessageError=""
            required />

        </div>
        {/*
        <div className="pb-6" >
          <Upload
            label="Adjunte  Documento "
            labelRequired="*"
            labelMessageError=""
            defaultValue={archivos as any}
            onOnLoad={file =>{
              archivos.push(file)
              setArchivos(Object.assign([],archivos))
            }}
            onRemove={fileToRemove => {
              setArchivos(Object.assign([],archivos.filter(f=> f.cid !==fileToRemove.cid)))
            }}
          />
        </div> */}

      </div>

    </div>)
  }
  const clearState = () => {
    setCantidadVoto(0)
    setCuit('')
    setMontoCapital(0)
    setObservaciones('')
    setPorcentajeCapital(0)
    setTipoPersoneriaPropietarios('')
    setTitular('')
  }


  const agregarPropietario = async () => {
    if (!tramite.propietarios)
      tramite.propietarios = []

    if (!titular) {
      setError('El titular es requerido')
      setShowError(true)
      return
    }
    if (!cuit) {
      setError('El cuit  es requerida')
      setShowError(true)
      return
    }
    if (!porcentajeCapital) {
      setError('El porcentaje del Capital es requerido')
      setShowError(true)
      return
    }

    if (!cantidadVoto) {
      setError('La cantidad de votos  es requerida')
      setShowError(true)
      return
    }

    if (!montoCapital) {
      setError('El monto Capital es requerido')
      setShowError(true)
      return
    }

    if (!tipoPersoneriaPropietarios) {
      setError('El tipo de personeria es requerido')
      setShowError(true)
      return
    }


    tramite.propietarios.push({
      archivos,
      cantidadVotos: cantidadVoto,
      cuit,
      montoCapital,
      observaciones,
      porcentajeCapital,
      tipoPersoneria: tipoPersoneriaPropietarios,
      titular
    })
    updateObjTramite()
    await save()

    setIsLoading(false)
    setModalPropietarios(false)
    clearState()

  }


  const removePropietario = (record) => {
    tramite.propietarios = tramite.propietarios.filter(p => p.cuit !== record.cuit)
    updateObjTramite()
    save()
    setIsLoading(false)
  }

  const columnsPropietarioSoc = [
    {
      title: 'Eliminar',
      key: 'action',
      render: (text, record) => (tramite && tramite.status === 'BORRADOR' || tramite && tramite.status === 'OBSERVADO' ? <div onClick={() => removePropietario(record)}><DeleteOutlined /></div> : <Space size="middle"></Space>)
    },
    {
      title: 'Titular',
      dataIndex: 'titular',
      key: 'titular',
    },
    {
      title: 'CUIT',
      dataIndex: 'cuit',
      key: 'cuit',
    },
    {
      title: '%  de Capital',
      dataIndex: 'porcentajeCapital',
      key: 'porcentajeCapital',
    },
    {
      title: 'Monto de Capital',
      dataIndex: 'montoCapital',
      key: 'montoCapital',
    },
    {
      title: 'Cantidad de Votos',
      dataIndex: 'cantidadVotos',
      key: 'cantidadVoto',
    },
    {
      title: 'Tipo de personería jurídica',
      dataIndex: 'tipoPersoneria',
      key: 'TPJ',
    },
    {
      title: 'Observaciones',
      dataIndex: 'observaciones',
      key: 'obs',
    },
    {
      title: 'Adjunto',
      render: (text, record) => <div>{record.archivos && record.archivos.map(f => f.name).join(', ')}</div>,
      key: 'attachment',
    },


  ];


  //console.log(tramite.propietarios)

  return (<div>
    <HeaderPrincipal tramite={tramite} onExit={() => router.push('/')} onSave={() => {
      save()
      router.push('/')
    }} />

    <div className="border-gray-200 border-b-2 flex ">
      <div className="px-20 pt-2 w-3/4">
        <NavigationStep 
        generalStatus={statusGeneralTramite} 
        current={1}  
        completaBalanceYObras={isConstructora(tramite) }  />
      </div>
      <div className="pt-2 w-1/4">
        <div className=" pt-4 text-center">

          <Button type="primary" onClick={async () => {
            await save()
            router.push('/ejercicios')
          }} > Guardar y Seguir</Button>

        </div>
      </div>
    </div>

    <div className="w-2/5 m-auto text-base mt-8">
      <Substeps progressDot current={2} esPersonaFisica={isPersonaFisica(tramite)} />
    </div>



    <div className="px-8  py-6 bg-muted-100">
      <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
        <div className="content-center  ">
          <Wrapper title="Propietario de sociedad" attributeName="Propietarioss" isTitle>
            <div className=" text-right content-center mb-4 -mt-8">
              {isTramiteEditable(tramite) ? <div>
                <div className="  text-right content-center -mt-8 ">
                  <Button type="primary" onClick={() => setModalPropietarios(true)} icon={<PlusOutlined />}> Agregar</Button>
                </div>
              </div> : ''}
            </div>
          </Wrapper>
          <div className="grid grid-cols-1 gap-4 mt-8">

            <div className="pb-6" >

              <Upload
                label={tramite.personeria === 'SA' ? "Último registro en el Libro de Depósito de Acciones" : "Contrato social o última modificación aprobada correspondiente a cesión de cuotas sociales "}
                labelRequired="*"
                labelMessageError=""
                defaultValue={tramite.archivoPropietarios2 as any}
                onOnLoad={file => {
                  if (!tramite.archivoPropietarios2)
                    tramite.archivoPropietarios2 = []
                  tramite.archivoPropietarios2.push(file)
                  save()
                  setIsLoading(false)
                }}
                onRemove={async fileToRemove => {
                  tramite.archivoPropietarios2 = tramite.archivoPropietarios2.filter(f => f.cid !== fileToRemove.uid)
                  updateObjTramite()
                  await save()
                  setIsLoading(false)
                }} />

            </div>


          </div>
          <Table columns={columnsPropietarioSoc} scroll={{ x: 1500 }} dataSource={Object.assign([], tramite.propietarios)} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }} />
          <Modal
            title="Datos del Propietario"
            visible={modalPropietarios}
            onOk={agregarPropietario}

            okText="Guardar"
            onCancel={() => setModalPropietarios(false)}
            cancelText="Cancelar"
            width={1000}
          >
            {renderModalPropietarios()}
          </Modal>
        </div>

      </div>


    </div>
  </div>
  )
}



const tipoPersoneria = [
  {
    label: 'Persona Fisica',
    value: 'PF',
  },
  {
    label: 'Sociedad Anonima',
    value: 'SA',
  },
  {
    label: 'Sociedad Responsabilidad Limitada',
    value: 'SRL',
  },


]

