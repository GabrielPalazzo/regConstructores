import React, { useState } from 'react'
import { Button, DatePicker, Tooltip, ConfigProvider } from 'antd';
import moment from 'moment'
import { isTramiteEditable } from '../services/business';
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';

function onChange(date, dateString) {
  console.log(date, dateString);
}
const dateFormat = 'DD/MM/YYYY';

interface Props {
  value: any
  bindFunction: Function
  label?: string,
  labelRequired: string
  placeholder?: any
  labelMessageError?: string
  labeltooltip?: string
  labelObservation?: string
  picker?:"time" | "date" | "week" | "month" | "quarter" | "year"
  showHands?: boolean
  locked?: boolean
  isEditable?: boolean
}

export default (props: Props) => {

  console.log(props.value)
  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)

  return (<div >

    <div className="flex">
      {props.label && <div className="w-5/5 pb-1 ">
        <label className="font-bold text-muted-700 text-sm">{props.label}<span className="text-danger-700 ml-1">{props.labelRequired}</span> </label>
      </div>}
    </div>
    <div className="w-full">

      <DatePicker

        disabled={props.isEditable === undefined ? false : !props.isEditable || props.locked}
        onChange={(value) => {
          props.bindFunction(moment(value, dateFormat).format(dateFormat))
        }}
        value={props.value && moment(props.value, dateFormat)}
        picker={props.picker ? props.picker  : 'date'}
        format={props.picker && props.picker ==='month' ? 'MMMM YYYY' : dateFormat} />
    </div>
    <div className="w-full text-xs text-danger-700 px-2 ">
      {props.labelMessageError}
    </div>

  </div>

  )
}
