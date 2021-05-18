import { Alert, BackTop, Button, Select, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import moment from 'moment'
import React, { useState } from 'react'
import { getEmptyTramiteAlta, getUniqCode, getUsuario } from '../services/business'
import DatePicker from './datePicker'
import InputTextModal from './input_text_modal'
import Upload from './upload'
import InputNumberModal from './input_number'
import numeral from 'numeral'
import { LinkToFile } from './linkToFile'
import _ from 'lodash'
import DatePickerModal from './datePicker_Modal'
import { Modal, Input, Tooltip } from 'antd'
import { LikeFilled, DislikeFilled } from '@ant-design/icons';
import { RootState } from '../redux/store'
import { useSelector } from 'react-redux'

const { Option } = Select
const { TextArea } = Input

export interface CertificacionesPrecargadasProps {
  obra: DDJJObra,
  onChange: Function
}




export const CertificacionesPrecargadas: React.FC<CertificacionesPrecargadasProps> = ({
  obra = null,
  onChange = () => null
}) => {

  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta) || getEmptyTramiteAlta()
  const [periodo, setPeriodo] = useState(null)
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState(0)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null)
  const [archivos, setArchivos] = useState<Array<Archivo>>([])
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [showMotivoRechazo, setShowMotivoRechazo] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [certificadoSeleccionado, setCertificadoSeleccionado] = useState(null)
  const borrarPeriodo = (p) => {
    // setPeriodos(Object.assign([], periodos.filter(v => v.codigo !== p.codigo)))
    obra.certificaciones = Object.assign([], obra.certificaciones.filter(v => v.codigo !== p.codigo))
    onChange(Object.assign({}, obra))
  }


  const Accion = (prop) => {

    if ((!tramite.asignadoA) || (!getUsuario().isConstructor() && tramite.asignadoA && tramite.asignadoA.cuit !== getUsuario().userData().cuit))
      return <div>{prop.certificacion.status ? prop.certificacion.status : 'SIN EVALUAR'}</div>

    return <div>
      <Select
        value={prop.certificacion.status}
        onChange={e => {
          setCertificadoSeleccionado(prop.certificacion)
          if (e === 'RECHAZADO') {
            setShowMotivoRechazo(true)
          } else {
            const idx = _.findIndex(obra.certificaciones, c => { return c.codigo === prop.certificacion.codigo })
            obra.certificaciones[idx] = {
              ...obra.certificaciones[idx],
              status: e as any
            }
            onChange(Object.assign({}, obra))
          }


        }} style={{ width: 150 }} >
        <Option key='APROBADA' value='APROBADA'>APROBADA</Option>
        <Option key='RECHAZADA' value='RECHAZADO'>OBSERVADA</Option>
       <Option key='DESESTIMADA' value='DESESTIMADA'>DESESTIMADA</Option>
      </Select>
    </div>
  }

  let columns = [
    {
      title: 'Estado',
      key: 'Estado',
      render: (text, record) => <Accion certificacion={record} />
    },
    {
      title: '',
      key: 'evaluacion',
      render: (text, record) => <Tooltip title={record.observacionRegistro}><div>{record.status === 'RECHAZADA' ? <DislikeFilled style={{ color: '#F9A822' }} /> : <LikeFilled style={{ color: record.status && record.status === 'APROBADA' ? '#2E7D33' : '#9CA3AF' }} />}</div></Tooltip>

    },
    {
      title: 'Eliminar',
      key: 'delete ',
      render: (text, record) => <div onClick={() => borrarPeriodo(record)}><DeleteOutlined /></div>
    },
    {
      title: 'Periodo',
      key: 'periodo',
      render: (text, record) => <div>{moment(record.periodo, 'DD/MM/YYYY').format('MMMM YYYY')}</div>
    }, 
    {
      title: 'Monto',
      key: 'monto',
      sorter: (a, b) => a.monto - b.monto,
      render: (text, record) => <div>{numeral(record.monto).format('$0,0.00')}</div>
    },
    
    {
      title: 'Descripción',
      key: 'descripcion',
      dataIndex: 'descripcion'
    },
    {
      title: 'Adjunto',
      key: 'adjunto',
      render: (text, record) => <div>{record.archivos && record.archivos.map(f => <LinkToFile fileName={f.name} id={f.cid} />)} </div>
      
    },
    
  ]

  columns = getUsuario().isConstructor() ? columns.slice(1, columns.length ) : [columns[0], columns[1], columns[3], columns[4], columns[5], columns[6]]



  const agregarPeriodo = () => {

    if ((!periodo)) {
      setError('El periodo   es requerido')
      setShowError(true)
      return
    }
    if ((!monto)) {
      setError('El monto   es requerido')
      setShowError(true)
      return
    }
    if ((!descripcion)) {
      setError('La descripción es requerida')
      setShowError(true)
      return
    }
    if (_.isEmpty(archivos)) {
      setError('El documento respaldatorio es requerido')
      setShowError(true)
      return
    }

    let periodosCopy = Object.assign([], obra.certificaciones)

    if (periodoSeleccionado)
      periodosCopy = obra.certificaciones.filter(v => v.codigo !== periodoSeleccionado.codigo)


    periodosCopy.push({
      codigo: periodoSeleccionado ? periodoSeleccionado.codigo : getUniqCode(),
      periodo,
      monto,
      descripcion,
      archivos
    })

    setPeriodo(null)
    setMonto(0)
    setDescripcion('')
    setPeriodoSeleccionado('')
    setArchivos([])
    obra.certificaciones = periodosCopy
    onChange(Object.assign({}, obra))
    clearState()
  }

  const clearState = () => {
    setPeriodo(null)
    setMonto(0)
    setDescripcion('')
    setPeriodoSeleccionado(null)

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
        const idx = _.findIndex(obra.certificaciones, c => { return c.codigo === certificadoSeleccionado.codigo })

        obra.certificaciones[idx] = {
          ...obra.certificaciones[idx],
          status: 'RECHAZADA',
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
    <div className="text-xl font-bold py-2 w-3/4">  Certificaciones</div>
    <div className="mb-4">
      <Alert message="“En esta sección podrá cargar cada certificado de la obra, y deberá hacerlo una vez se encuentre facturado, y de forma mensual. Indicar período de facturación (MM/AAAA), monto facturado en ese mes, una breve descripción sobre que es lo que compone este período, y la documental que sustente esta carga. Deberá adjuntar el certificado junto con su factura. En caso de que la cantidad de facturas emitidas al mes sea muy considerable, podrá presentar una certificación contable del libro IVA Ventas, indicando fecha, número de comprobante emitido, importe de la factura, y total mes a mes.”" type="info" />
    </div>
    <div className="grid grid-cols-4 gap-4 ">

      <div >
        <DatePickerModal
          picker="month"
          placeholder="Periodo (mm/yyyy)"
          label="Periodo"
          labelRequired="*"
          labelObservation=""
          labeltooltip=""
          labelMessageError=""
          value={periodo}
          bindFunction={(value) => { setPeriodo(value) }}
        />
      </div>
      <div >
        <InputNumberModal
          label="Monto"
          step="any"
          labelRequired="*"

          placeholder="000000,000 "
          value={monto}
          bindFunction={(val) => setMonto(parseFloat(val))}
          labelMessageError=""
          required />


      </div>
      <div >
        <InputTextModal
          label="Descripcion"
          labelRequired="*"
          labelMessageError=""
          value={descripcion}
          bindFunction={(value) => { setDescripcion(value) }}
        />
      </div>
      <div >
        <Upload
          label="Documentación respaldatoria"
          labelRequired="*"
          labelMessageError=""
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
    <div className=" text-center mb-4">
      <Button onClick={agregarPeriodo} type={periodo ? 'primary' : 'ghost'}>{periodoSeleccionado ? 'Editar' : 'Agregar'}</Button>
    </div>


    <div>
      <Table pagination={false} columns={columns} dataSource={Object.assign([], obra.certificaciones)}
        summary={pageData => {

          return <div>
            {pageData.length > 0 ? <div className="ml-4 font-semibold">
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <div >{numeral(pageData.map(d => d.monto).reduce((val, acc) => acc = val + acc)).format('$0,0.00')}</div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </div> : ''}
          </div>
        }}
      />
    </div>
    <style>
      {`
          .ant-btn{
              padding:0px 4px;
          }
          .like{
              color: #2E7D33;
          }
          .dislike{
              color:#F9A822;
          }
          .neutro{
              color:#333333;
              opacity:0.15;
          }
        `}
    </style>

  </div>
}


