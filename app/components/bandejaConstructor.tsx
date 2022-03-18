import React, { useState } from 'react'
import { Button, Card, Divider, Drawer, Tag, Input, Collapse, Tabs, Modal, Progress, Table, Empty, Alert, message, Timeline, Tooltip } from 'antd'
import { Space } from 'antd'
import { eliminarBorrador, getColorStatus, rechazarTramite, getObservacionesTecnicoRaw, getReviewAbierta, getStatusObsParsed, getEmptyObras, getToken } from '../services/business'
import { useDispatch } from 'react-redux'
import { setUpdateBorrador } from '../redux/actions/main'
import { useRouter } from 'next/router'
import { CloudDownloadOutlined, EyeOutlined, ArrowRightOutlined, DeleteTwoTone } from '@ant-design/icons';
import { cargarUltimaRevisionAbierta } from '../redux/actions/revisionTramite'
import { Certificado } from './certificado'
import obras from '../pages/obras'
import { ObrasDatosGenerales } from './obraDatosGenerales'
import _ from 'lodash'
import moment from 'moment'

const onSearch = value => console.log(value);
const { Search } = Input;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const format = "DD/MM/YYYY HH:mm"

function callback(key) {
  console.log(key);
}

export interface BandejaConstructorProps {
  tramites: Array<TramiteAlta>
  refreshFunction: Function,
  masterLoadingFunction: Function,
}


export const BandejaConstructor: React.FC<BandejaConstructorProps> = ({
  tramites = [],
  refreshFunction = () => null,
  masterLoadingFunction = () => null
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleObservaciones, setIsModalVisibleObservaciones] = useState(false);
  const [loading, setLoading] = useState(false)

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModalObservaciones = () => {
    setIsModalVisibleObservaciones(true);
  };

  const handleOkObservaciones = () => {
    setIsModalVisibleObservaciones(false);
  };

  const handleCancelObservaciones = () => {
    setIsModalVisibleObservaciones(false);
  };



  const dispatch = useDispatch()
  const router = useRouter()
  const [showProfile, setShowProfile] = useState(false)
  const [activeProfile, setActiveProfile] = useState<TramiteAlta>(null)
  const [modalObservaciones, setModalObservaciones] = useState(false)

  const [activeProfile2, setActiveProfile2] = useState<TramiteAlta>(null)
  const [showProfile2, setShowProfile2] = useState(false)


  const EliminarBorrador = (props) => {
    const [showEliminar, setShowEliminar] = useState(false)
    return <div>

      <Modal
        title="Eliminar Borrardor"
        visible={showEliminar}
        onCancel={() => setShowEliminar(false)}
        footer={[
          <Button key="back" onClick={() => setShowEliminar(false)}>
            Cancelar
          </Button>,
          <Button type="primary" loading={loading} onClick={async () => {
            setLoading(true)
            masterLoadingFunction(true)
            await eliminarBorrador(props.tramite)
            await refreshFunction()
            setShowEliminar(false)
            masterLoadingFunction(false)
          }}>
            Eliminar
          </Button>,
        ]}
      >
        <p> Esta seguro que desea eliminar el borrador? </p>
      </Modal>

      <div onClick={() => setShowEliminar(true)}>
        {props.tramite.status === 'BORRADOR' ? <div className="cursor-pointer" style={{ color: '#C62828', marginLeft: "20px", border: "1px dashed #C62828", borderRadius: "24px", textAlign: "center", float: "right", width: "24px", height: "24px" }} ><DeleteTwoTone twoToneColor="#C62828" /> </div> : ''}
      </div>
    </div>
  }

  const mostrarTramite = (t: TramiteAlta) => {

    const esUltimo = (_tramite: TramiteAlta) => {
      return _.last(
        _.sortBy(tramites.filter(t => t.cuit === _tramite.cuit), t => {
          t.aprobacion
        }))._id === _tramite._id

    }

    if (t.status !== 'VERIFICADO') return true

    return t.status === 'VERIFICADO' && esUltimo(t) && _.isEmpty(tramites.filter(tr => tr.cuit === t.cuit && tr.status !== 'VERIFICADO'))
  }


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


    <Modal title="Ver observaciones"
      visible={isModalVisibleObservaciones} onOk={handleOkObservaciones} onCancel={handleCancelObservaciones}
      width={1000}>
      <div className="text-3xl font-bold  text-black-700 pb-4 ">{activeProfile2 && activeProfile2.razonSocial}</div>
      <div className="text-base  text-black-700 pb-4 ">
        <Timeline>
          {activeProfile2 && activeProfile2.rechazos.map(e => <div><Timeline.Item>{e.motivo}</Timeline.Item></div>)}
        </Timeline>
      </div>
    </Modal>


    <div className="px-4 md:px-8 mx-8 ">
      <div className=" grid grid-cols-3  gap-4  ">
        {tramites.filter(mostrarTramite).map((e: TramiteAlta) => (
          <div className="cursor-pointer" >
            <Card className="rounded h-full " style={{ background: "#525252" }}
              actions={[

                <div className="text-left pl-4">
                  <div className="flex">
                    <Certificado
                      cuit={e.cuit}
                      token={getToken()} />
                    {/* 
                  {!_.isEmpty(e.rechazos) && <div className="text-left ">
                      <Button type="link" style={{ textAlign: "left", padding: 0, color: '#0072bb' }}
                        onClick={() => {
                          showModalObservaciones()
                          setActiveProfile2(e)
                          setShowProfile2(true)
                        }}> <EyeOutlined /> Ver Observaciones</Button>
                    </div>}
                    */}
                  </div>

                </div>,

                <div className="text-right pr-4 text-primary-500">
                  <Button type="link" style={{ fontWeight: 'bold', textAlign: "right", color: '#0072bb' }}
                    onClick={async () => {
                      //MONKEY PATCH = Se agrega valores por default a los campos que no los tienen. En futuras versiones sacar este afuera y dejarlo como un "Clean default."
                      if (!e.datosSocietarios.sociedadAnonima.contrato)
                        e.datosSocietarios.sociedadAnonima.contrato = {
                          fecha: '',
                          archivos: []
                        }

                      if (!e)
                        e.datosSocietarios['PJESP'] = {
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
                      await dispatch(setUpdateBorrador(e))
                      await dispatch(cargarUltimaRevisionAbierta(e))
                      router.push('/informacion_basica')

                    }}>{e.status === 'BORRADOR' ? 'Continuar' : 'Ingresar'}  <ArrowRightOutlined /> </Button></div>,
              ]}>
              <div className="pb-2">
                <div className="flex">
                  <Tooltip title="Estado de la Inscripción">
                    <Tag >{e.categoria}</Tag>
                  </Tooltip>

                  <Tooltip title="Estado de la Trámite">
                    <Tag color={getColorStatus(e)}>{ e.status === 'VERIFICADO' ? '' : '' || e.status === 'A SUPERVISAR' ? 'EN REVISION' : e.status  }</Tag>
                  </Tooltip>
                  {e.ddjjObras.map(r =>
                    <div>  {r.datosObra && r.datosObra.map(r => <div>{r.estado === 'Adjudicada' ? <Tag color="gold" >art.13</Tag> : ''}</div>)}</div>)}


                  <div className="absolute inset-y-10 right-0 w-1 pr-6">
                    <EliminarBorrador tramite={e} />
                  </div>



                </div>
              </div>
              <div className="text-lg font-bold text-black-700  "> {e.razonSocial}</div>
              <div className="text-sm  text-black-700  "> Cuit: {e.cuit}</div>
              <div className="text-sm  text-black-700  "> Fecha de creación: {moment(e.createdAt).format('DD/MM/YYYY HH:mm')} </div>
              <div className="text-sm  text-black-700  "> Fecha de envio: {e.submitedAt  ?  moment(e.submitedAt).format('DD/MM/YYYY HH:mm') : ''}</div>
              <div className="text-sm  text-black-700  ">Tipo de trámite:<span className="text-sm  font-bold text-black-700   "> {e.subCategoria && e.categoria==='DESACTUALIZADO'?'ACTUALIZACION' : 'INSCRIPCION'}</span></div>
            </Card>
          </div>
        ))}
      </div>
    </div>

    <style>
      {` 
      .ant-card-actions{
        border-radius: 10px !important;
        background: #FAFAFA !important;
      }
      .ant-card-actions > li:not(:last-child){
        border-right: 0px solid #f0f0f0;
      }
      
      
      `}
    </style>

  </div>
}

const columnsObras = [
  {
    title: 'Codigo',
    dataIndex: 'codigo',
    key: 'codigo',
  },
  {
    title: 'Razon social Comitente',
    dataIndex: 'razonsocialcomitente',
    key: 'razonsocialcomitente',
  },
  {
    title: 'Denominación',
    dataIndex: 'denominacion',
    key: 'denominacion',
  },
  {
    title: 'Fecha de adjudicación',
    dataIndex: 'fechaAdjudicacion',
    key: 'fechaAdjudicacion',
  },
  {
    title: 'Monto vigente',
    dataIndex: 'montovigente',
    key: 'montovigente',
  },
  {
    title: 'Saldo',
    dataIndex: 'saldo',
    key: 'saldo',
  }
]