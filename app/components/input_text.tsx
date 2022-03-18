import React, { useState } from 'react'
import { Button, Input, Tooltip, Modal } from 'antd';
import { LikeFilled, DislikeFilled, PropertySafetyFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux'
import { getReviewAbierta, getUsuario, isTramiteEditable } from '../services/business';
import _ from 'lodash'
import { updateRevisionTramite } from '../redux/actions/revisionTramite';
import { useDispatch } from 'react-redux'
import { RootState } from '../redux/store';

const { TextArea } = Input

const customColors = ['#2897D4'];
const colors = [
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
];

export interface IProps {
  value: string
  label?: string
  showHands?: boolean
  bindFunction?: Function
  type?: string
  placeHolder?: string
  required?: boolean
  disabled?: boolean
  labelMessageError?: string
  labelObservation?: string
  labeltooltip?: string
  labelRequired?: string
  attributeName: string
  maxLength?: number
  isEditable?: boolean
  locked? : boolean
  }
  




export const InputText: React.FC<IProps> = ({
  value = '',
  label = '',
  showHands = false,
  bindFunction,
  type,
  placeHolder,
  required = false,
  disabled = false,
  labelMessageError,
  labelObservation,
  labelRequired,
  maxLength,
  labeltooltip,
  attributeName,
  isEditable = false,
  locked = false

}) => {

  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)

  if (!tramite)
    return <div>Loading...</div>


  

 // const isEditable = () => {
   // const element = getReviewAbierta(tramite) && getReviewAbierta(tramite).reviews.filter(r => (r.field ===attributeName.toUpperCase()))
    /** Solo se permite editar aquellos elementos que estan observados o bien que no quue no fueron revisados */
    //return tramite.status ==='BORRADOR' ||
     // (tramite.status ==='OBSERVADO' && (_.isEmpty(element) || !element[0].isOk)) 
      //&& getUsuario().isConstructor()
  //}

  return <div >
    
    <div className="flex pb-1">
    {label && <div className="w-3/4">
        <label className="font-bold text-muted-700 text-sm">{label} <span className="text-danger-700 ml-1">{labelRequired}</span> </label>
      </div>
      }



    </div>
    <div className="w-full">
      <Input
        value={value}
        placeholder={placeHolder}
        required={required}
        disabled={isEditable === null ? false : !isEditable || locked}
        onChange={(e) => bindFunction(e.target.value)}
        type={type}
        maxLength ={maxLength}
      />
    </div>
    <div className="w-full text-xs text-danger-700 px-2 ">
      {labelMessageError}
    </div>
    

  </div>
}
