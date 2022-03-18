import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateRevisionTramite } from '../redux/actions/revisionTramite'
import _ from 'lodash'
import { Button, Modal, Tooltip } from 'antd'
import { DislikeFilled, InfoCircleOutlined, InfoCircleTwoTone, LikeFilled } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'
import { getReviewAbierta, getUsuario } from '../services/business'
import { RootState } from '../redux/store'
import { saveTramite } from '../redux/actions/main'


const customColors = ['#2897D4'];
const colors = [
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
];

export default (props) => {

  const { attributeName } = props
  const dispatch = useDispatch()
  const tramite: TramiteAlta = useSelector((state: RootState) => state.appStatus.tramiteAlta)
  const revisionTramite = useSelector((state: RootState) => state.revisionTramites)
  const [showObs, setShowObs] = useState(false)
  const [textObs, setTextObs] = useState('')
  const [user, setUser]= useState(null)


  useEffect(() => {
    setUser(getUsuario())
    
  },[])

  const getColorIcon = (handUp: boolean) => {
    const r = revisionTramite && revisionTramite.revision && revisionTramite.revision.reviews.filter(r => r.field.toUpperCase() === attributeName.toUpperCase())
    if (!r || r.length == 0)
      return "#1890ff"

    if (_.last(r).field.toUpperCase() === attributeName.toUpperCase()) {
      if (handUp)
        return _.last(r).isOk ? 'green' : '#e2e8f0'
      else
        return !_.last(r).isOk ? 'red' : '#e2e8f0'
    }
  }

  const like = () => {
    if (!revisionTramite.revision)
      revisionTramite.revision = {
        reviews: []
      }
    
    revisionTramite.revision.reviews = revisionTramite.revision.reviews.filter(r => r.field !== attributeName.toUpperCase())
    
    revisionTramite.revision.reviews.push({
      field: attributeName.toUpperCase(),
      isOk: true,
      review: ''
    })
    tramite.revisiones[0] = revisionTramite.revision
    dispatch(updateRevisionTramite(Object.assign({}, revisionTramite.revision)))
    dispatch(saveTramite(Object.assign({}, tramite)))
  }

  const disLike = () => {
    if (!revisionTramite.revision)
      revisionTramite.revision = {
        reviews: []
      }

    setShowObs(false)

    if (!textObs)
      return

    revisionTramite.revision.reviews = revisionTramite.revision.reviews.filter(r => r.field !== attributeName.toUpperCase())
    revisionTramite.revision.reviews.push({
      field: attributeName.toUpperCase(),
      isOk: false,
      review: textObs
    })
    dispatch(updateRevisionTramite(Object.assign({}, revisionTramite.revision)))
    tramite.revisiones[0] = revisionTramite.revision
    dispatch(saveTramite(Object.assign({}, tramite)))
    setTextObs('')
  }

  const getReviewText = () => {
    const r = revisionTramite && revisionTramite.revision && revisionTramite.revision.reviews.filter(r => r.field.toUpperCase() === attributeName.toUpperCase() && !r.isOk)
    if (!r || r.length === 0)
      return ''

    return _.last(r).review
  }

 

  const isEditable = () => {


    const element = getReviewAbierta(tramite) && getReviewAbierta(tramite).reviews.filter(r => (r.field ===props.attributeName.toUpperCase()))
    /** Solo se permite editar aquellos elementos que estan observados o bien que no quue no fueron revisados */

    return tramite.status ==='BORRADOR' ||
      (tramite.status ==='OBSERVADO' && (_.isEmpty(element) || !element[0].isOk)) 
      && getUsuario().isConstructor()
  }

  

  if (!user)
    return <div/>

  return <div className={props.isTitle ? 'w-full' : ''}>
    <Modal
      visible={showObs}
      title="Observaciones"
      onOk={disLike}
      onCancel={() => setShowObs(false)}
    >
      <TextArea placeholder="Escriba aqui el motivo " allowClear onChange={(e) => setTextObs(e.target.value)} />
    </Modal>
    <div className="flex ">
      <div className="flex w-3/4">
        <div >
        
         
          { getReviewText() && tramite.status==='OBSERVADO'  || getReviewText() && !user.isConstructor() && tramite.status !=='BORRADOR' ?<div className="">
          <label className={props.isTitle  ? 'text-2xl text-danger-700 font-bold py-4' : 'font-bold text-danger-700 text-sm'}>{props.title}<span className="text-danger-700 ml-1">   {props.labelRequired}
          {customColors.map(color => (
            <Tooltip
              title={getReviewText()}
              placement="right"
              color={color}
              key={color}>
               <p className="text-sm">OBSERVADO  <InfoCircleTwoTone twoToneColor="#f9a822" className="pl-2 text-xl" /></p>
            </Tooltip>
          ))}
           </span></label>
        </div>:  <label className={props.isTitle  ? 'text-2xl font-bold py-4' : 'font-bold text-muted-700 text-sm'}>{props.title}<span className="text-danger-700 ml-1">   {props.labelRequired}  </span></label>
         } 
         
        </div>

       
      </div>

      {
        !user.isConstructor() &&  tramite.asignadoA && tramite.categoria!=='INSCRIPTO'  ? <div className="justify-end w-2/5">
          <div className=" text-right">
            <Button onClick={like} type="link" icon={<LikeFilled style={{ color: getColorIcon(true) }} />} />
            <Button onClick={() => setShowObs(true)} type="link" icon={<DislikeFilled style={{ color: getColorIcon(false) }} />} />
          </div>
        </div> : ''
      }
    </div >
    {React.isValidElement(props.children) ?  React.cloneElement(props.children, {isEditable : isEditable()}) : props.children}

  </div >
}