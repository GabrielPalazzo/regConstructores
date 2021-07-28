import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { NavigationStep } from '../components/steps'
import { InputText } from '../components/input_text'
import InputTextModal from '../components/input_text_modal'
import { HeaderPrincipal } from '../components/header'
import Upload from '../components/upload_obras'
import Upload2 from '../components/upload'
import Switch2 from '../components/switch'
import { Button, Card, Steps, Modal, Select, Table, Tabs, Tag, Space, Empty, Popconfirm, message, Alert, Tooltip, Switch} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CloudDownloadOutlined, DislikeFilled, LikeFilled, CheckOutlined } from '@ant-design/icons';
import SelectModal from '../components/select_modal'
import SelectSimple from '../components/select'
import { Collapse } from 'antd';
import LikeDislike from '../components/like_dislike'
import DatePickerModal from '../components/datePicker_Modal'
import UploadLine from '../components/uploadLine'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { allowGuardar, getCodigoObra, getEmptyObras, getEmptyTramiteAlta, getTramiteByCUIT, isConstructora, isPersonaFisica, isTramiteEditable, calcularSaldoObra, calcularCertificaciones, hasObservacionesObra, getUsuario, determinarEstadoObra, } from '../services/business';
import { saveTramite } from '../redux/actions/main'
import { ObrasDatosGenerales } from '../components/obraDatosGenerales'
import { ObrasRedeterminaciones } from '../components/obraRedeterminaciones';
import { ObrasAmpliaciones } from '../components/obrasAmpliaciones'
import { isError } from 'util';
import { CertificacionesPrecargadas } from '../components/obraCertificacionesPrecargadas';
import SelectMultiple from '../components/select_multiple'
import InputNumberModal from '../components/input_number_modal'

import InputNumberModal2 from '../components/input_number'
import numeral from 'numeral'
import Wrapper from '../components/wrapper'
import { LinkToFile } from '../components/linkToFile';
import _ from 'lodash'
import { RootState } from '../redux/store';
import wrapper from '../components/wrapper';
import WrapperObras from '../components/wrapperObras'

const { TabPane } = Tabs;
const { Step } = Steps;
const { Option } = Select;

function confirm(e) {
  console.log(e);
  message.success('Se elimino correctamente');
}

function cancel(e) {
  console.log(e);
  message.error('Ha cancelado la operacion');
}


const MODO = {
  NEW: 'NEW',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
}


export default () => {

  const [modalObras, setModalObras] = useState(false)
  const [scroll, setScroll] = useState(undefined)

  const router = useRouter()
  const dispatch = useDispatch()
  const [waitingType, setWaitingType] = useState('sync')
  const [isLoading, setIsLoading] = useState(false)

  const [tramite, setTramite] = useState<TramiteAlta>(useSelector((state: RootState) => state.appStatus.tramiteAlta) || getEmptyTramiteAlta())
  const statusGeneralTramite = useSelector((state: RootState) => state.appStatus.resultadoAnalisisTramiteGeneral)
  const [ubicacionText, setUbicacionText] = useState('')
  const [prorrogaFecha, setProrrogaFecha] = useState('')
  const [prorrogaMeses, setProrrogaMeses] = useState(0)
  const [dataSource, setDataSource] = useState('')
  const [archivosPlazos, setArchivosPlazos] = useState<Array<Archivo>>([])
  const [archivos, setArchivos] = useState<Array<Archivo>>([])
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [plazosSeleccionada, setPlazosSeleccionada] = useState(null)
  const [showMotivoRechazo, setShowMotivoRechazo] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')

  const [obra, setObra] = useState<DDJJObra>(getEmptyObras())
  const [especialidad1, setEspecialidad1] = useState('')
  const [modo, setModo] = useState(MODO.NEW)


  useEffect(() => {
    if (!tramite.cuit)
      router.push('/')
  }, [])




  const save = async () => {
    setWaitingType('sync')

    setIsLoading(true)
    if (tramite._id) {
      await dispatch(saveTramite(tramite))
    } else {
      if (!(await getTramiteByCUIT(tramite.cuit)))
        await dispatch(saveTramite(tramite))
    }

  }

  const updateObra = (obra: DDJJObra) => {
    const idxObra = tramite.ddjjObras.findIndex(o => o.id === obra.id)
    tramite.ddjjObras[idxObra] = obra
    updateObjTramite()
    save()
  }


  const updateObjTramite = () => {
    setTramite(Object.assign({}, tramite))
  }

  function callback(key) {
    if (isTramiteEditable(tramite))
      save()
    setIsLoading(false)
  }
  function log(e) {
    console.log(e);
  }

  const agregarUbicacion = () => {
    obra.ubicacion.push(ubicacionText)
    setObra(Object.assign({}, obra))
  }

  const removerUbicacion = (ubicacion) => {
    obra.ubicacion = obra.ubicacion.filter(u => u !== ubicacion)
  }

  function preventDefault(e) {
    e.preventDefault();
    console.log('Clicked! But prevent default.');
  }


  const add = async () => {
    if ((!prorrogaFecha)) {
      setError('La Fecha de la prorroga es requerida')
      setShowError(true)
      return
    }
    if ((!prorrogaMeses)) {
      setError('Los meses son requeridos')
      setShowError(true)
      return
    }
    if (_.isEmpty(archivosPlazos)) {
      setError('El documento respladatorio')
      setShowError(true)
      return
    }
    if (!obra.prorrogaNueva)
      obra.prorrogaNueva = []

    obra.prorrogaNueva.push({
      prorrogaFecha,
      prorrogaMeses,
      archivosPlazos
    })
    setArchivosPlazos([])
    setProrrogaMeses(0)
    setProrrogaFecha('')
    updateObjTramite()
    await save()
    setIsLoading(false)

  }




  const renderModalObra = () => {
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
      <div className="text-left bg-gray-300 p-4 px-6  ">
        <Tag>Monto Vigente</Tag> <Tag color="green" className="mr-2 rounded-full">{numeral(obra.montoInicial + (obra.redeterminaciones.length !== 0 ? obra.redeterminaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0) + (obra.ampliaciones.length !== 0 ? obra.ampliaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0)).format('$0,0.00')}</Tag>
        <Tag>Certificado Total </Tag> <Tag color="magenta" className="mr-2 rounded-full">{numeral(obra.certificaciones.length !== 0 ? obra.certificaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0).format('$0,0.00')}</Tag>
        <Tag>Saldo </Tag> <Tag color="blue" className="mr-2 rounded-full">{numeral((obra.montoInicial) + (obra.redeterminaciones.length !== 0 ? obra.redeterminaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0) + (obra.ampliaciones.length !== 0 ? obra.ampliaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0) - (obra.certificaciones.length !== 0 ? obra.certificaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0)).format('$0,0.00')}</Tag>

      </div>
      <Tabs defaultActiveKey="datosGenerales" onChange={callback}>
        <TabPane tab="General" key="datosGenerales">
          <ObrasDatosGenerales obra={obra} onChange={setObra} modo={modo as any} />
          <div className="rounded-lg px-4 py-2 pb-4 border mt-6">
            < WrapperObras isTitle title="Ubicación geográfica" obra={obra} field='ubicacionGeografica' onChange={o => updateObra(o)} attributeName="ubicacion" >

              <div className="grid grid-cols-2 gap-4 ">

                <div className="pb-6" >

                  <InputTextModal
                    labelRequired="*"
                    label="Ubicacion"
                    value={ubicacionText}
                    bindFunction={setUbicacionText}
                    labelMessageError=""
                    required
                  />


                </div>
                {isTramiteEditable(tramite) ?
                  <div className="mt-8 ">
                    <Button onClick={agregarUbicacion} type="primary" icon={<PlusOutlined />}> Agregar</Button>
                  </div> : ''}

              </div>
            </ WrapperObras>

            <div className="mt-4 ">
              {obra.ubicacion.map(u => <Tag closable onClose={() => removerUbicacion(u)} color="#50B7B2">{u}</Tag>)}
            </div>

          </div>
        </TabPane>
        <TabPane tab="Datos Iniciales" key="especialidades">
          <div className="mt-4 pt-2">

            <div className="grid grid-cols-3 gap-4 ">
              <div className="rounded-lg px-4 py-2 mb-4  pb-4 border">
                <div  >
                  <WrapperObras title="Especialidad" obra={obra} field='especialidad1' onChange={o => updateObra(o)}>
                  <SelectSimple
                       value={obra.especialidad1}
                      bindFunction={e => {
                        obra.especialidad1 = e
                        setObra(Object.assign([], obra))
                      }}
                      labelObservation=""
                      labeltooltip=""
                      labelMessageError=""
                      defaultOption="Seleccione el tipo de Doc"
                     required
                      option={tipoEspecialidad.map(u => (
                        <Option value={u.value}>{u.label}</Option>
                      ))} />

                    
                  </WrapperObras>
                </div>
                <div className="pt-2" >
                  < WrapperObras title="Seleccione  (3) SubEspecialidad" obra={obra} field='subEspecialidad1' onChange={o => updateObra(o)} labelRequired="*">

                    <SelectMultiple
                      value={obra.subEspecialidad1}
                      bindFunction={e => {
                        obra.subEspecialidad1 = e
                        setObra(Object.assign([], obra))
                      }}
                      labelObservation=""
                      labeltooltip=""
                      labelMessageError=""
                      placeholder="Tipo de suebEspecialidad"
                      required
                      options={tipoSubespecialidadIA.filter(se => se.parent === obra.especialidad1).map(u => (
                        <Option value={u.value} label={u.label}>
                          {u.label}
                        </Option>
                      ))

                      } />
                  </WrapperObras>
                </div>
                <div className="pb-6" >
                  < WrapperObras title="Otros" obra={obra} field='subEspecialidades1Otros' onChange={o => updateObra(o)} labelRequired="*">

                    <InputText
                      attributeName='Otros'
                      labelRequired=""
                      value={obra.subEspecialidades1Otros}
                      bindFunction={e => {
                        obra.subEspecialidades1Otros = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelMessageError=""
                      maxLength={50}
                      placeHolder="Otros"
                      labelObservation=""
                      labeltooltip=""
                      required />
                  </WrapperObras>
                </div>

              </div>
              <div className="rounded-lg px-4 py-2 mb-4  pb-4 border">
                <div  >
                  < WrapperObras title="Especialidad" obra={obra} field='especialidad2' onChange={o => updateObra(o)} labelRequired="*">
                    <SelectSimple
                      value={obra.especialidad2}
                      bindFunction={e => {
                        obra.especialidad2 = e
                        setObra(Object.assign([], obra))
                      }}
                      defaultOption="Seleccione una especialidad"
                      labelRequired=""
                      labelMessageError=""
                      required
                      option={tipoEspecialidad.map(u => (
                        <Option value={u.value}>{u.label}</Option>
                      ))} />
                  </WrapperObras>
                </div>
                <div className="pt-2" >
                  < WrapperObras title="Seleccione  (3) SubEspecialidad" obra={obra} field='subEspecialidad2' onChange={o => updateObra(o)} labelRequired="*">
                    <SelectMultiple

                      value={obra.subEspecialidad2}
                      bindFunction={e => {
                        obra.subEspecialidad2 = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelObservation=""
                      labeltooltip=""
                      labelMessageError=""
                      placeholder="Tipo de suebEspecialidad"
                      required
                      options={tipoSubespecialidadIA.filter(se => se.parent === obra.especialidad2).map(u => (
                        <Option value={u.value} label={u.label}>
                          {u.label}
                        </Option>
                      ))

                      } />
                  </WrapperObras>
                </div>
                <div className="pb-6" >
                  < WrapperObras title="Otros" obra={obra} field='subEspecialidades2Otros' onChange={o => updateObra(o)} labelRequired="*">
                    <InputText
                      attributeName='Otros2'

                      labelRequired=""
                      value={obra.subEspecialidades2Otros}
                      bindFunction={e => {
                        obra.subEspecialidades2Otros = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelMessageError=""

                      maxLength={50}
                      placeHolder="Otros"
                      labelObservation=""
                      labeltooltip=""
                      required />
                  </WrapperObras>
                </div>

              </div>
              <div className="rounded-lg px-4 py-2 mb-4  pb-4 border">
                <div  >
                  < WrapperObras title="Especialidad" obra={obra} field='especialidad3' onChange={o => updateObra(o)} labelRequired="">

                    <SelectSimple
                      value={obra.especialidad3}
                      bindFunction={e => {
                        obra.especialidad3 = e
                        setObra(Object.assign([], obra))
                      }}
                      defaultOption="Seleccione una especialidad"
                      labelRequired=""
                      labelMessageError=""
                      required
                      option={tipoEspecialidad.map(u => (
                        <Option value={u.value}>{u.label}</Option>
                      ))} />
                  </WrapperObras>
                </div>
                <div className="pt-2" >
                  < WrapperObras title="Seleccione (3) SubEspecialidad" obra={obra} field='subEspecialidad3' onChange={o => updateObra(o)} labelRequired="">
                    <SelectMultiple

                      value={obra.subEspecialidad3}
                      bindFunction={e => {
                        obra.subEspecialidad3 = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelObservation=""
                      labeltooltip=""
                      labelMessageError=""
                      placeholder="Tipo de suebEspecialidad"
                      required
                      options={tipoSubespecialidadIA.filter(se => se.parent === obra.especialidad3).map(u => (
                        <Option value={u.value} label={u.label}>
                          {u.label}
                        </Option>
                      ))

                      } />

                  </WrapperObras>
                </div>
                <div className="pb-6" >
                  < WrapperObras title="Otros" obra={obra} field='subEspecialidades3Otros' onChange={o => updateObra(o)} labelRequired="">

                    <InputText
                      attributeName='Otros3'
                      label=""
                      labelRequired=""
                      value={obra.subEspecialidades3Otros}
                      bindFunction={e => {
                        obra.subEspecialidades3Otros = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelMessageError=""
                      maxLength={50}
                      placeHolder="Otros"
                      labelObservation=""
                      labeltooltip=""
                      required />
                  </WrapperObras>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 ">

              <div className="pb-6" >
                < WrapperObras title="Razón Social de la UTE" obra={obra} field='razonSocialUTE' onChange={o => updateObra(o)} labelRequired="*">

                  <InputText
                    attributeName='razonSocialUTE'

                    labelRequired=""
                    value={obra.razonSocialUTE}
                    bindFunction={e => {
                      obra.razonSocialUTE = e
                      setObra(Object.assign({}, obra))
                    }}
                    labelMessageError=""
                  />
                </WrapperObras>
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                <div className="pb-6" >
                  < WrapperObras title="CUIT de la UTE" obra={obra} field='cuitUTE' onChange={o => updateObra(o)} labelRequired="*">

                    <InputText
                      attributeName=''
                      labelRequired=""
                      value={obra.cuitUTE}
                      bindFunction={e => {
                        obra.cuitUTE = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelMessageError=""
                    />
                  </WrapperObras>
                </div>
                <div className="pb-6" >
                  < WrapperObras title="% de Participacio" obra={obra} field='participacionUTE' onChange={o => updateObra(o)} labelRequired="*">


                    <InputNumberModal
                      className=""
                      label=""
                      labelRequired=""
                      min={0}
                      type="number"
                      value={obra.participacionUTE}
                      bindFunction={e => {
                        obra.participacionUTE = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelMessageError=""
                    />
                  </ WrapperObras>
                </div>
              </div>
              <div className="pb-6" >
                < WrapperObras title="Razón Social Comitente" obra={obra} field='razonSocialComitente' onChange={o => updateObra(o)} labelRequired="*">

                  <InputText
                    attributeName='razonSocialComitente'
                    labelRequired=""
                    value={obra.razonSocialComitente}
                    bindFunction={e => {
                      obra.razonSocialComitente = e
                      setObra(Object.assign({}, obra))
                    }}
                    labelMessageError=""
                  />
                </ WrapperObras>
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                <div className="pb-6" >

                  < WrapperObras title="CUIT comitente" obra={obra} field='cuitComitente' onChange={o => updateObra(o)} labelRequired="*">
                    <InputText
                      attributeName=''
                      labelRequired=""
                      value={obra.cuitComitente}
                      bindFunction={e => {
                        obra.cuitComitente = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelMessageError=""
                    />
                  </WrapperObras>
                </div>
                <div className="pb-6" >
                  < WrapperObras title="Monto inicial contrato" obra={obra} field='montoInicial' onChange={o => updateObra(o)} labelRequired="*">

                    <InputNumberModal
                      className=""
                      type="number"
                      label=""
                      labelRequired=""
                      min={0} step="any"
                      placeholder="000000,000 "
                      value={obra.montoInicial}
                      bindFunction={e => {
                        obra.montoInicial = e
                        setObra(Object.assign({}, obra))
                      }}
                      labelMessageError=""
                      required />
                  </WrapperObras>

                </div>
              </div>
            </div>
            <div className="pb-6" >

              < WrapperObras title="Adjuntar Contrato / Orden de Comprar (de corresponder, también incluir Contrato de UTE inscripto)" obra={obra} field='archivosOrdenDeCompra' onChange={o => updateObra(o)} labelRequired="*">

                <Upload
                  labelMessageError=""
                  defaultValue={obra.archivosOrdenDeCompra as any}
                  onOnLoad={file => {
                    if (!obra.archivosOrdenDeCompra)
                      obra.archivosOrdenDeCompra = []
                    obra.archivosOrdenDeCompra.push(file)
                    setObra(Object.assign({}, obra))
                  }}
                  onRemove={fileToRemove => {
                    obra.archivosOrdenDeCompra = obra.archivosOrdenDeCompra.filter(f => f.cid !== fileToRemove.uid)
                    setObra(Object.assign({}, obra))
                  }}

                />
              </WrapperObras>
            </div>
          </div>

        </TabPane>
        < TabPane tab="Ampliaciones" key="ampliaciones">
          <ObrasAmpliaciones obra={obra} onChange={setObra} />
        </TabPane>
        <TabPane tab="Redeterminaciones" key="redeterminaciones">
          <ObrasRedeterminaciones obra={obra} onChange={setObra} />
        </TabPane>

        <TabPane tab="Certificaciones" key="certificaciones">
          <CertificacionesPrecargadas obra={obra} onChange={setObra} />
        </TabPane>

        <TabPane tab="Plazos" key="plazos">
          <div className="rounded-lg px-4 py-2  pb-4 border mt-6">
            <div className="text-xl font-bold py-2 w-3/4">  Plazos en meses</div>
            <div className="grid grid-cols-4 gap-4 ">

              <div className="pb-6" >
                < WrapperObras title="Por Contrato" obra={obra} field='plazoPorContrato' onChange={o => updateObra(o)} labelRequired="*">
                  <InputNumberModal
                    type="number"
                    labelRequired=""
                    label=""
                    className=""
                    min={0}
                    value={obra.plazoPorContrato}
                    bindFunction={e => {
                      obra.plazoPorContrato = e
                      setObra(Object.assign({}, obra))
                    }}
                    labelMessageError=""
                    required
                  />
                </WrapperObras>
              </div>
              <div className="pb-6 hidden" >
                <Wrapper title="% de Participacion" attributeName="% de Participacion" labelRequired="*">

                  <InputNumberModal
                    label=""
                    className=""
                    labelRequired=""
                    min={0}
                    type="number"
                    value={obra.participacionUTE}
                    bindFunction={e => {
                      obra.participacionUTE = e
                      setObra(Object.assign({}, obra))
                    }}
                    labelMessageError=""
                  />
                </Wrapper>

                <InputNumberModal
                  type="number"
                  labelRequired="*"
                  label="Prorroga"
                  className="input-disabled"

                  value={obra.prorroga}
                  bindFunction={e => {
                    obra.prorroga = e
                    setObra(Object.assign({}, obra))
                  }}

                  labelMessageError=""
                />
              </div>
              <div className="pb-6" >

                <InputNumberModal
                  label="Prorroga"
                  type="number"
                  labelRequired="*"
                  value={obra.prorrogaNueva && obra.prorrogaNueva.length !== 0 ? obra.prorrogaNueva.map(d => d.prorrogaMeses).reduce((val, acc) => acc = val + acc) : 0}
                  bindFunction={e => {
                    null
                  }}
                  labelMessageError=""
                  className="input-disabled"
                />
              </div>
              <div className="pb-6" >
                < WrapperObras title="Transcurrido" obra={obra} field='transcurrido' onChange={o => updateObra(o)} labelRequired="*">

                  <InputNumberModal
                    type="number"
                    label=""
                    labelRequired=""
                    min={0}
                    step=".01"
                    value={obra.transcurrido}
                    bindFunction={e => {
                      obra.transcurrido = e
                      setObra(Object.assign({}, obra))
                    }}
                    labelMessageError=""
                    className=""

                  />
                </WrapperObras>
              </div>
              <div className="pb-6" >

                <InputNumberModal
                  label="Restante"
                  type="number"
                  labelRequired=""
                  disabled={true}
                  className="input-disabled"

                  min={0}
                  step=".01"
                  value={(obra.plazoPorContrato + (obra.prorrogaNueva && obra.prorrogaNueva.length !== 0 ? obra.prorrogaNueva.map(d => d.prorrogaMeses).reduce((val, acc) => acc = val + acc) : 0)) - obra.transcurrido}
                  bindFunction={e => null}
                  labelMessageError=""
                />
              </div>
            </div>

            <div className="rounded-lg px-4 py-2 mb-4  pt-4 pb-4 border">

              < WrapperObras isTitle title="Agregar nueva Prórroga" obra={obra} field='addProrroga' onChange={o => updateObra(o)} labelRequired="">



                <div className="grid grid-cols-4 gap-4 ">
                  <div className="pb-6" >
                    <DatePickerModal
                      placeholder="Fecha  (dd/mm/yyyy)"
                      label="Fecha "
                      labelRequired="*"
                      labelObservation=""
                      labeltooltip=""
                      labelMessageError=""
                      value={prorrogaFecha}

                      bindFunction={(value) => { setProrrogaFecha(value) }}
                    />
                  </div>
                  <div className="pb-6" >
                    <InputNumberModal2
                      label="Meses"
                      type="number" step="any"
                      labelRequired="*"
                      className=""

                      placeholder="000000,000 "
                      value={prorrogaMeses}
                      bindFunction={(value) => { setProrrogaMeses(value) }}
                      labelMessageError=""
                      required />

                  </div>
                  <div className="pb-6" >
                    <Upload2
                      label="Adjuntar Acta"
                      labelRequired="*"
                      defaultValue={archivosPlazos as any}
                      onOnLoad={file => {
                        archivosPlazos.push(file)
                        setArchivosPlazos(Object.assign([], archivosPlazos))
                      }}
                      onRemove={fileToRemove => {
                        setArchivosPlazos(Object.assign([], archivosPlazos.filter(f => f.cid !== fileToRemove.uid)))
                      }}

                    />
                  </div>
                </div>

                {isTramiteEditable(tramite) ?
                  <div className="grid grid-cols-1  ">
                    <div className="text-center ">
                      <Button type="primary" onClick={add} icon={<PlusOutlined />}> Agregar</Button>
                    </div>

                  </div>
                  : ''}
              </WrapperObras>
              <Table
                columns={columnsPlazos}
                dataSource={Object.assign([], obra.prorrogaNueva)}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }}
                summary={pageData => {
                  return <div>
                    {pageData.length > 0 ? <div className="ml-4 font-semibold">
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <div >{pageData.map(d => d.prorrogaMeses).reduce((val, acc) => acc = val + acc)}</div>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </div> : ''}
                  </div>
                }} />

            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>)
  }

  const eliminarObra = (obra: DDJJObra) => {
    // tramite.ejercicios = tramite.ejercicios.filter(e => ((e.fechaInicio !== r.fechaInicio) && (r.fechaCierre !== e.fechaCierre)))
    tramite.ddjjObras = tramite.ddjjObras.filter((o: DDJJObra) => o.id !== obra.id)
    setTramite(Object.assign({}, tramite))
    save()
  }



  const editarObrar = (obra: DDJJObra) => {

    setObra(Object.assign({}, tramite.ddjjObras.filter((o: DDJJObra) => o.id === obra.id)[0]))
    console.log(Object.assign({}, tramite.ddjjObras.filter((o: DDJJObra) => o.id === obra.id)[0]))
    setModalObras(true)
  }


  const removePlazos = (record) => {
    obra.prorrogaNueva = obra.prorrogaNueva.filter(s => s.prorrogaFecha !== record.prorrogaFecha)
    save()
  }



  const Saldo = (record) => {
    return (<div >
      {numeral(calcularSaldoObra(record)).format('$0,0.00')}

    </div>
    )
  }




  let columnsPlazos = [


    {
      title: 'Eliminar',
      key: 'action',
      render: (text, record) => (tramite.status === 'BORRADOR' || tramite.status === 'OBSERVADO' ? <Popconfirm
        title="Esta seguro que lo  deseas Eliminar  la prorroga?"
        onConfirm={() => removePlazos(record)}
        onCancel={cancel}
        okText="Si, Eliminar"
        cancelText="Cancelar"
      > <div className="cursor-pointer" ><DeleteOutlined /></div></Popconfirm> :
        ''
      ),
    },


    {
      title: 'Fecha',
      dataIndex: 'prorrogaFecha',
      key: 'prorrogaFecha',
    },
    {
      title: 'Meses',
      dataIndex: 'prorrogaMeses',
      key: 'prorrogaMeses',
    },
    {
      title: 'Adjunto',
      render: (text, record) => <div>{record.archivosPlazos && record.archivosPlazos.map(f => <LinkToFile fileName={f.name} id={f.cid} />)} </div>,
      key: 'archivosPlazos',
    }
  ]

  const tieneObservaciones = (obra) => {

    return !_.isEmpty(obra.certificaciones && obra.certificaciones.filter(c => c.status === 'OBSERVADA'))
      || !_.isEmpty(obra.ampliaciones && obra.ampliaciones.filter(c => c.status === 'OBSERVADA'))
      || !_.isEmpty(obra.redeterminaciones && obra.redeterminaciones.filter(c => c.status === 'OBSERVADA'))
      || hasObservacionesObra(obra)
  }


  const allowDeleteObra = (obra: DDJJObra) => {

    return tramite && (tramite.status === 'BORRADOR' || tramite.status === 'OBSERVADO') ||
      !hasObservacionesObra(obra) && (tramite && (tramite.status === 'BORRADOR' || tramite.status === 'OBSERVADO'))

  }

  const desestimarObra =(desestimar,o)=>{
    if (desestimar){
      o.status = 'DESESTIMADA'
    }
    else 
      o.status ='A REVISAR'
    updateObra(Object.assign({},o))
  }

  let columns = [
    
    
    {
      title: 'Desestimar',
      key: 'Desestimar',
      render: (text, record) => <div><Switch checked={record.status=== 'DESESTIMADA'} onChange={value => desestimarObra(value,record)} />
    </div>
    },
   // {
   //   title: 'Editada',
   //   key: 'Editada',
   //   render: (text, record: DDJJObra) => <div> {record.fechaAprobacion && record.status !== 'APROBADA' ? 'Editada' : ''}</div>
   // },
    {
      title: 'Obs',
      key: 'Obs',
      render: (text, record) => <div>{determinarEstadoObra(record) === 'DESESTIMADA' && getUsuario().isConstructor() ? ' ' : determinarEstadoObra(record) }</div>
    },
   
    {
      title: <DeleteOutlined />,
      key: 'action',
      render: (text, record) => (allowDeleteObra(record) ? <Popconfirm
        title="Esta seguro que lo  deseas Eliminar  La Obra"
        onConfirm={() => {
          setModo(MODO.EDIT)
          eliminarObra(record)
        }}
        onCancel={cancel}
        okText="Si, Eliminar"
        cancelText="Cancelar"
      > <div className="cursor-pointer" ><DeleteOutlined /></div></Popconfirm> : <Space size="middle">
      </Space>)
    }, 
   
    {
      title: ' ',
      key: 'editar',
      render: (text, record) => (tramite && (tramite.status === 'BORRADOR' || tramite.status === 'OBSERVADO' || tramite.status === 'SUBSANADO') ? <div onClick={() => {
        setModo(MODO.EDIT)
        editarObrar(Object.assign({}, record))
      }} className="cursor-pointer"><EditOutlined /></div> : <div onClick={() => {
        setModo(MODO.VIEW)
        console.log(record)
        editarObrar(Object.assign({}, record))
      }} className="cursor-pointer"><CloudDownloadOutlined /></div>),
    
    },


    {
      title: 'codigo',
      dataIndex: 'id',
      key: 'id',
  
    },

    
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (text, record: DDJJObra) => <div>{_.last(record.datosObra.map(r => r.estado))}</div>,
  
    },
    {
      title: 'T. Contrat',
      dataIndex: 'tipoContratacion',
      render: (text, record: DDJJObra) => <div>{_.last(record.datosObra.map(r => r.tipoContratacion))}</div>,
    
    },
    {
      title: 'F. adjudicacion.',
      dataIndex: 'fechaAdjudicacion',
      render: (text, record: DDJJObra) => <div>{_.last(record.datosObra.map(r => r.fechaAdjudicacion))}</div>,
  
    },
    {
      title: 'Denominación',
      dataIndex: 'denominacion',
      key: 'denominacion',
      width: 250,
    },
    {
      title: 'Comitente',
      dataIndex: 'comitente',
      render: (text, record: DDJJObra) => <div>{record.razonSocialComitente}</div>,
      width: 250,
    },
    {
      title: 'Monto Vigente',
      dataIndex: 'Monto Vigente',
      render: (text, record: DDJJObra) => <div>{numeral(record.montoInicial + (record.redeterminaciones && record.redeterminaciones.length !== 0 ? record.redeterminaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0) + (record.ampliaciones && record.ampliaciones.length !== 0 ? record.ampliaciones.map(r => r.monto).reduce((val, acc) => acc = val + acc) : 0)).format('$0,0.00')}</div>,

    },
    {
      title: 'Certificado a la fecha',
      dataIndex: 'certificado',
      render: (text, record: DDJJObra) => <div>{numeral(calcularCertificaciones(record)).format('$0,0.00')}</div>,
    }, {

      title: 'Saldo',
      dataIndex: 'saldo',
      render: (text, record: DDJJObra) => <div>{numeral(calcularSaldoObra(record)).format('$0,0.00')}</div>
    }
  ]

  columns = getUsuario().isConstructor() ? columns.slice(1, columns.length ) : [columns[0], columns[1], columns[3],  columns[4], columns[5], columns[6], columns[7], columns[8], columns[9], columns[10], columns[11], columns[12], columns[13]]


  {/*if (isTramiteEditable(tramite)) {
    if (tramite.categoria === 'DESACTUALIZADO')
      columns = columns.slice(1, columns.length)
  } else {
    columns = columns.slice(2, columns.length)
  }*/}

  


  const supervizar = async () => {
    obra.status = 'SUPERVIZADA'
    //setObra({...obra})
    await updateObra(obra)

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

  const saveObra = async () => {
    if ((!obra.denominacion)) {
      setError('La denominacion es requerida ')
      setShowError(true)
      return
    }
    if ((!obra.razonSocialComitente)) {
      setError('La razon Social Comitente es requerida')
      setShowError(true)
      return
    }
    if ((!obra.cuitComitente)) {
      setError('El cuit del comitente es requerido')
      setShowError(true)
      return
    }
    if ((!obra.montoInicial)) {
      setError('El monto del contrato es requerido')
      setShowError(true)
      return
    }
   // if (_.isEmpty( obra.archivosOrdenDeCompra)) {
   //   setError('El documento respladatorio del contrato es requerido')
   //   setShowError(true)
   //   return
   // }


    if ((!obra.plazoPorContrato)) {
      setError('El plazo  por contrato es requerido ')
      setShowError(true)
      return
    }


    tramite.ddjjObras = tramite.ddjjObras.filter((o: DDJJObra) => o.id !== obra.id)
    obra.status = null
    tramite.ddjjObras.push(Object.assign({}, obra))
    await save()
    setModalObras(false)
  }

  return (<div>
    <HeaderPrincipal tramite={tramite} onExit={() => router.push('/')} onSave={() => {
      save()
      router.push('/')
    }} />
    <div className="border-gray-200 border-b-2 flex ">
      <div className="px-20 pt-2 w-3/4">
      <NavigationStep 
      generalStatus={statusGeneralTramite} 
      current={3} 
      completaBalanceYObras={isConstructora(tramite) } />
    </div>
      <div className="pt-2 w-1/4">
      <div className="pt-4 text-center">
        {allowGuardar(tramite) ? <Link href="/enviar_tramite" >
          <Button type="primary" > Continuar</Button>
        </Link> : ''}


      </div>
      </div>
    </div>
   
    <div className="px-8  py-6 bg-muted-100">
      <div className="px-8 mx-16  py-6 bg-white shadow-2xl rounded-xl mb-8">
        <div className="flex  content-center  ">
          <Wrapper title="Declaración jurada de Obras " attributeName="obras" isTitle>
            <div className="text-right content-center  -mt-8">
              {isTramiteEditable(tramite) ? <Button type="primary" onClick={() => {
                const obraEmpty = getEmptyObras()
                obraEmpty.id = getCodigoObra()
                // obra.id = getCodigoObra()
                setModo(MODO.NEW)
                setObra(Object.assign({}, obraEmpty))
                setModalObras(true)
              }} icon={<PlusOutlined />}> Agregar</Button> : ''}
            </div>
          </Wrapper>




        </div>
        <div className="mb-4 mt-8">
          <Alert message="El interesado deberá declarar sus antecedentes de ejecución de Obras según lo establecido en el artículo 11 de la DI-2021-3-APN-ONC#JGM" type="info" />
        </div>
        <div>
          <Tabs defaultActiveKey="1" onChange={callback} style={{ marginLeft: "0px" }}>
            <TabPane tab="Todas las obras declaradas" key="1">
              <div className="overflow-x-auto" >
                {tramite.ddjjObras.length === 0 ? renderNoData() :
                  <Table
                    columns={columns}
                    dataSource={tramite.ddjjObras.filter(o => determinarEstadoObra(o) === 'APROBADA' || determinarEstadoObra(o) === 'OBSERVADA' || determinarEstadoObra(o) === 'A REVISAR' || determinarEstadoObra(o) === 'DESESTIMADA' || determinarEstadoObra(o) === 'SUPERVIZADA')}
                    pagination={{ pageSize: 20 }}
                    scroll={{ x: 1500 }}
                    locale={{
                      emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span> No hay información cargada </span>}>
                      </Empty>
                    }} />}
              </div>
            </TabPane>
            <TabPane tab={`Obras a revisar por el Registro (${tramite.ddjjObras.filter(o => !o.status || tieneObservaciones(o)).length})`} key="2">
              <div className="overflow-x-auto" >
                {!tramite.ddjjObras || tramite.ddjjObras.length === 0 ? renderNoData() :
                  <Table
                    columns={columns}
                    scroll={{ x: 1500 }}
                    dataSource={tramite.ddjjObras.filter(o => determinarEstadoObra(o) === 'OBSERVADA' || determinarEstadoObra(o) === 'A REVISAR' || determinarEstadoObra(o) === 'SUPERVIZADA' )}
                    pagination={{ pageSize: 20 }}
                    locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty> }} />}
              </div>
            </TabPane>


          </Tabs>
        </div>

        <Modal
          title={`Datos de la obra ${obra.id} `}
          visible={modalObras}
          okText="Guardar"
          onCancel={() => setModalObras(false)}
          cancelText="Cancelar"
          footer={[
            <Button onClick={() => setModalObras(false)}>Cancel</Button>,
            <Button onClick={saveObra} type='primary' disabled={!isTramiteEditable(tramite)}>Guardar</Button>,
            <div className="float-right">{getUsuario().isSupervisor() || getUsuario().isAprobador() ?
              <Button onClick={supervizar} style={{ backgroundColor: '#52c41a', color: '#fff' }}> <CheckOutlined /> Supervizada</Button> : ''}</div>
          ]}
          width={1200}
        >
          {renderModalObra()}
        </Modal>
      </div>
      
    </div>
    <style>
      {`
      .input-disabled {
        color: rgba(0, 0, 0, 0.25) !important;
        background-color: #f5f5f5 !important;
        cursor: not-allowed !important;
        opacity: 1 !important;
        margin-top:4px;
    }
    .ant-table {font-size:12px !important}
    `}
    </style>

  </div>
  )
}
const tipoEspecialidad = [
  {
    label: 'INGENIERIA VIAL',
    value: 'IV',
  },
  {
    label: 'INGENIERÍA HIDRÁULICA',
    value: 'IH',
  },
  {
    label: 'SANITARIA',
    value: 'SANITARIA',
  },
  {
    label: 'INGENIERÍA FERROVIARIA',
    value: 'IF',
  },
  {
    label: 'INGENIERÍA ELECTROMECANICA',
    value: 'IE',
  },
  {
    label: 'INGENIERÍA  MECÁNICA',
    value: 'IM',
  },
  {
    label: 'INGENIERÍA AMBIENTAL',
    value: 'IA',
  },
  {
    label: 'ENERGIA',
    value: 'ENERGIA',
  },
  {
    label: 'INGENIERÍA NAVAL',
    value: 'IN',
  },
  {
    label: 'TELECOMUNICACIONES',
    value: 'TELECOMUNICACIONES',
  },
  {
    label: 'ELECTRÓNICA',
    value: 'ELECTRONICA',
  },
  {
    label: 'OBRAS MENORES EN LA VIA PÚBLICA',
    value: 'OMVP',
  },
  {
    label: 'INFORMÁTICA',
    value: 'INFORMATICA',
  },
  {
    label: 'INGENIERÍA AERONÁUTICA Y ESPACIAL',
    value: 'IAE',
  },
  {
    label: 'OBRAS DE ARQUITECTURA',
    value: 'OA',
  },


]

const tipoSubespecialidadIA = [
  {
    label: 'Pavimentos Rígidos',
    value: 'PR',
    parent: 'IV',
  },
  {
    label: 'Pavimentos Flexibles',
    value: 'PF',
    parent: 'IV',
  },
  {
    label: 'Puentes (Obras de arte mayor)',
    value: 'Puentes',
    parent: 'IV',
  },
  {
    label: 'Aeródromos (Pistas)',
    value: 'AERODROMO',
    parent: 'IV',
  },
  {
    label: 'Túneles',
    value: 'Tuneles',
    parent: 'IV',
  },
  {
    label: 'Movimiento de Suelos',
    value: 'MS',
    parent: 'IV',
  },
  {
    label: 'Estabilización de Terrenos, Autopistas',
    value: 'EA',
    parent: 'IV',
  },
  {
    label: 'Gaviones',
    value: 'Gaviones',
    parent: 'IV',
  },
  {
    label: 'Conservación de Caminos',
    value: 'CC',
    parent: 'IV',
  },
  {
    label: 'Pavimentos Urbanos y articulados',
    value: 'PUA',
    parent: 'IV',
  },
  {
    label: 'Voladuras',
    value: 'Voladuras',
    parent: 'IV',
  },
  {
    label: 'Limpieza de Terrenos, Desbosques',
    value: 'LTD',
    parent: 'IV',
  },
  {
    label: 'Destronque',
    value: 'Destronque',
    parent: 'IV',
  },
  {
    label: 'Relevamiento Topográfico,(Apertura de Trazas)',
    value: 'RT',
    parent: 'IV',
  },
  {
    label: 'Señalización Horizontal y Vertical',
    value: 'SHV',
    parent: 'IV',
  },
  {
    label: 'Obras de Arte Menor',
    value: 'OAM',
    parent: 'IV',
  },
  {
    label: 'Presas,Diques,Escolleras',
    value: 'PDE',
    parent: 'IH',
  }, {
    label: 'Obras de Arte Menor',
    value: 'OAM',
    parent: 'IH',
  }, {
    label: 'Canales Navegables',
    value: 'Canales Navegables',
    parent: 'IH',
  }, {
    label: 'Portuarias',
    value: 'Portuarias',
    parent: 'IH',
  }, {
    label: 'Acueductos',
    value: 'Acueductos',
    parent: 'IH',
  }, {
    label: 'Hidromecánicas',
    value: 'Hidromecánicas',
    parent: 'IH',
  }, {
    label: 'Acondicionamiento Hidráulico,',
    value: 'Acondicionamiento_Hidráulico,',
    parent: 'IH',
  }, {
    label: '(Sistematización de ríos y lagos)',
    value: 'SRL',
    parent: 'IH',
  }, {
    label: 'Canales de riego, Esclusas',
    value: 'CRE',
    parent: 'IH',
  }, {
    label: 'Dragados',
    value: 'Dragados',
    parent: 'IH',
  }, {
    label: 'Perforaciones',
    value: 'Perforaciones',
    parent: 'IH',
  }, {
    label: 'Tablestacados',
    value: 'Tablestacados',
    parent: 'IH',
  }, {
    label: 'Defensa aluvionales',
    value: 'Defensa_aluvionales',
    parent: 'IH',
  }, {
    label: 'Planta de Potabilización Pozos',
    value: 'PPB',
    parent: 'SANITARIA',
  }, {
    label: 'Plantas de Depuración',
    value: 'PD',
    parent: 'SANITARIA',
  }, {
    label: 'Impulsión y Bombeo',
    value: 'Impulsión_Bombeo',
    parent: 'SANITARIA',
  }, {
    label: 'Redes Principales de Desagüe',
    value: 'RPDD',
    parent: 'SANITARIA',
  }, {
    label: 'Redes Principales de Provisión de Agua',
    value: 'RPPA',
    parent: 'SANITARIA',
  }, {
    label: 'Pozos-Perforaciones-Drenaje',
    value: 'Pozos-Perforaciones-Drenaje',
    parent: 'SANITARIA',
  }, {
    label: 'Redes Secundarias de Desagüe',
    value: 'RSD',
    parent: 'SANITARIA',
  }, {
    label: 'Redes Secundarias de Provisión de Agua',
    value: 'RSPA',
    parent: 'SANITARIA',
  }, {
    label: 'Impermeabilización',
    value: 'Impermeabilización',
    parent: 'SANITARIA',
  }
  , {
    label: 'Mantenimiento en General',
    value: 'MG',
    parent: 'SANITARIA',
  }, {
    label: 'Electrificación',
    value: 'Electrificación',
    parent: 'IF',
  }, {
    label: 'Subterráneos',
    value: 'Subterráneos',
    parent: 'IF',
  }, {
    label: 'Material Rodante',
    value: 'Material Rodante',
    parent: 'IF',
  }, {
    label: 'Señalización y Enclavamiento',
    value: 'Señalización_Enclavamiento',
    parent: 'IF',
  }, {
    label: 'Instalación para Seguridad',
    value: 'Instalación_para_Seguridad',
    parent: 'IF',
  }, {
    label: 'Mantenimiento ferroviario',
    value: 'Mantenimiento_ferroviario',
    parent: 'IF',
  }, {
    label: 'Vía y Obra',
    value: 'VO',
    parent: 'IF',
  }, {
    label: 'Centrales Hidroeléctricas',
    value: 'Centrales_Hidroeléctricas',
    parent: 'IE',
  }, {
    label: 'Línea de Alta Tensión',
    value: 'LAT',
    parent: 'IE',
  }, {
    label: 'Subusinas',
    value: 'Subusinas',
    parent: 'IE',
  }, {
    label: 'Centrales Térmicas',
    value: 'Centrales_Térmicas',
    parent: 'IE',
  }, {
    label: 'Centrales Nucleares',
    value: 'Centrales_Nucleares',
    parent: 'IE',
  }, {
    label: 'Gasoductos',
    value: 'Gasoductos',
    parent: 'IE',
  }, {
    label: 'Planta de Impulsión y Almacenamiento',
    value: 'Planta_de _mpulsión_Almacenamiento',
    parent: 'IE',
  }, {
    label: 'Instalaciones eléctricas',
    value: 'Instalaciones_eléctricas',
    parent: 'IE',
  }, {
    label: 'Instalaciones Electromecánicas',
    value: 'Instalaciones_Electromecánicas',
    parent: 'IE',
  }, {
    label: 'Instalaciones Electrotérmicas',
    value: 'InstalacionesElectrotérmicas',
    parent: 'IE',
  }, {
    label: 'Instalaciones Acústicas',
    value: 'InstalacionesAcústicas',
    parent: 'IE',
  }, {
    label: 'Línea de Media y Baja Tensión',
    value: 'LíneaMediaBajaTensións',
    parent: 'IE',
  }, {
    label: 'Electrificación Rural',
    value: 'ElectrificaciónRural',
    parent: 'IE',
  }, {
    label: 'Red de alumbrado público',
    value: 'Redalumbradopúblico',
    parent: 'IE',
  }, {
    label: 'Semaforización',
    value: 'Semaforización',
    parent: 'IE',
  }, {
    label: 'Señalamiento y Balizamiento',
    value: 'SeñalamientoBalizamiento',
    parent: 'IE',
  }, {
    label: 'Radioeléctrico',
    value: 'Radioeléctrico',
    parent: 'IE',
  }, {
    label: 'Mantenimiento eléctrico',
    value: 'Mantenimientoeléctrico',
    parent: 'IE',
  }, {
    label: 'Instalaciones Termomecánicas',
    value: 'InstalacionesTermomecánicas',
    parent: 'IE',
  }, {
    label: 'Instalaciones Térmicas, Refrigeración',
    value: 'InstalacionesTérmicasRefrigeración',
    parent: 'IE',
  }, {
    label: 'Aire Acondicionado',
    value: 'AireAcondicionado',
    parent: 'IE',
  }, {
    label: 'Energía Solar',
    value: 'EnergíaSolar',
    parent: 'IE',
  }
  , {
    label: 'Horno de Ventilación',
    value: 'HornoVentilación',
    parent: 'IE',
  }
  , {
    label: 'Soldaduras',
    value: 'Soldaduras',
    parent: 'IE',
  }
  , {
    label: 'Mantenimiento Térmico',
    value: 'MantenimientoTérmico',
    parent: 'IE',
  }
  , {
    label: 'Redes de Distribución de Gas',
    value: 'RedesDistribuciónGas',
    parent: 'IE',
  }
  , {
    label: 'Provisión de Gas Natural',
    value: 'ProvisiónGasNatural',
    parent: 'IE',
  }, {
    label: 'Elevadores de Granos',
    value: 'ElevadoresGranos',
    parent: 'IM',
  }, {
    label: 'Translación Vertical Ascensores',
    value: 'TranslaciónVerticalAscensores',
    parent: 'IM',
  }, {
    label: 'Montacargas',
    value: 'Montacargas',
    parent: 'IM',
  }, {
    label: 'Cintas Transportadoras',
    value: 'CintasTransportadoras',
    parent: 'IM',
  }, {
    label: 'Silos y Norias',
    value: 'SilosNorias',
    parent: 'IM',
  }, {
    label: 'Fábrica de Motores',
    value: 'FábricaMotores',
    parent: 'IM',
  }, {
    label: 'Equipos Rodantes',
    value: 'EquiposRodantes',
    parent: 'IM',
  }, {
    label: 'Mantenimiento Mecánico',
    value: 'MantenimientoMecánico',
    parent: 'IM',
  }, {
    label: 'Instalaciones Industriales',
    value: 'InstalacionesIndustriales',
    parent: 'IM',
  }, {
    label: 'Instalaciones Metalúrgicas',
    value: 'InstalacionesMetalúrgicas',
    parent: 'IM',
  }, {
    label: 'Servicios de mantenimiento y limpieza',
    value: 'ServiciosmantenimientoLimpieza',
    parent: 'IA',
  }, {
    label: 'Recolección de residuos Peligrosos',
    value: 'RecolecciónresiduosP',
    parent: 'IA',
  }, {
    label: 'Recolección de residuos Domesticos',
    value: 'RecolecciónresiduosD',
    parent: 'IA',
  }, {
    label: 'Oleoducto, Poliductos',
    value: 'OleoductoPoliductos',
    parent: 'ENERGIA',
  }, {
    label: 'Plantas de Impulsión y Almacenamiento',
    value: 'PlantasAlmacenamiento',
    parent: 'ENERGIA',
  }, {
    label: 'Perforaciones y Pozos',
    value: 'PerforacionesPozos',
    parent: 'ENERGIA',
  }, {
    label: 'Instalación y Mantenimiento de Surtidores de Combustible',
    value: 'InstalaciónCombustible',
    parent: 'ENERGIA',
  }, {
    label: 'Servicios para la Industria del Petróleo',
    value: 'ServiciosPetróleo',
    parent: 'ENERGIA',
  }, {
    label: 'Servicios para la Industria de Mantenimiento',
    value: 'ServiciosIndustriaMantenimiento',
    parent: 'ENERGIA',
  }, {
    label: 'Astilleros (Construcción de Buques)',
    value: 'AstillerosConstrucciónBuques',
    parent: 'IN',
  }, {
    label: 'Talleres Navales',
    value: 'TalleresNavales',
    parent: 'IN',
  }, {
    label: 'Reparaciones Navales',
    value: 'ReparacionesNavales',
    parent: 'IN',
  }, {
    label: 'Reflotamientos',
    value: 'Reflotamientos',
    parent: 'IN',
  }, {
    label: 'Salvamentos Marítimos y Fluviales',
    value: 'SalvamentosMarítimosFluviales',
    parent: 'IN',
  }, {
    label: 'Telegrafía y Telefonía',
    value: 'TelegrafíaTelefonía',
    parent: 'TELECOMUNICACIONES',
  }, {
    label: 'Telecomunicaciones',
    value: 'Telecomunicaciones',
    parent: 'TELECOMUNICACIONES',
  }, {
    label: 'Radioenlace',
    value: 'Radioenlace',
    parent: 'TELECOMUNICACIONES',
  }, {
    label: 'Radar',
    value: 'Radar',
    parent: 'TELECOMUNICACIONES',
  }, {
    label: 'Sistema de Señalización',
    value: 'SistemaSeñalización',
    parent: 'ELECTRONICA',
  }, {
    label: 'Letreros Electrónicos',
    value: 'LetrerosElectrónicos',
    parent: 'ELECTRONICA',
  }, {
    label: 'Reparación de veredas y/o calzadas',
    value: 'ReparaciónVeredas',
    parent: 'OMVP',
  }, {
    label: 'Bacheos en calles de hormigón y/o asfalto',
    value: 'Bacheoscalles',
    parent: 'OMVP',
  }, {
    label: 'Construcción de rampas para discapacitados',
    value: 'Construcciónrampasdiscapacitados',
    parent: 'OMVP',
  }, {
    label: 'Construcción de bicisendas',
    value: 'Construcciónbicisendas',
    parent: 'OMVP',
  }, {
    label: 'Construcción de cercos en terrenos baldíos',
    value: 'ConstrucciónCercosTerrenosBaldíos',
    parent: 'OMVP',
  }, {
    label: 'Colocación de señales urbanas',
    value: 'ColocaciónSeñalesUrbanas',
    parent: 'OMVP',
  }, {
    label: 'Colocación de refugios para colectivos y/o taxis',
    value: 'ColocaciónRefugio',
    parent: 'OMVP',
  }, {
    label: 'Podas de árboles',
    value: 'Podasárboles',
    parent: 'OMVP',
  }, {
    label: 'Informática',
    value: 'Informática',
    parent: 'INFORMATICA',
  }, {
    label: 'Ingeniería Aeronáutica y Espacial',
    value: 'IngenieríaAeronáuticaEspacial',
    parent: 'IAE',
  }, {
    label: 'Construcciones Civiles en General',
    value: 'ConstruccionesCivilesGeneral',
    parent: 'OA',
  }, {
    label: 'Construcciones Industriales',
    value: 'ConstruccionesIndustriales',
    parent: 'OA',
  }, {
    label: 'Estructuras de Hormigón Armado',
    value: 'EstructurasHormigónArmado',
    parent: 'OA',
  }, {
    label: 'Urbanismo',
    value: 'Urbanismo',
    parent: 'OA',
  }, {
    label: 'Construcciones Prefabricadas',
    value: 'ConstruccionesPrefabricadas',
    parent: 'OA',
  }, {
    label: 'Construcciones Metálicas',
    value: 'ConstruccionesMetálicas',
    parent: 'OA',
  }, {
    label: 'Estructuras Metálicas (galpones, etc.)',
    value: 'Estructuras_Metálicas',
    parent: 'OA',
  }, {
    label: 'Restauración y Refacción de Edificios',
    value: 'RestauraciónEdificios',
    parent: 'OA',
  }, {
    label: 'Restauración de Sitios, Monumentos y Lugares Históricos.',
    value: 'RestauraciónMonumentos ',
    parent: 'OA',
  }, {
    label: 'Instalaciones contra incendio',
    value: 'Instalacionesincendio',
    parent: 'OA',
  }, {
    label: 'Instalaciones de Seguridad',
    value: 'InstalacionesSeguridad',
    parent: 'OA',
  }, {
    label: 'Instalaciones Complementarias',
    value: 'InstalacionesComplementarias',
    parent: 'OA',
  }, {
    label: 'Demoliciones y Excavaciones',
    value: 'DemolicionesExcavaciones',
    parent: 'OA',
  }, {
    label: 'Aislaciones Acústicas',
    value: 'AislacionesAcusticas',
    parent: 'OA',
  }, {
    label: 'Aislaciones Termicas',
    value: 'AislacionesTermicas',
    parent: 'OA',
  }, {
    label: 'Aislaciones Hidrófugas',
    value: 'AislacionesHidrófugas',
    parent: 'OA',
  }, {
    label: 'Impermeabilizaciones',
    value: 'Impermeabilizaciones',
    parent: 'OA',
  }
  , {
    label: 'Albañilería',
    value: 'Albañilería',
    parent: 'OA',
  }
  , {
    label: 'Limpieza de Frentes',
    value: 'LimpiezaFrentes',
    parent: 'OA',
  }
  , {
    label: 'Pinturas y Afines',
    value: 'PinturasAfines',
    parent: 'OA',
  }
  , {
    label: 'Marmolería',
    value: 'Marmolería',
    parent: 'OA',
  }
  , {
    label: 'Carpintería',
    value: 'Carpintería',
    parent: 'OA',
  }
  , {
    label: 'Herrería',
    value: 'Herrería',
    parent: 'OA',
  }, {
    label: 'Yesería',
    value: 'Yesería',
    parent: 'OA',
  }, {
    label: 'Vidriería',
    value: 'Vidriería',
    parent: 'OA',
  }, {
    label: 'Decoración Integral (provisión y colocación)',
    value: 'DecoraciónIntegral',
    parent: 'OA',
  }, {
    label: 'Limpieza de Edificios',
    value: 'LimpiezadeEdificios',
    parent: 'OA',
  }, {
    label: 'Parquización y Forestación',
    value: 'ParquizaciónyForestación',
    parent: 'OA',
  }, {
    label: 'Equipamiento Urbano',
    value: 'EquipamientoUrbano',
    parent: 'OA',
  }, {
    label: 'Amoblamientos',
    value: 'Amoblamientos',
    parent: 'OA',
  }



]