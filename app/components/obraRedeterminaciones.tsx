import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCodigoObra, getEmptyTramiteAlta, getUsuario, isTramiteEditable } from '../services/business'
import InputTextModal from './input_text_modal'
import SelectModal from './select_modal'
import Upload from './upload'
import { Button, Select, Table, Alert, Space, Empty, Tooltip, Modal, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, DislikeFilled, LikeFilled, EditOutlined  } from '@ant-design/icons';
import DatePickerModal from './datePicker_Modal'
import InputNumberModal from './input_number'
import { LinkToFile } from './linkToFile'
import _ from 'lodash'
import { RootState } from '../redux/store'
import numeral from 'numeral'
import Wrapper from './wrapper'

import WrapperObras from './wrapperObras'

const { Option } = Select
const { TextArea } = Input

export interface ObrasRedeterminacionesProps {
	obra: DDJJObra
	onChange: Function
}

const MODO = {
	NEW: 'NEW',
	EDIT: 'EDIT',
	VIEW: 'VIEW'
  }
  
export const ObrasRedeterminaciones: React.FC<ObrasRedeterminacionesProps> = ({
	obra = null,
	onChange = () => null
}) => {
	const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta || getEmptyTramiteAlta())
	/*const tramite: TramiteAlta = useSelector(state => state.appStatus.tramiteAlta || getEmptyTramiteAlta())*/
	const [monto, setMonto] = useState(0)
	const [fecha, setFecha] = useState('')
	const [descripcion, setDescripcion] = useState('')
	//const [dataSource, setDataSource] = useState<Array<Redeterminaciones>>(obra.redeterminaciones)
	const [error, setError] = useState('')
	const [archivos, setArchivos] = useState<Array<Archivo>>([])
	const [showError, setShowError] = useState(false)
	const [redeterinacionSeleccionada, setRedeterminacionSeleccionada] = useState(null)
	const [showMotivoRechazo, setShowMotivoRechazo] = useState(false)
	const [motivoRechazo, setMotivoRechazo] = useState('')
	const [observacionRegistro, setObservacionRegistro] = useState('')

	const [idRedeterminaciones, setIdRedeterminaciones] = useState('')

	const [modo, setModo] = useState(MODO.NEW)
	useEffect(() => {

	}, [])

	const eliminarDatos = (o: AmpliacionesObras) => {
		obra.redeterminaciones = Object.assign([], obra.redeterminaciones.filter((r: Redeterminaciones) => o.id !== r.id))
		onChange(Object.assign({}, obra))
	}

	const Accion = (prop) => {

		if ((!tramite.asignadoA) || (!getUsuario().isConstructor() && tramite.asignadoA && tramite.asignadoA.cuit !== getUsuario().userData().cuit))
			return <div>{prop.redeterminacion.status ? prop.redeterminacion.status : 'SIN EVALUAR'}</div>

		return <div>
			<Select
				value={prop.redeterminacion.status}
				onChange={e => {
					setRedeterminacionSeleccionada(prop.redeterminacion)
					if (e === 'OBSERVADA') {
						setShowMotivoRechazo(true)
					} else {
						const idx = _.findIndex(obra.redeterminaciones, c => { return c.id === prop.redeterminacion.id })
						obra.redeterminaciones[idx] = {
							...obra.redeterminaciones[idx],
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

	const cargarRederteminaciones = (record) => {
		setIdRedeterminaciones(JSON.stringify(record))
		setFecha(record.fecha)
		setDescripcion(record.descripcion)
		setArchivos(record.archivos)
		setMonto(record.monto)
		setObservacionRegistro(record.observacionRegistro)
		
	  }

	let columnsRedeterminaciones = [
		{
			title: 'Estado',
			key: 'Estado',
			render: (text, record) => <Accion redeterminacion={record} />,
			width: 100,
		},
		{
			title: '',
			key: 'evaluacion',
			render: (text, record) => 
			<Tooltip title={record.observacionRegistro}><div>
				 { getUsuario().isConstructor() && tramite.status==='OBSERVADO'  && record.status === 'OBSERVADA' || !getUsuario().isConstructor()  && record.status === 'OBSERVADA' ? <DislikeFilled style={{ color: '#F9A822' }} /> : <LikeFilled style={{ color: record.status && record.status === 'APROBADA' ? '#2E7D33' : '#9CA3AF' }} />}</div></Tooltip>,
			width: 50,
		},
		{
			title: '',
			key: 'edit',
			render: (text, record) => (tramite && tramite.status === 'BORRADOR' || tramite && tramite.status  === 'OBSERVADO' && record.status !=="APROBADA"
			|| tramite && tramite.status  === 'OBSERVADO' && record.status === 'OBSERVADA' ? <div onClick={() => {
				cargarRederteminaciones(record)
				setModo(MODO.EDIT)
				setRedeterminacionSeleccionada(Object.assign({}, record))
			}}><EditOutlined /></div>: ''),
			width: 25,
		  },
		{
			title: 'Eliminar',
			key: 'action',
			render: (text, record) => (tramite && tramite.status === 'BORRADOR' || tramite && tramite.status  === 'OBSERVADO'
			|| tramite && tramite.status  === 'OBSERVADO' && record.status === 'OBSERVADA'
			 ? <div onClick={() => eliminarDatos(record)}><DeleteOutlined /></div> : <Space size="middle">

			</Space>),
			 width: 25,
		},
		{
			title: 'Fecha',
			dataIndex: 'fecha',
			key: 'fecha',
			sorter: (a, b) => a.fecha - b.fecha,
			width: 75,
		},
		{
			title: 'Monto',
			dataIndex: 'monto',
			render: (text, record) => <div>{numeral(record.monto).format('$0,0.00')}</div>,
			sorter: (a, b) => a.monto - b.monto,
			width: 100,
		},
		{
			title: 'Descripción',
			dataIndex: 'descripcion',
			key: 'descripcion',
			width: 100,
		},
		{
			title: 'Adjunto',
			render: (text, record) => <div>{record.archivos && record.archivos.map(f => <LinkToFile fileName={f.name} id={f.cid} />)} </div>,
			key: 'adjunto',
			width: 150,
		}


	];

	columnsRedeterminaciones = getUsuario().isConstructor() ? columnsRedeterminaciones.slice(1, columnsRedeterminaciones.length ) : [columnsRedeterminaciones[0], columnsRedeterminaciones[1], columnsRedeterminaciones[3], columnsRedeterminaciones[4], columnsRedeterminaciones[5],columnsRedeterminaciones[6],columnsRedeterminaciones[7]]


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
			setError('La descripcion es requerida')
			setShowError(true)
			return
		}
		if (_.isEmpty(archivos)) {
			setError('El documento respaldatorio es requerido')
			setShowError(true)
			return
		}


		if (MODO.EDIT) {
			obra.redeterminaciones =  obra.redeterminaciones && obra.redeterminaciones.filter(r => JSON.stringify(r) !== idRedeterminaciones)
	  
		  }
		obra.redeterminaciones.push({
			
			id: getCodigoObra(),
			monto,
			fecha,
			descripcion,
			archivos
		})
		// setDataSource(Object.assign([], dataSource))
		// obra.redeterminaciones = Object.assign([], dataSource)

		setMonto(0)
		setFecha(null)
		setDescripcion('')
		setArchivos([])
		onChange(Object.assign({}, obra))
		clearState()

	}

	
    
   
   

	const clearState = () => {
		setMonto(0)
		setFecha(null)
		setDescripcion('')
		setArchivos([])
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
				const idx = _.findIndex(obra.redeterminaciones, c => { return c.id === redeterinacionSeleccionada.id })

				obra.redeterminaciones[idx] = {
					...obra.redeterminaciones[idx],
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
		<div className="text-xl font-bold py-2 w-3/4">Redeterminaciones </div>

			<div className="grid grid-cols-4 gap-4 mt-4 ">
				<div className="pb-6" >
					<DatePickerModal
						placeholder="Fecha  (dd/mm/yyyy)"
						label="Fecha de la redeterminación"
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
						min={0}
						placeholder="000000,000 "
						label="Monto"
						type="number" step="any"
						labelRequired="*"
						labelMessageError=""
						className=""
						value={monto}
						bindFunction={(val) => setMonto(parseFloat(val))}
					/>

				</div>

				<div className="pb-6" >
					<InputTextModal
						label="Descripción"

						labelRequired="*"
						labelMessageError=""
						value={descripcion}
						bindFunction={(value) => { setDescripcion(value) }}
					/>

				</div>
				<div className="pb-6" >
					<Upload
						label="Documentación respaldatoria "
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
			{getUsuario().isConstructor() ?
			<div className="text-center ">

				<div className=" ">
					<Button type="primary" onClick={add} icon={<PlusOutlined />}> Agregar</Button>
				</div>
			</div>
			:''}
			<div className="mt-4 ">
				<Table pagination={false}
				 columns={columnsRedeterminaciones}
					dataSource={Object.assign([], obra.redeterminaciones)}
					locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No hay información cargada </span>}></Empty>, }}
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
					}} />

			</div>

		</div>
	</div>
}

