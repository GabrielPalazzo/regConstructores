import React, { useState } from 'react'
import { Button, Input,Tooltip, } from 'antd';
import { LikeFilled, DislikeFilled, ConsoleSqlOutlined } from '@ant-design/icons';
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
  locked?: boolean
  maxLength?: number
  isEditable?:boolean
  className?:string
  
}

export default (props: Props) => {

  const tramite : TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)
  
  // console.log(props.isEditable === undefined)
 
  return (<div >
    <div className="flex">
      <div className="w-5/5 mb-2">
      <label className="font-bold text-muted-700 text-sm">{props.label}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
      </div>

      

    </div>
    <div className="w-full">
      <Input 
        value={props.value}
        onChange={  e => props.bindFunction(props.type==='number' ?  parseInt(e.target.value,10) :e.target.value ) }
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.isEditable === undefined ? false : !props.isEditable || props.locked}
        type={props.type}
        min={props.min}
        step={props.step}
        maxLength ={props.maxLength}
       
    
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
