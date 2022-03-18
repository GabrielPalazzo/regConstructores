import React, { useState } from 'react'
import { Button, Input, Tooltip, Switch } from 'antd';
import { LikeFilled, DislikeFilled } from '@ant-design/icons';
import {useSelector} from 'react-redux'
import { isTramiteEditable } from '../services/business';
import { RootState } from '../redux/store';

const customColors = ['#2897D4'];

interface Props {
  onChange? : Function
  value?: boolean
  SwitchLabel1: string 
  SwitchLabel2: string
  label?: string
  labelRequired?: string
  labelMessageError?: string
  labelObservation?:string
  labeltooltip?: string
}

export default (props:Props) => {
  const tramite : TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)

  return (<div >
    <div className="flex">
      <div className="">
        <label className="font-bold text-muted-700 text-sm">{props.label}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
      </div>
    </div>
    <div className="w-full">
      <Switch
        disabled={!isTramiteEditable(tramite)}
        defaultChecked={props.value}
        onChange={props.onChange as any}
        checkedChildren={props.SwitchLabel1} unCheckedChildren={props.SwitchLabel2} />

    </div>
    <div className="w-full text-xs text-danger-700 px-2 pt-2">
      {props.labelMessageError}
    </div>
  </div>

  )
}
