import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { getEmptyTramiteAlta } from '../services/business'
import InputTextModal from './input_text_modal'
import SelectModal from './select_modal'
import UploadLine from './uploadLine'

export interface ObrasUbicacionGeograficaProps {

}

export const ObrasUbicacionGeografica: React.FC<ObrasUbicacionGeograficaProps> = ({

}) => {
	const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta || getEmptyTramiteAlta())
	const [codigo,setCodigo] = useState('')
	const [estado,setEstado] = useState('')
	useEffect(() => {

	}, [])
	const add = () => {

	}
	return <div> hola</div>
}
