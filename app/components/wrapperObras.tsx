import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateRevisionTramite } from '../redux/actions/revisionTramite'
import _ from 'lodash'
import { Button, Modal, Tooltip } from 'antd'
import { DislikeFilled, InfoCircleOutlined, InfoCircleTwoTone, LikeFilled } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'
import { getReviewAbierta, getToken, getUsuario } from '../services/business'
import { RootState } from '../redux/store'


const customColors = ['#2897D4'];
const colors = [
	'red',
	'yellow',
	'orange',
	'cyan',
	'green',
];

export default (props) => {
	const { attributeName } = props
	const dispatch = useDispatch()
	const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)
	const revisionTramite = useSelector((state: RootState) => state.revisionTramites)
	const [showObs, setShowObs] = useState(false)
	const [textObs, setTextObs] = useState('')
	const [user, setUser] = useState(null)


	const obra: DDJJObra = props.obra



	if (obra && !obra.observacionesDelRegistro)
		obra.observacionesDelRegistro = {
			denominacion: null,
			ubicacionGeografica: null,
			plazoPorContrato: null,
			transcurrido: null,
			restante: null,
			razonSocialUTE: null,
			cuitUTE: null,
			participacionUTE: null,
			razonSocialComitente: null,
			cuitComitente: null,
			montoInicial: null,
			especialidad1: null,
			subEspecialidad1: null,
			subEspecialidades1Otros: null,
			especialidad2: null,
			subEspecialidad2: null,
			subEspecialidades2Otros: null,
			especialidad3: null,
			subEspecialidad3: null,
			subespecialidades: null,
			subEspecialidades3Otros: null,
			datosGenerales:null,
			archivosOrdenDeCompra:null,
			addProrroga:null,
			certificacionesTitles:null,
			ampliacionesTitle:null,
			redeterminacionesTitle:null,
			likeProrroga:null,
			ubicacion:null,
			ubicacionText:null,
			tipoContratacion:null,
			nivel:null
		}



	if (!obra)
		return <div></div>

	const isEditable = () => {
		
		return  obra.observacionesDelRegistro[props.field] && obra.observacionesDelRegistro[props.field] !== null  && (obra.observacionesDelRegistro[props.field] &&  obra.observacionesDelRegistro[props.field].length > 0 ) ||
		obra.observacionesDelRegistro[props.field] && obra.observacionesDelRegistro[props.field] !== undefined  && (obra.observacionesDelRegistro[props.field] &&  obra.observacionesDelRegistro[props.field].length > 0 )
		|| tramite.status ==='BORRADOR'  && getUsuario().isConstructor() || 
		tramite.status ==='OBSERVADO' && obra.observacionesDelRegistro[props.field] && obra.observacionesDelRegistro[props.field] !== null  && (obra.observacionesDelRegistro[props.field] &&  obra.observacionesDelRegistro[props.field].length > 0 )
		|| 
		tramite.status ==='OBSERVADO' && obra.observacionesDelRegistro[props.field] && obra.observacionesDelRegistro[props.field] !== undefined  && (obra.observacionesDelRegistro[props.field] &&  obra.observacionesDelRegistro[props.field].length > 0 )
	
	}

	const getColorIcon = (handUp: boolean) => {

		if (obra.observacionesDelRegistro[props.field] === null)
			return "#1890ff"


		if (handUp)
			return obra.observacionesDelRegistro[props.field] === '' ? 'green' : '#e2e8f0'
		else
			return obra.observacionesDelRegistro[props.field] !== '' ? 'red' : '#e2e8f0'

	}

	
	const disLike = () => {
		obra.observacionesDelRegistro[props.field] = textObs


		props.onChange(Object.assign({}, obra))

		setShowObs(false)

		if (!textObs)
			return
		setTextObs('')
	}

	const getReviewText = () => {
		return obra.observacionesDelRegistro[props.field]
	}




	return <div className={props.isTitle ? 'w-full' : ''}>
		<Modal
			visible={showObs}
			title="Observaciones"
			onOk={disLike}
			onCancel={() => setShowObs(false)}
		>
			<TextArea placeholder="Escriba aqui el motivo " allowClear onChange={(e) => setTextObs(e.target.value)} />
		</Modal>
		<div className="flex ">
			<div className="flex w-3/4">

				{  getReviewText()  ? <div className="">
          <label className={props.isTitle  ? 'text-2xl text-danger-700 font-bold py-4' : 'font-bold text-danger-700 text-sm'}>{props.title}<span className="text-danger-700 ml-1">   {props.labelRequired}
          {customColors.map(color => (
            <Tooltip
              title={getReviewText()}
              placement="right"
              color={color}
              key={color}>
              <p className="text-sm">OBSERVADO  <InfoCircleTwoTone twoToneColor="#f9a822" className="pl-2 text-xl" /> </p>
            </Tooltip>
          ))}
           </span></label>
        </div>:  <label className={props.isTitle  ? 'text-2xl font-bold py-4' : 'font-bold text-muted-700 text-sm'}>{props.title}<span className="text-danger-700 ml-1">   {props.labelRequired}  </span></label>
         } 
				
			</div>
			{!getUsuario().isConstructor() &&  tramite.asignadoA && tramite.categoria!=='INSCRIPTO'  ? 
				<div className="justify-end w-2/5">
					<div className=" text-right">
						<Button type="link" onClick={() => {
							obra.observacionesDelRegistro[props.field] = ''
							props.onChange(Object.assign({}, obra))
							
						}} icon={<LikeFilled style={{ color: getColorIcon(true) }} />} />
						<Button onClick={() => setShowObs(true)} type="link" icon={<DislikeFilled style={{ color: getColorIcon(false) }} />} />
					</div>
				</div>:''
			}
		</div >
		
		{React.isValidElement(props.children) ? React.cloneElement(props.children, { isEditable: isEditable() }) : props.children}

	</div >
}