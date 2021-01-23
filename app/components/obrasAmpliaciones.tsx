import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCodigoObra, getEmptyTramiteAlta } from '../services/business'
import InputTextModal from './input_text_modal'
import SelectModal from './select_modal'
import Upload from './upload'
import { Button, Select, Table, Alert , Space, Empty} from 'antd';
import { PlusOutlined ,DeleteOutlined} from '@ant-design/icons';
import DatePickerModal from './datePicker_Modal'

export interface ObrasAmpliacionesProps {
  obra: DDJJObra
  onChange: Function
}

export const ObrasAmpliaciones: React.FC<ObrasAmpliacionesProps> = ({
  obra = null,
  onChange = () => null
}) => {
  const tramite: TramiteAlta = useSelector(state => state.appStatus.tramiteAlta || getEmptyTramiteAlta())
  //const tramite: TramiteAlta = useSelector(state => state.appStatus.tramiteAlta || getEmptyTramiteAlta())*/
  const [monto, setMonto] = useState(0)
  const [fecha, setFecha] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [archivos,setArchivos] = useState([])
  const [dataSource, setDataSource] = useState<Array<AmpliacionesObras>>(obra.ampliaciones)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  useEffect(() => {

  }, [])

  const eliminarDatos = (o:AmpliacionesObras) => {
    setDataSource(dataSource.filter( (a:AmpliacionesObras) => o.id!== a.id))
    obra.ampliaciones = Object.assign([],dataSource)
    onChange(Object.assign({},obra))
  }

  const columnsAmpliaciones = [
    {
      title: 'Eliminar',
      key: 'action',
      render: (text, record) => (tramite && tramite.status === 'BORRADOR' ? <div onClick={() => eliminarDatos(record)}><DeleteOutlined /></div> : <Space size="middle">
  
      </Space>),
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha'
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto'
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion'
    },
    {
      title: 'Adjunto',
      key: 'adjunto',
      render: (text,record) => <div>{record.archivos && record.archivos.map( f=> f.name).join(', ')}</div>
    }
  
  
  ];

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

    dataSource.push({ 
      id:getCodigoObra(), 
      monto, 
      fecha,
      descripcion,
      archivos })
    setDataSource(Object.assign([], dataSource))
    obra.ampliaciones = Object.assign([],dataSource)
    onChange(obra)
    setArchivos([])
    setMonto(0)
    setDescripcion('')
    setFecha('')
  }
  return <div>
    {showError ? <div className="mb-4">
      <Alert
        message='Error'
        description={error}
        type="error"
        showIcon
        closable
        afterClose={() => setShowError(false)}
      /></div> : ''}
    <div className="rounded-lg px-4 py-2  pb-4 border mt-6">
      
      <div className="text-xl font-bold py-2 w-3/4">  Ampliaciones</div>
      <div className="mb-4">
        <Alert message="En esta sección podrá cargar ampliaciones de contrato, adendas, economías, reducciones contractuales, etc." type="info" />
      </div>
      <div className="grid grid-cols-3 gap-4 ">
        <div className="pb-6" >
          <InputTextModal
            label="Monto"
            type="number" step="any"
            labelRequired="*"
            labelMessageError=""
            value={monto}
            bindFunction={(value) => { setMonto(value) }}
          />
        </div>
        <div className="pb-6" >
          <DatePickerModal
            placeholder="Fecha  (dd/mm/yyyy)"
            label="Fecha de la Ampliacion"
            labelRequired="*"
            labelObservation=""
            labeltooltip=""
            labelMessageError=""
            value={fecha}
            bindFunction={(value) => { setFecha(value) }}
          />
        </div>
        <div className="pb-6" >
          <InputTextModal
            label="Descripcion"
            step="any"
            labelRequired="*"
            labelMessageError=""
            value={descripcion}
            bindFunction={(value) => { setDescripcion(value) }}
          />
        </div>

        <div className="pb-6" >
          <Upload
            label="Ampliación / Reducción contractual"
            labelRequired="*"
            defaultValue={archivos as any}
            onOnLoad={file =>{
              archivos.push(file)
              setArchivos(Object.assign([],archivos))
            }}
            onRemove={fileToRemove => {
              setArchivos(Object.assign([],archivos.filter(f=> f.cid !==fileToRemove.cid)))
            }}
          />
        </div>
       
      </div>
      <div className=" text-center">
        <Button type="primary" onClick={add} icon={<PlusOutlined />}> Agregar</Button>
      </div>
      <div className="mt-4 ">
        <Table columns={columnsAmpliaciones} dataSource={dataSource} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>,}}/>
      </div>

    </div>
  </div>
}

