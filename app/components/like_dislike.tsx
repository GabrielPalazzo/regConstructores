import React, { useState } from 'react'
import { Button, Tooltip } from 'antd';
import { LikeFilled, DislikeFilled } from '@ant-design/icons';

const customColors = ['#2897D4'];

export default (props) => {


  return (<div className=" text-right">

    <div>
    {customColors.map(color => (
      <Tooltip
        title={props.labeltooltip}
        placement="right"
        color={color}
        key={color}>
       <Button type="link">
        <LikeFilled style={props.status} />
      </Button>

      </Tooltip>
    ))}
     {customColors.map(color => (
      <Tooltip
        title={props.labeltooltip}
        placement="right"
        color={color}
        key={color}>
       <Button type="link">
       <DislikeFilled style={props.status} />
      </Button>
      
      </Tooltip>
    ))}
      
    </div>

    <div>
    

</div>


    <style>
      {`
          .ant-btn{
              padding:0px 4px;
          }
          .like{
              color: #2E7D33;
          }
          .dislike{
              color:#F9A822;
          }
          .neutro{
              color:#333333;
              opacity:0.15;
          }
        `}
    </style>
  </div>




  )
}
