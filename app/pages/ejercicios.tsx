import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { NavigationStep } from '../components/steps'
import { InputText } from '../components/input_text'
import InputTextModal from '../components/input_text_modal'
import InputNumberModal from '../components/input_number'
import { HeaderPrincipal } from '../components/header'
import Upload from '../components/upload'
import Switch from '../components/switch'
import { Button, Card, Steps, Modal, Select, Table, Tabs, Input,Space, Alert, Empty, ConfigProvider, message, Tooltip, Popconfirm, Statistic } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CloudDownloadOutlined, FolderViewOutlined, DislikeFilled,LikeFilled   } from '@ant-design/icons';
import SelectModal from '../components/select_modal'
import { Collapse } from 'antd';
import LikeDislike from '../components/like_dislike'
import DatePickerModal from '../components/datePicker_Modal'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getEmptyTramiteAlta, getTramiteByCUIT, isPersonaFisica,getCodigoObra,  isConstructora, isTramiteEditable, allowGuardar , getUsuario} from '../services/business';
import { saveTramite, setTramiteView } from '../redux/actions/main'
import { updateRevisionTramite } from '../redux/actions/revisionTramite';
import moment from 'moment'
import numeral from 'numeral'
import Wrapper from '../components/wrapper'
import _ from 'lodash'
import { RootState } from '../redux/store';
import { LinkToFile } from '../components/linkToFile'


const { TabPane } = Tabs;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input

function confirm(e) {
  console.log(e);
  message.success('Se elimino correctamente');
}

function cancel(e) {
  console.log(e);
  message.error('Ha cancelado la operacion');
}
function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

const MODO = {
  EDIT: 'EDIT',
  NEW: 'NEW',
  VIEW: 'VIEW'
}


export default () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [modalEjercicios, setModalEjercicios] = useState(false)
  const [scroll, setScroll] = useState(undefined)
  const [waitingType, setWaitingType] = useState('sync')
  const [isLoading, setIsLoading] = useState(false)

  const [tramite, setTramite] = useState<TramiteAlta>(useSelector((state: RootState) => state.appStatus.tramiteAlta) || getEmptyTramiteAlta())
  const tipoAccion: string = useSelector((state: RootState) => state.appStatus.tipoAccion) || 'SET_TRAMITE_NUEVO'
  const statusGeneralTramite = useSelector((state: RootState) => state.appStatus.resultadoAnalisisTramiteGeneral)

  const [idBalance, setIdBalance] = useState('')
  const [inicioEjercicio, setInicioEjercicio] = useState('')
  const [cierreEjercicio, setCierreEjercicio] = useState('')
  const [activoCorriente, setActivoCorriente] = useState(0)
  const [activoNoCorriente, setActivoNoCorriente] = useState(0)
  const [pasivoCorriente, setPasivoCorriente] = useState(0)
  const [pasivoNoCorriente, setPasivoNoCorriente] = useState(0)
  const [ventasDelEjercicio, setVentasDelEjercicio] = useState(0)
  const [capitalSuscripto, setCapitalSuscripto] = useState(0)
  const [archivos, setArchivos] = useState<Array<Archivo>>([])
  const [archivosActaAsamblea, setArchivosActaAsamblea] = useState<Array<Archivo>>([])
 //const [ejercicioSelecionado, setEjercicioSelecionado] = useState({})
  const [error, setError] = useState(null)
  const [modo, setModo] = useState(MODO.NEW)
  const [showMotivoRechazo, setShowMotivoRechazo] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')
 

  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (!tramite.cuit && tipoAccion !== 'SET_TRAMITE_NUEVO')
      router.push('/')
  }, [])


  const save = async () => {
    setWaitingType('sync')

    setIsLoading(true)
    if (tramite._id) {
      await dispatch(saveTramite(Object.assign({}, tramite)))
    } else {
      if (!(await getTramiteByCUIT(tramite.cuit)))
        await dispatch(saveTramite(Object.assign({}, tramite)))
    }
  }

  const updateObjTramite = () => {
    setTramite(Object.assign({}, tramite))
  }

  function callback(key) {
    console.log(key);
  }


  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }


  const renderModalEjercicios = () => {
    return (<div>

      {error ? <div className="mb-4">
        <Alert
          message=''
          description={error}
          type="error"
          showIcon
          closable
          afterClose={() => setError('')}
        /></div> : ''}
      <div className="grid grid-cols-2 gap-4 ">
        <div className="pb-6" >
          <DatePickerModal
            label="Inicio del ejercicio"
            labelRequired="*"
            placeholder="dd/mm/aaaa"
            value={inicioEjercicio}
            locked={modo === MODO.VIEW}
            bindFunction={setInicioEjercicio}
            labelMessageError=""
          />

        </div>
        <div className="pb-6" >
          <DatePickerModal
            label="Cierre del ejercicio"
            labelRequired="*"
            placeholder="dd/mm/aaaa"
            value={cierreEjercicio}
            locked={modo === MODO.VIEW}
            bindFunction={setCierreEjercicio}
            labelMessageError=""
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 ">

        <div className="pb-6" >
          <InputNumberModal
            type="number"
            label="Activo Corriente"
            labelRequired="*"
            min={0} step="any"
            className=""

            placeholder="000000,000 "
            value={activoCorriente}
            locked={modo === MODO.VIEW}
            bindFunction={(val) => setActivoCorriente(parseFloat(val))}
            labelMessageError=""
            required />

        </div>

        <div className="pb-6" >
          <InputNumberModal
            label="Activo no Corriente"
            type="number"
            labelRequired="*"
            className=""

            placeholder="000000,000 "
            min={0}
            step="any"
            value={activoNoCorriente}
            locked={modo === MODO.VIEW}
            bindFunction={(val) => setActivoNoCorriente(parseFloat(val))}
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <InputTextModal
            type="number" step="any"
            label="Activo Total"
            placeholder="000000,000 "
            locked={modo === MODO.VIEW}
            value={activoCorriente + activoNoCorriente}
            bindFunction={() => null}
            labelMessageError=""
            disabled={true} />

        </div>
        <div className="pb-6" >
          <InputNumberModal
            label="Pasivo Corriente"
            type="number" step="any"
            labelRequired="*"
            min={0}
            className=""

            placeholder="000000,000 "
            locked={modo === MODO.VIEW}
            value={pasivoCorriente}
            bindFunction={(val) => setPasivoCorriente(parseFloat(val))}
            labelMessageError=""
            required />

        </div>

        <div className="pb-6" >
          <InputNumberModal
            label="Pasivo no Corriente"
            type="number" step="any"
            labelRequired="*"
            className=""

            placeholder="000000,000 "
            value={pasivoNoCorriente}
            locked={modo === MODO.VIEW}
            min={0}
            bindFunction={(val) => setPasivoNoCorriente(parseFloat(val))}
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >

          <InputTextModal
            label="Pasivo Total"
            type="number" step="any"
            placeholder="000000,000 "
            locked={modo === MODO.VIEW}
            bindFunction={() => null}
            value={pasivoNoCorriente + pasivoCorriente}
            labelMessageError=""
            disabled={true} />

        </div>
        <div className="pb-6" >
          <InputNumberModal
            label="Ventas del ejercicio"
            type="number" step="any"
            labelRequired="*"
            className=""

            min={0}
            placeholder="000000,000 "
            value={ventasDelEjercicio}
            locked={modo === MODO.VIEW}
            bindFunction={(val) => setVentasDelEjercicio(parseFloat(val))}
            labelMessageError=""
            required />

        </div>

        <div className="pb-6" >
          <InputNumberModal
            label={isPersonaFisica(tramite) ? 'Caja y Bancos' : 'Capital suscripto'}
            type="number" step="any"
            className=""

            labelRequired="*"
            placeholder="000000,000 "
            min={0}
            value={capitalSuscripto}
            locked={modo === MODO.VIEW}
            bindFunction={(val) => setCapitalSuscripto(parseFloat(val))}
            labelMessageError=""
            required />

        </div>
        <div className="pb-6" >
          <InputTextModal
            label="Patrimonio Neto"
            placeholder="000000,000 "
            type="number" step="any"
            locked={modo === MODO.VIEW}
            bindFunction={() => null}
            value={(activoNoCorriente + activoCorriente) - (pasivoCorriente + pasivoNoCorriente)}
            labelMessageError=""
            disabled={true}
          />



        </div>
        <div className="pb-6" >
          <Upload
            label="Adjunte el balance contable  "
            labelRequired="*"

            labelMessageError=""
            defaultValue={archivos as any}


            onOnLoad={file => {
              archivos.push(file)
              setArchivos(Object.assign([], archivos))
              save()
              setIsLoading(false)
            }}
            onRemove={fileToRemove => {
              setArchivos(Object.assign([], archivos.filter(f => f.cid !== fileToRemove.uid)))
            }}
          />
        </div>
        {(tramite.personeria === 'SA' || tramite.personeria === 'Cooperativa' || tramite.personeria === 'SRL' || tramite.personeria === 'PJESP') ?
          <div className="pb-6" >
            <Upload
              label="Acta  asamblea de aprobación del balance  "
              labelRequired="*"

              labelMessageError=""
              defaultValue={archivosActaAsamblea as any}
              
              onRemove={fileToRemove => {
                setArchivosActaAsamblea(Object.assign([], archivosActaAsamblea.filter(f => f.cid !== fileToRemove.uid)))
              }}
              

              onOnLoad={file => {
                
                archivosActaAsamblea &&  archivosActaAsamblea.push(file)
                setArchivosActaAsamblea(Object.assign([], archivosActaAsamblea))
                save()
                setIsLoading(false)
              }}
             


            />
          </div> : ''}

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

  const cargarEjercicio = (r: Ejercicio) => {
    setIdBalance(JSON.stringify(r))
    setActivoCorriente(r.activoCorriente)
    setActivoNoCorriente(r.activoNoCorriente)
    setPasivoCorriente(r.pasivoCorriente)
    setPasivoNoCorriente(r.pasivoNoCorriente)
    setCapitalSuscripto(r.capitalSuscripto)
    setCierreEjercicio(r.fechaCierre)
    setInicioEjercicio(r.fechaInicio)
    setVentasDelEjercicio(r.ventasEjercicio)
    setArchivos(r.archivos)
    setArchivosActaAsamblea(r.archivosActaAsamblea)

  }
 
  const Accion = ({ejercicio}) => {
    if ((!tramite.asignadoA) || (!getUsuario().isConstructor() && tramite.asignadoA && tramite.asignadoA.cuit !== getUsuario().userData().cuit))
      return <div>{ejercicio.status ? ejercicio.status : 'SIN EVALUAR'}</div>

    return <div>
      <Select
        value={ejercicio.status}
        onChange={e => {
          setEjercicioSeleccionado(ejercicio)
          console.log(ejercicioSeleccionado)
          if (e === 'OBSERVADO'){
           setShowMotivoRechazo(true)
          }
          else{
            const idx = _.findIndex(tramite.ejercicios, c => { return c.codigo === ejercicio.codigo })
            tramite.ejercicios[idx] = {
              ...tramite.ejercicios[idx],
              status: e as any
            }
          }
                   }
        }style={{ width: 150 }} >
        <Option key='APROBADO' value='APROBADO'>APROBADO</Option>
        <Option key='OBSERVADO' value='OBSERVADO'>OBSERVADO</Option>
       </Select>
    </div>
  }

  


  let columnsBalances = [

    {
      title: 'Estado',
      key: 'Estado',
      render: (text, record) => <Accion ejercicio={record} />
    },
    {
      title: '',
      key: 'evaluacion',
      render: (text, record) => <Tooltip title={record.observacionRegistro}>
        <div>{record.status === 'OBSERVADO' ? 
        <DislikeFilled style={{ color: '#F9A822' }} /> : 
        <LikeFilled style={{ color: record.status && record.status === 'APROBADO' ? '#2E7D33' : '#9CA3AF' }} />}</div></Tooltip>,
        with:100,
    },
   
    {
      title: 'Eliminar',
      key: 'action',
      render: (text, record) => ( tramite.categoria === 'DESACTUALIZADO' && tramite && tramite.status === 'BORRADOR'  && record.status !=='APROBADO'
      || tramite.categoria === 'DESACTUALIZADO' && tramite.status === 'BORRADOR'  && record.status !=='APROBADO'
      || tramite.categoria === 'DESACTUALIZADO' && tramite.status === 'OBSERVADO'  && record.status !=='APROBADO'
      || tramite.categoria === 'PRE INSCRIPTO' && tramite.status === 'BORRADOR'  && record.status !=='APROBADO'
      || tramite.categoria === 'PRE INSCRIPTO' && tramite.status === 'OBSERVADO'  && record.status !=='APROBADO' ? <Popconfirm
        title="Esta seguro que lo  desea Eliminar ?"
        onConfirm={() => eliminarEjercicio(record)}
        onCancel={cancel}
        okText="Si, Eliminar"
        cancelText="Cancelar"
      > <div className="cursor=pointer" ><DeleteOutlined /></div></Popconfirm> : <Space size="middle">

      </Space>),
    },

    {
      title: 'Editar',
      key: 'editar',
      render: (text, record) => ( tramite.categoria === 'DESACTUALIZADO' && tramite && tramite.status === 'BORRADOR'  && record.status !=='APROBADO'
      || tramite.categoria === 'DESACTUALIZADO' && tramite.status === 'OBSERVADO'  && record.status !=='APROBADO'
      || tramite.categoria === 'PRE INSCRIPTO' && tramite.status === 'BORRADOR'  && record.status !=='APROBADO'
      || tramite.categoria === 'PRE INSCRIPTO' && tramite.status === 'OBSERVADO' && record.status !=='APROBADO'  ? <div onClick={() => {
        cargarEjercicio(record)
        setModo(MODO.EDIT)
        setModalEjercicios(Object.assign({}, record))
      }}><EditOutlined /></div> : <Space size="middle" />)
    }, {
      title: 'View',
      key: 'view',
      render: (text, record) => <div onClick={() => {
        cargarEjercicio(record)
        setModo(MODO.VIEW)
        setModalEjercicios(true)

      }}><FolderViewOutlined /></div>
    },
    {
      title: 'Inicio de ejercicio',
      dataIndex: 'fechaInicio',
      key: 'fechaInicio',

    },
    {
      title: 'Cierre de ejercicio',
      dataIndex: 'fechaCierre',
      key: 'fechaCierre',
      sorter: (a, b) => moment(a.fechaCierre).unix() - moment(b.fechaCierre).unix(),

    },
    {
      title: 'Activo Corriente',
      render: (text, record: Ejercicio) => <div>{numeral(record.activoCorriente).format('$0,0.00')}</div>,
      key: 'activoCorriente',
      sorter: (a, b) => a.activoCorriente - b.activoCorriente,
    },
    {
      title: 'Activo No Corriente',
      render: (text, record: Ejercicio) => <div>{numeral(record.activoNoCorriente).format('$0,0.00')}</div>,
      key: 'activoNoCorriente',
      sorter: (a, b) => a.activoNoCorriente - b.activoNoCorriente,
    },

    {
      title: 'Pasivo Corriente',
      render: (text, record: Ejercicio) => <div>{numeral(record.pasivoCorriente).format('$0,0.00')}</div>,
      key: 'pasivoCorriente',
      sorter: (a, b) => a.pasivoCorriente - b.pasivoCorriente,
    },
    {
      title: 'Pasivo No corriente',
      render: (text, record: Ejercicio) => <div>{numeral(record.pasivoNoCorriente).format('$0,0.00')}</div>,
      key: 'pasivoNoCorriente',
      sorter: (a, b) => a.pasivoNoCorriente - b.pasivoNoCorriente,
    },
    {
      title: 'Ventas del ejercicio',
      render: (text, record: Ejercicio) => <div>{numeral(record.ventasEjercicio).format('$0,0.00')}</div>,
      key: 'ventasDelEjercicio',
      sorter: (a, b) => a.ventasEjercicio - b.ventasEjercicio,
    },
    {
      title: isPersonaFisica(tramite) ? 'Caja y Bancos' : 'Capital suscripto',
      dataIndex: 'capitalSuscripto',
      key: 'capitalSuscripto',
      sorter: (a, b) => a.capitalSuscripto - b.capitalSuscripto,
    },
    {
      title: 'Adjunto',
      render: (text, record) => <div>{record.archivos && record.archivos.map(f => <LinkToFile fileName={f.name} id={f.cid} />)}  {record.archivosActaAsamblea && record.archivosActaAsamblea.map(f => <LinkToFile fileName={f.name} id={f.cid} />)}</div>,
      key: 'adjunto',
    }
  ]
  columnsBalances = getUsuario().isConstructor() ? columnsBalances.slice(1, columnsBalances.length ) : [columnsBalances[0], columnsBalances[1], columnsBalances[2], columnsBalances[3],  columnsBalances[4], columnsBalances[5], columnsBalances[6], columnsBalances[7], columnsBalances[8], columnsBalances[9], columnsBalances[10], columnsBalances[11], columnsBalances[12], columnsBalances[13]]


  {/*if (isTramiteEditable(tramite)) {
    if (tramite.categoria === 'DESACTUALIZADO')
      columnsBalances = columnsBalances.slice(1, columnsBalances.length)
  } else {
    columnsBalances = columnsBalances.slice(2, columnsBalances.length)
  }*/}

  const eliminarEjercicio = (r) => {
    tramite.ejercicios = tramite.ejercicios.filter(e => ((e.fechaInicio !== r.fechaInicio) && (r.fechaCierre !== e.fechaCierre)))
    setTramite(Object.assign({}, tramite))
    save()
  }

  for (let index=0; index <tramite.ejercicios.length;index++ ) {
    if (!tramite.ejercicios[index].codigo)
      tramite.ejercicios[index].codigo = getCodigoObra()
  }

  const guardarEjercicio = async (e) => {

    if (modo === MODO.VIEW) {
      setModalEjercicios(false)
      clearState()
      return
    }


    if (!tramite.ejercicios)
      tramite.ejercicios = []



    const errores = []

    if (!inicioEjercicio) errores.push('Debe indicar la fecha de inicio de ejercicio')
    if (!cierreEjercicio) errores.push('Debe indicar la fecha de cierre de ejercicio')


    if (errores.length > 0) {
      setError(errores.map(e => e).join(', '))
      return
    }

    const fechaInicio = moment(inicioEjercicio, 'DD/MM/YYYY')
    const fechaCierre = moment(cierreEjercicio, 'DD/MM/YYYY')

    if (fechaCierre.diff(fechaInicio, 'M') > 12) {
      setError('El balance no puede tener más de un año calendario. Revise sus fechas de inicio y cierre')
      return
    }

    if (isPersonaFisica(tramite) && (cierreEjercicio.split('/')[0] !== '31' && cierreEjercicio.split('/')[1] !== '12')) {
      setError("La fecha de cierre para personas físicas debe ser 31/12/AAAA")
      return
    }

    if (capitalSuscripto === 0) {
      setError(isPersonaFisica(tramite) ? 'El rubro Caja/Bancos tiene que  ser mayor a 0' : 'El capital suscripto tiene que  ser mayor a 0')
      return
    }

    if ((activoCorriente + activoNoCorriente) < 0) {
      setError('El activo tiene que  ser mayor a 0')
      return
    }

    if ((pasivoCorriente + pasivoNoCorriente) < 0) {
      setError('El pasivo tiene que  ser mayor a 0')
      return
    }
    if (_.isEmpty(archivos)) {
      setError('El balance contable es requerido')
      setShowError(true)
      return
    }

    if ((tramite.personeria === 'SA'  || tramite.personeria === 'Cooperativa') && (_.isEmpty(archivosActaAsamblea))) {
      setError('El acta  es requerido')
      setShowError(true)
      return
    }
    if (MODO.EDIT) {
      tramite.ejercicios = tramite.ejercicios.filter(e => JSON.stringify(e) !== idBalance)
    }


    tramite.ejercicios.push({
      fechaCierre: cierreEjercicio,
      fechaInicio: inicioEjercicio,
      activoCorriente,
      activoNoCorriente,
      pasivoCorriente,
      pasivoNoCorriente,
      capitalSuscripto,
      ventasEjercicio: ventasDelEjercicio,
      archivos,
      archivosActaAsamblea,
      codigo:getCodigoObra()
    })
    setArchivos([])
    setArchivosActaAsamblea([])
    setCierreEjercicio(null)
    setInicioEjercicio(null)
    setTramite(Object.assign({}, tramite))
    await save()
    setModalEjercicios(false)
    clearState()

  }
  const clearState = () => {
    setCierreEjercicio(null)
    setInicioEjercicio(null)
    setActivoCorriente(0)
    setActivoNoCorriente(0)
    setPasivoCorriente(0)
    setPasivoNoCorriente(0)
    setCapitalSuscripto(0)
    setVentasDelEjercicio(0)
    setArchivos([])
    setArchivosActaAsamblea([])
  }
 
  return (<div>
    <HeaderPrincipal tramite={tramite} onExit={() => router.push('/')} onSave={() => {
      save()
      router.push('/')
    }} />

    <Modal
      visible={showMotivoRechazo}
      onCancel={() => setShowMotivoRechazo(false)}
      onOk={(e) => {
        const idx = _.findIndex(tramite.ejercicios, c => { return c.codigo === ejercicioSeleccionado.codigo })

        tramite.ejercicios[idx] = {
          ...tramite.ejercicios[idx],
          status: 'OBSERVADO',
          observacionRegistro: motivoRechazo
        }
        setShowMotivoRechazo(false)
        setMotivoRechazo('')
      }}

    >
      <p>Por favor, indique el motivo de rechazo o desestimación</p>
      <TextArea value={motivoRechazo} onChange={e => setMotivoRechazo(e.target.value)}></TextArea>
    </Modal>  

    <div className="border-gray-200 border-b-2 flex ">
      <div className="px-20 pt-2 w-3/4">
        <NavigationStep 
        generalStatus={statusGeneralTramite} 
        completaBalanceYObras={isConstructora(tramite)}  current={2} />
      </div>
      <div className="pt-2 w-1/4">
      <div className="pt-4 text-center">
        {allowGuardar(tramite) ? <Link href="/obras" >
          <Button type="primary" >Continuar</Button>
        </Link> : ''}
      </div>
      </div>
    </div>
    <div className="px-8  py-6 bg-muted-100">
      <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
        <div className="flex  content-center  ">
          <Wrapper title="Ejercicios" attributeName="ejercicios" isTitle>
            <div className=" text-right content-center mb-4 -mt-8">
              {isTramiteEditable(tramite) ? <Button type="primary" onClick={() => {
                setModalEjercicios(true)
                clearState()
                setModo(MODO.NEW)
              }} icon={<PlusOutlined />}> Agregar</Button> : ''}
            </div>

          </Wrapper>

        </div>
        <div className="mb-4 mt-4 divAlert p-2" >
          <p>El interesado deberá declarar sus balances según lo establecido en la DI-2021-3- APN-ONC#JGM, artículos 11,12 y anexo al artículo 4 de dicha disposición<br/>
Deberán declararse, como mínimo, los Balances correspondientes a los últimos 5 Ejercicios Económicos cerrados. En caso de que, por la antigüedad de la empresa, se posea menos Ejercicios cerrados, declarará los Balances de todos.
<br/>Si se consignan antecedentes de obras, de los que se haya certificado y facturado en Ejercicios Económicos anteriores a los ya declarados, se deberá informar y adjuntar los Balances correspondientes, de forma consecutiva, sin obviar la declaración de Ejercicios Económicos intermedios.
<br/>La presentación del balance del último ejercicio cerrado deberá realizarse dentro de los SEIS (6) meses, contados a partir de la fecha de cierre del mismo. </p>
        </div>

        <div>
          <Tabs defaultActiveKey="1" onChange={callback}  >
            <TabPane tab="Balances declarados" key="1">
              <div className="overflow-x-auto" >
                {!tramite.ejercicios || tramite.ejercicios.length === 0 ? renderNoData() : <Table columns={columnsBalances} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }} dataSource={Object.assign([], _.sortBy(tramite.ejercicios, (e: Ejercicio) => moment(e.fechaInicio, 'DD/MM/YYYY').toDate().getTime()))} scroll={{ x: 1800 }} onChange={onChange} />}
              </div>
            </TabPane>
            <TabPane tab={`Balances para revisar por el Registro (${tramite.ejercicios.filter(e => !e.status || e.status !== 'APROBADO').length})`} key="2">
              <div className="overflow-x-auto" >
                {!tramite.ejercicios || tramite.ejercicios.length === 0 ? renderNoData() : <Table columns={columnsBalances} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }} dataSource={Object.assign([], _.sortBy(tramite.ejercicios.filter(e => !e.status || e.status !== 'APROBADO'), (e: Ejercicio) => moment(e.fechaInicio, 'DD/MM/YYYY').toDate().getTime()))} onChange={onChange} scroll={{ x: 1800 }} />}
              </div>
            </TabPane>
          </Tabs>
        </div>

        <Modal
          title="Nuevo Ejercicio"
          visible={modalEjercicios}
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={() => setModalEjercicios(false)}
          width={1000}
          footer={[
            <Button onClick={() => setModalEjercicios(false)}>Cancel</Button>,
            <Button onClick={guardarEjercicio} type='primary' disabled={!isTramiteEditable(tramite)}>Guardar</Button>
          ]}
        >
          {renderModalEjercicios()}
        </Modal>
      </div>
     
    </div>
    <style>
      {`
      .divAlert{
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
        color: rgba(0,0,0,.85);
        font-size: 14px;
      }
      }
      `}
      
    </style>
  </div>
  )
}




