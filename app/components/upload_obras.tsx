import React, { useState } from 'react'
import { Button, Upload, message, Tooltip } from 'antd';
import { LikeFilled, DislikeFilled, CloudUploadOutlined } from '@ant-design/icons';
import { getCodigoObra, getReviewAbierta, getToken, getUsuario } from '../services/business';
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';

const { Dragger } = Upload;
const customColors = ['#2897D4'];



interface Props {
  label?: string
  labelMessageError?: string
  labelRequired?: string
  onOnLoad: Function
  defaultValue: []
  onRemove: Function
  disabled?: boolean
  isEditable?: boolean

  locked?: boolean
}

const mapFile = (fileToMap) => {
  return {
    uid: fileToMap.cid,
    name: fileToMap.name,
    status: 'done',
    url: `/api/files/${fileToMap.cid}?name=${fileToMap.name} `

  }
}

export default (props: Props) => {


  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)

  const isEditable = () => {
    return tramite.status === 'BORRADOR' || tramite.status === 'OBSERVADO' && getUsuario().isConstructor()

  }


  const propsUpload = {
    multiple: false,
    defaultFileList: props.defaultValue ? props.defaultValue.map(mapFile) as any : [],
    action: '/api/files/new',
    headers: {
      authorization: 'Bearer ' + getToken()
    },
    onRemove(fileToRemove) {
      props.onRemove(fileToRemove)
    },
    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: <CloudUploadOutlined > Ver documento</CloudUploadOutlined>,
      showRemoveIcon: isEditable(),

    },
    onChange(info) {


      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        //console.log(info.file.response.filesSaved[0].cid)
        props.onOnLoad({
          uid: info.file.uid,//info.file.response.filesSaved[0],
          cid: info.file.response.filesSaved[0].cid,
          createdAt: info.file.response.filesSaved[0].createdAt,
          type: info.file.type,
          size: info.file.size,
          name: info.file.name.replace( ',', '-')
        } as Archivo)
        //console.log(info)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };


  return (<div key={getCodigoObra()} >
    <div className="flex">
      {
        props.label && <div className="w-5/5 pb-2">
          <label className="font-bold text-muted-700 text-sm">{props.label}<span className="text-danger-700 ml-1">{props.labelRequired}</span></label>
        </div>
      }


    </div>
    <div className="w-full">
      <Dragger key={getCodigoObra()}
      maxCount={2}
       disabled={props.isEditable === null ? false : !props.isEditable || props.locked}
        className="flex py-1 text-left"
        accept="image/*, .pdf"
        {...propsUpload}
        
        >
        <p className="ant-upload-drag-icon inline-block mr-2">
          <CloudUploadOutlined />
        </p>
        <p className="ant-upload-text text-sm inline-block">Haga click o arrastre un archivo aquí</p>

      </Dragger>
    </div>
    <div className="w-full text-xs text-danger-700 px-2 pt-2">
      {props.labelMessageError}
    </div>
    <div>
      <style>
        {`
    .ant-upload.ant-upload-drag .ant-upload{
        padding: 8px 0 !important;
    }`}
      </style>

    </div>

  </div>

  )
}





