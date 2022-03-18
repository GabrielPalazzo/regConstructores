import React, { useState } from 'react'
import { Select, Tooltip, Button } from 'antd';
import { LikeFilled, DislikeFilled } from '@ant-design/icons';
import {useSelector} from 'react-redux'
import { isTramiteEditable } from '../services/business';
import { RootState } from '../redux/store';

const { Option, OptGroup } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}


const customColors = ['#2897D4'];

interface Props {
  value: any
  bindFunction: Function
  title: string
  labelRequired?: string
  defaultOption: string
  option: any
  labelMessageError?: string
  labeltooltip?: string
  labelObservation? : string
  required: boolean
  showHands? : boolean
  locked? : boolean
  isEditable?:boolean
}


export default (props) => {
  console.log(props.locked)

  const tramite : TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)

  return (<div>

    <div className="flex pb-1">
      {props.title && <div className="w-3/4">
        <label className="font-bold text-muted-700 text-sm">{props.title}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
      </div>
      }
      </div>
   
    <div className="w-full">
      <Select
        disabled={props.isEditable === undefined ? false : !props.isEditable || props.locked}
        style={{ width: '100%' }}
        value={props.value}
        onChange={props.bindFunction}>

        {props.option}
      </Select>
    </div>
    <div className="w-full text-xs text-danger-700 px-2 ">
      {props.labelMessageError}
    </div>



  </div>

  )
}
