import React, { useState } from 'react'
import { Button,Input } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import LikeDislike from '../components/like_dislike'


export default (props) => {

  return (<div >
    <div className="flex">
    <div className="w-3/4">
    <label className="font-bold text-muted-700 text-sm">{props.title}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
    </div>

    <div className="justify-end w-1/4">
      <LikeDislike />
    </div>
    
    </div>
    
    
   
  </div>

  )
}
