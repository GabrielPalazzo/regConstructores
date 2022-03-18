import React, { useState } from 'react'
import { Button, InputNumber,Tooltip, } from 'antd';
import { LikeFilled, DislikeFilled } from '@ant-design/icons';
import {useSelector} from 'react-redux'
import { isTramiteEditable } from '../services/business';
import { RootState } from '../redux/store';

const customColors = ['#2897D4'];
const colors = [
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
];



interface Props { 
  label:string
  labelMessageError?: string
  labelRequired?: string
  value?: any
  bindFunction?: Function
  placeholder?: string
  required?: boolean 
  disabled?: boolean
  type?:string
  step?:any
  min?:any
  formatter?:any
  locked?: boolean
  isEditable?: boolean
  className: string
}

export default (props: Props) => {

  const tramite : TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)
  
 

  return (<div >
    <div className="flex pb-1">

    {props.label && <div className="w-3/4">
        <label className="font-bold text-muted-700 text-sm">{props.label} <span className="text-danger-700 ml-1">{props.labelRequired}</span> </label>
      </div>
      }
</div>
    <div className="w-full">
      <InputNumber 
        value={props.value}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.isEditable ===  null ? false : !props.isEditable || props.locked}
       
        onChange={ e => props.bindFunction(e)}
        type={props.type}
        min={props.min}
        step={props.step}
        formatter={props.formatter}
        precision={2}
        className={props.className}
    
      />
    </div>
    <div className="w-full text-xs text-danger-700 px-2 ">
      {props.labelMessageError}
    </div>
    <div>
   

</div>

  </div>

  )
}
