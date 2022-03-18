import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCodigoObra, getEmptyTramiteAlta, getUsuario, isTramiteEditable } from '../services/business'
import InputTextModal from './input_text_modal'
import InputNumberModal from './input_number'
import SelectModal from './select_modal'
import Upload from './upload'
import { Button, Select, Table, Alert, Space, Empty, Input, Tooltip, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, DislikeFilled, LikeFilled,EditOutlined } from '@ant-design/icons';
import DatePickerModal from './datePicker_Modal'
import { LinkToFile } from './linkToFile'
import { RootState } from '../redux/store'
import _ from 'lodash'
import WrapperObras from './wrapperObras'
import Wrapper from './wrapper'

const { Option } = Select
const { TextArea } = Input

export interface ObrasAmpliacionesProps {
  obra: DDJJObra
  onChange: Function
}
const MODO = {
  NEW: 'NEW',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
  }


export const ObrasAmpliaciones: React.FC<ObrasAmpliacionesProps> = ({
  obra = null,
  onChange = () => null
}) => {
  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta || getEmptyTramiteAlta())
  //const tramite: TramiteAlta = useSelector(state => state.appStatus.tramiteAlta || getEmptyTramiteAlta())*/
  const [monto, setMonto] = useState(0)
  const [fecha, setFecha] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [archivos, setArchivos] = useState([])
  const [status, setStatus] = useState('')
  const [observacionRegistro, setObservacionRegistro] = useState('')
  //const [dataSource, setDataSource] = useState<Array<AmpliacionesObras>>(obra.ampliaciones)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [ampliacionSeleccionada, setAmpliacionSeleccionada] = useState(null)
  const [showMotivoRechazo, setShowMotivoRechazo] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [idAmpliaciones, setIdAmpliaciones] = useState('')

	const [modo, setModo] = useState(MODO.NEW)
	useEffect(() => {

	}, [])


  useEffect(() => {

  }, [])

  const eliminarDatos = (o: AmpliacionesObras) => {
    // setDataSource(obra.ampliaciones.filter((a: AmpliacionesObras) => o.id !== a.id))
    obra.ampliaciones = Object.assign([], obra.ampliaciones.filter((a: AmpliacionesObras) => o.id !== a.id))
    onChange(Object.assign({}, obra))
  }
 

	const cargarAmpliaciones = (record) => {
    setAmpliacionSeleccionada(record)
		setStatus(record.status)
    setObservacionRegistro(record.observacionRegistro)
		setFecha(record.fecha)
		setDescripcion(record.descripcion)
		setArchivos(record.archivos)
		setMonto(record.monto)
	  }

  const Accion = (prop) => {

    if ((!tramite.asignadoA) || (!getUsuario().isConstructor() && tramite.asignadoA && tramite.asignadoA.cuit !== getUsuario().userData().cuit))
      return <div>{prop.ampliacion.status ? prop.ampliacion.status : 'SIN EVALUAR'}</div>

    return <div>
      <Select
        value={prop.ampliacion.status}
        onChange={e => {
          setAmpliacionSeleccionada(prop.ampliacion)
          if (e === 'OBSERVADA') {
            setShowMotivoRechazo(true)
          } else {
            const idx = _.findIndex(obra.ampliaciones, c => { return c.id === prop.ampliacion.id })
            obra.ampliaciones[idx] = {
              ...obra.ampliaciones[idx],
              status: e as any
            }
            onChange(Object.assign({}, obra))
          }


        }} style={{ width: 150 }} >
        <Option key='APROBADA' value='APROBADA'>APROBADA</Option>
        <Option key='OBSERVADA' value='OBSERVADA'>OBSERVADA</Option>
       {/*  <Option key='DESESTIMADA' value='DESESTIMADA'>DESESTIMADA</Option>*/}
      </Select>
    </div>
  }

  let columnsAmpliaciones = [
    {
      title: 'Estado',
      key: 'Estado',
      render: (text, record) => <Accion ampliacion={record} />
    },
    {
      title: '',
      key: 'evaluacion',
      render: (text, record) => <Tooltip title={record.observacionRegistro}>
        <div> { getUsuario().isConstructor() && tramite.status==='OBSERVADO'  && record.status === 'OBSERVADA' || !getUsuario().isConstructor()  && record.status === 'OBSERVADA' ? 
        <DislikeFilled style={{ color: '#F9A822' }} /> : 
        <LikeFilled style={{ color: record.status && record.status === 'APROBADA' ? '#2E7D33' : '#9CA3AF' }} />}</div></Tooltip>,
        with:100,
    },
    {
			title: '',
			key: 'edit',
			render: (text, record) => (tramite && tramite.status === 'BORRADOR' || tramite && tramite.status  === 'OBSERVADO' && record.status !== 'APROBADA'
			|| tramite && tramite.status  === 'OBSERVADO' && record.status === 'OBSERVADA' ? <div onClick={() => {
        cargarAmpliaciones(Object.assign({}, record))
			}}><EditOutlined /></div>: '')
		  },
    {
      title: 'Eliminar',
      key: 'action',
      render: (text, record) => (tramite && tramite.status === 'BORRADOR' || tramite && tramite.status  === 'OBSERVADO' && record.status !== 'APROBADA'
      || tramite && tramite.status  === 'OBSERVADO' && record.status === 'OBSERVADA' ? 
      <div onClick={() => eliminarDatos(record)}><DeleteOutlined /></div> : '' ),
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha'
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      sorter: (a, b) => a.monto - b.monto,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion'
    },
    {
      title: 'Adjunto',
      key: 'adjunto',
      render: (text, record) => <div>{record.archivos && record.archivos.map(f => <LinkToFile fileName={f.name} id={f.cid} />)} </div>
    }


  ];

  columnsAmpliaciones = getUsuario().isConstructor() ? columnsAmpliaciones.slice(1, columnsAmpliaciones.length ) : [columnsAmpliaciones[0], columnsAmpliaciones[1], columnsAmpliaciones[3], columnsAmpliaciones[4], columnsAmpliaciones[5], columnsAmpliaciones[6], columnsAmpliaciones[7]]


  const add = () => {
    if ((!monto)) {
      setError('El monto  es requerido')
      setShowError(true)
      return
    }
    if ((!fecha)) {
      setError('La fecha es requerida')
      setShowError(true)
      return
    }
    if ((!descripcion)) {
      setError('La Descripcion es requerida')
      setShowError(true)
      return
    }
    if (_.isEmpty(archivos)) {
      setError('El documento respaldatorio es requerido')
      setShowError(true)
      return
    }
    
    



    obra.ampliaciones.push({
      id: getCodigoObra(),
      monto,
      fecha,
      descripcion,
      archivos,
      observacionRegistro,
      
      
    })
    //setDataSource(Object.assign([], dataSource))
    // obra.ampliaciones = Object.assign([], dataSource)
    onChange(Object.assign({}, obra))
    setArchivos([])
    setMonto(0)
    setDescripcion('')
    setFecha('')
    setStatus('')
    setObservacionRegistro('')
  }
  return <div>
    {showError ? <div className="mb-4">
      <Alert
        message=''
        description={error}
        type="error"
        showIcon
        closable
        afterClose={() => setShowError(false)}
      /></div> : ''}

    <Modal
      visible={showMotivoRechazo}
      onCancel={() => setShowMotivoRechazo(false)}
      onOk={() => {
        const idx = _.findIndex(obra.ampliaciones, c => { return c.id === ampliacionSeleccionada.id })

        obra.ampliaciones[idx] = {
          ...obra.ampliaciones[idx],
          status: 'OBSERVADA',
          observacionRegistro: motivoRechazo
        }
        setShowMotivoRechazo(false)
        setMotivoRechazo('')
        onChange(Object.assign({}, obra))
      }}

    >
      <p>Por favor, indique el motivo de rechazo o desestimación</p>
      <TextArea value={motivoRechazo} onChange={e => setMotivoRechazo(e.target.value)}></TextArea>
    </Modal>

    <div className="rounded-lg px-4 py-2  pb-4 border mt-6">
    <div className="text-xl font-bold py-2 w-3/4"> Ampliaciones </div>

		
      <div className="text-xl font-bold py-2 w-3/4">  </div>
      <div className="mb-4">
        <Alert message="En esta sección podrá cargar ampliaciones de contrato, adendas, economías, reducciones contractuales, etc." type="info" />
      </div>
      <div className="grid grid-cols-4 gap-4 ">
        <div className="pb-6" >
          <DatePickerModal
            placeholder="Fecha  (dd/mm/yyyy)"
            label="Fecha de la Ampliación"
            labelRequired="*"
            labelObservation=""
            labeltooltip=""
            labelMessageError=""
            value={fecha}
            bindFunction={(value) => { setFecha(value) }}
          />
        </div>
        <div className="pb-6" >

          <InputNumberModal
            placeholder="000000,000 "
            label="Monto"
            type="number" step="any"
            labelRequired="*"
            labelMessageError=""
            className=""
            value={monto}
            bindFunction={(val) => setMonto(parseFloat(val))}
            required />
        </div>


        <div className="pb-6" >
          <InputTextModal
            label="Descripción"
            step="any"
            labelRequired="*"
            labelMessageError=""
            value={descripcion}
            bindFunction={(value) => { setDescripcion(value) }}
          />
        </div>

        <div className="pb-6" >
          <Upload
            label="Documentación respaldatoria"
            labelRequired="*"
            defaultValue={archivos as any}
            onOnLoad={file => {
              archivos.push(file)
              setArchivos(Object.assign([], archivos))
            }}
            onRemove={fileToRemove => {
              setArchivos(Object.assign([], archivos.filter(f => f.cid !== fileToRemove.cid)))
            }}
          />
        </div>

      </div>
      {getUsuario().isConstructor() ?
      <div className=" text-center">
        
        <Button type="primary" onClick={add} icon={<PlusOutlined />}> Agregar</Button>
      </div> :''}
      <div className="mt-4 ">
        <Table
        pagination={false}
          columns={columnsAmpliaciones}
          dataSource={Object.assign([], obra.ampliaciones)}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }}
          summary={pageData => {
            return <div>
              {pageData.length > 0 ? <div className="ml-4 font-semibold">
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <div >{pageData.map(d => d.monto).reduce((val, acc) => acc = val + acc)}</div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </div> : ''}
            </div>
          }} />
      </div>

    </div>
  </div>
}

