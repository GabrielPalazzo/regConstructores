import React, { useState, useEffect, useDebugValue } from 'react';
import { useRouter } from 'next/router'
import { NavigationStep } from '../components/steps'
import { InputText } from '../components/input_text'
import InputTextModal from '../components/input_text_modal'
import { HeaderPrincipal } from '../components/header'
import DatePicker from '../components/datePicker'
import Switch from '../components/switch'
import DatePickerModal from '../components/datePicker_Modal'
import Upload from '../components/upload'
import { Button, Card, Steps, Modal, Space, Table, Select, Checkbox, Collapse, Tooltip, Empty, Alert, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Substeps from '../components/subSteps'
import Link from 'next/link'
import LikeDislike from '../components/like_dislike'
import SelectModal from '../components/select_modal'
import UploadLine from '../components/uploadLine'
import InputNumberModal from '../components/input_number'
import { QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { allowGuardar, getEmptyTramiteAlta, getTramiteByCUIT, isConstructora, isPersonaFisica, isTramiteEditable } from '../services/business';
import { saveTramite } from '../redux/actions/main'

import { LinkToFile } from '../components/linkToFile';

import Wrapper from '../components/wrapper'
import { RootState } from '../redux/store';
import wrapper from '../components/wrapper';

function confirm(e) {
  console.log(e);
  message.success('Se elimino correctamente');
}

function cancel(e) {
  console.log(e);
  message.error('Ha cancelado la operacion');
}


const { Panel } = Collapse;
const { Option } = Select;

export default () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [visible, setVisible] = useState<boolean>(false)

  const [modalAutoridad, setModalAutoridad] = useState(false)
  const [modalCalidad, setModalCalidad] = useState(false)
  const [waitingType, setWaitingType] = useState('sync')
  const [isLoading, setIsLoading] = useState(false)

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [tipoDocumento, setTipoDocumento] = useState('')
  const [nroDocumento, setNroDocumento] = useState('')
  const [tipoOrgano, setTipoOrgano] = useState('')
  const [tipoCargo, setTipoCargo] = useState('')
  const [direccion, setDireccion] = useState('')
  const [cuit, setCuit] = useState('')
  const [inhibiciones, setInhibiciones] = useState(false)
  const [observaciones, setObservaciones] = useState('')
  const [fotosDNIAutoridades, setFotosDNIAutoridades] = useState([])
  const [autoridadesSociedad, setAutoridadesSociedad] = useState([])
  const [inversionesPermanentes, setInversionesPermanentes] = useState([])

  const [cuitSistemaCalidad, setCuitSistemaCalidad] = useState('')
  const [norma, setNorma] = useState('')
  const [direccionSistemaCalidad, setDireccionSistemaCalidad] = useState('')
  const [documentoSistemaCalidad, setDocumentoSistemaCalidad] = useState([])
  const [fechaOtorgamiento, setFechaOtorgamiento] = useState('')
  const [fechaExpiracion, setFechaExpiracion] = useState('')
  const [cuitNit, setCuitNit] = useState('')
  const [empresaParticipada, setEmpresaParticipada] = useState('')
  const [actividad, setActividad] = useState('')
  const [porcentajeCapital, setPorcentajeCapital] = useState(0)
  const [votos, setAVotos] = useState(0)
  const [idAutoridad, setIdAutoridad] = useState('')
  const [poseeIeric, setPoseeIeric] = useState(false)
  const [modificacionEstatutoDatos, setModificacionEstatutoDatos] = useState('')
  const [modificacionEstatutoFecha, setModificacionEstatutoFecha] = useState('')
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [autoridadesVencimiento, setAutoridadesVencimiento] = useState(false)

  const [tramite, setTramite] = useState<TramiteAlta>(useSelector((state: RootState) => state.appStatus.tramiteAlta) || getEmptyTramiteAlta())
  const tipoAccion: string = useSelector((state: RootState) => state.appStatus.tipoAccion) || 'SET_TRAMITE_NUEVO'
  const statusGeneralTramite = useSelector((state: RootState) => state.appStatus.resultadoAnalisisTramiteGeneral)

  useEffect(() => {

    if (!tramite.cuit && tipoAccion !== 'SET_TRAMITE_NUEVO')
      router.push('/')

  }, [])

  const save = async () => {
    setWaitingType('sync')

    setIsLoading(true)
    updateObjTramite()
    if (tramite._id) {
      await dispatch(saveTramite(Object.assign({}, tramite)))
    } else {
      if (!(await getTramiteByCUIT(tramite.cuit)))
        await dispatch(saveTramite(Object.assign({}, tramite)))
    }
    setIsLoading(false)
  }



  console.log(tramite)
  const { Step } = Steps;
  const renderModalCalidad = () => {
    return (<div>
      <div className="grid grid-cols-2 gap-4 ">
        <div className="pb-6" >
          <InputTextModal
            label="Organismo certificante"
            value={cuitSistemaCalidad}
            bindFunction={(value) => setCuitSistemaCalidad(value)}
            labelRequired="*"
            placeholder="Ingrese el nombre del organismo"

            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <InputTextModal
            label="Norma"
            labelRequired="*"
            value={norma}
            bindFunction={(value) => setNorma(value)}

            labelMessageError=""
            required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 ">

        <div className="pb-6" >
          <InputTextModal
            label="Procesos Certificados"
            labelRequired="*"
            placeholder=""
            value={direccionSistemaCalidad}
            bindFunction={(value) => setDireccionSistemaCalidad(value)}
            labelMessageError=""
            required />

        </div>
        <div className="grid grid-cols-2 gap-4 ">
          <div className="pb-6" >
            <DatePickerModal
              label="Fecha de otorgamiento"
              labelRequired="*"
              placeholder="Ingrese su numero de documento sin deja espacios"
              value={fechaOtorgamiento}
              bindFunction={(value) => setFechaOtorgamiento(value)}
              labelMessageError=""
            />

          </div>
          <div className="pb-6" >
            <DatePickerModal
              label="Fecha de expiracion"
              labelRequired="*"
              placeholder="Ingrese su numero de documento sin deja espacios"
              value={fechaExpiracion}
              bindFunction={(value) => setFechaExpiracion(value)}
              labelMessageError=""
            />
          </div>
        </div>


      </div>

      <div className="grid grid-cols-2 gap-4 ">
        <div className="pb-6" >
          <Upload
            label="Adjuntar copia del certificado de sistemas de calidad "
            labelRequired="*"
            labelMessageError=""
            defaultValue={documentoSistemaCalidad as any}
            onOnLoad={file => {
              documentoSistemaCalidad.push(file)
              setDocumentoSistemaCalidad(Object.assign([], documentoSistemaCalidad))
            }}
            onRemove={fileToRemove => {
              setDocumentoSistemaCalidad(Object.assign([], documentoSistemaCalidad.filter(d => d.cid !== fileToRemove.uid)))
            }}
          />
        </div>
      </div>
    </div>)
  }


  const renderModalAutoridad = () => {
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
            value={nombre}
            bindFunction={setNombre}
            label="Nombre"
            labelRequired="*"
            placeholder="Ingrese su nombre de Pila"
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <InputTextModal
            label="Apellido"
            value={apellido}
            bindFunction={setApellido}
            labelRequired="*"
            labelMessageError=""
            required />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 ">
        <div className="pb-6" >
          <SelectModal
            title="Tipo de Doc"
            defaultOption="Tipo de Doc"
            labelRequired="*"
            labelMessageError=""
            required
            value={tipoDocumento}
            bindFunction={(value) => setTipoDocumento(value)}
            option={TipoDocumento.map(u => (
              <Option value={u.value}>{u.label}</Option>

            ))}
          />

        </div>
        <div className="pb-6" >
          <InputTextModal
            label="Nº de Documento"
            labelRequired="*"
            placeholder="Ingrese su numero de documento sin deja espacios"
            value={nroDocumento}
            bindFunction={setNroDocumento}
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <SelectModal
            title="Tipo de Organo"
            defaultOption="Tipo de Organo"
            labelRequired="*"
            labelMessageError=""
            required
            value={tipoOrgano}
            bindFunction={(value) => setTipoOrgano(value)}
            option={TipoOrgano.map(u => (
              <Option value={u.value}>{u.label}</Option>

            ))}
          />


        </div>
        <div className="pb-6" >
          <SelectModal
            title="Tipo de Cargo"
            defaultOption="Tipo de Cargo"
            labelRequired="*"
            labelMessageError=""
            required
            value={tipoCargo}
            bindFunction={(value) => setTipoCargo(value)}
            option={TipoCargo.map(u => (
              <Option value={u.value}>{u.label}</Option>

            ))}
          />


        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 ">
        <div className="pb-6" >
          <InputTextModal
            label="Direccion"
            labelRequired="*"
            placeholder="Ingrese su email personal"
            value={direccion}
            bindFunction={setDireccion}
            labelMessageError=""
            required />

        </div>
        <div className="grid grid-cols-2 gap-4 ">
          <div className="pb-6" >
            <InputTextModal
              label="CUIT"
              labelRequired="*"
              value={cuit}
              bindFunction={setCuit}

              labelMessageError=""
              required />
          </div>

          <div className="pb-6" >
            <Switch
              value={inhibiciones}
              onChange={setInhibiciones}
              label="Inhibiciones"
              labelRequired="*"
              SwitchLabel1="Si"
              SwitchLabel2="No"
              labelObservation=""
              labeltooltip=""
              labelMessageError=""
            />
          </div>
        </div>


      </div>
      <div className="grid grid-cols-1 gap-4 ">
        <div className="pb-6" >
          <InputTextModal
            label="Observaciones"
            labelRequired="*"
            value={observaciones}
            bindFunction={setObservaciones}
            labelMessageError=""
            required />
        </div>

        <div className="pb-6" >

          <Upload
            label="Adjunte frente y dorso del DNI, Pasaporte, cédula de identidad "
            labelRequired="*"
            labelMessageError=""
            defaultValue={fotosDNIAutoridades as any}
            onOnLoad={(file) => {
              fotosDNIAutoridades.push(file)
              setFotosDNIAutoridades(Object.assign([], fotosDNIAutoridades))
            }}
            onRemove={fileToRemove => {
              setFotosDNIAutoridades(Object.assign([], fotosDNIAutoridades.filter(f => f.cid !== fileToRemove.uid)))
            }}
          />
        </div>
      </div>
    </div>)
  }


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



  const agregarAutoridades = async () => {
    if (!apellido.trim()) {
      setError('El Apellido  es requerido')
      setShowError(true)
      return
    }
    if (!nombre.trim()) {
      setError('El Nombre  es requerido')
      setShowError(true)
      return
    }

    if (!nroDocumento.trim()) {
      setError('El Numero de Documento  es requerido')
      setShowError(true)
      return
    }
    if (!cuit.trim()) {
      setError('El cuit  es requerido')
      setShowError(true)
      return
    }

    if (!tramite.autoridadesSociedad)
      tramite.autoridadesSociedad = []


    tramite.autoridadesSociedad.push({
      nombre,
      apellido,
      tipoDocumento,
      nroDocumento,
      tipoCargo,
      tipoOrgano,
      direccion,
      observaciones,
      cuit,
      inhibiciones,
      fotosDNI: fotosDNIAutoridades
    })
    setNombre('')
    setApellido('')
    setTipoDocumento('')
    setTipoCargo('')
    setTipoOrgano('')
    setDireccion('')
    setNroDocumento('')
    setObservaciones('')
    setCuit('')
    setFotosDNIAutoridades([])

    updateObjTramite()
    await save()
    setIsLoading(false)
    setModalAutoridad(false)
    clearState()



  }

  const addInversiones = async () => {
    if (!cuitNit.trim()) {
      setError('El cuit / nit  es requerido')
      setShowError(true)
      return
    }
    if (!actividad.trim()) {
      setError('La actividad  es requerida')
      setShowError(true)
      return
    }
    if (!empresaParticipada.trim()) {
      setError('La empresa participada   es requerida')
      setShowError(true)
      return
    }
    if (!porcentajeCapital) {
      setError('El porcentaje de capital   es requerido')
      setShowError(true)
      return
    }
    if (!votos) {
      setError('La cantidad de votos   es requerido')
      setShowError(true)
      return
    }

    if (!tramite.inversionesPermanentes)
      tramite.inversionesPermanentes = []

    tramite.inversionesPermanentes.push({
      actividad,
      cuitNit,
      empresaParticipada,
      porcentajeCapital,
      votos
    })
    updateObjTramite()
    await save()
    setIsLoading(false)
    clearState()
    setShowError(false)


  }


  const clearState = () => {
    setNombre('')
    setApellido('')
    setTipoDocumento('')
    setNroDocumento('')
    setTipoCargo('')
    setTipoOrgano('')
    setDireccion('')
    setObservaciones('')
    setCuit('')
    setActividad('')
    setCuitNit('')
    setAVotos(0)
    setPorcentajeCapital(0)
    setCuitSistemaCalidad('')
    setNorma('')
    setDireccionSistemaCalidad('')
    setCuitSistemaCalidad('')
    setFechaExpiracion('')
    setFechaOtorgamiento('')
  }

  const agregarUltimaModificacion = async () => {
    if (!tramite.datosSocietarios.sociedadAnonima.ultimaModificacion)



      updateObjTramite()
    await save()
    setIsLoading(false)
    clearState()




  }



  const updateObjTramite = () => {
    setTramite(Object.assign({}, tramite))
  }

  function callback(key) {
    save()
    setIsLoading(false)
  }

  const removeAutoridad = (record) => {
    tramite.autoridadesSociedad = tramite.autoridadesSociedad.filter(a => a.cuit !== record.cuit)
    save()
  }
  const removeInversiones = (record) => {
    tramite.inversionesPermanentes = tramite.inversionesPermanentes.filter(a => a.cuitNit !== record.cuitNit)
    save()
  }
  const columnsInversiones = [
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (tramite && tramite.status === 'BORRADOR' ?
        <Popconfirm
          title="Esta seguro que lo  desea Eliminar ?"
          onConfirm={() => removeInversiones(record)}
          onCancel={cancel}
          okText="Si, Eliminar"
          cancelText="Cancelar"
        > <div className="cursor=pointer" ><DeleteOutlined /></div></Popconfirm>
        : <Space size="middle">
          <LikeDislike />
        </Space>),

    },

    {
      title: 'CUIT',
      dataIndex: 'cuitNit',
      key: 'cuitNit',
    },
    {
      title: 'Empresa Participada',
      dataIndex: 'empresaParticipada',
      key: 'empresaParticipada',
    },
    {
      title: 'Actividad',
      dataIndex: 'actividad',
      key: 'actividad',
    },
    {
      title: '%  de Capital',
      dataIndex: 'porcentajeCapital',
      key: 'porcentajeCapital',
    },

    {
      title: 'Cantidad de Votos',
      dataIndex: 'votos',
      key: 'votos',
    }


  ];


  const cargarAutoridades = (record) => {
    setIdAutoridad(JSON.stringify(record))
    setNombre(record.autoridadesSociedad.nombre)
    setApellido(record.autoridadesSociedad.apellido)
    setTipoDocumento(record.autoridadesSociedad.tipoDocumento)
    setTipoCargo(record.autoridadesSociedad.tipoCargo)
    setTipoOrgano(record.autoridadesSociedad.tipoOrgano)
    setNroDocumento(record.autoridadesSociedad.nroDocumento)
    setCuit(record.autoridadesSociedad.cuit)
    setDireccion(record.autoridadesSociedad.direccion)
    setFotosDNIAutoridades(record.autoridadesSociedad.fotosDNI)
  }

  const columnsAutoridad = [
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (tramite && tramite.status === 'BORRADOR' || tramite && tramite.status === 'OBSERVADO' ?
        <Popconfirm
          title="Esta seguro que lo  desea Eliminar ?"
          onConfirm={() => removeAutoridad(record)}
          onCancel={cancel}
          okText="Si, Eliminar"
          cancelText="Cancelar"> <div ><DeleteOutlined /></div>
        </Popconfirm> : <Space size="middle"> </Space>
      ),
    },
    {
      title: '',
      key: 'edit',
      render: (text, record) => <div onClick={() => {
        cargarAutoridades(record)
        setModalAutoridad(true)
      }}><EditOutlined /></div>
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre'
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
    },
    {
      title: 'CUIT',
      dataIndex: 'cuit',
      key: 'cuit',
    },

    {
      title: 'Tipo Cargo',
      dataIndex: 'tipoCargo',
      key: 'tipoCargo',
    },
    {
      title: 'Tipo de Organo',
      dataIndex: 'tipoOrgano',
      key: 'tipoOrgano',
    },
    {
      title: 'Adjunto',
      render: (text, record) => <div>{record.fotosDNI && record.fotosDNI.map(f => <LinkToFile fileName={f.name} id={f.cid} />)} </div>,
      key: 'fotosDNI',
    }
  ]

  const columnsModificacionEstatuto = [
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (tramite.status === 'BORRADOR' ? <div ><DeleteOutlined /></div> : <Space size="middle">
        <LikeDislike />
      </Space>),
    },
    {
      title: 'Fecha',
      dataIndex: 'Fecha',
      key: 'fecha',
    },
    {
      title: 'Dato',
      dataIndex: 'Dato',
      key: 'Dato',
    },
    {
      title: 'Archivo',
      dataIndex: 'Archivo',
      key: 'archivo',
    }
  ]

  const removeSistemaCalidad = (record) => {
    tramite.sistemaCalidad = tramite.sistemaCalidad.filter(s => s.norma !== record.norma)
    save()
  }
  const columnsCalidad = [
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (tramite.status === 'BORRADOR' ? <div onClick={() => removeSistemaCalidad(record)} className="cursor-pointer"><DeleteOutlined /></div> : <Space size="middle">

      </Space>),
    },
    {
      title: 'CUIT',
      dataIndex: 'cuit',
      key: 'cuit'
    },
    {
      title: 'Norma',
      dataIndex: 'norma',
      key: 'norma',
    },
    {
      title: 'Fecha Otorgamiento',
      dataIndex: 'fechaOtorgamiento',
      key: 'fechaOtorgamiento',
    },
    {
      title: 'Fecha Expiración',
      dataIndex: 'fechaExpiracion',
      key: 'fechaExpiracion',
    },
    {
      title: 'Adjunto',
      render: (text, record) => <div>{record.archivos && record.archivos.map(f => <LinkToFile fileName={f.name} id={f.cid} />)} </div>,
      key: 'documentoSistemaCalidad',
    }

  ]




  const showSaveButton = () => {
    if (!allowGuardar(tramite))
      return <div></div>

    return <div className="pt-4 text-center">

      <Button type="primary" onClick={async () => {
        await save()
        if (isPersonaFisica(tramite))
          router.push('/enviar_tramite')
        else
          router.push('/informacion_propietarios')
      }} > Guardar y Seguir</Button>
    </div>
  }


  if (tramite && !tramite.datosSocietarios.PJESP) {
    tramite.datosSocietarios['PJESP'] = {
      archivosContrato: [],
      archivoModificacion: [],
      archivoUltimaModificacion: [],
      inscripcionConstitutiva: {
        fecha: '',
        datos: ''
      },
      inscripcionSucursal: {
        fecha: '',
        datos: ''
      },
      modifcicacionObjeto: {
        fecha: '',
        datos: ''
      },
      ultimaModificacionInscripcion: {
        fecha: '',
        datos: ''
      },
      fechaVencimiento: {
        fecha: ''
      }

    }
  }

  return (<div>
    <HeaderPrincipal tramite={tramite} onExit={() => router.push('/')} onSave={() => {
      save()
      router.push('/')
    }} />

    <div className="border-gray-200 border-b-2 flex ">
      <div className="px-20 pt-2 w-3/4">
        <NavigationStep
          current={1}
          generalStatus={statusGeneralTramite}
          completaBalanceYObras={isConstructora(tramite)} />
      </div>
      <div className="pt-2 w-1/4">
        {showSaveButton()}
      </div>
    </div>

    <div className="w-2/5 m-auto text-base  mt-8">
      <Substeps progressDot current={1} esPersonaFisica={isPersonaFisica(tramite)} />
    </div>


    <div className="px-8  py-6 bg-muted-100">


      {tramite.personeria === 'UTE' ? <div>

        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Firma del Contrato de la U.T.E.</div>
          <div className="grid grid-cols-3 gap-4 ">
            <div>
              <Wrapper title="Fecha" attributeName="fechaInscripcionUTE"
                labelRequired="*"  >

                <DatePickerModal
                  labelRequired="*"
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.fechaInscripcion}
                  bindFunction={value => {
                    tramite.datosSocietarios.fechaInscripcion = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>

          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Inscripción del contrato de la U.T.E</div>

          <div className="grid grid-cols-2 gap-4 ">
            <div >
              <Wrapper title="datos" attributeName="datosInscripcionContratoUTE" labelRequired="*">
                <InputText
                  attributeName="datosInscripcionContratoUTE"
                  value={tramite.datosSocietarios.ute.inscripcionUTE.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.ute.inscripcionUTE.datos = value
                    updateObjTramite()
                  }}
                  labelMessageError=""
                  required />
              </Wrapper>
            </div>
            <div >
              <Wrapper title="Fecha" attributeName="fechaInscripcionContratoUTE"
                labelRequired="*"  >
                <DatePicker
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""

                  value={tramite.datosSocietarios.ute.inscripcionUTE.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.ute.inscripcionUTE.fecha = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>
          </div> <div className="grid grid-cols-2 gap-4 ">
            <div >
              <Wrapper title="Contrato de la U.T.E. y junto con TODAS sus modificaciones" attributeName="contratoUTEUpload"
                labelRequired="*"  >
                <Upload
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.ute.archivosContrato as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.ute.archivosContrato)
                      tramite.datosSocietarios.ute.archivosContrato = []
                    tramite.datosSocietarios.ute.archivosContrato.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.ute.archivosContrato = tramite.datosSocietarios.ute.archivosContrato.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}


                />
              </Wrapper>
            </div>
          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <Wrapper isTitle title="Última modificación del contrato de la U.T.E." attributeName="ultimaModificacionContratoUTE" >
            <div className="grid grid-cols-3 gap-4 ">
            {/*   <div >

                <InputTextModal
                  label="Datos"
                  labelRequired=""
                  placeholder=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.ute.modificacionUTE.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.ute.modificacionUTE.datos = value
                    updateObjTramite()
                  }}
                  required /></div>*/}
              <div >
                <DatePickerModal
                  label="Fecha"
                  labelRequired=""
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.ute.modificacionUTE.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.ute.modificacionUTE.fecha = value
                    updateObjTramite()
                  }}
                />
              </div>
            </div>
            {/*<div className="grid grid-cols-3 gap-4 ">
              <div >
                <Upload
                  label=" Última modificación del Contrato de la U.T.E"
                  labelRequired=""
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.ute.modificacionUTE.archivos as any}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.ute.modificacionUTE.archivos = tramite.datosSocietarios.ute.modificacionUTE.archivos.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.ute.modificacionUTE.archivos)
                      tramite.datosSocietarios.ute.modificacionUTE.archivos = []
                    tramite.datosSocietarios.ute.modificacionUTE.archivos.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </div>
            </div>*/}
          </Wrapper>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <Wrapper isTitle title="Fecha de vencimiento del Contrato de la UTE" attributeName="fechaVencimientoContratoUTE">
            <div className="grid grid-cols-2 gap-4 mb-4 ">

              <div >
                <DatePickerModal
                  label="Fecha"
                  labelRequired=""
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.fechaVencimiento}
                  bindFunction={value => {
                    tramite.datosSocietarios.fechaVencimiento = value
                    updateObjTramite()
                  }}
                />
              </div>
              <div className="mt-8 ml-2 mr-4"> <Checkbox >No Corresponde</Checkbox></div>
              <div className="w-full" >
                <InputTextModal
                  label="Observaciones"
                  labelRequired=""
                  placeholder=""
                  labelMessageError=""
                  value=""
                  bindFunction={value => {

                  }}
                /></div>



            </div>
          </Wrapper>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <Wrapper isTitle title="Autoridades" attributeName="Autoridades" >
            {isTramiteEditable(tramite) ?
              <div className="content-center ">
                <div className="  text-right content-center -mt-8 ">
                  <Button type="primary" onClick={() => setModalAutoridad(true)} icon={<PlusOutlined />}> Agregar</Button>
                </div>

              </div> : ''}
            <div className="grid grid-cols-2 gap-4 ">

              <div className="pb-6">

                <Switch
                  value={tramite.autoridadesVencimiento}
                  onChange={value => {
                    tramite.autoridadesVencimiento = value
                    setTramite(Object.assign({}, tramite))
                  }}
                  label="Declaro que la designación de autoridades  no tiene vencimiento."
                  labelRequired=""
                  SwitchLabel1="Si"
                  SwitchLabel2="No"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />


              </div> <div className="pb-6">

                {tramite.autoridadesVencimiento ? '' : <div>
                  <DatePicker
                    label="Fecha de Vencimiento"
                    value={tramite.autoridadesFechaVencimiento}
                    bindFunction={(value) => {
                      tramite.autoridadesFechaVencimiento = value
                      updateObjTramite()
                    }}
                    labelRequired="*"
                    placeholder="Inspeccion General de Justicia"
                    labelObservation=""
                    labeltooltip=""
                    labelMessageError=""
                  /></div>}
              </div>
            </div>
           {/* <div className="grid grid-cols-1 gap-4 ">
              <div className="pb-6" >
                <Upload
                  label="Ultima acta de designacion de autoridades inscripta en la Inspeccion General de Justicia o Registro Publico de comercio"
                  labelRequired="*"
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.archivoAutoridades as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.archivoAutoridades)
                      tramite.datosSocietarios.archivoAutoridades = []
                    tramite.datosSocietarios.archivoAutoridades.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.archivoAutoridades = tramite.datosSocietarios.archivoAutoridades.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </div>
            </div>*/}
            <div className="pb-6" >
              <Upload
                label="Ultima acta de designacion de autoridades inscripta en la Inspeccion General de Justicia o Registro Publico de comercio"
                labelRequired="*"
                labelMessageError=""
                defaultValue={tramite.datosSocietarios.archivoAutoridades as any}
                onOnLoad={file => {
                  if (!tramite.datosSocietarios.archivoAutoridades)
                    tramite.datosSocietarios.archivoAutoridades = []
                  tramite.datosSocietarios.archivoAutoridades.push(file)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
                onRemove={fileToRemove => {
                  tramite.datosSocietarios.archivoAutoridades = tramite.datosSocietarios.archivoAutoridades.filter(f => f.cid !== fileToRemove.uid)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
              />
            </div>
          </Wrapper>
          {tramite.autoridadesSociedad && tramite.autoridadesSociedad.length > 0 ?
            <Table columns={columnsAutoridad}
              dataSource={Object.assign([], tramite.autoridadesSociedad)}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty> }} /> :
            renderNoData()}
        </div>

        <Modal
          title="Datos de la Autoridad"
          visible={modalAutoridad}
          onOk={agregarAutoridades}
          okText="Guardar"
          onCancel={() => setModalAutoridad(false)}
          cancelText="Cancelar"
          width={1000}
        >
          {renderModalAutoridad()}
        </Modal>

      </div> : ''}

      {tramite.personeria === 'Cooperativa' ? <div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Firma del Acta Constitutiva</div>
          <div className="grid grid-cols-2 gap-4 ">
            <div >
              <Wrapper title="Fecha" attributeName="fechaFirmaActaCooperativa" labelRequired="*">
                <DatePicker
                  labelRequired=""
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.fechaInscripcion}
                  bindFunction={value => {
                    tramite.datosSocietarios.fechaInscripcion = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>

          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Inscripción de Acta Constitutiva en I.N.A.E.S</div>
          <div className="grid grid-cols-2 gap-4 ">
            <div >
              <Wrapper title="Datos" attributeName="datosInscripcionINAES" labelRequired="*">
                <InputText
                  attributeName="datosInscripcionINAES"
                  value={tramite.datosSocietarios.cooperativa.inscriptionINAES.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.cooperativa.inscriptionINAES.datos = value
                    updateObjTramite()
                  }}
                  labelMessageError=""
                  required />
              </Wrapper>
            </div>
            <div >
              <Wrapper title="Fecha" attributeName="fechaInscripcionINAES" labelRequired="*">

                <DatePickerModal
                  labelRequired="*"
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""

                  value={tramite.datosSocietarios.cooperativa.inscriptionINAES.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.cooperativa.inscriptionINAES.fecha = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 ">
            <div >
              <Wrapper title="Acta Constitutiva, junto con TODAS sus modificaciones hasta el día de hoy" attributeName="cooperativaarchivoActaConstitutiva"
                labelRequired="*"  >
                <Upload

                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.cooperativa.archivoActaConstitutiva as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.cooperativa.archivoActaConstitutiva)
                      tramite.datosSocietarios.cooperativa.archivoActaConstitutiva = []

                    tramite.datosSocietarios.cooperativa.archivoActaConstitutiva.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.cooperativa.archivoActaConstitutiva = tramite.datosSocietarios.cooperativa.archivoActaConstitutiva.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </Wrapper>
            </div>
          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold pb-4 py-4">Modificación estatutaria Inscripta en I.N.A.E.S (objeto social referente a rubro Construcción)
            <Tooltip title="En caso de que la cooperativa sea Constructora desde su Constitución, repetir mismos datos y fecha de la Inscripción de Acta Constitutiva en I.N.A.E.S "> <QuestionCircleOutlined className="pl-4" /></Tooltip></div>
          <div className="grid grid-cols-2 gap-4 ">
            {/*<div >
              <Wrapper title="Datos" attributeName="datosModificacionEstatutariaINAES" labelRequired="*">
                <InputText
                  attributeName="datosModificacionEstatutariaINAES"

                  labelMessageError=""
                  value={tramite.datosSocietarios.cooperativa.modificacionINAES.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.cooperativa.modificacionINAES.datos = value
                    updateObjTramite()
                  }}
                  required />
              </Wrapper>
                </div>*/}
            <div >
              <Wrapper title="Fecha" attributeName="fechamodificacionINAES" labelRequired="*">
                <DatePickerModal

                  labelRequired=""
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.cooperativa.modificacionINAES.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.cooperativa.modificacionINAES.fecha = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>
          </div>
        {/*  <div className="grid grid-cols-1 gap-4 ">
            <div >
              <Wrapper title="Modificación del Objeto de la cooperativa a rubro construccion" attributeName="cooperativaarchivomodificacionINAES"
                labelRequired="*"  >
                <Upload

                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.cooperativa.modificacionINAES.archivos as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.cooperativa.modificacionINAES.archivos)
                      tramite.datosSocietarios.cooperativa.modificacionINAES.archivos = []

                    tramite.datosSocietarios.cooperativa.modificacionINAES.archivos.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.cooperativa.modificacionINAES.archivos = tramite.datosSocietarios.cooperativa.modificacionINAES.archivos.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </Wrapper>
            </div>
                </div>*/}
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4">Última modificación estatutaria Inscripta en I.N.A.E.S.</div>
          <div className="grid grid-cols-2 gap-4 ">
          <div >
              <Wrapper title="Datos" attributeName="datosultimaModificacionEstatutariaINAES" labelRequired="*">
                <InputText
                  attributeName="datosultimaModificacionEstatutariaINAES"

                  labelRequired=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.datos = value
                    updateObjTramite()
                  }}
                  required />
              </Wrapper></div>

            <div >
              <Wrapper title="Fecha" attributeName="fechaultimaModificacionINAES" labelRequired="*">
                <DatePickerModal

                  labelRequired=""
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.fecha = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>
          </div>
         
          <div className="grid grid-cols-1 gap-4 ">
            <div >

              <Wrapper title="Última modificación estatutaria Inscripta en I.N.A.E.S." attributeName="cooperativaarchivultimaModifcacionINAES"
                labelRequired="*"  >
                <Upload

                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.archivos as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.archivos)
                      tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.archivos = []

                    tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.archivos.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.archivos = tramite.datosSocietarios.cooperativa.ultimaModifcacionINAES.archivos.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </Wrapper>
            </div>
                </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4">Fecha de vencimiento del Contrato / Acta Constitutiva</div>
          <div className="grid grid-cols-2 gap-4 mb-4 ">
            <div >
              <Wrapper title="Fecha" attributeName="fechaVencimientoCooperativa" labelRequired="*">
                <DatePickerModal

                  labelRequired=""
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.fechaVencimiento}
                  bindFunction={value => {
                    tramite.datosSocietarios.fechaVencimiento = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>

          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <Wrapper isTitle title="Autoridades" attributeName="Autoridades" >
            {isTramiteEditable(tramite) ?
              <div className=" content-center ">
                <div className=" text-right content-center -mt-8 ">
                  <Button type="primary" onClick={() => setModalAutoridad(true)} icon={<PlusOutlined />}> Agregar</Button>
                </div>

              </div> : ''}
            <div className="grid grid-cols-2 gap-4 ">

              <div className="pb-6">

                <Switch
                  value={tramite.autoridadesVencimiento}
                  onChange={value => {
                    tramite.autoridadesVencimiento = value
                    setTramite(Object.assign({}, tramite))
                  }}
                  label="Declaro que la designación de autoridades  no tiene vencimiento."
                  labelRequired=""
                  SwitchLabel1=""
                  SwitchLabel2=""
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />


              </div> <div className="pb-6">

                {tramite.autoridadesVencimiento ? '' : <div>
                  <DatePicker
                    label="Fecha de Vencimiento"
                    value={tramite.autoridadesFechaVencimiento}
                    bindFunction={(value) => {
                      tramite.autoridadesFechaVencimiento = value
                      updateObjTramite()
                    }}
                    labelRequired="*"
                    placeholder="Inspeccion General de Justicia"
                    labelObservation=""
                    labeltooltip=""
                    labelMessageError=""
                  /></div>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 ">
              <div className="pb-6" >
                <Upload
                  label="Ultima acta de designacion de autoridades inscripta en la Inspeccion General de Justicia o Registro Publico de comercio"
                  labelRequired="*"
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.archivoAutoridades as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.archivoAutoridades)
                      tramite.datosSocietarios.archivoAutoridades = []
                    tramite.datosSocietarios.archivoAutoridades.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.archivoAutoridades = tramite.datosSocietarios.archivoAutoridades.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </div>
            </div>
            <div className="pb-6" >
              <Upload
                label="Ultima acta de designacion de autoridades inscripta en la Inspeccion General de Justicia o Registro Publico de comercio"
                labelRequired="*"
                labelMessageError=""
                defaultValue={tramite.datosSocietarios.archivoAutoridades as any}
                onOnLoad={file => {
                  if (!tramite.datosSocietarios.archivoAutoridades)
                    tramite.datosSocietarios.archivoAutoridades = []
                  tramite.datosSocietarios.archivoAutoridades.push(file)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
                onRemove={fileToRemove => {
                  tramite.datosSocietarios.archivoAutoridades = tramite.datosSocietarios.archivoAutoridades.filter(f => f.cid !== fileToRemove.uid)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
              />
            </div>
          </Wrapper>

          {tramite.autoridadesSociedad && tramite.autoridadesSociedad.length > 0 ?
            <Table columns={columnsAutoridad}
              dataSource={Object.assign([], tramite.autoridadesSociedad)}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty> }} /> : renderNoData()}
        </div>

        <Modal
          title="Datos de la Autoridad"
          visible={modalAutoridad}
          onOk={agregarAutoridades}
          okText="Guardar"
          onCancel={() => setModalAutoridad(false)}
          cancelText="Cancelar"
          width={1000}
        >
          {renderModalAutoridad()}
        </Modal>

      </div> : ''}

      {tramite.personeria === 'PJESP' ? <div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Inscripción constitutiva en país de origen</div>
          <div className="grid grid-cols-3 gap-4 ">
            <div >

              <Wrapper title="Datos" attributeName="DatosInscripcionPJESP" labelRequired="*">
                <InputText
                  attributeName="DatosInscripcionPJES"
                  value={tramite.datosSocietarios.PJESP.inscripcionConstitutiva.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.PJESP.inscripcionConstitutiva.datos = value
                    updateObjTramite()
                  }}
                  labelMessageError=""
                  required />
              </Wrapper>
            </div>
            <div >
              <Wrapper title="Fecha" attributeName="FechaInscripcionPJESP" labelRequired="*">
                <DatePickerModal
                  labelRequired=""
                  placeholder=""
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.PJESP.inscripcionConstitutiva.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.PJESP.inscripcionConstitutiva.fecha = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>

          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Inscripción de la Sucursal en Argentina (inscripta en D.P.P.J / I.G.J.)</div>
          <div className="grid grid-cols-2 gap-4 ">
            <div >
              <Wrapper title="Datos" attributeName="DatosInscripcionPJES" labelRequired="*">
                <InputText
                  attributeName="DatosInscripcionPJES"
                  value={tramite.datosSocietarios.PJESP.inscripcionSucursal.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.PJESP.inscripcionSucursal.datos = value
                    updateObjTramite()
                  }}

                  labelMessageError=""
                  required />
              </Wrapper>
            </div>
            <div >
              <Wrapper title="Fecha" attributeName="FechaInscripcionPJES" labelRequired="*">
                <DatePickerModal
                  labelRequired=""
                  placeholder=""
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""

                  value={tramite.datosSocietarios.PJESP.inscripcionSucursal.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.PJESP.inscripcionSucursal.fecha = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 ">
            <div >
              <Wrapper title="Inscripción efectiva de la sucursal en D.P.P.J. / I.G.J., junto con todas sus modificaciones" attributeName="modificacionUpload"
                labelRequired="*"  >
                <Upload
                  defaultValue={tramite.datosSocietarios.PJESP.archivosContrato as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.PJESP.archivosContrato)
                      tramite.datosSocietarios.PJESP.archivosContrato = []
                    tramite.datosSocietarios.PJESP.archivosContrato.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.PJESP.archivosContrato = tramite.datosSocietarios.PJESP.archivosContrato.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </Wrapper>
            </div>
          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Modificación del objeto de la Sucursal en Argentina (inscripta en D.P.P.J / I.G.J.)
            <Tooltip title="En caso de que la empresa sea Constructora desde la inscripción inicial de la Sucursal en Argentina, repetir mismos datos y fecha de la Inscripción de la Sucursal en Argentina (inscripta en D.P.P.J / I.G.J."> <QuestionCircleOutlined className="pl-4" /></Tooltip></div>
          <div className="grid grid-cols-2 gap-4 ">
           {/*<div >
              <Wrapper title="Datos" attributeName="DatosModificacionObjetoPJES" labelRequired="*">
                <InputText
                  attributeName="DatosModificacionObjetoPJES"

                  labelMessageError=""
                  value={tramite.datosSocietarios.PJESP.modifcicacionObjeto.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.PJESP.modifcicacionObjeto.datos = value
                    updateObjTramite()
                  }}
                  required />
              </Wrapper>
                </div>*/}
            <div >
              <Wrapper title="Fecha" attributeName="FechaModificacionObjetoPJES" labelRequired="*">

                <DatePickerModal
                  labelRequired="*"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.PJESP.modifcicacionObjeto.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.PJESP.modifcicacionObjeto.fecha = value
                    updateObjTramite()
                  }}
                />
              </Wrapper>
            </div>
          </div>
          {/*<div className="grid grid-cols-1 gap-4 ">
            <div >
              <Wrapper title="Modificación del Objeto de la Sucursal Argentina al rubro Construcción inscripto en D.P.P.J / I.G.J." attributeName="modificacionObjetoUpload"
                labelRequired="*"  >
                <Upload
                  defaultValue={tramite.datosSocietarios.PJESP.archivoModificacion as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.PJESP.archivoModificacion)
                      tramite.datosSocietarios.PJESP.archivoModificacion = []
                    tramite.datosSocietarios.PJESP.archivoModificacion.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.PJESP.archivoModificacion = tramite.datosSocietarios.PJESP.archivoModificacion.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </Wrapper>
            </div>
          </div> */}
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">

          <Wrapper isTitle title="Última modificación de inscripción de la Sucursal en Argentina (inscripta en D.P.P.J / I.G.J.)" attributeName="UltimaModificacionInscripcionPJESP" >
            <div className="grid grid-cols-2 gap-4 ">
              <div >
                <Wrapper title="Datos" attributeName="datosMODSUC"
                  labelRequired=""  >

                  <InputTextModal
                    label=""
                    labelRequired=""
                    placeholder=""
                    labelMessageError=""
                    value={tramite.datosSocietarios.PJESP.ultimaModificacionInscripcion.datos}
                    bindFunction={value => {
                      tramite.datosSocietarios.PJESP.ultimaModificacionInscripcion.datos = value
                      updateObjTramite()
                    }}
                    required />
                </Wrapper>
              </div>

              <div >
                <Wrapper title="Fecha" attributeName="fechaMODSUC"
                  labelRequired="*"  >

                  <DatePickerModal
                    labelRequired=""
                    placeholder="Fecha"
                    labelObservation=""
                    labeltooltip=""
                    labelMessageError=""
                    value={tramite.datosSocietarios.PJESP.ultimaModificacionInscripcion.fecha}
                    bindFunction={value => {
                      tramite.datosSocietarios.PJESP.ultimaModificacionInscripcion.fecha = value
                      updateObjTramite()
                    }}
                  />
                </Wrapper>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 ">
              <div >
                <Upload
                  label="Última modificación de la Inscripción de la Sucursal en Argentina, inscripta en D.P.P.J. / I.G.J."
                  defaultValue={tramite.datosSocietarios.PJESP.archivoUltimaModificacion as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.PJESP.archivoUltimaModificacion)
                      tramite.datosSocietarios.PJESP.archivoUltimaModificacion = []
                    tramite.datosSocietarios.PJESP.archivoUltimaModificacion.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.PJESP.archivoUltimaModificacion = tramite.datosSocietarios.PJESP.archivoUltimaModificacion.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </div>
            </div>
          </Wrapper>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">

          <Wrapper isTitle title="Fecha de vencimiento del Contrato / Acta Constitutiva" attributeName="FechaVencimientoPJESP" >


            <div className="grid grid-cols-3 gap-4  mb-4 ">
              <div >
                <DatePickerModal
                  label="Fecha"
                  labelRequired=""
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.datosSocietarios.PJESP.fechaVencimiento.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.PJESP.fechaVencimiento.fecha = value
                    updateObjTramite()
                  }}
                />
              </div>

            </div>
          </Wrapper>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <Wrapper isTitle title="Autoridades" attributeName="Autoridades" >
            {isTramiteEditable(tramite) ?
              <div className="content-center ">
                <div className=" text-right content-center -mt-8 ">
                  <Button type="primary" onClick={() => setModalAutoridad(true)} icon={<PlusOutlined />}> Agregar</Button>
                </div>

              </div> : ''}
            <div className="grid grid-cols-2 gap-4 ">

              <div className="pb-6">

                <Switch
                  value={tramite.autoridadesVencimiento}
                  onChange={value => {
                    tramite.autoridadesVencimiento = value
                    setTramite(Object.assign({}, tramite))
                  }}
                  label="Declaro que la designación de autoridades  no tiene vencimiento."
                  labelRequired=""
                  SwitchLabel1=""
                  SwitchLabel2=""
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />


              </div> <div className="pb-6">

                {tramite.autoridadesVencimiento ? '' : <div>
                  <DatePicker
                    label="Fecha de Vencimiento"
                    value={tramite.autoridadesFechaVencimiento}
                    bindFunction={(value) => {
                      tramite.autoridadesFechaVencimiento = value
                      updateObjTramite()
                    }}
                    labelRequired="*"
                    placeholder="Inspeccion General de Justicia"
                    labelObservation=""
                    labeltooltip=""
                    labelMessageError=""
                  /></div>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 ">
              <div className="pb-6" >
                <Upload
                  label="Ultima acta de designacion de autoridades inscripta en la Inspeccion General de Justicia o Registro Publico de comercio"
                  labelRequired="*"
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.archivoAutoridades as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.archivoAutoridades)
                      tramite.datosSocietarios.archivoAutoridades = []
                    tramite.datosSocietarios.archivoAutoridades.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.archivoAutoridades = tramite.datosSocietarios.archivoAutoridades.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </div>
            </div>
            <div className="pb-6" >
              <Upload
                label="Ultima acta de designacion de autoridades inscripta en la Inspeccion General de Justicia o Registro Publico de comercio"
                labelRequired="*"
                labelMessageError=""
                defaultValue={tramite.datosSocietarios.archivoAutoridades as any}
                onOnLoad={file => {
                  if (!tramite.datosSocietarios.archivoAutoridades)
                    tramite.datosSocietarios.archivoAutoridades = []
                  tramite.datosSocietarios.archivoAutoridades.push(file)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
                onRemove={fileToRemove => {
                  tramite.datosSocietarios.archivoAutoridades = tramite.datosSocietarios.archivoAutoridades.filter(f => f.cid !== fileToRemove.uid)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
              />
            </div>
          </Wrapper>

          {tramite.autoridadesSociedad && tramite.autoridadesSociedad.length > 0 ?
            <Table columns={columnsAutoridad}
              dataSource={Object.assign([], tramite.autoridadesSociedad)}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty> }} /> : renderNoData()}
        </div>

        <Modal
          title="Datos de la Autoridad"
          visible={modalAutoridad}
          onOk={agregarAutoridades}
          okText="Guardar"
          onCancel={() => setModalAutoridad(false)}
          cancelText="Cancelar"
          width={1000}
        >
          {renderModalAutoridad()}
        </Modal>

      </div> : ''}

      {tramite.personeria === 'SA' || tramite.personeria === 'SRL' || tramite.personeria === 'OFS' ? <div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Firma del Contrato Constitutivo</div>
          <div className="grid grid-cols-4 gap-4 ">
            <div >
              <Wrapper title="Fecha" attributeName="fechaContratoConstitutivo"
                labelRequired="*"  >
                <DatePicker
                  value={tramite.datosSocietarios.sociedadAnonima.contrato.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.sociedadAnonima.contrato.fecha = value
                    updateObjTramite()
                  }}
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />
              </Wrapper>
            </div>

          </div>
        </div>

        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Inscripción de Contrato Constitutivo (en D.P.P.J / I.G.J.)</div>
          <div className="grid grid-cols-2 gap-4 ">
            <div >

              <Wrapper title="Datos" attributeName="datosInscripcionContratoConstitutivo" labelRequired="*">
                <InputText
                  attributeName="datosInscripcionContratoConstitutivo"
                  value={tramite.datosSocietarios.sociedadAnonima.inscripcion.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.sociedadAnonima.inscripcion.datos = value
                    updateObjTramite()
                  }}

                  labelMessageError=""
                  required />
              </Wrapper>
            </div>
            <div >
              <Wrapper title="Fecha" attributeName="fechaInscripcionContratoConstitutivo"
                labelRequired="*"  >
                <DatePicker
                  value={tramite.datosSocietarios.sociedadAnonima.inscripcion.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.sociedadAnonima.inscripcion.fecha = value
                    updateObjTramite()
                  }}
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />
              </Wrapper>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 ">
            <div >
              <Wrapper attributeName="DocumentoContratoConstitutivo" title="Contrato Constitutivo, junto con TODAS sus modificaciones hasta el día de hoy" labelRequired="*">

                <Upload
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.sociedadAnonima.contrato.archivos as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.sociedadAnonima.contrato.archivos)
                      tramite.datosSocietarios.sociedadAnonima.contrato.archivos = []
                    tramite.datosSocietarios.sociedadAnonima.contrato.archivos.push(file)

                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.sociedadAnonima.contrato.archivos = tramite.datosSocietarios.sociedadAnonima.contrato.archivos.filter(f => f.cid !== fileToRemove.uid)

                    save()
                    setIsLoading(false)
                  }}
                />



              </Wrapper>
            </div>


          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4"> Modificación del Contrato Social (inscripta en D.P.P.J / I.G.J. correspondiente a ampliación del objeto social para realizar actividades del rubro Construcción)</div>
          <div className="grid grid-cols-2 gap-4 ">
           {/* <div >
              <Wrapper title="Datos" attributeName="datosModificacionContratoo" labelRequired="*">
                <InputText
                  attributeName="datosModificacionContratoo"
                  value={tramite.datosSocietarios.sociedadAnonima.modificacion.datos}
                  bindFunction={value => {
                    tramite.datosSocietarios.sociedadAnonima.modificacion.datos = value
                    updateObjTramite()
                  }}
                  labelMessageError=""
                  required />
                </Wrapper></div>*/}
            <div >
              <Wrapper title="Fecha" attributeName="fechaModificacionContratoSA" >
                <DatePicker
                  value={tramite.datosSocietarios.sociedadAnonima.modificacion.fecha}
                  bindFunction={value => {
                    tramite.datosSocietarios.sociedadAnonima.modificacion.fecha = value
                    updateObjTramite()
                  }}
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />
              </Wrapper>
            </div>
          </div>
         {/*<div className="grid grid-cols-1 gap-4 ">

            <div >
              <Wrapper attributeName="DocumentoModificacionObjetoSocial" title="Modificación del Objeto Social a rubro Construcción inscripto en D.P.P.J / I.G.J." labelRequired="*">

                <Upload
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.sociedadAnonima.modificacion.archivos as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.sociedadAnonima.modificacion.archivos)
                      tramite.datosSocietarios.sociedadAnonima.modificacion.archivos = []
                    tramite.datosSocietarios.sociedadAnonima.modificacion.archivos.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.sociedadAnonima.modificacion.archivos = tramite.datosSocietarios.sociedadAnonima.modificacion.archivos.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </Wrapper>
            </div>

          </div> */}

        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">

          <Wrapper isTitle title="Última modificación del Contrato Social (inscripta en D.P.P.J / I.G.J.)" attributeName="ultimaModifcacionContratoSA" >
            <div className="grid grid-cols-2 gap-4 ">
              <div >
                <Wrapper title="Datos" attributeName="rubroConsutrccionDatos"
                  labelRequired="*"  >

                  <InputText
                    attributeName="rubroConsutrccionDatos"
                    value={tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.datos}
                    bindFunction={(value) => {
                      tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.datos = value
                      updateObjTramite()
                    }}
                    placeHolder="Inspeccion General de Justicia"
                    labelObservation=""
                    labeltooltip=""
                    labelMessageError=""
                    required />
                </Wrapper>
              </div>
              <div >
                <Wrapper title="Fecha" attributeName="rubroConsutrccionFecha" labelRequired="*"  >

                  <DatePicker
                    label=""
                    value={tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.fecha}
                    bindFunction={(value) => {
                      tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.fecha = value
                      updateObjTramite()
                    }}
                    placeholder="Inspeccion General de Justicia"
                    labelObservation=""
                    labeltooltip=""
                    labelMessageError=""
                  />
                </Wrapper>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 ">
              <div >
                <Upload
                  label="Última modificación del Contrato Social, inscripta en en D.P.P.J / I.G.J."
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.archivos as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.archivos)
                      tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.archivos = []
                    tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.archivos.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.archivos = tramite.datosSocietarios.sociedadAnonima.ultimaModificacion.archivos.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </div>

              <div className="mt-8 ">
                <Button type="primary" onClick={agregarUltimaModificacion} icon={<PlusOutlined />}> Agregar</Button>
              </div>

            </div>
          </Wrapper>
          <Table columns={columnsModificacionEstatuto}

            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty> }} />
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4 mt-4"> Fecha de vencimiento del Contrato Social</div>
          <div className="grid grid-cols-2 gap-4 ">
            <div >
              <Wrapper title="Fecha" attributeName="fechaVencimientoContratoSA" >
                <DatePicker

                  value={tramite.datosSocietarios.fechaVencimiento}
                  bindFunction={(value) => {
                    tramite.datosSocietarios.fechaVencimiento = value
                    updateObjTramite()
                  }}
                  labelRequired="*"
                  placeholder="Inspeccion General de Justicia"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />
              </Wrapper>
            </div>
          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <Wrapper isTitle title="Autoridades" attributeName="Autoridades" >
            {isTramiteEditable(tramite) ?
              <div className=" content-center ">
                <div className=" text-right content-center -mt-8 ">
                  <Button type="primary" onClick={() => setModalAutoridad(true)} icon={<PlusOutlined />}> Agregar</Button>
                </div>

              </div> : ''}
            <div className="grid grid-cols-2 gap-4 ">

              <div className="pb-6">

                <Switch
                  value={tramite.autoridadesVencimiento}
                  onChange={value => {
                    tramite.autoridadesVencimiento = value
                    setTramite(Object.assign({}, tramite))
                  }}
                  label="Declaro que la designación de autoridades  no tiene vencimiento."
                  labelRequired=""
                  SwitchLabel1="Si"
                  SwitchLabel2="No"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />


              </div> <div className="pb-6">

                {tramite.autoridadesVencimiento ? '' : <div>
                  <DatePicker
                    label="Fecha de Vencimiento"
                    value={tramite.autoridadesFechaVencimiento}
                    bindFunction={(value) => {
                      tramite.autoridadesFechaVencimiento = value
                      updateObjTramite()
                    }}
                    labelRequired="*"
                    placeholder="Inspeccion General de Justicia"
                    labelObservation=""
                    labeltooltip=""
                    labelMessageError=""
                  /></div>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 ">
              <div className="pb-6" >
                <Upload
                  label="Ultima acta de designacion de autoridades inscripta en la Inspeccion General de Justicia o Registro Publico de comercio"
                  labelRequired="*"
                  labelMessageError=""
                  defaultValue={tramite.datosSocietarios.archivoAutoridades as any}
                  onOnLoad={file => {
                    if (!tramite.datosSocietarios.archivoAutoridades)
                      tramite.datosSocietarios.archivoAutoridades = []
                    tramite.datosSocietarios.archivoAutoridades.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.datosSocietarios.archivoAutoridades = tramite.datosSocietarios.archivoAutoridades.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </div>
            </div>
          </Wrapper>
          {tramite.autoridadesSociedad && tramite.autoridadesSociedad.length > 0 ?
            <Table columns={columnsAutoridad}
              dataSource={Object.assign([], tramite.autoridadesSociedad)}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty> }} /> : renderNoData()}
        </div>

        <Modal
          title="Datos de la Autoridad"
          visible={modalAutoridad}
          onOk={agregarAutoridades}

          okText="Guardar"
          onCancel={() => setModalAutoridad(false)}
          cancelText="Cancelar"
          width={1000}
        >
          {renderModalAutoridad()}
        </Modal>


      </div> : ''}

      {isPersonaFisica(tramite) ? <div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">

          <div className="text-2xl font-bold py-4 mt-4"> Alta en AFIP (actividad referente a rubro Construcción</div>
          <div className="grid grid-cols-2 gap-4 ">

            
              <div >
              <Wrapper title="Datos" attributeName="altaAfipDatos" labelRequired="*" >
                <InputText
                  attributeName="altaAfipDatos"
                  value={tramite.altaAFIP.datos}
                  bindFunction={(value) => {
                    tramite.altaAFIP.datos = value
                    updateObjTramite()
                  }}

                  labelMessageError=""
                  required />
                  </Wrapper>
              </div>
            

          


            <Wrapper title="Fecha" attributeName="altaAfipFecha" labelRequired="*" >

              <div >
                <DatePicker
                  label=""
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.altaAFIP.fecha}
                  bindFunction={value => {
                    tramite.altaAFIP.fecha = value
                    setTramite(Object.assign({}, tramite))
                  }}
                />
              </div>
            </Wrapper>
          </div>
          <div className="grid grid-cols-1 gap-4 ">
          <Wrapper attributeName="Constancia de Inscripción en AFIPl" title="Constancia de Inscripción en AFIP" labelRequired="*">

            <div >
              <Upload
                
                labelMessageError=""
                defaultValue={tramite.datosSocietarios.personaFisica.constanciaInscripcion as any}
                onOnLoad={file => {
                  if (!tramite.datosSocietarios.personaFisica.constanciaInscripcion)
                    tramite.datosSocietarios.personaFisica.constanciaInscripcion = []
                  tramite.datosSocietarios.personaFisica.constanciaInscripcion.push(file)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
                onRemove={fileToRemove => {
                  tramite.datosSocietarios.personaFisica.constanciaInscripcion = tramite.datosSocietarios.personaFisica.constanciaInscripcion.filter(f => f.cid !== fileToRemove.uid)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
              />
            </div>
            </Wrapper>
          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4 mt-4"> Matrícula de Comerciante (inscripción en D.P.P.J / I.G.J.)</div>


          <div className="grid grid-cols-2 gap-4 ">
            
              <div >
              <Wrapper title="Datos" attributeName="matriculaDatos" labelRequired="*" >
                <InputText
                  attributeName="matriculaDatos"

                  value={tramite.matriculaComerciante.datos}
                  bindFunction={value => {
                    tramite.matriculaComerciante.datos = value
                    setTramite(Object.assign({}, tramite))
                  }}

                  labelMessageError=""
                  required />
                  </Wrapper>
                  </div>
            
            <Wrapper title="Fecha" attributeName="matriculaFecha" labelRequired="*" >

              <div >
                <DatePicker
                  label=""
                  labelRequired="*"
                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""

                  value={tramite.matriculaComerciante.fecha}
                  bindFunction={value => {
                    tramite.matriculaComerciante.fecha = value
                    setTramite(Object.assign({}, tramite))
                  }}
                />
              </div>
            </Wrapper>
          </div>
          <div className="grid grid-cols-1 gap-4 ">
          <Wrapper attributeName="constanciaMatriculaComerciante" title="Matrícula de Comerciante" labelRequired="*">

            <div >
              <Upload
               
                labelMessageError=""
                defaultValue={tramite.datosSocietarios.personaFisica.constanciaMatriculaComerciante as any}
                onOnLoad={file => {
                  if (!tramite.datosSocietarios.personaFisica.constanciaMatriculaComerciante)
                    tramite.datosSocietarios.personaFisica.constanciaMatriculaComerciante = []
                  tramite.datosSocietarios.personaFisica.constanciaMatriculaComerciante.push(file)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}
                onRemove={fileToRemove => {
                  tramite.datosSocietarios.personaFisica.constanciaMatriculaComerciante = tramite.datosSocietarios.personaFisica.constanciaMatriculaComerciante.filter(f => f.cid !== fileToRemove.uid)
                  updateObjTramite()
                  save()
                  setIsLoading(false)
                }}

              />
            </div>
            </Wrapper>
          </div>
        </div>
        <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
          <div className="text-2xl font-bold py-4 mt-4"> Última modificación de Matrícula de Comerciante / Modificación de Actividades en AFIP</div>
          <div className="grid grid-cols-2 gap-4 ">
             <div >
             <Wrapper title="Datos" attributeName="ultimaModificacionMatriculaOActividadesAFIPDatos" labelRequired="*" >
            
                <InputText
                  attributeName="ultimaModificacionMatriculaOActividadesAFIPDatos"
                  labelMessageError=""
                  value={tramite.ultimaModificacionMatriculaOActividadesAFIP.datos}
                  bindFunction={value => {
                    tramite.ultimaModificacionMatriculaOActividadesAFIP.datos = value
                    setTramite(Object.assign({}, tramite))
                  }}
                  required />
                  </Wrapper>
                  </div>

            <Wrapper title="Fecha" attributeName="ultimamodificacionMatriculaFecha" labelRequired="*" >

              <div >
                <DatePicker
                  label=""

                  placeholder="Fecha"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                  value={tramite.ultimaModificacionMatriculaOActividadesAFIP.fecha}
                  bindFunction={value => {
                    tramite.ultimaModificacionMatriculaOActividadesAFIP.fecha = value
                    setTramite(Object.assign({}, tramite))
                  }}
                />
              </div>
            </Wrapper>

          </div>
        </div>
      </div> : <div></div>}



      <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">

        <div className="text-2xl font-bold"> Inscripción en I.E.R.I.C. (Instituto de Estadística y Registro de la Industria de la Construcción)</div>
        <div className="grid grid-cols-1 mb-4 mt-4  ">
          <Wrapper title={isPersonaFisica(tramite) ? "Declaro ante el Registro Nacional de Constructores y Firmas Consultoras de Obras Públicas que no me encuentro comprendido en el régimen de de la Ley Nº 22.250 según lo determinado en su artículo 1." : "Declaro que la Persona a la cual represento ante el Registro Nacional de Constructores y Firmas Consultoras de Obras Públicas no es un empleador comprendido en el régimen de de la Ley Nº 22.250 según lo determinado en su artículo 1 incisos a y b."} attributeName="siIeric" >
            <div className="">
              <Switch
                value={tramite.poseeIERIC}
                onChange={value => {
                  tramite.poseeIERIC = value
                  setTramite(Object.assign({}, tramite))
                }}
                label=""
                labelRequired=""
                SwitchLabel1="Si"
                SwitchLabel2="No"
                labelObservation=""
                labeltooltip=""
                labelMessageError=""
              /></div>



          </Wrapper>
        </div>
        {tramite.poseeIERIC ? '' :

          <div className="grid grid-cols-3 gap-4 ">
            <div>
              <Wrapper title="IERIC" attributeName="nroIeric" >


                <InputText

                  attributeName="ieric"
                  labelRequired="*"
                  placeHolder="IERIC"
                  value={tramite.ieric}
                  bindFunction={(value) => {
                    tramite.ieric = value
                    updateObjTramite()
                  }}
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />
              </Wrapper>
            </div>
            <div>
              <Wrapper title="Vencimiento IERIC" attributeName="fechaVtoIeric" >
                <DatePicker
                  value={tramite.vtoIeric}
                  bindFunction={(value) => {
                    tramite.vtoIeric = value
                    updateObjTramite()
                  }}

                  labelRequired="*"
                  placeholder="dd/mm/aaaa"
                  labelObservation=""
                  labeltooltip=""
                  labelMessageError=""
                />
              </Wrapper>
            </div>

            <div>
              <Wrapper title="Adjunte IERIC" attributeName="constanciaIeric" >
                <Upload

                  labelRequired="*"
                  labelMessageError=""
                  defaultValue={tramite.archivoIERIC as any}
                  onOnLoad={file => {
                    if (!tramite.archivoIERIC)
                      tramite.archivoIERIC = []
                    tramite.archivoIERIC.push(file)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                  onRemove={fileToRemove => {
                    tramite.archivoIERIC = tramite.archivoIERIC.filter(f => f.cid !== fileToRemove.uid)
                    updateObjTramite()
                    save()
                    setIsLoading(false)
                  }}
                />
              </Wrapper>

            </div>


          </div>}
      </div>
      <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
        <Collapse accordion>
          <Panel header=" Sistema de Calidad" key="1">
            <Wrapper title="Sistema de Calidad" attributeName="SistemaCalidad" >
              {isTramiteEditable(tramite) ?
                <div className="  text-center content-center mt-2 mb-4 ">
                  <Button type="primary" onClick={() => setModalCalidad(true)} icon={<PlusOutlined />}> Agregar</Button>
                </div> : ''}
            </Wrapper>
            {tramite.sistemaCalidad && tramite.sistemaCalidad.length > 0 ? <Table columns={columnsCalidad}
              dataSource={Object.assign([], tramite.sistemaCalidad)}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }} /> : renderNoData()}
            <Modal
              title="Datos del Certificado de Sistemas de Calidad"
              visible={modalCalidad}
              onOk={() => {
                if (!tramite.sistemaCalidad)
                  tramite.sistemaCalidad = []

                tramite.sistemaCalidad.push({
                  cuit: cuitSistemaCalidad,
                  norma,
                  fechaExpiracion,
                  fechaOtorgamiento,
                  direccion,
                  archivos: documentoSistemaCalidad
                })
                updateObjTramite()
                setIsLoading(false)
                save()
                setModalCalidad(false)
                clearState()
              }}
              okText="Guardar"
              onCancel={() => setModalCalidad(false)}
              cancelText="Cancelar"
              width={1000}
            >
              {renderModalCalidad()}
            </Modal>
          </Panel>
          <Panel header="Inversiones permanentes" key="2">
            {showError ? <div className="mb-4">
              <Alert
                message=''
                description={error}
                type="error"
                showIcon
                closable
                afterClose={() => setShowError(false)}
              /></div> : ''}
            <div className="grid grid-cols-2 gap-4 pb-6  ">



              <div >
                <Wrapper title="CUIT / NIT" attributeName="CuitNit" labelRequired="*" >
                  <InputText
                    attributeName="CuitNit"
                    value={cuitNit}
                    bindFunction={(value) => { setCuitNit(value) }}
                    labelMessageError=""
                    required />
                </Wrapper>

              </div>
              <div >
                <Wrapper title="EmpresaParticipada" attributeName="EmpresaParticipada" labelRequired="*"  >
                  <InputText
                    attributeName="EmpresaParticipada"
                    value={empresaParticipada}
                    bindFunction={(value) => { setEmpresaParticipada(value) }}
                    labelMessageError=""
                    required />
                </Wrapper>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pb-6 ">
              <div >
                <Wrapper title="Actividad" attributeName="Actividad" labelRequired="*"  >
                  <InputText
                    attributeName="Actividad"
                    value={actividad}
                    bindFunction={(value) => { setActividad(value) }}
                    labelMessageError=""
                  />
                </Wrapper>
              </div>
              <div >
                <InputNumberModal
                  type="number"
                  label="% de Capital"
                  labelRequired="*"
                  min={0} step="any"
                  placeholder="000000 "
                  value={porcentajeCapital}
                  bindFunction={(value) => { setPorcentajeCapital(value) }}
                  className=""
                  labelMessageError=""

                  required />


              </div>
              <div >
                <InputNumberModal
                  type="number"
                  label="Votos Posibles"
                  labelRequired="*"
                  min={0} step="any"
                  placeholder="000000,000 "
                  value={votos}
                  bindFunction={(value) => { setAVotos(value) }}
                  className=""

                  labelMessageError=""
                  required />


              </div>
            </div>
            <div className="mt-6 text-center pb-6">
              <Button className="mr-4" type="primary" onClick={addInversiones} icon={<PlusOutlined />} > Agregar</Button>
            </div>

            <Table columns={columnsInversiones}
              dataSource={Object.assign([], tramite.inversionesPermanentes)}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }} />

          </Panel>

        </Collapse>
      </div>


    </div>
    <style>
      {`
      .ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow{
        top:8px;
      }
      .ant-collapse > .ant-collapse-item > .ant-collapse-header{
        font-size: 16px;
    font-weight: bold;
      }`}
    </style>

  </div>
  )

}


const TipoOrgano = [
  {
    label: 'Administracion',
    value: 'administracion',
  },
  {
    label: 'Fiscalizacion',
    value: 'Fiscalizacion',
  },
  {
    label: 'Representante',
    value: 'Representante',
  }
];
const TipoDocumento = [
  {
    label: 'DU',
    value: 'DU',
  },
  {
    label: 'Pasaporte',
    value: 'Pasaporte',
  },
  {
    label: 'Cedula de identidad',
    value: 'CE',
  }
];

const TipoCargo = [
  {
    label: 'Presidente',
    value: 'Presidente',
  },
  {
    label: 'Vice Presidente',
    value: 'vice_presidente',
  },
  {
    label: 'Socio Gerente',
    value: 'socio_gerente',
  },
  {
    label: 'Gerente General',
    value: 'gerente_general',
  },
  {
    label: 'Gerente Especial',
    value: 'gerente_especial',
  },
  {
    label: 'Director Titular',
    value: 'director_titular',
  },
  {
    label: 'Director Suplente',
    value: 'director_suplente',
  },
  {
    label: 'Sindico Titular',
    value: 'sindico_titular',
  },
  {
    label: 'Sindico Suplente',
    value: 'sindico_suplente',
  },
  {
    label: 'Representante',
    value: 'Representante',
  }
]

const posee = [
  {
    label: 'SI',
    value: 'si',
  },
  {
    label: 'NO',
    value: 'no',
  }
]