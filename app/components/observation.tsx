import React, { useState } from 'react'
import { Tooltip, Button } from 'antd';

const customColors = ['#2897D4'];

export default (props) => {


  return (<div>
    {customColors.map(color => (
      <Tooltip
        title={props.title}
        placement="right"
        color={color}
        key={color}>
        <span className="text-warning-700 font-bold mt-2">¿Por qué me observaron este campo?</span>
      </Tooltip>
    ))}

  </div>
  )
}
