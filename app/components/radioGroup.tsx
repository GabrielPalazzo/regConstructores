import React, { useState } from 'react'
import { Select, Tooltip, Radio, Button } from 'antd';
import { LikeFilled, DislikeFilled } from '@ant-design/icons';
import {useSelector} from 'react-redux'
import { isTramiteEditable } from '../services/business';
import { RootState } from '../redux/store';


const customColors = ['#2897D4'];
const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

interface Props {
  value: any
  bindFunction: Function
  label: string
  labelRequired?: string
  radioOptions: any,
  labelMessageError?:string,
  labeltooltip?:string,
  labelObservation?:string,
  showHands?: boolean
  isEditable?:boolean
}

export default (props:Props) => {

  const tramite : TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)

  return (<div >
    <div className="flex">
      <div className="w-3/4">
        <label className="font-bold text-muted-700 text-sm">{props.label}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
      </div>

      {props.showHands ?<div className="justify-end w-1/4 text-right">
        <Button type="link" icon={<LikeFilled />} />
        <Button type="link" icon={<DislikeFilled />} />
      </div> : '' }
      

    </div>
    <div className="w-full">
      <Radio.Group disabled={props.isEditable === undefined ? false : !props.isEditable} onChange={e => props.bindFunction(e.target.value)} name="radiogroup" defaultValue={props.value}>
        {props.radioOptions}
      </Radio.Group>
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


