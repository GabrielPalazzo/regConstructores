import React, { useState } from 'react'
import { Select, Tooltip, Button } from 'antd'
import LikeDislike from '../components/like_dislike'
import { LikeFilled, DislikeFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux'
import { isTramiteEditable } from '../services/business';
import { RootState } from '../redux/store';


const customColors = ['#2897D4'];
const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

interface Props {
  value: any,
  title?: string
  bindFunction: Function
  placeholder: string
  options?: any
  labeltooltip?: string
  labelMessageError?: string
  labelObservation?: string
  labelRequired?: string
  defaultValue?: Array<string>
  required?: boolean
  showHands?: boolean
  attributeName?: string
  isEditable?:boolean
  locked?: boolean
}

export default (props: Props) => {

  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)

  return (<div >
    <div className="flex">
      {props.title && <div className="w-3/4">
        <label className="font-bold text-muted-700 text-sm">{props.title}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
      </div>
      }

    </div>
    <div className="w-full">
      <Select
        disabled={props.isEditable === null || undefined  ? false : !props.isEditable || props.locked}
        mode="multiple"
        style={{ width: '100%' }}
        value={props.value ? props.value : []}
        placeholder={props.placeholder}
        onChange={(v) => props.bindFunction(v)}
        optionLabelProp="label">

        {props.options}
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
