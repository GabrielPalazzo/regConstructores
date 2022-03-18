import React, { useState } from 'react'
import { Button, Upload, message,Tooltip } from 'antd';
import { LikeFilled, DislikeFilled,CloudUploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const customColors = ['#2897D4'];
const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  

export default (props) => {

  return (<div >
    <div className="flex">
      <div className="w-5/5 pb-2">
        <label className="font-bold text-muted-700 text-sm">{props.label}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
      </div>

     

    </div>
    <div className="w-full">
    <Dragger {...props} className="flex py-1 text-left">
    <div className="ant-upload-drag-icon inline-block mr-2">
    <CloudUploadOutlined />
    </div>
    <div className="ant-upload-text text-sm inline-block">Haga click o arrastre archivo</div>
    
  </Dragger>
    </div>
    <div className="w-full text-xs text-danger-700 px-2 pt-2">
      {props.labelMessageError}
    </div>
    <div>
    

</div>
<style>
    {`
    .ant-upload.ant-upload-drag .ant-upload{
        padding: 8px 0 !important;
    }`}
</style>

  </div>

  )
}
