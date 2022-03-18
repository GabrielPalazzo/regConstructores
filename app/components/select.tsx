import React, { useState } from 'react'
import { Select, Tooltip, Button } from 'antd';
import { LikeFilled, DislikeFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux'
import { isTramiteEditable } from '../services/business';
import { RootState } from '../redux/store';

const { Option, OptGroup } = Select;



const customColors = ['#2897D4'];

interface Props {
  value: any
  bindFunction: Function
  title?: string
  labelRequired?: string
  defaultOption: string
  option: any
  labelMessageError?: string
  labeltooltip?: string
  labelObservation?: string
  required: boolean
  showHands?: boolean
  isEditable? : boolean
  locked?: boolean
}



export default (props: Props) => {

  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)

  return (<div >
    <div className="flex pb-1">
      {props.title && <div className="w-3/4">
        <label className="font-bold text-muted-700 text-sm">{props.title}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
      </div>
      }


    </div>
    <div className="w-full">


      <Select
         disabled={props.isEditable === null || undefined  ? false : !props.isEditable || props.locked}
      
        style={{ width: '100%' }}
        defaultValue={!props.value ? props.defaultOption : props.value} 
        onChange={(value) => {
          props.bindFunction(value)
        }}>
          
        {props.option}
      </Select>

      
    </div>
    <div className="w-full text-xs text-danger-700 px-2 ">
      {props.labelMessageError}
    </div>
    <div>
      {customColors.map(color => (
        <Tooltip
          title={props.labeltooltip}
          placement="right"
          color={color}
          key={color}>
          <span className="text-warning-700 font-bold px-2 text-xs  cursor-pointer">{props.labelObservation}</span>
        </Tooltip>
      ))}

    </div>


  </div>

  )
}
